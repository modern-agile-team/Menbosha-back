import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import * as mongoose from 'mongoose';
import { S3Service } from '@src/common/s3/services/s3.service';
import { Observable, Subject, catchError, map } from 'rxjs';
import { In } from 'typeorm';
import { UserService } from '@src/users/services/user.service';
import { ChatUserDto } from '@src/users/dtos/chat-user.dto';
import { PageQueryDto } from '@src/common/dto/page-query.dto';
import { PostChatDto } from '@src/chat/dto/post-chat.dto';
import { ChatRoomType } from '@src/chat/constants/chat-rooms-enum';
import { AggregateChatRoomForChatsDto } from '@src/chat/dto/aggregate-chat-room-for-chats.dto';
import { AggregateChatRoomsDto } from '@src/chat/dto/aggregate-chat-rooms.dto';
import { ChatImageDto } from '@src/chat/dto/chat-image.dto';
import { ChatRoomDto } from '@src/chat/dto/chat-room.dto';
import { ChatDto } from '@src/chat/dto/chat.dto';
import { CreateChatRoomBodyDto } from '@src/chat/dto/create-chat-room-body.dto';
import { ResponseFindChatRoomsPaginationDto } from '@src/chat/dto/response-find-chat-rooms-pagination.dto';
import { ResponseFindChatRoomsDto } from '@src/chat/dto/response-find-chat-rooms.dto';
import { ChatRepository } from '@src/chat/repositories/chat.repository';
import { ChatRooms } from '@src/chat/schemas/chat-rooms.schemas';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private readonly subjectMap: Map<number, Subject<ChatDto>> = new Map();
  constructor(
    private readonly s3Service: S3Service,
    private readonly userService: UserService,
    private readonly chatRepository: ChatRepository,
  ) {}

  /**
   * @todo 현재 알람 수신은 잘 되는데 객체가 empty로 나옴. 마지막에 수정.
   * @param myId
   * @returns
   */
  notificationListener(myId: number): Observable<string> {
    if (!this.subjectMap.get(myId)) {
      this.subjectMap.set(myId, new Subject<ChatDto>());
    }

    const subject = this.subjectMap.get(myId);

    return subject.asObservable().pipe(
      map((notification) => JSON.stringify(notification)),
      catchError((err) => {
        this.logger.error('notificationListener : ' + err.message);
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }),
    );
  }

  /**
   *
   * @param roomId
   * @returns 채팅방을 1개 return. 없을 시에 에러 던짐.(roomId)
   */
  async findOneChatRoomOrFail(
    roomId: mongoose.Types.ObjectId,
  ): Promise<ChatRoomDto> {
    const returnedRoom = await this.findOneChatRoom({
      _id: roomId,
      deletedAt: null,
    });

    if (!returnedRoom) {
      throw new NotFoundException('해당 채팅방이 존재하지 않습니다.');
    }

    return new ChatRoomDto(returnedRoom);
  }

  async findOneChatRoom(
    filter: mongoose.FilterQuery<ChatRooms>,
    projection?: mongoose.ProjectionType<ChatRooms>,
    options?: mongoose.QueryOptions<ChatRooms>,
  ) {
    const returnedRoom = await this.chatRepository.findOneChatRoom(
      filter,
      projection,
      options,
    );

    return returnedRoom ? new ChatRoomDto(returnedRoom) : null;
  }

  /**
   *
   * @param myId
   * @param guestId
   * @returns userId를 통해 채팅방을 조회.
   *  아마 유저에게 채팅을 걸기 전 해당 유저와의 채팅방이 있는지 확인하기위 호출하는 api로 쓰일 예정
   */
  async findOneChatRoomByUserIds(
    myId: number,
    chatPartnerId: number,
  ): Promise<ChatRoomDto> {
    const returnedRoom = await this.findOneChatRoom({
      originalMembers: { $all: [myId, chatPartnerId] },
      chatMembers: { $all: [myId, chatPartnerId] },
      deletedAt: null,
      chatRoomType: ChatRoomType.OneOnOne,
    });

    if (!returnedRoom) {
      throw new NotFoundException('해당 채팅방이 없습니다.');
    }

    return new ChatRoomDto(returnedRoom);
  }

  /**
   *
   * @param myId
   * @param guestId
   * @returns 채팅방 생성 로직. 해당 채팅방의 원본 멤버를 통해 채팅방의 유무를 검사함.
   * 만약에 둘다 현재 참가중인 1:1 채팅방이 있다면 conflict error를 던짐.
   * 둘 중에 하나만 있다면 없는 유저를 기존 채팅방으로 다시 초대.
   * 둘 다 없다면 새로운 채팅방 개설.
   */
  async createChatRoom(
    myId: number,
    createChatRoomBodyDto: CreateChatRoomBodyDto,
  ): Promise<ChatRoomDto> {
    const { receiverId, chatRoomType } = createChatRoomBodyDto;

    if (myId === receiverId) {
      throw new ForbiddenException('본인과 채팅방을 생성할 수 없습니다.');
    }

    const existReceiver = await this.userService.findOneByOrNotFound({
      select: ['id'],
      where: { id: receiverId },
    });

    const existChatRoom = await this.chatRepository.findOneChatRoom({
      $and: [
        { originalMembers: { $all: [myId, existReceiver.id] } },
        { deletedAt: null },
        { chatRoomType: chatRoomType },
      ],
    });

    if (!existChatRoom) {
      const returnedChatRoom = await this.chatRepository.createChatRoom({
        originalMembers: [myId, existReceiver.id],
        chatMembers: [myId, existReceiver.id],
        chatRoomType: chatRoomType,
      });

      return new ChatRoomDto(returnedChatRoom);
    }

    const { chatMembers, _id } = existChatRoom;

    const pushUserId = chatMembers.includes(myId) ? existReceiver.id : myId;

    if (chatMembers.length === 2) {
      return new ChatRoomDto(existChatRoom);
    }

    const updateWriteOpResult = await this.chatRepository.updateOneChatRoom(
      { _id },
      {
        $push: { chatMembers: pushUserId },
      },
    );

    if (!updateWriteOpResult.modifiedCount) {
      throw new InternalServerErrorException('채팅방 생성 중 서버에러 발생');
    }

    chatMembers.push(pushUserId);

    return new ChatRoomDto(existChatRoom);
  }

  /**
   *
   * @param myId
   * @param roomId
   * @returns 채팅방 나가기 로직.
   * 채팅방 내의 모든 유저가 나가면 채팅방 삭제 처리.
   */
  async leaveChatRoom(
    myId: number,
    roomId: mongoose.Types.ObjectId,
  ): Promise<mongoose.UpdateWriteOpResult> {
    const existChatRoom = await this.findOneChatRoomOrFail(roomId);

    if (!existChatRoom.chatMembers.includes(myId)) {
      throw new ForbiddenException('해당 채팅방에 접근 권한이 없습니다');
    }

    return this.chatRepository.updateOneChatRoom(
      { _id: roomId },
      {
        $pull: { chatMembers: myId },
        deletedAt: existChatRoom.chatMembers.length === 1 ? new Date() : null,
      },
    );
  }

  leaveChatRooms(userId: number) {
    return this.chatRepository.updateManyChatRoom(
      {
        chatMembers: { $in: userId },
      },
      { $pull: { chatMembers: userId } },
    );
  }

  /**
   *
   * @param myId
   * @param roomId
   * @returns chatRoom pagination(chats)
   */
  async findAllChats(
    myId: number,
    roomId: mongoose.Types.ObjectId,
    pageQueryDto: PageQueryDto,
  ): Promise<AggregateChatRoomForChatsDto> {
    const { page, pageSize } = pageQueryDto;
    const skip = (page - 1) * pageSize;

    const aggregatedChatRooms: AggregateChatRoomForChatsDto[] =
      await this.chatRepository.aggregateChatRooms([
        {
          $match: { _id: new mongoose.Types.ObjectId(roomId), deletedAt: null },
        },
        {
          $addFields: {
            filterChat: {
              $filter: {
                input: '$chats',
                as: 'chat',
                cond: { $eq: ['$$chat.deletedAt', null] },
              },
            },
          },
        },
        {
          $addFields: {
            totalCount: { $size: '$filterChat' },
            paginatedChat: {
              $slice: [{ $reverseArray: '$filterChat' }, skip, pageSize],
            },
          },
        },
        {
          $project: {
            _id: 1,
            originalMembers: 1,
            chatMembers: 1,
            totalCount: 1,
            chats: '$paginatedChat',
            chatRoomType: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        },
      ]);

    aggregatedChatRooms[0].chats.forEach((chat: ChatDto) => {
      if (!chat.seenUsers.includes(myId)) {
        chat.seenUsers.push(myId);
      }
    });

    await this.chatRepository.findOneAndUpdateChatRoom(
      {
        _id: roomId,
      },
      { $push: { 'chats.$[elem].seenUsers': myId } },
      { arrayFilters: [{ 'elem.seenUsers': { $ne: myId } }] },
    );

    if (!aggregatedChatRooms[0].chatMembers.includes(myId)) {
      throw new ForbiddenException('해당 채팅방에 접근 권한이 없습니다');
    }

    const chatPartnerIds = aggregatedChatRooms[0].originalMembers.filter(
      (userId) => userId !== myId,
    );

    const chatPartners = await this.userService.findAll({
      select: {
        id: true,
        name: true,
        userImage: {
          imageUrl: true,
        },
      },
      relations: {
        userImage: true,
      },
      where: {
        id: In(chatPartnerIds),
      },
    });

    const chatUsersDto = chatPartners.map(
      (chatPartner) =>
        new ChatUserDto({
          id: chatPartner.id,
          name: chatPartner.name,
          userImage: chatPartner.userImage.imageUrl,
        }),
    );

    return new AggregateChatRoomForChatsDto(
      aggregatedChatRooms[0],
      chatUsersDto,
      page,
      pageSize,
    );
  }

  async createChat({
    roomId,
    content,
    senderId,
  }: PostChatDto): Promise<ChatDto> {
    const returnedChatRoom = await this.findOneChatRoomOrFail(roomId);

    if (!returnedChatRoom.chatMembers.includes(senderId)) {
      throw new ForbiddenException('해당 채팅방에 접근 권한이 없습니다,');
    }

    const newChat: ChatDto = {
      _id: new mongoose.Types.ObjectId(),
      chatRoomId: new mongoose.Types.ObjectId(roomId),
      senderId: senderId,
      content: content,
      seenUsers: [senderId],
      createdAt: new Date(),
      deletedAt: null,
    };

    const updatedChatRoom = await this.chatRepository.createChat(
      roomId,
      {
        $push: { chats: newChat },
      },
      { new: true },
    );

    const { chats } = updatedChatRoom;

    const updatedChat = chats[chats.length - 1];

    const chatsDto = new ChatDto(updatedChat);

    chatsDto &&
      updatedChatRoom.chatMembers.forEach(
        (chatMember) =>
          chatMember !== senderId &&
          this.subjectMap.get(chatMember)?.next(chatsDto),
      );

    return chatsDto;
  }

  async createChatImage(
    roomId: mongoose.Types.ObjectId,
    senderId: number,
    file: Express.Multer.File,
  ) {
    const existChatRoom = await this.findOneChatRoomOrFail(roomId);

    if (!existChatRoom.chatMembers.includes(senderId)) {
      throw new ForbiddenException('해당 채팅방에 접근 권한이 없습니다');
    }

    if (!file) {
      throw new BadRequestException(
        'File buffer is missing in the uploaded file.',
      );
    }

    const uploadedImage = await this.s3Service.uploadImage(
      file,
      senderId,
      'ChatImages',
    );

    const returnedChatImage = await this.chatRepository.createChatImage({
      chatRoomId: new mongoose.Types.ObjectId(roomId),
      senderId: senderId,
      imageUrl: uploadedImage.url,
    });

    return new ChatImageDto(returnedChatImage);
  }

  /**
   * @param myId
   * @returns 각 채팅방의 채팅 상대방 멤버들의 정보와 가장 최신 채팅 내용을 매핑한 객체들의 배열을 return
   */
  async findAllChatRoomsWithUserAndChat(
    myId: number,
    pageQueryDto: PageQueryDto,
  ): Promise<ResponseFindChatRoomsPaginationDto> {
    const { page, pageSize } = pageQueryDto;
    const skip = (page - 1) * pageSize;

    const returnedChatRoomsAggregate: AggregateChatRoomsDto[] =
      await this.chatRepository.aggregateChatRooms([
        {
          $match: {
            chatMembers: myId,
            deletedAt: null,
          },
        },
        {
          $addFields: {
            unReadChatCount: {
              $size: {
                $filter: {
                  input: '$chats',
                  as: 'chat',
                  cond: { $not: { $in: [myId, '$$chat.seenUsers'] } },
                },
              },
            },
            latestChat: {
              $arrayElemAt: [
                {
                  $filter: {
                    input: '$chats',
                    as: 'chat',
                    cond: { $eq: ['$$chat.deletedAt', null] },
                  },
                },
                -1,
              ],
            },
          },
        },
        {
          $sort: { 'chats.createdAt': -1 },
        },
        { $skip: skip },
        { $limit: pageSize },
        {
          $project: {
            _id: 1,
            originalMembers: 1,
            chatMembers: 1,
            chatRoomType: 1,
            createdAt: 1,
            updatedAt: 1,
            unReadChatCount: 1,
            chat: {
              content: '$latestChat.content',
              seenUsers: '$latestChat.seenUsers',
              createdAt: '$latestChat.createdAt',
            },
          },
        },
      ]);

    if (!returnedChatRoomsAggregate) {
      return null;
    }

    const userIds = returnedChatRoomsAggregate.map((chatRoom) => {
      return chatRoom.chatMembers.filter((userId: number) => userId !== myId);
    });

    const oneDimensionalUserIds = [].concat(...userIds);

    const targetUsers = await this.userService.findAll({
      select: {
        id: true,
        name: true,
        userImage: {
          imageUrl: true,
        },
      },
      relations: {
        userImage: true,
      },
      where: {
        id: In(oneDimensionalUserIds),
      },
    });

    const chatUsersDtoArray = targetUsers.map((user) => {
      return new ChatUserDto({
        id: user.id,
        name: user.name,
        userImage: user.userImage.imageUrl,
      });
    });

    const aggregateChatRoomsDto = returnedChatRoomsAggregate.map((chat) => {
      return new AggregateChatRoomsDto(chat);
    });

    const responseFindChatRoomsDto = aggregateChatRoomsDto.map(
      (aggregateChatRoomDto) => {
        const { originalMembers } = aggregateChatRoomDto;

        const chatUserDto = chatUsersDtoArray.filter((chatUserDto) =>
          originalMembers.includes(chatUserDto.id),
        );

        return new ResponseFindChatRoomsDto(aggregateChatRoomDto, chatUserDto);
      },
    );

    return new ResponseFindChatRoomsPaginationDto(
      responseFindChatRoomsDto,
      responseFindChatRoomsDto.length,
      page,
      pageSize,
    );
  }

  async deleteChat(
    myId: number,
    roomId: mongoose.Types.ObjectId,
    chatId: mongoose.Types.ObjectId,
  ) {
    const existChatRoom = await this.findOneChatRoomOrFail(roomId);

    if (
      !existChatRoom.chats.length ||
      !existChatRoom.chats.some(
        (chat: ChatDto) =>
          chat._id === chatId && chat.senderId === myId && !chat.deletedAt,
      )
    ) {
      throw new NotFoundException('해당 채팅이 존재하지 않습니다.');
    }

    return this.chatRepository.findOneAndUpdateChatRoom(
      {
        _id: new mongoose.Types.ObjectId(roomId),
        'chats._id': new mongoose.Types.ObjectId(chatId),
      },
      { $set: { 'chats.$.deletedAt': new Date() } },
    );
  }
}
