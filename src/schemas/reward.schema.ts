import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RewardDocument = Reward & Document;

@Schema()
export class Reward {
  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  date: Date;
}

export const RewardSchema = SchemaFactory.createForClass(Reward);
