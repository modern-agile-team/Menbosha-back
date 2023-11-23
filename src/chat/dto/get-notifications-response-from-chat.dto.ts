import mongoose from 'mongoose';

export class GetNotificationsResponseFromChatDto {
  _id: mongoose.Types.ObjectId;

  chatroom_id: mongoose.Types.ObjectId;

  sender: number;

  receiver: number;

  content: string;

  createdAt: Date;

  isSeen: false;

  count: number;
}
