import { Injectable, InternalServerErrorException } from '@nestjs/common';
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

  /**
   *  @todo 재사용성 높은 코드로 고치기
   *
   */
  findAllChatRooms(
    filter: mongoose.FilterQuery<ChatRooms>,
  ): Promise<ChatRoomsDto[]> {
    return this.chatRoomModel.find(filter);
  }

  /**
   *
   * @param filter
   * @returns
   */
  findOneChatRoomOrFail(
    filter: mongoose.FilterQuery<ChatRooms>,
  ): Promise<ChatRoomsDto> {
    return this.chatRoomModel.findOne(filter);
  }

  /**
   *  @todo 재사용성 높은 코드로 고치기
   *
   */
  async createChatRoom(myId: number, guestId: number): Promise<ChatRoomsDto> {
    const value = await this.chatRoomModel.create({
      hostId: myId,
      guestId: guestId,
    });

    return value.unprotectedData;
  }

  /**
   *
   * @param filter
   * @param update
   */
  async updateOneChatRoom(
    filter?: mongoose.FilterQuery<ChatRooms>,
    update?: mongoose.UpdateQuery<ChatRooms>,
  ): Promise<void> {
    const updatedChatRoom = await this.chatRoomModel.updateOne(filter, update);

    if (!updatedChatRoom.modifiedCount) {
      throw new InternalServerErrorException(
        '업데이트 중 알 수 없는 오류 발생',
      );
    }
  }

  /**
   *
   * @param filter
   * @returns
   */
  findAllChats(filter: mongoose.FilterQuery<Chats>): Promise<ChatsDto[]> {
    return this.chatModel.find(filter);
  }

  /**
   *  @todo 재사용성 높은 코드로 고치기
   *
   */
  async updateManyChats(
    filter: mongoose.FilterQuery<Chats>,
    update: mongoose.UpdateQuery<Chats>,
  ): Promise<void> {
    await this.chatModel.updateMany(filter, update);
  }

  /**
   *  @todo 재사용성 높은 코드로 고치기
   *
   */
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

    await this.updateOneChatRoom(
      { _id: roomId },
      {
        $push: { chatIds: returnedChat._id },
      },
    );

    return returnedChat;
  }

  /**
   *  @todo 재사용성 높은 코드로 고치기
   *
   */
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
