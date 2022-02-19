import { parentPort, workerData } from "worker_threads";
import { Oven } from "../cook-process/oven/Oven";

const sharedArray = workerData;
const oven = new Oven("Oven", 10000);

parentPort.on("message", (orders) => {
  Atomics.wait(sharedArray, 2, 0);
  setImmediate(async () => {
    const order = await oven.chunk(orders, 1);
    for (let i = 0; i < order.length; i++) {
      const started_at = new Date();
      const started = Date.now();
      const time = setTimeout(async () => {
        await oven.add(order[i]);
        for (let j = 0; j < order[i].length; j++) {
          const capture = await oven.capture();
          oven.release(capture);
        }
        console.log("end item", Date.now() - started);
        console.log("end item", new Date());
        console.log("====================================");
        parentPort.postMessage({
          order: order[i],
          process_point: oven.name,
          started_at,
          ended_at: new Date(),
          expected_time: oven.workTime,
          spend_time: oven.countTime(started),
        })
        Atomics.store(sharedArray, 3, 1);
        Atomics.notify(sharedArray, 3);
        clearTimeout(time);
      }, (i + 1) * oven.workTime);
    }
  });
});