import { Injectable } from "@nestjs/common";
import { CreateOrderDto } from "../dto/CreateOrderDto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Order, OrderDocument } from "../models/order.model";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";

@Injectable()
export class OrderService {
  constructor(@InjectModel(Order.name) private orderModel: Model<OrderDocument>,
              @InjectQueue('pizza-consumer') private consumerJob: Queue) {
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const data = await new this.orderModel(createOrderDto).save();
    await this.consumerJob.add('pizza-job', data);

    return data;
  }
}