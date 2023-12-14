import mongoose from 'mongoose';
import { ChatsDto } from './chats.dto';

export class GetNotificationsResponseFromChatDto extends ChatsDto {
  _id: mongoose.Types.ObjectId;

  count: number;

  constructor(
    getNotificationsResponseFromChatDto: GetNotificationsResponseFromChatDto,
  ) {
    super(getNotificationsResponseFromChatDto);

    this._id = getNotificationsResponseFromChatDto._id;
    this.count = getNotificationsResponseFromChatDto.count;
  }
}
