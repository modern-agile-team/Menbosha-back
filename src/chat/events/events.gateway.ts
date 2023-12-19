import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from 'src/chat/services/chat.service';
import { PostChatDto } from '../dto/post-chat.dto';
import { AsyncApiSub } from 'nestjs-asyncapi';
import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { LoginChatRoomsDto } from '../dto/login-chat-rooms.dto';
import { WebSocketExceptionFilter } from '../exceptions/websocket-exception.filter';
import mongoose from 'mongoose';
@WebSocketGateway({ namespace: /\/ch-.+/, cors: true })
@UsePipes(ValidationPipe)
@UseFilters(new WebSocketExceptionFilter())
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
  handleLogin(
    @MessageBody() loginChatRoomDto: LoginChatRoomsDto,
    @ConnectedSocket() socket: Socket,
  ) {
    console.log('login', loginChatRoomDto.userId);
    loginChatRoomDto.rooms.forEach((room) => {
      const isObjectId = mongoose.isObjectIdOrHexString(room);

      if (!isObjectId) {
        throw new WsException('오브젝트 id 형식이 아닙니다');
      }

      console.log('join', socket.nsp.name, room);
      socket.join(room.toString());
    });
  }

  @AsyncApiSub({
    description: `
    imageUrl 혹은 content로 이미지 전송인지, 스트링 챗인지 판별
    채팅 전송
    리턴 값
    {
      content: 채팅내용,
      sender: 보낸 사람 id,
      receiver: 받는 사람 id,
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
    if (postChatDto.hasOwnProperty('content')) {
      const returnedChat = await this.chatService.createChat(postChatDto);
      const data = returnedChat;
      socket.to(postChatDto.roomId.toString()).emit('message', { data });
    } else {
      const returnedChat = await this.chatService.findOneChatImage(postChatDto);
      const data = returnedChat;
      socket.to(postChatDto.roomId.toString()).emit('message', { data });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  afterInit(server: Server): any {
    console.log('websocketserver init');
  }

  handleConnection(@ConnectedSocket() socket: Socket): any {
    console.log('connected', socket.nsp.name);
    socket.emit('hello', socket.nsp.name);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket): any {
    console.log('disconnected', socket.nsp.name);
  }
}
