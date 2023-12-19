import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

const options: SchemaOptions = {
  collection: 'chats',
  timestamps: true,
};

@Schema(options)
export class Chats {
  _id: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'chat_rooms' })
  chatRoomId: mongoose.Types.ObjectId;

  @Prop({ required: true })
  sender: number;

  @Prop({ required: true })
  receiver: number;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true, default: false })
  isSeen: boolean;

  createdAt: Date;

  readonly unprotectedData: {
    _id: mongoose.Types.ObjectId;
    chatRoomId: string;
    sender: number;
    receiver: number;
    content: string;
    isSeen: boolean;
    createdAt: Date;
  };
}

export const ChatsSchema = SchemaFactory.createForClass(Chats);

ChatsSchema.virtual('unprotectedData').get(function (this: Chats) {
  return {
    _id: this._id,
    chatRoomId: this.chatRoomId,
    sender: this.sender,
    receiver: this.receiver,
    content: this.content,
    isSeen: this.isSeen,
    createdAt: this.createdAt,
  };
});
