import { ChatsDto } from './chats.dto';
import { Expose } from 'class-transformer';

export class GetNotificationsResponseFromChatsDto extends ChatsDto {
  @Expose()
  count: number;

  constructor(
    getNotificationsResponseFromChatsDto: Partial<GetNotificationsResponseFromChatsDto> = {},
  ) {
    super(getNotificationsResponseFromChatsDto);

    this.count = getNotificationsResponseFromChatsDto.count;
  }
}
