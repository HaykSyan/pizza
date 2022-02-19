import { CookProcess } from "../CookProcess";

export class Waiter extends CookProcess{
  public size: number = 2;

  constructor(name: string, timeout: number = 5000) {
    super(name);
    this.workTime = timeout;
  }
}