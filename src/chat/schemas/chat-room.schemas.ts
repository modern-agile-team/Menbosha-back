import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { IsNumber } from 'class-validator';

const options: SchemaOptions = {
  collection: 'ChatRoom',
  timestamps: true,
};

@Schema(options)
export class ChatRoom {
  @IsNumber()
  @Prop({ required: true })
  host_id: number;

  @IsNumber()
  @Prop({ required: true })
  guest_id: number;

  @Prop({ type: Date, default: null })
  deleted_at: Date | null;
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
