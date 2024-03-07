import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ChatImageDto } from '@src/chat/dto/chat-image.dto';
import { ChatRoomDto } from '@src/chat/dto/chat-room.dto';
import { ChatImages } from '@src/chat/schemas/chat-images.schemas';
import { ChatRooms } from '@src/chat/schemas/chat-rooms.schemas';
import mongoose, {
  AggregatePaginateModel,
  AggregatePaginateResult,
  PaginateModel,
  PaginateOptions,
  PaginateResult,
} from 'mongoose';

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
    projection?: mongoose.ProjectionType<ChatRooms>,
    options?: mongoose.QueryOptions<ChatRooms>,
  ): Promise<ChatRoomDto[]> {
    return this.chatRoomsModel.find(filter, projection, options);
  }

  aggregateChatRooms(
    pipeline: mongoose.PipelineStage[],
  ): mongoose.Aggregate<Array<any>> {
    return this.chatRoomsModel.aggregate(pipeline);
  }

  /**
   *
   * @param filter
   * @returns
   */
  findOneChatRoom(
    filter: mongoose.FilterQuery<ChatRooms>,
    projection?: mongoose.ProjectionType<ChatRooms>,
    options?: mongoose.QueryOptions<ChatRooms>,
  ): Promise<ChatRoomDto> {
    return this.chatRoomsModel.findOne(filter, projection, options);
  }

  paginateOneChatRoom(
    query: mongoose.FilterQuery<ChatRooms>,
    options: PaginateOptions,
    callback?,
  ): Promise<PaginateResult<ChatRoomDto>> {
    return this.chatRoomsPaginateModel.paginate(query, options, callback);
  }

  aggregatePaginate(
    query: mongoose.Aggregate<ChatRooms[]>,
    options: mongoose.PaginateOptions,
    callback?,
  ): Promise<AggregatePaginateResult<ChatRoomDto>> {
    return this.chatRoomsAggregatePaginateModel.aggregatePaginate(
      query,
      options,
      callback,
    );
  }

  async createChatRoom<DocContents = mongoose.AnyKeys<ChatRooms>>(
    doc: DocContents,
  ): Promise<ChatRoomDto> {
    return this.chatRoomsModel.create(doc);
  }

  async findOneAndUpdateChatRoom(
    filter: mongoose.FilterQuery<ChatRooms>,
    update: mongoose.UpdateQuery<ChatRooms>,
    options?: mongoose.QueryOptions<ChatRooms>,
  ): Promise<ChatRoomDto> {
    return this.chatRoomsModel.findOneAndUpdate(filter, update, options);
  }

  async updateOneChatRoom(
    filter: mongoose.FilterQuery<ChatRooms>,
    update: mongoose.UpdateQuery<ChatRooms>,
    options?: mongoose.QueryOptions<ChatRooms>,
  ) {
    return this.chatRoomsModel.updateOne(filter, update, options);
  }

  updateManyChatRoom(
    filter: mongoose.FilterQuery<ChatRooms>,
    update: mongoose.UpdateQuery<ChatRooms>,
    options?: mongoose.QueryOptions<ChatRooms>,
  ) {
    return this.chatRoomsModel.updateMany(filter, update, options);
  }

  findOneChatImages(
    filter: mongoose.FilterQuery<ChatImages>,
  ): Promise<ChatImages> {
    return this.chatImagesModel.findOne(filter);
  }

  createChat(
    id: mongoose.Types.ObjectId,
    update: mongoose.UpdateQuery<ChatRooms>,
    options?: mongoose.QueryOptions<ChatRooms> | null,
  ): Promise<ChatRoomDto> {
    return this.chatRoomsModel.findByIdAndUpdate(id, update, options);
  }

  createChatImage<DocContents = mongoose.AnyKeys<ChatImages>>(
    doc: DocContents,
  ): Promise<ChatImageDto> {
    return this.chatImagesModel.create(doc);
  }
}
