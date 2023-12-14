import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { Chats } from './chats.schemas';

const options: SchemaOptions = {
  collection: 'chat_images',
  timestamps: true,
};

@Schema(options)
export class ChatImages {
  @IsMongoId()
  @IsNotEmpty()
  @Prop({ type: mongoose.Types.ObjectId, ref: Chats.name })
  chatId: mongoose.Types.ObjectId;

  @IsString()
  @Prop({ required: true })
  imageUrl: string;
}

export const ChatImagesSchema = SchemaFactory.createForClass(ChatImages);
