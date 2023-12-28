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
import { ApiLeaveChatRoom } from '../swagger-decorators/leave-chat-room.decorator';
import { ApiGetChats } from '../swagger-decorators/get-chats.decorator';
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
import { ApiGetChatNotificationSse } from '../swagger-decorators/get-chat-notification-Sse.decorator';
import { CreateChatRoomBodyDto } from '../dto/create-chat-room-body.dto';
import { ChatRoomPaginateResultDto } from '../dto/chat-paginate-result.dto';
/**
 * @todo 1:1 채팅 컨트롤러 서비스 완성
 */
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
   * @todo 추후 다른 기능들에서도 호출이 필요할 경우 service코드에 별도의 비즈니스 로직 추가
   */
  @UseGuards(JwtAccessTokenGuard)
  @ApiGetChatNotificationSse()
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

  @UseGuards(JwtAccessTokenGuard)
  @Get('check')
  findOneChatRoomByUserIds(
    @GetUserId() userId: number,
    @Body() receivedUserDto: ReceivedUserDto,
  ) {
    return this.chatService.findOneChatRoomByUserIds(
      userId,
      receivedUserDto.receiverId,
    );
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
   * @returns 채팅방 생성
   */
  @UseGuards(JwtAccessTokenGuard)
  @ApiCreateChatRoom()
  @Post()
  createChatRoom(
    @GetUserId() userId: number,
    @Body() createChatRoomBodyDto: CreateChatRoomBodyDto,
  ): Promise<ChatRoomsDto> {
    return this.chatService.createChatRoom(userId, createChatRoomBodyDto);
  }

  /**
   *
   * @param userId
   * @param roomId
   * @returns 채팅창 나가기
   */
  @UseGuards(JwtAccessTokenGuard)
  @ApiLeaveChatRoom()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':roomId')
  leaveChatRoom(
    @GetUserId() userId: number,
    @Param('roomId', ParseObjectIdPipe) roomId: mongoose.Types.ObjectId,
  ) {
    return this.chatService.leaveChatRoom(userId, roomId);
  }

  /**
   *
   * @param userId
   * @param roomId
   * @returns chats
   * @todo 채팅 생성 및 전송 로직 수정 이후 다시 확인
   */
  @UseGuards(JwtAccessTokenGuard)
  @ApiGetChats()
  @Get(':roomId/chat')
  findAllChats(
    @GetUserId() userId: number,
    @Param('roomId', ParseObjectIdPipe) roomId: mongoose.Types.ObjectId,
  ): Promise<ChatRoomsDto> {
    return this.chatService.findAllChats(userId, roomId);
  }

  @UseGuards(JwtAccessTokenGuard)
  @ApiCreateChatImage()
  @Post(':roomId/chat/image')
  @UseInterceptors(FileInterceptor('file'))
  createChatImage(
    @Param('roomId', ParseObjectIdPipe) roomId: mongoose.Types.ObjectId,
    @GetUserId() senderId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.chatService.createChatImage(roomId, senderId, file);
  }

  // @ApiGetChatUnreadCounts()
  // @Get(':roomId/chat/unReads')
  //  getUnreadCounts(
  //   @Param('roomId', ParseObjectIdPipe) roomId: mongoose.Types.ObjectId,
  //   @Query('after', ParseIntPipe) after: number,
  // ) {
  //   return this.chatService.getUnreadCounts(roomId, after);
  // }
}
