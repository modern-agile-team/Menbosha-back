import { Types } from 'mongoose';
import { Chat } from '../schemas/chat.schemas';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsMongoId,
  IsNumber,
  IsString,
} from 'class-validator';
import { TransformMongoId } from './transform/transform-mongo-id';

export class ChatDto implements Partial<Chat> {
  @ApiProperty({
    description: '채팅 방 id',
    type: 'string',
    format: 'ObjectId',
  })
  @IsMongoId()
  @TransformMongoId()
  chatroom_id: Types.ObjectId;

  @ApiProperty({
    description: '채팅 내용',
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: '채팅을 전송한 유저의 id',
  })
  @IsNumber()
  sender: number;

  @ApiProperty({
    description: '채팅을 받은 유저의 id',
  })
  @IsNumber()
  receiver: number;

  @ApiProperty({
    description: '채팅 확인 여부',
  })
  @IsBoolean()
  isSeen: boolean;

  @ApiProperty({
    description: '생성 날짜',
  })
  @IsDate()
  createdAt: Date;

  constructor(chatDto: Partial<ChatDto>) {
    this.chatroom_id = chatDto.chatroom_id;
    this.content = chatDto.content;
    this.sender = chatDto.sender;
    this.receiver = chatDto.receiver;
    this.isSeen = chatDto.isSeen;
    this.createdAt = chatDto.createdAt;
  }
}
