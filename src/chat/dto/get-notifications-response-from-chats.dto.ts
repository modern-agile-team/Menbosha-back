import mongoose from 'mongoose';
import { ChatsDto } from './chats.dto';
import { Expose } from 'class-transformer';
import { TransformMongoId } from './transform/transform-mongo-id';

export class GetNotificationsResponseFromChatsDto extends ChatsDto {
  @Expose()
  @TransformMongoId()
  _id: mongoose.Types.ObjectId;

  @Expose()
  count: number;

  constructor(
    getNotificationsResponseFromChatsDto: Partial<GetNotificationsResponseFromChatsDto> = {},
  ) {
    super(getNotificationsResponseFromChatsDto);

    this._id = getNotificationsResponseFromChatsDto._id;
    this.count = getNotificationsResponseFromChatsDto.count;
  }
}
