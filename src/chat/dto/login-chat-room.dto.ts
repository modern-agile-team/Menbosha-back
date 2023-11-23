import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';
import mongoose from 'mongoose';

export class LoginChatRoomDto {
  @IsNumber()
  @ApiProperty({
    example: '1',
    description: '소켓에 join하는 user id',
  })
  userId: number;

  @IsArray()
  @ApiProperty({
    example: '650bde3798dd4c34439c30dc',
    description: '채팅을 전송하는 채팅방 id',
  })
  rooms: mongoose.Types.ObjectId[];
}
