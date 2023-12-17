import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ChatRooms } from '../schemas/chat-rooms.schemas';
import { Chats } from '../schemas/chats.schemas';
import { ChatImages } from '../schemas/chat-images.schemas';
import mongoose from 'mongoose';
import { ChatRoomsDto } from '../dto/chat-rooms.dto';
import { ChatsDto } from '../dto/chats.dto';

@Injectable()
export class ChatRepository {
  constructor(
    @InjectModel(ChatRooms.name)
    private readonly chatRoomModel: mongoose.Model<ChatRooms>,
    @InjectModel(Chats.name)
    private readonly chatModel: mongoose.Model<Chats>,
    @InjectModel(ChatImages.name)
    private readonly chatImageModel: mongoose.Model<ChatImages>,
  ) {}

  getChatRooms(myId: number): Promise<ChatRoomsDto[]> {
    return this.chatRoomModel.find({
      $and: [{ $or: [{ hostId: myId }, { guestId: myId }] }],
    });
  }

  getOneChatRoom(roomId: mongoose.Types.ObjectId): Promise<ChatRoomsDto> {
    return this.chatRoomModel.findById(roomId);
  }

  async createChatRoom(myId: number, guestId: number): Promise<ChatRoomsDto> {
    const value = await this.chatRoomModel.create({
      hostId: myId,
      guestId: guestId,
    });

    return value.unprotectedData;
  }

  async deleteChatRoom(roomId: mongoose.Types.ObjectId) {
    await this.chatRoomModel.findByIdAndUpdate(roomId, {
      deleted_at: new Date(),
    });
  }

  getChats(roomId: mongoose.Types.ObjectId): Promise<ChatsDto[]> {
    return this.chatModel.find({
      chatRoomId: roomId,
    });
  }

  async updateChatIsSeen(
    receiverId: number,
    roomId: mongoose.Types.ObjectId,
  ): Promise<void> {
    await this.chatModel.updateMany(
      {
        $and: [
          { receiver: receiverId },
          { chatRoomId: roomId },
          { isSeen: false },
        ],
      },
      { $set: { isSeen: true } },
    );
  }

  async createChat(
    roomId: mongoose.Types.ObjectId,
    content: string,
    myId: number,
    receiverId: number,
  ): Promise<ChatsDto> {
    const returnedChat = await this.chatModel.create({
      chatRoomId: roomId,
      content: content,
      sender: myId,
      receiver: receiverId,
    });

    await this.chatRoomModel.findByIdAndUpdate(returnedChat.chatRoomId, {
      $push: { chatIds: returnedChat._id },
    });

    return returnedChat;
  }

  async createChatImage(
    roomId: mongoose.Types.ObjectId,
    myId: number,
    receiverId: number,
    imageUrl: string,
  ): Promise<Chats> {
    const returnedChat = await this.chatModel.create({
      chatRoomId: roomId,
      sender: myId,
      receiver: receiverId,
      content: imageUrl,
    });

    await this.chatImageModel.create({
      chatId: returnedChat.id,
      imageUrl: returnedChat.content,
    });

    await this.chatRoomModel.findByIdAndUpdate(returnedChat.chatRoomId, {
      $push: { chatIds: returnedChat._id },
    });

    return returnedChat;
  }

  // async getChatNotifications(userId: number): Promise<Chats[]> {
  //   const notifications = await this.chatModel
  //     .find({
  //       $and: [{ receiver: userId }, { isSeen: false }],
  //     })
  //     .select({
  //       _id: 1,
  //       chatRoomId: 1,
  //       content: 1,
  //       sender: 1,
  //       receiver: 1,
  //       isSeen: 1,
  //       createdAt: 1,
  //     })
  //     .sort({ createdAt: -1 });
  //   // .lean();

  //   return notifications;
  // }

  // async getUnreadCounts(roomId: mongoose.Types.ObjectId, after: number) {
  //   return this.chatModel.count({
  //     $and: [{ chatRoomId: roomId }, { createdAt: { $gt: new Date(after) } }],
  //   });
  // }
}
