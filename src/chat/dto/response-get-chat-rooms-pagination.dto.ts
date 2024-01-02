import { PaginationResponseDto } from 'src/common/dto/pagination-response.dto';
import { ResponseGetChatRoomsDto } from './response-get-chat-rooms.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseGetChatRoomsPaginationDto extends PaginationResponseDto {
  @ApiProperty({
    description: '최신 채팅 내역이 포함된 chatRoom 객체',
  })
  chatRooms: ResponseGetChatRoomsDto[];

  constructor(
    responseGetChatRoomsDto: ResponseGetChatRoomsDto[],
    totalCount: number,
    page: number,
    pageSize: number,
  ) {
    super(totalCount, page, pageSize);
    this.chatRooms = responseGetChatRoomsDto;
  }
}
