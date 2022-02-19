import { CookProcess } from "../CookProcess";

export class ToppingChef extends CookProcess{
  public size: number = 6;

  constructor(name: string, timeout: number = 4000) {
    super(name)
    this.workTime = timeout;
  }
}