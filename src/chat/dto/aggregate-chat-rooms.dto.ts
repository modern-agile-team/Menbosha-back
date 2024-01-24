import { ChatRoomDto } from './chat-room.dto';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { LookupChatsDto } from './lookup-chat-dto';

export class AggregateChatRoomsDto extends OmitType(ChatRoomDto, [
  'chats',
  'deletedAt',
]) {
  @ApiProperty({
    description: '읽지 않은 채팅 갯수',
  })
  unReadChatCount: number;

  @ApiProperty({
    description: '채팅 schema에서 content, 생성 날짜, 채팅 확인 여부',
  })
  chat: LookupChatsDto;

  constructor(aggregateChatRoomsDto: AggregateChatRoomsDto) {
    super();

    this._id = aggregateChatRoomsDto._id;
    this.originalMembers = aggregateChatRoomsDto.originalMembers;
    this.chatMembers = aggregateChatRoomsDto.chatMembers;
    this.chatRoomType = aggregateChatRoomsDto.chatRoomType;
    this.createdAt = aggregateChatRoomsDto.createdAt;
    this.updatedAt = aggregateChatRoomsDto.updatedAt;
    this.unReadChatCount = aggregateChatRoomsDto.unReadChatCount;
    this.chat = aggregateChatRoomsDto.chat;
  }
}
