import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Chat } from './chat.schemas';

const options: SchemaOptions = {
  collection: 'ChatRoom',
  timestamps: true,
};

@Schema(options)
export class ChatRoom {
  @Prop({
    type: [{ type: mongoose.Types.ObjectId, ref: Chat.name }],
    default: [],
  })
  chat_ids: mongoose.Types.ObjectId[];

  @Prop({ required: true })
  host_id: number;

  @Prop({ required: true })
  guest_id: number;

  @Prop({ type: Date, default: null })
  deleted_at: Date | null;
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
