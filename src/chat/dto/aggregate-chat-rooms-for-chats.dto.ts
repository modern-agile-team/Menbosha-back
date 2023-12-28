import { ApiProperty } from '@nestjs/swagger';
import { ChatRoomsDto } from './chat-rooms.dto';

export class AggregateChatRoomsForChatsDto extends ChatRoomsDto {
  @ApiProperty({
    description: '해당 채팅방 내의 채팅 총 개수.',
  })
  chatsCount: number;

  constructor(aggregateChatRoomsForChatsDto: AggregateChatRoomsForChatsDto) {
    super(aggregateChatRoomsForChatsDto);

    this.chatsCount = aggregateChatRoomsForChatsDto.chatsCount;
  }
}
