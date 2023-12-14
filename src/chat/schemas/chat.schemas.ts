import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

const options: SchemaOptions = {
  collection: 'Chat',
  timestamps: true,
};

@Schema(options)
export class Chat {
  @Prop({ type: mongoose.Types.ObjectId, ref: 'ChatRoom' })
  chatroom_id: mongoose.Types.ObjectId;

  @Prop({ required: true })
  sender: number;

  @Prop({ required: true })
  receiver: number;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true, default: false })
  isSeen: boolean;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
