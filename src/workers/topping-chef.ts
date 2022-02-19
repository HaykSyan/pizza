import { parentPort, workerData } from "worker_threads";
import { ToppingChef } from "../cook-process/topping-chef/ToppingChef";

const sharedArray = workerData;
const toppingChef = new ToppingChef("ToppingChef", 4000);

parentPort.on("message", (orders) => {
  Atomics.wait(sharedArray, 1, 0);
  setImmediate(async () => {
    const order = await toppingChef.chunk(orders, 6);
    for (let i = 0; i < order.length; i++) {
      const started_at = new Date();
      const started = Date.now();
      const time = setTimeout(async () => {
        await toppingChef.add(order[i]);
        for (let j = 0; j < order[i].length; j++) {
          const capture = await toppingChef.capture();
          toppingChef.release(capture);
        }
        console.log("end item", Date.now() - started);
        console.log("end item", new Date());
        console.log("====================================");
        parentPort.postMessage({
          order: order[i],
          process_point: toppingChef.name,
          started_at,
          ended_at: new Date(),
          expected_time: toppingChef.workTime,
          spend_time: toppingChef.countTime(started),
        })
        Atomics.store(sharedArray, 2, 1);
        Atomics.notify(sharedArray, 2);
        console.log(sharedArray)
        clearTimeout(time);
      }, (i + 1) * toppingChef.workTime);
    }
  });
});