import { ApiProperty } from '@nestjs/swagger';
import { TransformMongoId } from './transform/transform-mongo-id';
import { Exclude, Expose } from 'class-transformer';
import mongoose from 'mongoose';
import { Chat } from '../schemas/chats.schemas';

export class ChatDto implements Chat {
  @ApiProperty({
    description: '채팅 id',
    type: 'string',
    format: 'ObjectId',
  })
  @TransformMongoId()
  @Expose()
  _id: mongoose.Types.ObjectId;

  @ApiProperty({
    description: '채팅 방 id',
    type: 'string',
    format: 'ObjectId',
  })
  @Expose()
  @TransformMongoId()
  chatRoomId: mongoose.Types.ObjectId;

  @ApiProperty({
    description: '채팅을 전송한 유저의 id',
  })
  @Expose()
  senderId: number;

  @ApiProperty({
    description: '채팅 내용',
  })
  @Expose()
  content: string;

  @ApiProperty({
    isArray: true,
    type: Number,
    description: '채팅 확인한 유저들 id 배열',
  })
  @Expose()
  seenUsers: number[];

  @ApiProperty({
    description: '생성 날짜',
    type: 'string',
    format: 'date-time',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: '채팅 삭제 날짜',
    type: 'string',
    format: 'date-time',
  })
  @Exclude()
  deletedAt: Date;

  constructor(chatDto: Partial<ChatDto> = {}) {
    this._id = chatDto._id;
    this.chatRoomId = chatDto.chatRoomId;
    this.content = chatDto.content;
    this.senderId = chatDto.senderId;
    this.seenUsers = chatDto.seenUsers;
    this.createdAt = chatDto.createdAt;
  }
}
