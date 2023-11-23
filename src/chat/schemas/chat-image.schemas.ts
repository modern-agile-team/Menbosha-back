import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Chat } from './chat.schemas';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

const options: SchemaOptions = {
  collection: 'ChatImage',
  timestamps: true,
};

@Schema(options)
export class ChatImage {
  @IsMongoId()
  @IsNotEmpty()
  @Prop({ type: mongoose.Types.ObjectId, ref: Chat.name })
  chat_id: mongoose.Types.ObjectId;

  @IsString()
  @Prop({ required: true })
  image_url: string;
}

export const ChatImageSchema = SchemaFactory.createForClass(ChatImage);
