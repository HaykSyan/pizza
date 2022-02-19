import {Process, Processor} from "@nestjs/bull";
import {Job} from "bull";
import { CookService } from "../cook-process/services/cook.service";
import { Injectable } from "@nestjs/common";

@Injectable()
@Processor('pizza-consumer')
export class PizzaConsumer {
    constructor(private cookService: CookService) {
    }

    @Process('pizza-job')
    async readData(job: Job<unknown>) {
        await this.cookService.start(job.data.pizzas);
    }
}
