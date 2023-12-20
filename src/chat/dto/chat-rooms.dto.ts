import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { TransformMongoId } from './transform/transform-mongo-id';
import mongoose from 'mongoose';
import { ChatRooms } from '../schemas/chat-rooms.schemas';
import { TransformMongoIdToPlainOnly } from './transform/transform-mongo-id-to-plain-only';

export class ChatRoomsDto implements Omit<ChatRooms, 'unprotectedData'> {
  @ApiProperty({
    description: '채팅 방 id',
    type: 'string',
    format: 'ObjectId',
  })
  @TransformMongoId()
  @Expose()
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
    isArray: true,
    format: 'ObjectId',
  })
  @Expose()
  @TransformMongoIdToPlainOnly()
  chatIds: mongoose.Types.ObjectId[] | [];

  @ApiProperty({
    description: '채팅방 생성 날짜',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: '채팅방 삭제 날짜',
    default: null,
  })
  @Exclude()
  deletedAt: Date | null;

  constructor(chatRoomDto: Partial<ChatRoomsDto> = {}) {
    this._id = chatRoomDto._id;
    this.hostId = chatRoomDto.hostId;
    this.guestId = chatRoomDto.guestId;
    this.chatIds = chatRoomDto.chatIds;
    this.createdAt = chatRoomDto.createdAt;
  }
}
