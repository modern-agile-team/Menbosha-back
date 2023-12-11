import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';
import mongoose from 'mongoose';

export class PostChatDto {
  @IsMongoId()
  @ApiProperty({
    description: '채팅 방 id',
    type: 'string',
    format: 'ObjectId',
  })
  roomId: mongoose.Types.ObjectId;

  @ApiPropertyOptional({
    example: '안녕하세요',
    description: '채팅 내용',
  })
  @IsString()
  @IsOptional()
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

  @ApiPropertyOptional({
    example:
      'https://ma6-main.s3.ap-northeast-2.amazonaws.com/1_1696831127634.jpeg',
    description: '이미지 url',
  })
  @IsOptional()
  @IsString()
  imageUrl: string;
}
