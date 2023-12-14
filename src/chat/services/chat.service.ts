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
import { InjectModel } from '@nestjs/mongoose';
import { ChatRooms } from '../schemas/chat-room.schemas';
import * as mongoose from 'mongoose';
import { S3Service } from 'src/common/s3/s3.service';
import { Subject, catchError, map } from 'rxjs';
import { Chats } from '../schemas/chat.schemas';
import { EntityManager } from 'typeorm';
import { GetNotificationsResponseFromChatDto } from '../dto/get-notifications-response-from-chat.dto';
import { UserService } from 'src/users/services/user.service';
import { ChatUserDto } from 'src/users/dtos/chat-user.dto';
import { ResponseGetChatRoomsDto } from '../dto/response-get-chat-rooms.dto';
import { ChatRoomsDto } from '../dto/chat-rooms.dto';
import { ResponsePostChatDto } from '../dto/response-post-chat-dto';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private readonly subject = new Subject();
  constructor(
    private readonly s3Service: S3Service,
    private readonly userService: UserService,
    private readonly chatRepository: ChatRepository,
    private readonly entityManager: EntityManager,
    @InjectModel(ChatRooms.name)
    private readonly chatRoomModel: mongoose.Model<ChatRooms>,
    @InjectModel(Chats.name)
    private readonly chatModel: mongoose.Model<Chats>,
  ) {}

  notificationListener() {
    return this.subject.asObservable().pipe(
      map((notification: Notification) => JSON.stringify(notification)),
      catchError((err) => {
        this.logger.error('notificationListener : ' + err.message);
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }),
    );
  }
  getChatRooms(myId: number): Promise<ChatRoomsDto[]> {
    return this.chatRepository.getChatRooms(myId);
  }

  async getOneChatRoom(roomId: mongoose.Types.ObjectId): Promise<ChatRoomsDto> {
    const returnedRoom = await this.chatRepository.getOneChatRoom(roomId);

    if (!returnedRoom) {
      throw new NotFoundException('해당 채팅방이 없습니다.');
    }

    return new ChatRoomsDto(returnedRoom);
  }

  async createChatRoom(myId: number, guestId: number): Promise<ChatRoomsDto> {
    try {
      const isChatRoom = await this.chatRoomModel.findOne({
        $or: [
          { $and: [{ host_id: myId }, { guest_id: guestId }] },
          { $and: [{ host_id: guestId }, { guest_id: myId }] },
        ],
      });

      if (isChatRoom) {
        throw new ConflictException('해당 유저들의 채팅방이 이미 존재합니다.');
      }

      const returnedChatRoom = await this.chatRepository.createChatRoom(
        myId,
        guestId,
      );

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

  async deleteChatRoom(
    myId: number,
    roomId: mongoose.Types.ObjectId,
  ): Promise<void> {
    const existChatRoom = await this.getOneChatRoom(roomId);

    if (!(existChatRoom.hostId === myId || existChatRoom.guestId === myId)) {
      throw new ForbiddenException('해당 채팅방에 접근 권한이 없습니다');
    }

    return this.chatRepository.deleteChatRoom(roomId);
  }

  async getChats(userId: number, roomId: mongoose.Types.ObjectId) {
    await this.getOneChatRoom(roomId);
    const returnedChat = await this.chatRepository.getChats(roomId);

    if (returnedChat.length) {
      this.chatRepository.updateChatIsSeen(userId, roomId);
      return returnedChat;
    }

    return returnedChat;
  }

  async createChat({
    roomId,
    content,
    senderId,
    receiverId,
  }): Promise<ResponsePostChatDto> {
    const returnedChatRoom = await this.getOneChatRoom(roomId);

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

    const returnedChat = await this.chatRepository.createChat(
      roomId,
      content,
      senderId,
      receiverId,
    );

    if (returnedChat) this.subject.next(returnedChat);

    return new ResponsePostChatDto(returnedChat);
  }

  async createChatImage(
    roomId: mongoose.Types.ObjectId,
    myId: number,
    receiverId: number,
    file: Express.Multer.File,
  ) {
    await this.getOneChatRoom(roomId);

    const isChatRoom = await this.chatRoomModel.findOne({
      $or: [
        {
          $and: [{ host_id: myId }, { guest_id: receiverId }],
        },
        {
          $and: [{ host_id: receiverId }, { guest_id: myId }],
        },
      ],
    });

    if (!isChatRoom) {
      throw new NotFoundException('채팅을 전송할 유저가 채팅방에 없습니다');
    }

    const imageUrl = await this.s3Service.uploadImage(file, myId, 'ChatImages');

    return this.chatRepository.createChatImage(
      roomId,
      myId,
      receiverId,
      imageUrl.url,
    );
  }

  async findChatImage({ roomId, imageUrl, senderId, receiverId }) {
    const isChatAndUsers = await this.chatModel.findOne({
      $and: [
        { chatroom_id: roomId },
        { sender: senderId },
        { receiver: receiverId },
        { content: imageUrl },
      ],
    });
    console.log(isChatAndUsers);
    if (!isChatAndUsers) {
      throw new NotFoundException('해당 채팅을 찾지 못했습니다.');
    }

    return isChatAndUsers;
  }

  async getChatNotifications(
    userId: number,
  ): Promise<GetNotificationsResponseFromChatDto[]> {
    const returnedNotifications =
      await this.chatRepository.getChatNotifications(userId);

    const groupedNotifications = {};

    returnedNotifications.forEach((notification) => {
      const chatroomId = notification.chatroom_id.toString();
      if (!groupedNotifications[chatroomId]) {
        const newNotification = {
          ...notification,
          count: 1,
          content: notification.content.substring(0, 10),
        };
        groupedNotifications[chatroomId] = newNotification;
      } else {
        groupedNotifications[chatroomId]['count'] += 1;
      }
    });

    return Object.values(groupedNotifications);
  }

  async getChatRoomsWithUserAndChat(
    myId: number,
  ): Promise<ResponseGetChatRoomsDto[]> {
    const returnedChatAggregate = await this.chatRoomModel.aggregate([
      {
        $match: { $or: [{ host_id: myId }, { guest_id: myId }] },
      },
      {
        $lookup: {
          from: 'Chat',
          localField: 'chat_ids',
          foreignField: '_id',
          as: 'chats',
        },
      },
      { $sort: { 'chats.createdAt': -1 } },
      {
        $project: {
          _id: 1,
          host_id: 1,
          guest_id: 1,
          createdAt: 1,
          chat: {
            content: { $arrayElemAt: ['$chats.content', 0] },
            isSeen: { $arrayElemAt: ['$chats.isSeen', 0] },
            createdAt: { $arrayElemAt: ['$chats.createdAt', 0] },
          },
        },
      },
    ]);

    if (!returnedChatAggregate) {
      return null;
    }

    return Promise.all(
      returnedChatAggregate.map(async (chatRooms) => {
        const targetUser =
          chatRooms.host_id === myId
            ? await this.userService.getMyInfo(chatRooms.guest_id)
            : await this.userService.getMyInfo(chatRooms.host_id);

        const chatUserDto = new ChatUserDto(targetUser);

        return new ResponseGetChatRoomsDto(chatRooms, chatUserDto);
      }),
    );
  }

  // async getUnreadCounts(roomId: mongoose.Types.ObjectId, after: number) {
  //   const returnedRoom = await this.chatRoomModel.findOne({ _id: roomId });
  //   if (!returnedRoom) {
  //     throw new NotFoundException('해당 채팅 룸을 찾지 못했습니다.');
  //   }
  //   return this.chatRepository.getUnreadCounts(roomId, after);
  // }
}
