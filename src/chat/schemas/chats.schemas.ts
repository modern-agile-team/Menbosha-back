import * as mongoose from 'mongoose';

export class Chat {
  _id: mongoose.Types.ObjectId;

  chatRoomId: mongoose.Types.ObjectId;

  senderId: number;

  content: string;

  seenUsers: number[] | [];

  createdAt: Date;

  deletedAt: null | Date = null;
}
