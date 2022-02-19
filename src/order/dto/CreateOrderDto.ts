import { Pizza } from "../models/pizza.model";

export class CreateOrderDto {
  readonly date: Date;
  readonly pizzas: Pizza[];
}