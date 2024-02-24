import { PaginationResponseDto } from '@src/common/dto/pagination-response.dto';
import { ResponseFindChatRoomsDto } from './response-find-chat-rooms.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseFindChatRoomsPaginationDto extends PaginationResponseDto {
  @ApiProperty({
    description: '최신 채팅 내역이 포함된 chatRoom 객체',
    type: [ResponseFindChatRoomsDto],
  })
  chatRooms: ResponseFindChatRoomsDto[];

  constructor(
    responseFindChatRoomsDto: ResponseFindChatRoomsDto[],
    totalCount: number,
    page: number,
    pageSize: number,
  ) {
    super(totalCount, page, pageSize);
    this.chatRooms = responseFindChatRoomsDto;
  }
}
