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
import { config } from 'dotenv';

config({ path: '.env.production' });
config({ path: '.env.development', override: true });
config({ path: '.env.local', override: true });

/**
 * 마지막 배포 단계가 되면 production 환경은 로컬에서의 요청은 아예 허용하지 않음. 오직 프론트의 https 적용된 프론트 도메인만 허용.
 * 추후 development 환경의 서버를 새로 개설해야 함.
 * staging server 까지 따로 열 계획은 없기 때문에 환경 자체는 최대한 운영 서버 환경과 거의 100% 비슷할 정도로 환경을 맞춰야 함.
 * development 환경의 허용 도메인은 development 환경의 프론트 서버 도메인 및 로컬에서의 요청 허용
 * 추후 프론트의 admin 전용 서버가 열리면 production 환경에서 프론트의 admin 서버 도메인도 허용(아마 development 환경에서도)
 */
@WebSocketGateway({
  cors: {
    origin:
      process.env.NODE_ENV === 'production'
        ? [
            process.env.FRONT_PRODUCTION_DOMAIN,
            process.env.FRONT_PRODUCTION_WWW_DOMAIN,
            process.env.FRONT_LOCAL_DOMAIN,
          ]
        : process.env.NODE_ENV === 'development'
          ? [
              process.env.FRONT_DEVELOPMENT_DOMAIN,
              process.env.FRONT_LOCAL_DOMAIN,
            ]
          : true,
  },
})
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
