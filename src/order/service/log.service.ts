import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Logs, LogsDocument } from "../models/logs.model";
import { LogsType } from "../../types/logs.type";

@Injectable()
export class LogService {
  constructor(@InjectModel(Logs.name) private logModel: Model<LogsDocument>) {
  }

  async store(logs: LogsType) {
    return await new this.logModel(logs).save();
  }
}
