import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

const options: SchemaOptions = {
  collection: 'chats',
  timestamps: true,
};

@Schema(options)
export class Chats {
  @Prop({ type: mongoose.Types.ObjectId, ref: 'chat_rooms' })
  chatRoomId: string;

  @Prop({ required: true })
  sender: number;

  @Prop({ required: true })
  receiver: number;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true, default: false })
  isSeen: boolean;

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
    _id: options._id,
    chatRoomId: this.chatRoomId,
    sender: this.sender,
    receiver: this.receiver,
    content: this.content,
    isSeen: this.isSeen,
    createdAt: options.timestamps,
  };
});
