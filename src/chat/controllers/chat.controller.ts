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
import { ApiGetChatNotificationSse } from '../swagger-decorators/get-chat-notification-Sse.decorator';
// import { ApiGetChatUnreadCounts } from '../swagger-decorators/get-chat-unread-counts.decorator';
import { GetUserId } from 'src/common/decorators/get-userId.decorator';
import { JwtAccessTokenGuard } from 'src/config/guards/jwt-access-token.guard';
import { GetNotificationsResponseFromChatDto } from '../dto/get-notifications-response-from-chat.dto';
import { ApiGetChatNotifications } from '../swagger-decorators/get-chat-notifications.decorator';
import { ApiCreateChatImage } from '../swagger-decorators/create-chat-image.decorators';
import { SuccessResponseInterceptor } from 'src/common/interceptors/success-response.interceptor';
import { ChatRoomDto } from '../dto/chat-room.dto';
import { ResponseGetChatRoomsDto } from '../dto/response-get-chat-rooms.dto';
import { plainToInstance } from 'class-transformer';
import { ApiGetChatRoomsNew } from '../swagger-decorators/get-chat-rooms-new.decorator';

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

  @ApiGetChatNotificationSse()
  @Sse('listener')
  notificationListener() {
    return this.chatService.notificationListener();
  }

  @UseGuards(JwtAccessTokenGuard)
  @ApiGetChatRooms()
  @Get()
  async getChatRooms(@GetUserId() userId: number): Promise<ChatRoomDto[]> {
    const returnedChatRooms = await this.chatService.getChatRooms(userId);

    return plainToInstance(ChatRoomDto, returnedChatRooms, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(JwtAccessTokenGuard)
  @ApiGetChatRoomsNew()
  @Get('new-api')
  getChatRoomsWithUserAndChat(
    @GetUserId() userId: number,
  ): Promise<ResponseGetChatRoomsDto[]> {
    return this.chatService.getChatRoomsWithUserAndChat(userId);
  }

  @ApiGetOneChatRoom()
  @Get(':roomId')
  getOneChatRoom(
    @Param('roomId', ParseObjectIdPipe) roomId: mongoose.Types.ObjectId,
  ): Promise<ChatRoomDto> {
    return this.chatService.getOneChatRoom(roomId);
  }

  @UseGuards(JwtAccessTokenGuard)
  @ApiCreateChatRoom()
  @Post()
  createChatRoom(
    @GetUserId() userId: number,
    @Body() body: ReceivedUserDto,
  ): Promise<ChatRoomDto> {
    return this.chatService.createChatRoom(userId, body.receiverId);
  }

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
  getChats(
    @GetUserId() userId: number,
    @Param('roomId', ParseObjectIdPipe) roomId: mongoose.Types.ObjectId,
  ) {
    return this.chatService.getChats(userId, roomId);
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

  @UseGuards(JwtAccessTokenGuard)
  @ApiGetChatNotifications()
  @Get('chat/notice')
  getChatNotifications(
    @GetUserId() userId: number,
  ): Promise<GetNotificationsResponseFromChatDto[]> {
    return this.chatService.getChatNotifications(userId);
  }

  // @ApiGetChatUnreadCounts()
  // @Get(':roomId/chat/unreads')
  //  getUnreadCounts(
  //   @Param('roomId', ParseObjectIdPipe) roomId: mongoose.Types.ObjectId,
  //   @Query('after', ParseIntPipe) after: number,
  // ) {
  //   return this.chatService.getUnreadCounts(roomId, after);
  // }
}
