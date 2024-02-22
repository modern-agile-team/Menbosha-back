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
import { ChatService } from 'src/chat/services/chat.service';
import { PostChatDto } from '../dto/post-chat.dto';
import { AsyncApiSub } from 'nestjs-asyncapi';
import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { LoginChatRoomsDto } from '../dto/login-chat-rooms.dto';
import { WebSocketExceptionFilter } from '../exceptions/filters/websocket-exception.filter';
import mongoose from 'mongoose';
import { SocketException } from '../exceptions/socket.exception';

@WebSocketGateway({ namespace: 'chat', cors: true })
@UseFilters(WebSocketExceptionFilter)
@UsePipes(ValidationPipe)
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private chatService: ChatService) {}
  @WebSocketServer() public server: Server;

  @SubscribeMessage('test')
  handleTest(@MessageBody() data: string) {
    console.log('test', data);
  }

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
          '해당 채팅방은 존재하지 않습니다.',
        );
      }

      const stringChatRoomId = String(chatRoom._id);

      await socket.join(stringChatRoomId);
      console.log('join', socket.nsp.name, stringChatRoomId);

      socket
        .to(stringChatRoomId)
        .emit('join', `join ${socket.nsp.name} ${stringChatRoomId}`);
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
    @ConnectedSocket() socket: Socket,
  ) {
    const returnedChat = await this.chatService.createChat(postChatDto);
    socket.to(postChatDto.roomId.toString()).emit('message', returnedChat);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  afterInit(server: Server): any {
    console.log('websocketserver init');
  }

  handleConnection(@ConnectedSocket() socket: Socket): any {
    console.log('connected', socket.nsp.name);
    socket.emit('hello', socket.nsp.name);
    socket.on('connection-error', (err) => {
      console.log(err.message);
      console.log(err.description);
      console.log(err.context);
    });
    this.server.engine.on('connection-error', (err) => {
      console.log(err.message);
      console.log(err.description);
      console.log(err.context);
    });
  }

  handleDisconnect(@ConnectedSocket() socket: Socket): any {
    console.log('disconnected', socket.nsp.name);
  }
}
