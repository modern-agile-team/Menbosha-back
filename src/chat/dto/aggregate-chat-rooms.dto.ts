import { ChatRoomsDto } from './chat-rooms.dto';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { LookupChatsDto } from './lookup-chat-dto';

export class AggregateChatRoomsDto extends OmitType(ChatRoomsDto, [
  'chats',
  'deletedAt',
]) {
  @ApiProperty({
    description: '채팅 갯수',
  })
  chatCount: number;

  @ApiProperty({
    description: '채팅 schema에서 content, 생성 날짜, 채팅 확인 여부',
  })
  chat: LookupChatsDto;

  constructor(aggregateChatRoomsDto: AggregateChatRoomsDto) {
    super();

    this._id = aggregateChatRoomsDto._id;
    this.chatMembers = aggregateChatRoomsDto.chatMembers;
    this.createdAt = aggregateChatRoomsDto.createdAt;
    this.chatCount = aggregateChatRoomsDto.chatCount;
    this.chat = aggregateChatRoomsDto.chat;
  }
}
