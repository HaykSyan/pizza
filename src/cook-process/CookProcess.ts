import { CookInterface } from "../types/cook.interface";

export class CookProcess implements CookInterface{
  protected pizzaCount: number = 0;
  protected size: number;
  protected available: number = 0;
  protected queue = [];
  protected items = [];
  protected free = [];
  protected current: number = 0;

  public name: string;
  public workTime: number;

  constructor(name: string, timeout: number = 0) {
    this.name = name;
    this.workTime = timeout || 0;
  }

  async next() {
    if (!this.available) return null;
    if (this.available > this.size) {
      return new Promise<any>((resolve, reject) => {
        const waiting = {resolve, timer: null};
        const scheduled = Date.now();
        waiting.timer = setTimeout(() => {
          waiting.resolve = null;
          this.queue.shift();
          this.countTime(scheduled)
          reject(new Error("It's getting delay!"))
        }, this.workTime)
        this.queue.push(waiting);
      });
    }
    let item = null;
    let free = false;
    do {
      item = this.items[this.current];
      free = this.free[this.current];
      this.current++;
    } while (!item || !free);
    return item;
  }

  add(item): void {
    this.pizzaCount += item.length;
    this.available = item.length;
    this.items.push(...item);
    this.free.push(...item);
    console.log(`Pizza count => ${this.pizzaCount}`, `available ${this.available}`)
  }

  async capture() {
    const item = await this.next();
    if (!item) return null;
    const index = this.items.indexOf(item);
    this.free[index] = false;
    this.available--;
    return item;
  }

  release(item) {
    const index = this.items.indexOf(item);
    if (index < 0) throw new Error(`No any ${this.name}`)
    if (this.free[index]) throw Error("DougChef is not free!")
    this.free[index] = true;
    this.available++;
    if (this.queue.length > 0) {
      const { resolve, timer } = this.queue.shift();
      clearTimeout(timer);
      if (resolve) setTimeout(resolve, 0, item);
    }
    console.log("free item", index, this.free)
  }

  countTime(start) {
    return Date.now() - start;
  }

  async chunk(arr, size) {
    return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
      arr.slice(i * size, i * size + size)
    );
  }
}