import { Worker } from "worker_threads";
import { join } from "path";
import { LogsType } from "../../types/logs.type";
import { Injectable } from "@nestjs/common";
import { LogService } from "../../order/service/log.service";

@Injectable()
export class CookService {
  constructor(private logsService: LogService) {}

  async start(order = []) {
    console.log("started");
    const sharedArray = new Int32Array(new SharedArrayBuffer(32));

    const dougChefWorker = new Worker(join(__dirname, "../../workers/doug-chef.js"), { workerData: sharedArray });
    const toppingChefWorker = new Worker(join(__dirname, "../../workers/topping-chef.js"), { workerData: sharedArray });
    const ovenWorker = new Worker(join(__dirname, "../../workers/oven.js"), { workerData: sharedArray });
    const waiterWorker = new Worker(join(__dirname, "../../workers/waiter.js"), { workerData: sharedArray });
    dougChefWorker.postMessage(order);

    Atomics.store(sharedArray, 0, 1);
    Atomics.notify(sharedArray, 0);

    dougChefWorker.on("message", (toTopping: LogsType) => {
      this.logsService.store(toTopping);
      Atomics.wait(sharedArray, 1, 0)
      toppingChefWorker.postMessage(toTopping.order);
    })

    toppingChefWorker.on("message", (toOven: LogsType) => {
      this.logsService.store(toOven);
      Atomics.wait(sharedArray, 2, 0)
      ovenWorker.postMessage(toOven.order);
    })

    ovenWorker.on("message", (toWaiters: LogsType) => {
      this.logsService.store(toWaiters);
      Atomics.wait(sharedArray, 3, 0)
      waiterWorker.postMessage(toWaiters.order);
    })

    waiterWorker.on("message", (logs: LogsType) => {
      this.logsService.store(logs);
      Atomics.store(sharedArray, 3, 0)
      Atomics.notify(sharedArray, 3);
    })
  }
}