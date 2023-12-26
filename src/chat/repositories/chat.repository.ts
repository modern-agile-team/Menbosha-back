import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ChatRooms } from '../schemas/chat-rooms.schemas';
import { ChatImages } from '../schemas/chat-images.schemas';
import mongoose, {
  AggregatePaginateModel,
  PaginateModel,
  PaginateOptions,
} from 'mongoose';
import { ChatRoomsDto } from '../dto/chat-rooms.dto';
import { ChatsDto } from '../dto/chats.dto';
import { ChatImagesDto } from '../dto/chat-images.dto';
import { AggregateChatRoomsDto } from '../dto/aggregate-chat-rooms.dto';

@Injectable()
export class ChatRepository {
  constructor(
    @InjectModel(ChatRooms.name)
    private readonly chatRoomsModel: mongoose.Model<ChatRooms>,
    @InjectModel(ChatImages.name)
    private readonly chatImagesModel: mongoose.Model<ChatImages>,
    @InjectModel(ChatRooms.name)
    private readonly chatRoomsPaginateModel: PaginateModel<ChatRooms>,
    @InjectModel(ChatRooms.name)
    private readonly chatRoomsAggregatePaginateModel: AggregatePaginateModel<ChatRooms>,
  ) {}

  findAllChatRooms(
    filter: mongoose.FilterQuery<ChatRooms>,
  ): Promise<ChatRoomsDto[]> {
    return this.chatRoomsModel.find(filter);
  }

  aggregateChatRooms(
    pipeline: mongoose.PipelineStage[],
  ): Promise<AggregateChatRoomsDto[]> {
    return this.chatRoomsModel.aggregate(pipeline);
  }

  /**
   *
   * @param filter
   * @returns
   */
  findOneChatRoom(
    filter: mongoose.FilterQuery<ChatRooms>,
  ): Promise<ChatRoomsDto> {
    return this.chatRoomsModel.findOne(filter);
  }

  paginateOneChatRoom(
    query: mongoose.FilterQuery<ChatRooms>,
    options: PaginateOptions,
    callback?,
  ): Promise<ChatRooms> {
    return this.chatRoomsPaginateModel.paginate(query, options, callback);
  }

  async createChatRoom<DocContents = mongoose.AnyKeys<ChatRooms>>(
    doc: DocContents,
  ): Promise<ChatRoomsDto> {
    return this.chatRoomsModel.create(doc);
  }

  async updateOneChatRoom(
    filter: mongoose.FilterQuery<ChatRooms>,
    update: mongoose.UpdateQuery<ChatRooms>,
    options?: mongoose.QueryOptions<ChatRooms>,
  ): Promise<void> {
    await this.chatRoomsModel.updateOne(filter, update, options);
  }

  async updateManyChatRoom(
    filter: mongoose.FilterQuery<ChatRooms>,
    update: mongoose.UpdateQuery<ChatRooms>,
    options?: mongoose.QueryOptions<ChatRooms>,
  ) {
    return this.chatRoomsModel.updateMany(filter, update, options);
  }

  // findAllChats(filter: mongoose.FilterQuery<Chats>): Promise<ChatsDto[]> {
  //   return this.chatsModel.find(filter);
  // }

  // findOneChat(filter: mongoose.FilterQuery<Chats>): Promise<ChatsDto> {
  //   return this.chatsModel.findOne(filter);
  // }

  findOneChatImages(
    filter: mongoose.FilterQuery<ChatImages>,
  ): Promise<ChatImages> {
    return this.chatImagesModel.findOne(filter);
  }

  // async updateManyChats(
  //   filter: mongoose.FilterQuery<Chats>,
  //   update: mongoose.UpdateQuery<Chats>,
  // ): Promise<void> {
  //   await this.chatsModel.updateMany(filter, update);
  // }

  async createChat(
    id: mongoose.Types.ObjectId | any,
    update: mongoose.UpdateQuery<ChatRooms>,
    options?: mongoose.QueryOptions<ChatRooms> | null,
  ): Promise<ChatRoomsDto> {
    return this.chatRoomsModel.findByIdAndUpdate(id, update, options);
  }

  async createChatImage<DocContents = mongoose.AnyKeys<ChatImages>>(
    doc: DocContents,
  ): Promise<ChatImagesDto> {
    return this.chatImagesModel.create(doc);
  }

  // async getUnreadCounts(roomId: mongoose.Types.ObjectId, after: number) {
  //   return this.chatsModel.count({
  //     $and: [{ chatRoomId: roomId }, { createdAt: { $gt: new Date(after) } }],
  //   });
  // }
}
