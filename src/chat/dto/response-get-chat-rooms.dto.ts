import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ChatUserDto } from 'src/users/dtos/chat-user.dto';
import { ChatDto } from './chat.dto';
import mongoose from 'mongoose';
import { TransformMongoId } from './transform/transform-mongo-id';

export class ResponseGetChatRoomsDto implements Partial<ChatDto> {
  @ApiProperty({
    description: '채팅 방 id',
    type: 'string',
    format: 'ObjectId',
  })
  @TransformMongoId()
  _id: mongoose.Types.ObjectId;

  @ApiProperty({
    description: '가장 마지막 채팅 객체',
  })
  chat: Partial<ChatDto>;

  @ApiProperty({
    description: '생성 날짜',
  })
  createdAt: Date;

  @ApiPropertyOptional({
    description: '채팅 상대 유저의 정보',
  })
  chatPartner: ChatUserDto;

  constructor(
    chatDto: Partial<ResponseGetChatRoomsDto>,
    chatUserDto: ChatUserDto,
  ) {
    this._id = chatDto._id;
    this.chat = chatDto.chat;
    this.chatPartner = chatUserDto;
  }
}
