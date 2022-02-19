import { CookProcess } from "../CookProcess";

export class Oven extends CookProcess{
  public size: number = 1;

  constructor(name: string, timeout: number = 10000) {
    super(name);
    this.workTime = timeout;
  }
}