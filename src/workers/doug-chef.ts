import { parentPort, workerData } from "worker_threads";
import { DougChef } from "../cook-process/doug-chef/DougChef";

const sharedArray = workerData;
const dougChef = new DougChef("DougChef", 7000);

parentPort.on("message", (orders) => {
  Atomics.wait(sharedArray, 0, 0);
  setImmediate(async () => {
    const order = await dougChef.chunk(orders, 2);
    for (let i = 0; i < order.length; i++) {
      const started_at = new Date();
      const started = Date.now();
      const time = setTimeout(async () => {
        await dougChef.add(order[i]);
        for (let j = 0; j < order[i].length; j++) {
          const capture = await dougChef.capture();
          dougChef.release(capture);
        }
        console.log("end item", Date.now() - started);
        console.log("end item", new Date());
        console.log("====================================");
        parentPort.postMessage({
          order: order[i],
          process_point: dougChef.name,
          started_at,
          ended_at: new Date(),
          expected_time: dougChef.workTime,
          spend_time: dougChef.countTime(started),
        })
        Atomics.store(sharedArray, 1, 1);
        Atomics.notify(sharedArray, 1);
        clearTimeout(time);
      }, (i + 1) * dougChef.workTime);
    }
  });
});