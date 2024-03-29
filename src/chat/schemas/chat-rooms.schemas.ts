import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { Chat } from '@src/chat/schemas/chats.schemas';
import { ChatRoomType } from '@src/chat/constants/chat-rooms-enum';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

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
  chats: Chat[] | [];

  @Prop({ required: true })
  originalMembers: number[];

  @Prop({ required: true })
  chatMembers: number[];

  @Prop({ required: true })
  chatRoomType: ChatRoomType;

  createdAt: Date;

  updatedAt: Date;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;

  readonly unprotectedData: {
    _id: mongoose.Types.ObjectId;
    chats: Chat[] | [];
    originalMembers: number[];
    chatMembers: number[];
    chatRoomType: ChatRoomType;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
  };
}

export const ChatRoomsSchema = SchemaFactory.createForClass(ChatRooms);

ChatRoomsSchema.plugin(mongoosePaginate).plugin(aggregatePaginate);

ChatRoomsSchema.virtual('unprotectedData').get(function (this: ChatRooms) {
  return {
    _id: this._id,
    chats: this.chats,
    originalMembers: this.originalMembers,
    chatMembers: this.chatMembers,
    chatRoomType: this.chatRoomType,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    deletedAt: this.deletedAt,
  };
});
