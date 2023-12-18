import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Sse,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ChatService } from '../services/chat.service';
import { ApiTags } from '@nestjs/swagger';
import { ReceivedUserDto } from '../dto/received-user.dto';
import mongoose from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParseObjectIdPipe } from '../validation-pipe/parse-object-id.pipe';
import { ApiCreateChatRoom } from '../swagger-decorators/create-chat-room.decorator';
import { ApiGetChatRooms } from '../swagger-decorators/get-chat-rooms.decorator';
import { ApiGetOneChatRoom } from '../swagger-decorators/get-one-chat-room.decorator';
import { ApiDeleteChatRoom } from '../swagger-decorators/delete-chat-room.decorator';
import { ApiGetChats } from '../swagger-decorators/get-chats.decorator';
import { ApiGetChatNotificationSse } from '../swagger-decorators/get-chat-notification-sse.decorator';
// import { ApiGetChatUnreadCounts } from '../swagger-decorators/get-chat-unread-counts.decorator';
import { GetUserId } from 'src/common/decorators/get-userId.decorator';
import { JwtAccessTokenGuard } from 'src/config/guards/jwt-access-token.guard';
// import { GetNotificationsResponseFromChatsDto } from '../dto/get-notifications-response-from-chats.dto';
// import { ApiGetChatNotifications } from '../swagger-decorators/get-chat-notifications.decorator';
import { ApiCreateChatImage } from '../swagger-decorators/create-chat-image.decorators';
import { SuccessResponseInterceptor } from 'src/common/interceptors/success-response.interceptor';
import { ChatRoomsDto } from '../dto/chat-rooms.dto';
import { ResponseGetChatRoomsDto } from '../dto/response-get-chat-rooms.dto';
import { plainToInstance } from 'class-transformer';
import { ApiGetChatRoomsNew } from '../swagger-decorators/get-chat-rooms-new.decorator';
import { Observable } from 'rxjs';
import { ChatsDto } from '../dto/chats.dto';

@ApiTags('CHAT')
@UsePipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
)
@UseInterceptors(SuccessResponseInterceptor, ClassSerializerInterceptor)
@Controller('chat-room')
export class ChatController {
  constructor(private chatService: ChatService) {}

  /**
   *
   * @param userId
   * @returns
   */
  @ApiGetChatNotificationSse()
  @UseGuards(JwtAccessTokenGuard)
  @Sse('listener')
  notificationListener(@GetUserId() userId: number): Observable<string> {
    return this.chatService.notificationListener(userId);
  }

  /**
   *
   * @param userId
   * @returns
   */
  @UseGuards(JwtAccessTokenGuard)
  @ApiGetChatRooms()
  @Get()
  async findAllChatRooms(@GetUserId() userId: number): Promise<ChatRoomsDto[]> {
    const returnedChatRooms = await this.chatService.findAllChatRooms(userId);

    return plainToInstance(ChatRoomsDto, returnedChatRooms, {
      excludeExtraneousValues: true,
    });
  }

  /**
   *
   * @param userId
   * @returns
   */
  @UseGuards(JwtAccessTokenGuard)
  @ApiGetChatRoomsNew()
  @Get('new-api')
  findAllChatRoomsWithUserAndChat(
    @GetUserId() userId: number,
  ): Promise<ResponseGetChatRoomsDto[]> {
    return this.chatService.findAllChatRoomsWithUserAndChat(userId);
  }

  /**
   *
   * @param roomId
   * @returns
   */
  @ApiGetOneChatRoom()
  @Get(':roomId')
  findOneChatRoomOrFail(
    @Param('roomId', ParseObjectIdPipe) roomId: mongoose.Types.ObjectId,
  ): Promise<ChatRoomsDto> {
    return this.chatService.findOneChatRoomOrFail(roomId);
  }

  /**
   *
   * @param userId
   * @param receivedUserDto
   * @returns
   */
  @UseGuards(JwtAccessTokenGuard)
  @ApiCreateChatRoom()
  @Post()
  createChatRoom(
    @GetUserId() userId: number,
    @Body('receivedUserDto') receivedUserDto: ReceivedUserDto,
  ): Promise<ChatRoomsDto> {
    return this.chatService.createChatRoom(userId, receivedUserDto.receiverId);
  }

  /**
   *
   * @param userId
   * @param roomId
   * @returns
   */
  @UseGuards(JwtAccessTokenGuard)
  @ApiDeleteChatRoom()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':roomId')
  deleteChatRoom(
    @GetUserId() userId: number,
    @Param('roomId', ParseObjectIdPipe) roomId: mongoose.Types.ObjectId,
  ) {
    return this.chatService.deleteChatRoom(userId, roomId);
  }

  @UseGuards(JwtAccessTokenGuard)
  @ApiGetChats()
  @Get(':roomId/chat')
  async findChats(
    @GetUserId() userId: number,
    @Param('roomId', ParseObjectIdPipe) roomId: mongoose.Types.ObjectId,
  ): Promise<ChatsDto[]> {
    const returnedChats = await this.chatService.findAllChats(userId, roomId);

    return plainToInstance(ChatsDto, returnedChats, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(JwtAccessTokenGuard)
  @ApiCreateChatImage()
  @Post(':roomId/chat/image')
  @UseInterceptors(FileInterceptor('file'))
  createChatImage(
    @Param('roomId', ParseObjectIdPipe) roomId: mongoose.Types.ObjectId,
    @GetUserId() senderId: number,
    @Body() body: ReceivedUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.chatService.createChatImage(
      roomId,
      senderId,
      body.receiverId,
      file,
    );
  }

  // @UseGuards(JwtAccessTokenGuard)
  // @ApiGetChatNotifications()
  // @Get('chat/notice')
  // async getChatNotifications(@GetUserId() userId: number) {
  //   const returnedChatNotifications =
  //     await this.chatService.getChatNotifications(userId);
  //   return plainToInstance(
  //     GetNotificationsResponseFromChatsDto,
  //     returnedChatNotifications,
  //     { excludeExtraneousValues: true },
  //   );
  // }

  // @ApiGetChatUnreadCounts()
  // @Get(':roomId/chat/unreads')
  //  getUnreadCounts(
  //   @Param('roomId', ParseObjectIdPipe) roomId: mongoose.Types.ObjectId,
  //   @Query('after', ParseIntPipe) after: number,
  // ) {
  //   return this.chatService.getUnreadCounts(roomId, after);
  // }
}
