import { CookProcess } from "../CookProcess";

export class DougChef extends CookProcess{
  public size: number = 2;

  constructor(name: string, timeout: number = 7000) {
    super(name);
    this.workTime = timeout;
  }
}