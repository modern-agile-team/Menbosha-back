import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNumber, IsString } from 'class-validator';
import mongoose from 'mongoose';

export class PostChatDto {
  @IsMongoId()
  @ApiProperty({
    description: '채팅 방 id',
    type: 'string',
    format: 'ObjectId',
  })
  roomId: mongoose.Types.ObjectId;

  @ApiProperty({
    example: ['안녕하세요', 'imageUrl'],
    description: '채팅 내용',
  })
  @IsString()
  content: string;

  @ApiProperty({
    example: 1,
    description: '채팅을 보내는 유저 아이디',
  })
  @IsNumber()
  senderId: number;

  @ApiProperty({
    example: 2,
    description: '채팅을 받는 유저 아이디',
  })
  @IsNumber()
  receiverId: number;
}
