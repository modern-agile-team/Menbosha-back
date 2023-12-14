import mongoose from 'mongoose';
import { ChatsDto } from './chats.dto';
import { Expose } from 'class-transformer';

export class GetNotificationsResponseFromChatsDto extends ChatsDto {
  @Expose()
  _id: mongoose.Types.ObjectId;

  @Expose()
  count: number;

  constructor(
    getNotificationsResponseFromChatsDto: GetNotificationsResponseFromChatsDto,
  ) {
    super(getNotificationsResponseFromChatsDto);

    this._id = getNotificationsResponseFromChatsDto._id;
    this.count = getNotificationsResponseFromChatsDto.count;
  }
}
