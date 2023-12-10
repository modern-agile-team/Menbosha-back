import { ChatRepository } from '../repositories/chat.repository';
import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ChatRoom } from '../schemas/chat-room.schemas';
import * as mongoose from 'mongoose';
import { S3Service } from 'src/common/s3/s3.service';
import { Subject, catchError, map } from 'rxjs';
import { Chat } from '../schemas/chat.schemas';
import { User } from 'src/users/entities/user.entity';
import { EntityManager } from 'typeorm';
import { GetNotificationsResponseFromChatDto } from '../dto/get-notifications-response-from-chat.dto';
import { UserService } from 'src/users/services/user.service';
import { ChatUserDto } from 'src/users/dtos/chat-user.dto';
import { ResponseGetChatRoomsDto } from '../dto/response-get-chat-rooms.dto';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private readonly subject = new Subject();
  constructor(
    private readonly s3Service: S3Service,
    private readonly userService: UserService,
    private readonly chatRepository: ChatRepository,
    private readonly entityManager: EntityManager,
    @InjectModel(ChatRoom.name)
    private readonly chatRoomModel: mongoose.Model<ChatRoom>,
    @InjectModel(Chat.name)
    private readonly chatModel: mongoose.Model<Chat>,
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
  getChatRooms(myId: number) {
    return this.chatRepository.getChatRooms(myId);
  }

  async getOneChatRoom(myId: number, roomId: mongoose.Types.ObjectId) {
    const returnedRoom = await this.chatRepository.getOneChatRoom(myId, roomId);

    if (!returnedRoom) {
      throw new NotFoundException('해당 유저가 속한 채팅방이 없습니다.');
    }

    return returnedRoom;
  }

  async createChatRoom(myId: number, guestId: number) {
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

      return await this.chatRepository.createChatRoom(myId, guestId);
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

  async deleteChatRoom(myId: number, roomId: mongoose.Types.ObjectId) {
    const chatRoom = await this.chatRoomModel.findOne({
      $and: [{ _id: roomId }, { deleted_at: null }],
    });

    if (!chatRoom) {
      throw new NotFoundException('해당 채팅룸이 없습니다.');
    }

    const isUser = await this.chatRoomModel.find({
      $and: [
        { $or: [{ host_id: myId }, { guest_id: myId }] },
        { _id: chatRoom.id },
      ],
    });

    if (!isUser.length) {
      throw new NotFoundException('해당 유저는 채팅방에 속해있지 않습니다.');
    }

    return this.chatRepository.deleteChatRoom(roomId);
  }

  async getChats(userId: number, roomId: mongoose.Types.ObjectId) {
    await this.getOneChatRoom(userId, roomId);
    const returnedChat = await this.chatRepository.getChats(roomId);

    if (returnedChat.length) {
      this.chatRepository.updateChatIsSeen(userId, roomId);
      return returnedChat;
    }

    return returnedChat;
  }

  async createChat({ roomId, content, senderId, receiverId }) {
    await this.getOneChatRoom(senderId, roomId);

    const isChatRoom = await this.chatRoomModel.findOne({
      $or: [
        {
          $and: [{ host_id: senderId }, { guest_id: receiverId }],
        },
        {
          $and: [{ host_id: receiverId }, { guest_id: senderId }],
        },
      ],
    });

    if (!isChatRoom) {
      throw new NotFoundException('채팅을 전송할 유저가 채팅방에 없습니다');
    }

    const returnedChat = await this.chatRepository.createChat(
      roomId,
      content,
      senderId,
      receiverId,
    );

    const chat = {
      content: returnedChat.content,
      sender: returnedChat.sender,
      receiver: returnedChat.receiver,
    };

    if (returnedChat) this.subject.next(returnedChat);

    return chat;
  }

  async createChatImage(
    roomId: mongoose.Types.ObjectId,
    myId: number,
    receiverId: number,
    file: Express.Multer.File,
  ) {
    await this.getOneChatRoom(myId, roomId);

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
    const isUser = await this.entityManager.findOne(User, {
      where: { id: userId },
    });

    if (!isUser) {
      throw new NotFoundException('해당 유저를 찾지 못했습니다.');
    }

    const returnedNotifications =
      await this.chatRepository.getChatNotifications(userId);

    const groupedNotifications = {};

    returnedNotifications.forEach((notification) => {
      const chatroomId = notification.chatroom_id.toString();
      if (!groupedNotifications[chatroomId]) {
        const newNotification = {
          ...notification.toObject(),
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
    const returnedChatRooms = await this.chatRepository.getChatRooms(myId);

    if (!returnedChatRooms.length) {
      return null;
    }

    return Promise.all(
      returnedChatRooms.map(async (chatRooms) => {
        const targetUser =
          chatRooms.host_id === myId
            ? await this.userService.getMyInfo(chatRooms.guest_id)
            : await this.userService.getMyInfo(chatRooms.host_id);

        const returnedChat = (await this.chatRepository.getOneChat(
          chatRooms._id.toString(),
        )) || { chatroom_id: chatRooms._id, content: null };

        const chatUserDto = new ChatUserDto(targetUser);
        return new ResponseGetChatRoomsDto(returnedChat, chatUserDto, myId);
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
