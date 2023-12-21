import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Chat } from './chats.schemas';

const options: SchemaOptions = {
  collection: 'chat_rooms',
  timestamps: true,
};

@Schema(options)
export class ChatRooms {
  _id: mongoose.Types.ObjectId;

  @Prop({
    type: [Chat],
    default: [],
  })
  chats: Chat[];

  @Prop({ required: true })
  hostId: number;

  @Prop({ required: true })
  guestId: number;

  createdAt: Date;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;

  readonly unprotectedData: {
    _id: mongoose.Types.ObjectId;
    chats: Chat[];
    hostId: number;
    guestId: number;
    createdAt: Date;
    deletedAt: Date;
  };
}

export const ChatRoomsSchema = SchemaFactory.createForClass(ChatRooms);

ChatRoomsSchema.virtual('unprotectedData').get(function (this: ChatRooms) {
  return {
    _id: this._id,
    chats: this.chats,
    hostId: this.hostId,
    guestId: this.guestId,
    createdAt: this.createdAt,
    deletedAt: this.deletedAt,
  };
});
