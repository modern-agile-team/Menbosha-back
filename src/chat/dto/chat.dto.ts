import mongoose from 'mongoose';
import { Chat } from '../schemas/chat.schemas';
import { ApiProperty } from '@nestjs/swagger';
import { TransformMongoId } from './transform/transform-mongo-id';

export class ChatDto implements Partial<Chat> {
  @ApiProperty({
    description: '채팅 id',
    type: 'string',
    format: 'ObjectId',
  })
  @TransformMongoId()
  _id: mongoose.Types.ObjectId;

  @ApiProperty({
    description: '채팅 방 id',
    type: 'string',
    format: 'ObjectId',
  })
  @TransformMongoId()
  chatroom_id: mongoose.Types.ObjectId;

  @ApiProperty({
    description: '채팅 내용',
  })
  content: string;

  @ApiProperty({
    description: '채팅을 전송한 유저의 id',
  })
  sender: number;

  @ApiProperty({
    description: '채팅을 받은 유저의 id',
  })
  receiver: number;

  @ApiProperty({
    description: '채팅 확인 여부',
    default: false,
  })
  isSeen: boolean;

  @ApiProperty({
    description: '생성 날짜',
  })
  createdAt: Date;

  constructor(chatDto: Partial<ChatDto>) {
    this._id = chatDto._id;
    this.chatroom_id = chatDto.chatroom_id;
    this.content = chatDto.content;
    this.sender = chatDto.sender;
    this.receiver = chatDto.receiver;
    this.isSeen = chatDto.isSeen;
    this.createdAt = chatDto.createdAt;
  }
}
