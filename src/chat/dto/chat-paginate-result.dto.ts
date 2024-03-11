export class ChatRoomPaginateResultDto<ChatRoomDto> {
  docs: ChatRoomDto[];
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
  [customLabel: string]: ChatRoomDto[] | number | boolean | null | undefined;

  constructor(paginateResult: ChatRoomPaginateResultDto<ChatRoomDto>) {
    Object.assign(this, paginateResult);
  }
}
