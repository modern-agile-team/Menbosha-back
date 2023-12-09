import { Types } from 'mongoose';
import { Chat } from '../schemas/chat.schemas';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsMongoId, IsString } from 'class-validator';

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
}
