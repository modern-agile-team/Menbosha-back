import { ChatRoomsDto } from './chat-rooms.dto';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { lookupChatsDto } from './lookup-chat-dto';

export class AggregateChatRoomsDto extends OmitType(ChatRoomsDto, [
  'chatIds',
  'deletedAt',
]) {
  @ApiProperty({
    description: '채팅 갯수',
  })
  chatCount: number;

  @ApiProperty({
    description: '채팅 schema에서 content, 생성 날짜, 채팅 확인 여부',
  })
  chat: lookupChatsDto;

  constructor(aggregateChatRoomsDto: AggregateChatRoomsDto) {
    super();

    this._id = aggregateChatRoomsDto._id;
    this.hostId = aggregateChatRoomsDto.hostId;
    this.guestId = aggregateChatRoomsDto.guestId;
    this.createdAt = aggregateChatRoomsDto.createdAt;
    this.chatCount = aggregateChatRoomsDto.chatCount;
    this.chat = aggregateChatRoomsDto.chat;
  }
}
