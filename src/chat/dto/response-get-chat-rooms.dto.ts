import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ChatUserDto } from 'src/users/dtos/chat-user.dto';
import { ChatDto } from './chat.dto';
import { Exclude } from 'class-transformer';
import { Types } from 'mongoose';
import { TransformMongoId } from './transform/transform-mongo-id';

export class ResponseGetChatRoomsDto implements Partial<ChatDto> {
  @ApiProperty({
    description: '채팅 방 id',
    type: 'string',
    format: 'ObjectId',
  })
  @TransformMongoId()
  chatroom_id: Types.ObjectId;

  @ApiProperty({
    description: '채팅 내용',
  })
  content: string;

  @Exclude()
  sender: number;

  @Exclude()
  receiver: number;

  @ApiProperty({
    description: '채팅 확인 여부',
  })
  isSeen: boolean;

  @ApiPropertyOptional({
    description: '생성 날짜',
  })
  createdAt: Date;

  @ApiPropertyOptional({
    description: '상대 유저의 정보(guest_id)',
  })
  host?: ChatUserDto;

  @ApiPropertyOptional({
    description: '상대 유저의 정보(host_id)',
  })
  guest?: ChatUserDto;

  constructor(
    chatDto: Partial<ChatDto> = {},
    chatUserDto: ChatUserDto,
    myId: number,
  ) {
    this.chatroom_id = chatDto.chatroom_id;
    this.content = chatDto.content;
    this.isSeen = chatDto.isSeen;
    this.createdAt = chatDto.createdAt;

    chatDto.sender === myId
      ? (this.host = chatUserDto)
      : (this.guest = chatUserDto);
  }
}
