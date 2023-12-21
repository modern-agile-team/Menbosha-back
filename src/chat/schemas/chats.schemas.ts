import { Prop } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export class Chat {
  _id: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Types.ObjectId })
  chatRoomId: mongoose.Types.ObjectId;

  @Prop({ required: true })
  senderId: number;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  unSeenUser: number[];

  @Prop({ default: Date.now })
  createdAt: Date;
}
