import { Types } from 'mongoose';
import { Chat } from '../schemas/chat.schemas';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';
import { Exclude } from 'class-transformer';

export class ChatDto implements Partial<Chat> {
  @ApiProperty({
    description: '채팅 방 id',
  })
  @IsMongoId()
  chatroom_id: Types.ObjectId;

  @ApiProperty({
    description: '채팅 내용',
  })
  @IsString()
  content: string;

  @Exclude()
  sender: number;

  @Exclude()
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
  @IsOptional()
  createdAt?: Date;

  constructor(chatDto: Partial<ChatDto>) {
    this.chatroom_id = chatDto.chatroom_id;
    this.content = chatDto.content;
    this.sender = chatDto.sender;
    this.receiver = chatDto.receiver;
    this.isSeen = chatDto.isSeen;
    this.createdAt = chatDto.createdAt;
  }
}
