import { ChatRoomsDto } from './chat-rooms.dto';

export class ChatRoomPaginateResultDto<ChatRoomsDto> {
  docs: ChatRoomsDto[];
  totalDocs: number;
  limit: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  page?: number | undefined;
  totalPages: number;
  offset: number;
  prevPage?: number | null | undefined;
  nextPage?: number | null | undefined;
  pagingCounter: number;
  meta?: any;
  [customLabel: string]: ChatRoomsDto[] | number | boolean | null | undefined;

  constructor(paginateResult: ChatRoomPaginateResultDto<ChatRoomsDto>) {
    Object.assign(this, paginateResult);
  }
}
