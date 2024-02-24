import { ApiProperty } from '@nestjs/swagger';
import { ChatUserDto } from '@src/users/dtos/chat-user.dto';
import { AggregateChatRoomsDto } from './aggregate-chat-rooms.dto';

export class ResponseFindChatRoomsDto {
  @ApiProperty({
    description: '최신 채팅 내역이 포함된 chatRoom 객체',
  })
  chatRooms: AggregateChatRoomsDto;

  @ApiProperty({
    description: '채팅 상대 유저의 정보',
    isArray: true,
    type: ChatUserDto,
  })
  chatPartners: ChatUserDto[];

  constructor(
    chatRoomsDto: AggregateChatRoomsDto,
    chatUserDtos: ChatUserDto[],
  ) {
    this.chatRooms = chatRoomsDto;
    this.chatPartners = chatUserDtos;
  }
}
