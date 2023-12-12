import { ApiProperty } from '@nestjs/swagger';
import { ChatRoom } from '../schemas/chat-room.schemas';
import { Exclude, Expose } from 'class-transformer';
import { TransformMongoId } from './transform/transform-mongo-id';
import mongoose from 'mongoose';

export class ChatRoomDto
  implements Pick<ChatRoom, 'guest_id' | 'host_id' | 'chat_ids' | 'deleted_at'>
{
  @ApiProperty({
    description: '채팅 방 id',
    format: 'ObjectId',
  })
  @Expose()
  @TransformMongoId()
  _id: mongoose.Types.ObjectId;

  @ApiProperty({
    description: '채팅 id',
    type: () => Array,
    format: 'ObjectId',
  })
  @Exclude()
  chat_ids: mongoose.Types.ObjectId[] | [];

  @ApiProperty({
    description: '채팅방에 속한 유저의 id',
  })
  @Expose()
  host_id: number;

  @ApiProperty({
    description: '채팅방에 속한 유저의 id',
  })
  @Expose()
  guest_id: number;

  @ApiProperty({
    description: '채팅방 생성 날짜',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: '채팅방 삭제 날짜',
    type: Date,
    nullable: true,
  })
  @Exclude()
  deleted_at: Date | null;

  constructor(chatRoomDto: Partial<ChatRoomDto> = {}) {
    this._id = chatRoomDto._id;
    this.host_id = chatRoomDto.host_id;
    this.guest_id = chatRoomDto.guest_id;
    this.createdAt = chatRoomDto.createdAt;
  }
}
