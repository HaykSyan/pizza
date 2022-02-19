import { Module } from "@nestjs/common";
import { OrderService } from "./service/order.service";
import { OrderController } from "./controller/order.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Pizza, PizzaSchema } from "./models/pizza.model";
import { Order, OrderSchema } from "./models/order.model";
import { CookService } from "../cook-process/services/cook.service";
import { DougChef } from "../cook-process/doug-chef/DougChef";
import { ToppingChef } from "../cook-process/topping-chef/ToppingChef";
import { Oven } from "../cook-process/oven/Oven";
import { Waiter } from "../cook-process/waiters/Waiter";
import { PizzaConsumer } from "../jobs/pizza-consumer";
import { BullModule } from "@nestjs/bull";
import { Logs, LogsSchema } from "./models/logs.model";
import { LogService } from './service/log.service';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Pizza.name, schema: PizzaSchema },
    { name: Order.name, schema: OrderSchema },
    { name: Logs.name, schema: LogsSchema },

  ]),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
      }
    }),
    BullModule.registerQueue(
      {
        name: "pizza-consumer"
      }),
  ],
  providers: [
    OrderService,
    CookService,
    DougChef,
    ToppingChef,
    Oven,
    Waiter,
    PizzaConsumer,
    LogService,
  ],
  controllers: [OrderController]
})
export class OrderModule {
}
