import { Body, Controller, Post } from "@nestjs/common";
import { OrderService } from "../service/order.service";
import { CreateOrderDto } from "../dto/CreateOrderDto";

@Controller("order")
export class OrderController {
  constructor(private orderService: OrderService) {
  }

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    return await this.orderService.create(createOrderDto);
  }

}