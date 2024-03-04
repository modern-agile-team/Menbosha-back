import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsMongoId, IsNotEmpty, Min } from 'class-validator';
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
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    example: 1,
    description: '채팅을 보내는 유저 아이디',
  })
  @IsInt()
  @Min(1)
  senderId: number;
}
