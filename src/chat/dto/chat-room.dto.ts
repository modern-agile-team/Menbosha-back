import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { TransformMongoId } from './transform/transform-mongo-id';
import mongoose from 'mongoose';
import { ChatRooms } from '../schemas/chat-room.schemas';

export class ChatRoomsDto
  implements Pick<ChatRooms, 'guestId' | 'hostId' | 'chatIds' | 'deletedAt'>
{
  @ApiProperty({
    description: '채팅 방 id',
    type: 'string',
    format: 'ObjectId',
  })
  @TransformMongoId()
  _id: mongoose.Types.ObjectId;

  @ApiProperty({
    description: '채팅방에 속한 유저의 id',
  })
  @Expose()
  hostId: number;

  @ApiProperty({
    description: '채팅방에 속한 유저의 id',
  })
  @Expose()
  guestId: number;

  @ApiProperty({
    description: '해당 채팅방 채팅 내역 id',
    type: 'string',
    format: 'ObjectId',
  })
  chatIds: mongoose.Types.ObjectId[];

  @ApiProperty({
    description: '채팅방 생성 날짜',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: '채팅방 삭제 날짜',
  })
  @Exclude()
  deletedAt: Date;

  constructor(chatRoomDto: Partial<ChatRoomsDto>) {
    this._id = chatRoomDto._id;
    this.hostId = chatRoomDto.hostId;
    this.guestId = chatRoomDto.guestId;
    this.createdAt = chatRoomDto.createdAt;
  }
}
