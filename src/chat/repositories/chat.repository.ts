import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ChatRooms } from '../schemas/chat-rooms.schemas';
import { Chats } from '../schemas/chats.schemas';
import { ChatImages } from '../schemas/chat-images.schemas';
import mongoose from 'mongoose';
import { ChatRoomsDto } from '../dto/chat-rooms.dto';
import { ChatsDto } from '../dto/chats.dto';
import { ChatImagesDto } from '../dto/chat-images.dto';
import { AggregateChatRoomsDto } from '../dto/aggregate-chat-rooms.dto';

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

  aggregateChatRooms(
    pipeline: mongoose.PipelineStage[],
  ): Promise<AggregateChatRoomsDto[]> {
    return this.chatRoomModel.aggregate(pipeline);
  }

  /**
   *
   * @param filter
   * @returns
   */
  findOneChatRoom(
    filter: mongoose.FilterQuery<ChatRooms>,
  ): Promise<ChatRoomsDto> {
    return this.chatRoomModel.findOne(filter);
  }

  async createChatRoom<DocContents = mongoose.AnyKeys<ChatRooms>>(
    doc: DocContents,
  ): Promise<ChatRoomsDto> {
    return this.chatRoomModel.create(doc);
  }

  async updateOneChatRoom(
    filter: mongoose.FilterQuery<ChatRooms>,
    update: mongoose.UpdateQuery<ChatRooms>,
  ): Promise<void> {
    const updatedChatRoom = await this.chatRoomModel.updateOne(filter, update);

    if (!updatedChatRoom.modifiedCount) {
      throw new InternalServerErrorException(
        '업데이트 중 알 수 없는 오류 발생',
      );
    }
  }

  findAllChats(filter: mongoose.FilterQuery<Chats>): Promise<ChatsDto[]> {
    return this.chatModel.find(filter);
  }

  findOneChat(filter: mongoose.FilterQuery<Chats>): Promise<ChatsDto> {
    return this.chatModel.findOne(filter);
  }

  async updateManyChats(
    filter: mongoose.FilterQuery<Chats>,
    update: mongoose.UpdateQuery<Chats>,
  ): Promise<void> {
    await this.chatModel.updateMany(filter, update);
  }

  async createChat<DocContents = mongoose.AnyKeys<Chats>>(
    doc: DocContents,
  ): Promise<ChatsDto> {
    return this.chatModel.create(doc);
  }

  async createChatImage<DocContents = mongoose.AnyKeys<Chats>>(
    doc: DocContents,
  ): Promise<ChatImagesDto> {
    return this.chatImageModel.create(doc);
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
