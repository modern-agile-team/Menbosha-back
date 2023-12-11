import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { IsBoolean, IsMongoId, IsNumber, IsString } from 'class-validator';

const options: SchemaOptions = {
  collection: 'Chat',
  timestamps: true,
};

@Schema(options)
export class Chat {
  @IsMongoId()
  @Prop({ type: mongoose.Types.ObjectId, ref: 'ChatRoom' })
  chatroom_id: mongoose.Types.ObjectId;

  @IsNumber()
  @Prop({ required: true })
  sender: number;

  @IsNumber()
  @Prop({ required: true })
  receiver: number;

  @IsString()
  @Prop({ required: true })
  content: string;

  @IsBoolean()
  @Prop({ required: true, default: false })
  isSeen: boolean;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
