import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ChatRoom } from '../schemas/chat-room.schemas';
import { Chat } from '../schemas/chat.schemas';
import { ChatImage } from '../schemas/chat-image.schemas';
import mongoose from 'mongoose';
import { ChatRoomDto } from '../dto/chat-room.dto';
import { ChatDto } from '../dto/chat.dto';

@Injectable()
export class ChatRepository {
  constructor(
    @InjectModel(ChatRoom.name)
    private readonly chatRoomModel: mongoose.Model<ChatRoom>,
    @InjectModel(Chat.name)
    private readonly chatModel: mongoose.Model<Chat>,
    @InjectModel(ChatImage.name)
    private readonly chatImageModel: mongoose.Model<ChatImage>,
  ) {}

  getChatRooms(myId: number): Promise<ChatRoomDto[]> {
    return this.chatRoomModel.find({
      $and: [{ $or: [{ host_id: myId }, { guest_id: myId }] }],
    });
  }

  getOneChatRoom(roomId: mongoose.Types.ObjectId): Promise<ChatRoomDto> {
    return this.chatRoomModel.findById(roomId);
  }

  createChatRoom(myId: number, guestId: number): Promise<ChatRoom> {
    return this.chatRoomModel.create({
      host_id: myId,
      guest_id: guestId,
    });
  }

  async deleteChatRoom(roomId: mongoose.Types.ObjectId) {
    await this.chatRoomModel.findByIdAndUpdate(roomId, {
      deleted_at: new Date(),
    });
  }

  getChats(roomId: mongoose.Types.ObjectId): Promise<ChatDto[]> {
    return this.chatModel.find({
      chatroom_id: roomId,
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
          { chatroom_id: roomId },
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
  ): Promise<Chat> {
    const returnedChat = await this.chatModel.create({
      chatroom_id: roomId,
      content: content,
      sender: myId,
      receiver: receiverId,
    });

    await this.chatRoomModel.findByIdAndUpdate(returnedChat.chatroom_id, {
      $push: { chat_ids: returnedChat._id },
    });

    return returnedChat;
  }

  async createChatImage(
    roomId: mongoose.Types.ObjectId,
    myId: number,
    receiverId: number,
    imageUrl: string,
  ): Promise<Chat> {
    const returnedChat = await this.chatModel.create({
      chatroom_id: roomId,
      sender: myId,
      receiver: receiverId,
      content: imageUrl,
    });

    await this.chatImageModel.create({
      chat_id: returnedChat.id,
      image_url: returnedChat.content,
    });

    await this.chatRoomModel.findByIdAndUpdate(returnedChat.chatroom_id, {
      $push: { chat_ids: returnedChat._id },
    });

    return returnedChat;
  }

  async getChatNotifications(userId: number): Promise<Chat[]> {
    const notifications = await this.chatModel
      .find({
        $and: [{ receiver: userId }, { isSeen: false }],
      })
      .sort({ createdAt: -1 });

    return notifications;
  }

  // async getUnreadCounts(roomId: mongoose.Types.ObjectId, after: number) {
  //   return this.chatModel.count({
  //     $and: [{ chatroom_id: roomId }, { createdAt: { $gt: new Date(after) } }],
  //   });
  // }
}
