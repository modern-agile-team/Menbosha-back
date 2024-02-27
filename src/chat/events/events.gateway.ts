import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from '@src/chat/services/chat.service';

import { AsyncApiSub } from 'nestjs-asyncapi';
import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import mongoose from 'mongoose';
import { LoginChatRoomsDto } from '@src/chat/dto/login-chat-rooms.dto';
import { PostChatDto } from '@src/chat/dto/post-chat.dto';
import { WebSocketExceptionFilter } from '@src/chat/exceptions/filters/websocket-exception.filter';
import { SocketException } from '@src/chat/exceptions/socket.exception';

@WebSocketGateway({ cors: true })
@UseFilters(WebSocketExceptionFilter)
@UsePipes(ValidationPipe)
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly chatService: ChatService) {}
  @WebSocketServer() private readonly server: Server;

  @AsyncApiSub({
    description: `
    socket.join
    유저가 속한 chat_room의 id를 토대로
    소켓 룸으로 join`,
    channel: 'login',
    message: {
      payload: LoginChatRoomsDto,
    },
  })
  @SubscribeMessage('login')
  async handleLogin(
    @MessageBody() loginChatRoomDto: LoginChatRoomsDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const { chatRoomIds } = loginChatRoomDto;
    console.log('login', loginChatRoomDto.userId);

    for (const chatRoomId of chatRoomIds) {
      const isObjectId = mongoose.isObjectIdOrHexString(chatRoomId);

      if (!isObjectId) {
        throw new SocketException(
          'BadRequest',
          `${chatRoomId} 오브젝트 id 형식이 아닙니다`,
        );
      }

      const chatRoom = await this.chatService.findOneChatRoom({
        _id: chatRoomId,
        deletedAt: null,
      });

      if (!chatRoom) {
        throw new SocketException(
          'NotFound',
          '해당 채팅방이 존재하지 않습니다.',
        );
      }

      const stringChatRoomId = String(chatRoom._id);

      await socket.join(stringChatRoomId);
      console.log('join', socket.nsp.name, stringChatRoomId);

      socket.emit('join', {
        namespace: socket.nsp.name,
        roomId: stringChatRoomId,
        message: '조인 됐습니다',
      });
    }
  }

  @AsyncApiSub({
    description: `
    채팅 전송
    리턴 값
    {
      data: {
        _id: "string",
        chatRoomId: "string"
        content: 채팅내용,
        sender: 보낸 사람 id,
        seenUsers: [userId],
        createdAt: "Date",
      }
    };
    `,
    channel: 'message',
    message: {
      payload: PostChatDto,
    },
  })
  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() postChatDto: PostChatDto,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @ConnectedSocket() _socket: Socket,
  ) {
    const returnedChat = await this.chatService.createChat(postChatDto);
    this.server.to(postChatDto.roomId.toString()).emit('message', returnedChat);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  afterInit(_server: Server): any {
    console.log('websocket server init');
  }

  handleConnection(@ConnectedSocket() socket: Socket): any {
    console.log('connected', socket.nsp.name);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket): any {
    console.log('disconnected', socket.nsp.name);
  }
}
