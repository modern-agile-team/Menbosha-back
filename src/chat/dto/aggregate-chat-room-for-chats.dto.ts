import { ApiProperty } from '@nestjs/swagger';
import { ChatRoomDto } from './chat-room.dto';
import { PaginationResponseDto } from '@src/common/dto/pagination-response.dto';
import { ChatUserDto } from '@src/users/dtos/chat-user.dto';

export class AggregateChatRoomForChatsDto
  extends ChatRoomDto
  implements PaginationResponseDto
{
  @ApiProperty({
    description: '채팅 상대 유저의 정보',
    isArray: true,
    type: ChatUserDto,
  })
  chatPartners: ChatUserDto[];

  @ApiProperty({
    description: '해당 채팅방 내의 채팅 총 개수.',
  })
  totalCount: number;

  @ApiProperty({
    description: '해당 채팅방 내의 채팅 pagination 현재 페이지',
  })
  currentPage: number;

  @ApiProperty({
    description: 'pagination 요청한 데이터의 개수',
  })
  pageSize: number;

  @ApiProperty({
    description: '해당 채팅방 내의 채팅 pagination 다음 페이지',
    type: 'integer',
    nullable: true,
  })
  nextPage: number | null;

  @ApiProperty({
    description: '해당 채팅방 내의 채팅 pagination 다음 페이지 여부',
  })
  hasNext: boolean;

  @ApiProperty({
    description: '해당 채팅방 내의 채팅 pagination 마지막 페이지',
  })
  lastPage: number;

  constructor(
    aggregateChatRoomsForChatsDto: AggregateChatRoomForChatsDto,
    chatPartners: ChatUserDto[],
    page: number,
    pageSize: number,
  ) {
    super(aggregateChatRoomsForChatsDto);

    this.chatPartners = chatPartners;
    this.totalCount = aggregateChatRoomsForChatsDto.totalCount;
    this.currentPage = page;
    this.pageSize = pageSize;
    this.lastPage = Math.ceil(this.totalCount / pageSize);
    this.nextPage =
      pageSize * this.currentPage < this.totalCount ? page + 1 : null;
    this.hasNext = pageSize * this.currentPage < this.totalCount;
  }
}
