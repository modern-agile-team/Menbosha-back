import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { TransformMongoId } from './transform/transform-mongo-id';
import { Chats } from '../schemas/chat.schemas';

export class ChatDto
  implements
    Pick<Chats, 'chatroomId' | 'content' | 'sender' | 'receiver' | 'isSeen'>
{
  @ApiProperty({
    description: '채팅 방 id',
    type: 'string',
    format: 'ObjectId',
  })
  @TransformMongoId()
  chatroomId: Types.ObjectId;

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
  })
  isSeen: boolean;

  @ApiProperty({
    description: '생성 날짜',
  })
  createdAt: Date;

  constructor(chatDto: Partial<ChatDto>) {
    this.chatroomId = chatDto.chatroomId;
    this.content = chatDto.content;
    this.sender = chatDto.sender;
    this.receiver = chatDto.receiver;
    this.isSeen = chatDto.isSeen;
    this.createdAt = chatDto.createdAt;
  }
}
