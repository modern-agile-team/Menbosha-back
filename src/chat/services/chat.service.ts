import { ChatRepository } from '../repositories/chat.repository';
import {
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

  notificationListener(myId: number): Observable<string> {
    if (!this.subjectMap.get(myId)) {
      this.subjectMap.set(myId, new Subject<ChatsDto>());
    }

    const subject = this.subjectMap.get(myId);

    return subject.asObservable().pipe(
      map((notification: ChatsDto) => JSON.stringify(notification)),
      catchError((err) => {
        this.logger.error('notificationListener : ' + err.message);
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }),
    );
  }

  findAllChatRooms(myId: number): Promise<ChatRoomsDto[]> {
    return this.chatRepository.findAllChatRooms({
      $and: [{ $or: [{ hostId: myId }, { guestId: myId }] }],
    });
  }

  /**
   *
   * @param roomId
   * @returns
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

  async createChatRoom(myId: number, guestId: number): Promise<ChatRoomsDto> {
    try {
      const isChatRoom = await this.chatRepository.findOneChatRoom({
        $or: [
          {
            $and: [{ hostId: myId }, { guestId: guestId }, { deletedAt: null }],
          },
          {
            $and: [{ hostId: guestId }, { guestId: myId }, { deletedAt: null }],
          },
        ],
      });

      if (isChatRoom) {
        throw new ConflictException('해당 유저들의 채팅방이 이미 존재합니다.');
      }

      const returnedChatRoom = await this.chatRepository.createChatRoom({
        hostId: myId,
        guestId: guestId,
      });

      return new ChatRoomsDto(returnedChatRoom);
    } catch (error) {
      console.error('채팅룸 생성 실패: ', error);

      if (error.code === 11000) {
        throw new ConflictException(
          '채팅룸 생성 실패. 서버에서 에러가 발생했습니다.',
        );
      }

      throw error;
    }
  }

  /**
   *
   * @param myId
   * @param roomId
   * @returns
   */
  async deleteChatRoom(
    myId: number,
    roomId: mongoose.Types.ObjectId,
  ): Promise<void> {
    const existChatRoom = await this.findOneChatRoomOrFail(roomId);

    if (!(existChatRoom.hostId === myId || existChatRoom.guestId === myId)) {
      throw new ForbiddenException('해당 채팅방에 접근 권한이 없습니다');
    }

    return this.chatRepository.updateOneChatRoom(
      { _id: roomId },
      {
        deletedAt: new Date(),
      },
    );
  }

  async findAllChats(
    userId: number,
    roomId: mongoose.Types.ObjectId,
  ): Promise<ChatsDto[]> {
    await this.findOneChatRoomOrFail(roomId);

    await this.chatRepository.updateManyChats(
      {
        $and: [{ receiver: userId }, { chatRoomId: roomId }, { isSeen: false }],
      },
      { $set: { isSeen: true } },
    );

    return this.chatRepository.findAllChats({
      chatRoomId: new mongoose.Types.ObjectId(roomId),
    });
  }

  async createChat({
    roomId,
    content,
    senderId,
    receiverId,
  }): Promise<ResponsePostChatDto> {
    const returnedChatRoom = await this.findOneChatRoomOrFail(roomId);

    if (
      !(
        (returnedChatRoom.hostId === senderId ||
          returnedChatRoom.hostId === receiverId) &&
        (returnedChatRoom.guestId === senderId ||
          returnedChatRoom.guestId === receiverId)
      )
    ) {
      throw new ForbiddenException('해당 채팅방에 접근 권한이 없습니다');
    }

    const returnedChat = await this.chatRepository.createChat({
      chatRoomId: returnedChatRoom._id,
      content: content,
      sender: senderId,
      receiver: receiverId,
    });

    await this.chatRepository.updateOneChatRoom(
      { _id: returnedChat.chatRoomId },
      {
        $push: { chatIds: returnedChat._id },
      },
    );

    const chatsDto = new ChatsDto(returnedChat);

    if (chatsDto) {
      const subject = this.subjectMap.get(receiverId);
      if (subject) {
        subject.next(chatsDto);
      }
    }

    return chatsDto;
  }

  async createChatImage(
    roomId: mongoose.Types.ObjectId,
    senderId: number,
    receiverId: number,
    file: Express.Multer.File,
  ): Promise<ChatsDto> {
    const existChatRoom = await this.findOneChatRoomOrFail(roomId);

    if (
      !(
        (existChatRoom.hostId === senderId ||
          existChatRoom.hostId === receiverId) &&
        (existChatRoom.guestId === senderId ||
          existChatRoom.guestId === receiverId)
      )
    ) {
      throw new ForbiddenException('해당 채팅방에 접근 권한이 없습니다');
    }

    const imageUrl = await this.s3Service.uploadImage(
      file,
      senderId,
      'ChatImages',
    );

    const returnedChat = await this.chatRepository.createChat({
      chatRoomId: existChatRoom._id,
      sender: senderId,
      receiver: receiverId,
      content: imageUrl,
    });

    await this.chatRepository.updateOneChatRoom(
      { _id: returnedChat.chatRoomId },
      {
        $push: { chatIds: returnedChat._id },
      },
    );

    const chatsDto = new ChatsDto(returnedChat);

    if (chatsDto) {
      const subject = this.subjectMap.get(receiverId);
      if (subject) {
        subject.next(chatsDto);
      }
    }

    return chatsDto;
  }

  async findOneChatImage({
    roomId,
    imageUrl,
    senderId,
    receiverId,
  }): Promise<ChatsDto> {
    const existChat = await this.chatRepository.findOneChat({
      $and: [
        { chatRoomId: roomId },
        { sender: senderId },
        { receiver: receiverId },
        { content: imageUrl },
      ],
    });

    if (!existChat) {
      throw new NotFoundException('해당 채팅을 찾지 못했습니다.');
    }

    return new ChatsDto(existChat);
  }

  async findAllChatRoomsWithUserAndChat(
    myId: number,
  ): Promise<ResponseGetChatRoomsDto[]> {
    const returnedChatRoomsAggregate =
      await this.chatRepository.aggregateChatRooms([
        {
          $match: { $or: [{ hostId: myId }, { guestId: myId }] },
        },
        {
          $lookup: {
            from: 'chats',
            localField: 'chatIds',
            foreignField: '_id',
            as: 'chats',
          },
        },
        {
          $addFields: {
            chatCount: {
              $size: '$chats',
            },
          },
        },
        { $sort: { 'chats.createdAt': -1 } },
        {
          $project: {
            _id: 1,
            hostId: 1,
            guestId: 1,
            createdAt: 1,
            chatCount: 1,
            chat: {
              content: { $arrayElemAt: ['$chats.content', 0] },
              isSeen: { $arrayElemAt: ['$chats.isSeen', 0] },
              createdAt: { $arrayElemAt: ['$chats.createdAt', 0] },
            },
          },
        },
      ]);

    if (!returnedChatRoomsAggregate) {
      return null;
    }

    const userIds = returnedChatRoomsAggregate.map((userId) => {
      return userId.hostId === myId ? userId.guestId : userId.hostId;
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
      const chatUsersDto = chatUsersDtoArray.find((user) => {
        return (
          user.id === aggregateChatRoomDto.hostId ||
          user.id === aggregateChatRoomDto.guestId
        );
      });

      return new ResponseGetChatRoomsDto(aggregateChatRoomDto, chatUsersDto);
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
