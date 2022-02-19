import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type LogsDocument = Logs & Document

@Schema()
export class Logs {
  @Prop({ default: new Date() })
  started_at: Date;

  @Prop({ default: new Date() })
  ended_at: Date;

  @Prop()
  process_point: string;

  @Prop()
  expected_time: number;

  @Prop()
  spend_time: number;

  @Prop({ ref: "Pizza" })
  order: [];

}

export const LogsSchema = SchemaFactory.createForClass(Logs);
