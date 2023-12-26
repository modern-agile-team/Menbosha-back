import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { Chat } from './chats.schemas';
import mongoose from 'mongoose';
import { ChatRoomType } from '../constants/chat-rooms-enum';
import * as mongoosePaginate from 'mongoose-paginate-v2';

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

ChatRoomsSchema.plugin(mongoosePaginate);

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
