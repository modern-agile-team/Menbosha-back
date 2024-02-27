import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { ChatRooms } from '@src/chat/schemas/chat-rooms.schemas';
import * as mongoose from 'mongoose';

const options: SchemaOptions = {
  collection: 'chat_images',
  timestamps: true,
};

@Schema(options)
export class ChatImages {
  _id: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Types.ObjectId, ref: ChatRooms.name })
  chatRoomId: mongoose.Types.ObjectId;

  @Prop({ required: true })
  senderId: number;

  @Prop({ required: true })
  imageUrl: string;

  createdAt: Date;

  readonly unprotectedData: {
    _id: mongoose.Types.ObjectId;
    chatRoomId: mongoose.Types.ObjectId;
    senderId: number;
    imageUrl: string;
    createdAt: Date;
  };
}

export const ChatImagesSchema = SchemaFactory.createForClass(ChatImages);

ChatImagesSchema.virtual('unprotectedData').get(function (this: ChatImages) {
  return {
    _id: this._id,
    chatRoomId: this.chatRoomId,
    senderId: this.senderId,
    imageUrl: this.imageUrl,
    createdAt: this.createdAt,
  };
});
