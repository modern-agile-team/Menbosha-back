import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import * as mongoose from 'mongoose';
import { S3Service } from 'src/common/s3/s3.service';
import { Observable, Subject, catchError, map } from 'rxjs';
import { In } from 'typeorm';
import { UserService } from 'src/users/services/user.service';
import { ChatUserDto } from 'src/users/dtos/chat-user.dto';
import { ResponseGetChatRoomsDto } from '../dto/response-get-chat-rooms.dto';
import { ChatRoomsDto } from '../dto/chat-rooms.dto';
import { ResponsePostChatDto } from '../dto/response-post-chat-dto';
import { AggregateChatRoomsDto } from '../dto/aggregate-chat-rooms.dto';
import { ChatsDto } from '../dto/chats.dto';
import { ChatImagesDto } from '../dto/chat-images.dto';
import { ChatRoomType } from '../constants/chat-rooms-enum';
import { CreateChatRoomBodyDto } from '../dto/create-chat-room-body.dto';
import { plainToInstance } from 'class-transformer';
import { ChatRepository } from '../repositories/chat.repository';
import { ChatRoomPaginateResultDto } from '../dto/chat-paginate-result.dto';
import { AggregateChatRoomsForChatsDto } from '../dto/aggregate-chat-rooms-for-chats.dto';
// import { GetNotificationsResponseFromChatsDto } from '../dto/get-notifications-response-from-chats.dto';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private readonly subjectMap: Map<number, Subject<ChatsDto>> = new Map();
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
      this.subjectMap.set(myId, new Subject<ChatsDto>());
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
   * @param myId
   * @returns 1:1, 단톡 관련 없이 삭제된 채팅방 이외에 다 불러옴
   */
  findAllChatRooms(myId: number): Promise<ChatRoomsDto[]> {
    return this.chatRepository.findAllChatRooms(
      {
        $and: [
          { originalMembers: myId },
          { chatMembers: myId },
          { deletedAt: null },
        ],
      },
      { chats: 0 },
    );
  }

  /**
   *
   * @param roomId
   * @returns 채팅방을 1개 return. 없을 시에 에러 던짐.(roomId)
   */
  async findOneChatRoomOrFail(
    roomId: mongoose.Types.ObjectId,
  ): Promise<ChatRoomsDto> {
    const returnedRoom = await this.chatRepository.findOneChatRoom({
      _id: roomId,
      deletedAt: null,
    });

    if (!returnedRoom) {
      throw new NotFoundException('해당 채팅방이 없습니다.');
    }

    return new ChatRoomsDto(returnedRoom);
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
    guestId: number,
  ): Promise<ChatRoomsDto> {
    const returnedRoom = await this.chatRepository.findOneChatRoom({
      originalMembers: { $all: [myId, guestId] },
      chatMembers: { $all: [myId, guestId] },
      deletedAt: null,
      chatRoomType: ChatRoomType.OneOnOne,
    });

    if (!returnedRoom) {
      throw new NotFoundException('해당 채팅방이 없습니다.');
    }

    return new ChatRoomsDto(returnedRoom);
  }

  /**
   *
   * @param myId
   * @param guestId
   * @returns 채팅방 생성 로직. 해당 채팅방의 원본 멤버를 통해 채팅방의 유무를 검사함.
   * 만약에 둘다 현재 참가중인 1:1 채팅방이 있다면 conflict error를 던짐.
   * 둘 중에 하나만 있다면 없는 유저를 기존 채팅방으로 다시 초대.
   * 둘 다 없다면 새로운 채팅방 개설.
   * @todo 나중에 new option을 활용해서 push메서드를 사용하지 않는 방향으로 개선할 예정(아마)
   */
  async createChatRoom(
    myId: number,
    createChatRoomBodyDto: CreateChatRoomBodyDto,
  ): Promise<ChatRoomsDto> {
    const { receiverId, chatRoomType } = createChatRoomBodyDto;

    const existChatRoom = await this.chatRepository.findOneChatRoom({
      $and: [
        { originalMembers: { $all: [myId, receiverId] } },
        { deletedAt: null },
        { chatRoomType: chatRoomType },
      ],
    });

    if (!existChatRoom) {
      const returnedChatRoom = await this.chatRepository.createChatRoom({
        originalMembers: [myId, receiverId],
        chatMembers: [myId, receiverId],
        chatRoomType: chatRoomType,
      });

      return new ChatRoomsDto(returnedChatRoom);
    }

    const { chatMembers, _id } = existChatRoom;

    const pushUserId = chatMembers.includes(myId) ? receiverId : myId;

    if (chatMembers.length === 2) {
      throw new ConflictException('해당 유저들의 채팅방이 이미 존재합니다.');
    }

    await this.chatRepository.updateOneChatRoom(
      { _id: _id },
      {
        $push: { chatMembers: pushUserId },
      },
    ),
      chatMembers.push(pushUserId);

    return new ChatRoomsDto(existChatRoom);
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
  ): Promise<void> {
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

  /**
   *
   * @param myId
   * @param roomId
   * @returns chatRoom pagination(chats)
   */
  async findAllChats(
    myId: number,
    roomId: mongoose.Types.ObjectId,
    page: number,
  ): Promise<AggregateChatRoomsForChatsDto> {
    const pageSize = 20;
    const skip = (page - 1) * pageSize;

    await this.findOneChatRoomOrFail(roomId);

    await this.chatRepository.updateOneChatRoom(
      {
        _id: roomId,
      },
      { $push: { 'chats.$[elem].seenUsers': myId } },
      { arrayFilters: [{ 'elem.seenUsers': { $ne: myId } }] },
    );

    const returnedChatRoom: AggregateChatRoomsForChatsDto[] =
      await this.chatRepository.aggregateChatRooms([
        {
          $match: { _id: new mongoose.Types.ObjectId(roomId), deletedAt: null },
        },
        {
          $addFields: {
            totalCount: { $size: '$chats' },
            sortedChat: {
              $slice: [{ $reverseArray: '$chats' }, skip, pageSize],
            },
          },
        },
        {
          $project: {
            _id: 1,
            chatMembers: 1,
            totalCount: 1,
            chats: '$sortedChat',
            chatRoomType: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        },
      ]);

    const aggregateChatRoomsForChatsDto = new AggregateChatRoomsForChatsDto(
      returnedChatRoom[0],
      page,
      pageSize,
    );

    const { currentPage, lastPage } = aggregateChatRoomsForChatsDto;

    if (currentPage > lastPage) {
      throw new NotFoundException('Page not found');
    }

    return aggregateChatRoomsForChatsDto;
  }

  async createChat({ roomId, content, senderId }): Promise<ChatsDto> {
    const returnedChatRoom = await this.chatRepository.findOneChatRoom({
      _id: roomId,
      chatMembers: senderId,
      deletedAt: null,
    });

    if (!returnedChatRoom) {
      throw new ForbiddenException('해당 채팅방에 접근 권한이 없습니다');
    }

    const newChat: ChatsDto = {
      _id: new mongoose.Types.ObjectId(),
      chatRoomId: new mongoose.Types.ObjectId(roomId),
      senderId: senderId,
      content: content,
      seenUsers: [senderId],
      createdAt: new Date(),
    };

    const updatedChatRoom = await this.chatRepository.createChat(
      {
        _id: roomId,
      },
      {
        $push: { chats: newChat },
      },
      { new: true },
    );

    const { chats } = updatedChatRoom;

    const updatedChat = chats[chats.length - 1];

    const chatsDto = new ChatsDto(updatedChat);

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

    return new ChatImagesDto(returnedChatImage);
  }

  /**
   * @param myId
   * @returns 각 채팅방의 채팅 상대방 멤버들의 정보와 가장 최신 채팅 내용을 매핑한 객체들의 배열을 return
   */
  async findAllChatRoomsWithUserAndChat(
    myId: number,
  ): Promise<ResponseGetChatRoomsDto[]> {
    const returnedChatRoomsAggregate =
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
                  // as를 통해 정의된 chat이라는 별칭을 참조하기 위해 $$를 붙임.
                },
              },
            },
          },
        },
        {
          $set: {
            latestChat: {
              $arrayElemAt: [
                // 출력되는 값은 1개기 때문에 배열 형태에서 빼내기 위해서 arrayElemAt을 통해 0번 인덱스를 지정
                // 혹은 addFields를 이용해도 되는데 코드가 너무 길어질 것 같음.
                {
                  $filter: {
                    input: '$chats',
                    cond: {
                      $eq: ['$$this.createdAt', { $max: '$chats.createdAt' }],
                      // as를 통해 정의하지 않아도 this로 접근 가능.
                      // 혹은 reserveArray를 사용해서 가져와도 될듯.
                    },
                  },
                },
                0,
              ],
            },
          },
        },
        {
          $project: {
            _id: 1,
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
        id: In(userIds),
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

    return aggregateChatRoomsDto.map((aggregateChatRoomDto) => {
      const { chatMembers } = aggregateChatRoomDto;
      const chatUserDto = [];

      chatMembers.forEach((chatMemberId) => {
        const matchingUser = chatUsersDtoArray.find((user) => {
          return user.id === chatMemberId;
        });

        if (matchingUser) {
          chatUserDto.push(matchingUser);
        }
      });

      return new ResponseGetChatRoomsDto(aggregateChatRoomDto, chatUserDto);
    });
  }

  // async getUnreadCounts(roomId: mongoose.Types.ObjectId, after: number) {
  //   const returnedRoom = await this.chatRoomsModel.findOne({ _id: roomId });
  //   if (!returnedRoom) {
  //     throw new NotFoundException('해당 채팅 룸을 찾지 못했습니다.');
  //   }
  //   return this.chatRepository.getUnreadCounts(roomId, after);
  // }
}
