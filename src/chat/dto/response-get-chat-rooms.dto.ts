import { ApiProperty } from '@nestjs/swagger';
import { ChatUserDto } from 'src/users/dtos/chat-user.dto';
import { ChatsDto } from './chats.dto';
import mongoose from 'mongoose';
import { TransformMongoId } from './transform/transform-mongo-id';
import { ChatRoomsDto } from './chat-rooms.dto';

export class ResponseGetChatRoomsDto
  implements Pick<ChatRoomsDto, '_id' | 'createdAt'>
{
  @ApiProperty({
    description: '채팅 방 id',
    type: 'string',
    format: 'ObjectId',
  })
  @TransformMongoId()
  _id: mongoose.Types.ObjectId;

  @ApiProperty({
    description: '가장 최신 채팅 객체',
  })
  chat: Partial<ChatsDto>;

  @ApiProperty({
    description: '채팅방 생성 날짜',
  })
  createdAt: Date;
  // 빼야하나 말아야 하나??

  @ApiProperty({
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
