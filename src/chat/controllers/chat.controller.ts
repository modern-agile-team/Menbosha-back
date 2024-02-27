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
  Query,
  Sse,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUserId } from '@src/common/decorators/get-userId.decorator';
import { SuccessResponseInterceptor } from '@src/common/interceptors/success-response.interceptor';
import { Observable } from 'rxjs';
import { PageQueryDto } from '@src/common/dto/page-query.dto';
import { ParsePositiveIntPipe } from '@src/common/pipes/parse-positive-int.pipe';
import { AccessTokenAuthGuard } from '@src/auth/jwt/jwt-auth.guard';
import { AggregateChatRoomForChatsDto } from '@src/chat/dto/aggregate-chat-room-for-chats.dto';
import { ChatImageDto } from '@src/chat/dto/chat-image.dto';
import { ChatRoomDto } from '@src/chat/dto/chat-room.dto';
import { CreateChatRoomBodyDto } from '@src/chat/dto/create-chat-room-body.dto';
import { ResponseFindChatRoomsPaginationDto } from '@src/chat/dto/response-find-chat-rooms-pagination.dto';
import { ParseObjectIdPipe } from '@src/chat/pipes/parse-object-id.pipe';
import { ChatService } from '@src/chat/services/chat.service';
import { ApiCreateChatImage } from '@src/chat/swagger-decorators/create-chat-image.decorators';
import { ApiCreateChatRoom } from '@src/chat/swagger-decorators/create-chat-room.decorator';
import { ApiDeleteChat } from '@src/chat/swagger-decorators/delete-chat.decorator';
import { ApiFindChatNotificationSse } from '@src/chat/swagger-decorators/find-chat-notification-Sse.decorator';
import { ApiFindChatRooms } from '@src/chat/swagger-decorators/find-chat-rooms.decorator';
import { ApiFindChats } from '@src/chat/swagger-decorators/find-chats.decorator';
import { ApiFindOneChatRoomByUserId } from '@src/chat/swagger-decorators/find-one-chat-room-by-user-id.decorator';
import { ApiFindOneChatRoom } from '@src/chat/swagger-decorators/find-one-chat-room.decorator';
import { ApiLeaveChatRoom } from '@src/chat/swagger-decorators/leave-chat-room.decorator';
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
  @UseGuards(AccessTokenAuthGuard)
  @ApiFindChatNotificationSse()
  @Sse('listener')
  notificationListener(@GetUserId() userId: number): Observable<string> {
    return this.chatService.notificationListener(userId);
  }

  /**
   *
   * @param userId
   * @returns find all chat rooms with mapped user
   */
  @UseGuards(AccessTokenAuthGuard)
  @ApiFindChatRooms()
  @Get()
  findAllChatRoomsWithUserAndChat(
    @GetUserId() userId: number,
    @Query() pageQueryDto: PageQueryDto,
  ): Promise<ResponseFindChatRoomsPaginationDto> {
    return this.chatService.findAllChatRoomsWithUserAndChat(
      userId,
      pageQueryDto,
    );
  }

  /**
   *
   * @deprecated 삭제 예정
   */
  @UseGuards(AccessTokenAuthGuard)
  @ApiFindOneChatRoomByUserId()
  @Get('check')
  findOneChatRoomByUserIds(
    @GetUserId() userId: number,
    @Query('chatPartnerId', ParsePositiveIntPipe) chatPartnerId: number,
  ): Promise<ChatRoomDto> {
    return this.chatService.findOneChatRoomByUserIds(userId, chatPartnerId);
  }

  /**
   *
   * @param roomId
   * @returns find one chat room or fail
   */
  @ApiFindOneChatRoom()
  @Get(':roomId')
  findOneChatRoomOrFail(
    @Param('roomId', ParseObjectIdPipe) roomId: mongoose.Types.ObjectId,
  ): Promise<ChatRoomDto> {
    return this.chatService.findOneChatRoomOrFail(roomId);
  }

  /**
   *
   * @param userId
   * @param createChatRoomBodyDto
   * @returns 채팅방 생성
   */
  @UseGuards(AccessTokenAuthGuard)
  @ApiCreateChatRoom()
  @Post()
  createChatRoom(
    @GetUserId() userId: number,
    @Body() createChatRoomBodyDto: CreateChatRoomBodyDto,
  ): Promise<ChatRoomDto> {
    return this.chatService.createChatRoom(userId, createChatRoomBodyDto);
  }

  /**
   *
   * @param userId
   * @param roomId
   * @returns 채팅창 나가기
   */
  @UseGuards(AccessTokenAuthGuard)
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
   * @returns chatRoom
   */
  @UseGuards(AccessTokenAuthGuard)
  @ApiFindChats()
  @Get(':roomId/chat')
  findAllChats(
    @GetUserId() userId: number,
    @Query() pageQueryDto: PageQueryDto,
    @Param('roomId', ParseObjectIdPipe) roomId: mongoose.Types.ObjectId,
  ): Promise<AggregateChatRoomForChatsDto> {
    return this.chatService.findAllChats(userId, roomId, pageQueryDto);
  }

  @UseGuards(AccessTokenAuthGuard)
  @ApiCreateChatImage()
  @Post(':roomId/chat/image')
  @UseInterceptors(FileInterceptor('file'))
  createChatImage(
    @Param('roomId', ParseObjectIdPipe) roomId: mongoose.Types.ObjectId,
    @GetUserId() userId: number,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ChatImageDto> {
    return this.chatService.createChatImage(roomId, userId, file);
  }

  @UseGuards(AccessTokenAuthGuard)
  @ApiDeleteChat()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':roomId/chat/:chatId')
  deleteChat(
    @Param('roomId', ParseObjectIdPipe) roomId: mongoose.Types.ObjectId,
    @Param('chatId', ParseObjectIdPipe) chatId: mongoose.Types.ObjectId,
    @GetUserId() userId: number,
  ) {
    return this.chatService.deleteChat(userId, roomId, chatId);
  }
}
