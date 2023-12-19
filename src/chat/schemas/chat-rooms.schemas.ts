import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Chats } from './chats.schemas';

const options: SchemaOptions = {
  collection: 'chat_rooms',
  timestamps: true,
};

@Schema(options)
export class ChatRooms {
  _id: mongoose.Types.ObjectId;

  @Prop({
    type: [{ type: mongoose.Types.ObjectId, ref: Chats.name }],
    default: [],
  })
  chatIds: mongoose.Types.ObjectId[];

  @Prop({ required: true })
  hostId: number;

  @Prop({ required: true })
  guestId: number;

  createdAt: Date;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;

  readonly unprotectedData: {
    _id: mongoose.Types.ObjectId;
    chatIds: mongoose.Types.ObjectId[];
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
    chatIds: this.chatIds,
    hostId: this.hostId,
    guestId: this.guestId,
    createdAt: this.createdAt,
    deletedAt: this.deletedAt,
  };
});
