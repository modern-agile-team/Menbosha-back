import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

const options: SchemaOptions = {
  collection: 'chats',
  timestamps: true,
};

@Schema(options)
export class Chats {
  @Prop({ type: mongoose.Types.ObjectId, ref: 'chat_rooms' })
  chatroomId: mongoose.Types.ObjectId;

  @Prop({ required: true })
  sender: number;

  @Prop({ required: true })
  receiver: number;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true, default: false })
  isSeen: boolean;
}

export const ChatSchema = SchemaFactory.createForClass(Chats);
