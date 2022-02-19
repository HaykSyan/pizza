import { parentPort, workerData } from "worker_threads";
import { Waiter } from "../cook-process/waiters/Waiter";

const sharedArray = workerData;
const waiter = new Waiter("Waiter", 5000);

parentPort.on("message", (orders) => {
  Atomics.wait(sharedArray, 3, 0);
  setImmediate(async () => {
    const order = await waiter.chunk(orders, 2);
    for (let i = 0; i < order.length; i++) {
      const started_at = new Date();
      const started = Date.now();
      const time = setTimeout(async () => {
        await waiter.add(order[i]);
        for (let j = 0; j < order[i].length; j++) {
          const capture = await waiter.capture();
          waiter.release(capture);
        }
        console.log("end item", Date.now() - started);
        console.log("end item", new Date());
        console.log("====================================");
        parentPort.postMessage({
          order: order[i],
          process_point: waiter.name,
          started_at,
          ended_at: new Date(),
          expected_time: waiter.workTime,
          spend_time: waiter.countTime(started),
        })
        clearTimeout(time);
      }, (i + 1) * waiter.workTime);
    }
  });
});