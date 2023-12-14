import mongoose from 'mongoose';
import { ChatsDto } from './chats.dto';

export class GetNotificationsResponseFromChatsDto extends ChatsDto {
  _id: mongoose.Types.ObjectId;

  count: number;

  constructor(
    getNotificationsResponseFromChatsDto: GetNotificationsResponseFromChatsDto,
  ) {
    super(getNotificationsResponseFromChatsDto);

    this._id = getNotificationsResponseFromChatsDto._id;
    this.count = getNotificationsResponseFromChatsDto.count;
  }
}
