import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Chats } from './chat.schemas';

const options: SchemaOptions = {
  collection: 'chat_rooms',
  timestamps: true,
};

@Schema(options)
export class ChatRooms {
  @Prop({
    type: [{ type: mongoose.Types.ObjectId, ref: Chats.name }],
    default: [],
  })
  chatIds: mongoose.Types.ObjectId[];

  @Prop({ required: true })
  hostId: number;

  @Prop({ required: true })
  guestId: number;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRooms);
