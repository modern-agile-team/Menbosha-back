import { IsDate, IsMongoId, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ChatRoom } from '../schemas/chat-room.schemas';
import { Expose } from 'class-transformer';
import { TransformMongoId } from './transform/transform-mongo-id';
import mongoose from 'mongoose';

export class ChatRoomDto implements Pick<ChatRoom, 'guest_id' | 'host_id'> {
  @ApiProperty({
    description: '채팅방 고유 id',
  })
  @Expose()
  @TransformMongoId()
  @IsMongoId()
  _id: mongoose.Types.ObjectId;

  @ApiProperty({
    description: '채팅방에 속한 유저의 id',
  })
  @Expose()
  @IsNumber()
  host_id: number;

  @ApiProperty({
    description: '채팅방에 속한 유저의 id',
  })
  @Expose()
  @IsNumber()
  guest_id: number;

  @Expose()
  @IsDate()
  createdAt: Date;

  constructor(chatRoomDto: Partial<ChatRoomDto>) {
    this._id = chatRoomDto._id;
    this.host_id = chatRoomDto.host_id;
    this.guest_id = chatRoomDto.guest_id;
    this.createdAt = chatRoomDto.createdAt;
  }
}
