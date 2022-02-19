
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Pizza } from "./pizza.model";

export type OrderDocument = Order & Document

@Schema()
export class Order {
  @Prop({ default: new Date() })
  date: Date;

  @Prop({ ref: "Pizza" })
  pizzas: Pizza[];

}

export const OrderSchema = SchemaFactory.createForClass(Order);
