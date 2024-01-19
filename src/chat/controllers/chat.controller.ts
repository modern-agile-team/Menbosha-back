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
import { ChatService } from '../services/chat.service';
import { ApiTags } from '@nestjs/swagger';
import { ReceivedUserDto } from '../dto/received-user.dto';
import mongoose from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParseObjectIdPipe } from '../pipes/parse-object-id.pipe';
import { ApiCreateChatRoom } from '../swagger-decorators/create-chat-room.decorator';
import { ApiGetChatRooms } from '../swagger-decorators/get-chat-rooms.decorator';
import { ApiGetOneChatRoom } from '../swagger-decorators/get-one-chat-room.decorator';
import { ApiLeaveChatRoom } from '../swagger-decorators/leave-chat-room.decorator';
import { ApiGetChats } from '../swagger-decorators/get-chats.decorator';
// import { ApiGetChatUnreadCounts } from '../swagger-decorators/get-chat-unread-counts.decorator';
import { GetUserId } from 'src/common/decorators/get-userId.decorator';
import { JwtAccessTokenGuard } from 'src/config/guards/jwt-access-token.guard';
import { ApiCreateChatImage } from '../swagger-decorators/create-chat-image.decorators';
import { SuccessResponseInterceptor } from 'src/common/interceptors/success-response.interceptor';
import { ChatRoomDto } from '../dto/chat-room.dto';
import { plainToInstance } from 'class-transformer';
import { ApiGetChatRoomsNew } from '../swagger-decorators/get-chat-rooms-new.decorator';
import { Observable } from 'rxjs';
import { ApiGetChatNotificationSse } from '../swagger-decorators/get-chat-notification-Sse.decorator';
import { CreateChatRoomBodyDto } from '../dto/create-chat-room-body.dto';
import { PageQueryDto } from 'src/common/dto/page-query.dto';
import { AggregateChatRoomForChatsDto } from '../dto/aggregate-chat-room-for-chats.dto';
import { ChatImageDto } from '../dto/chat-image.dto';
import { ChatRoomsWithoutChatsItemDto } from '../dto/chat-rooms-without-chats-item.dto';
import { ApiGetOneChatRoomByUserId } from '../swagger-decorators/get-one-chat-room-by-user-id.decorator';
import { ResponseGetChatRoomsPaginationDto } from '../dto/response-get-chat-rooms-pagination.dto';
import { ApiDeleteChat } from '../swagger-decorators/delete-chat.decorator';
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
   * @returns find all chat rooms by userId without chats
   */
  @UseGuards(JwtAccessTokenGuard)
  @ApiGetChatRooms()
  @Get()
  async findAllChatRooms(
    @GetUserId() userId: number,
  ): Promise<ChatRoomsWithoutChatsItemDto[]> {
    const returnedChatRooms = await this.chatService.findAllChatRooms(userId);

    return plainToInstance(ChatRoomsWithoutChatsItemDto, returnedChatRooms, {
      excludeExtraneousValues: true,
    });
  }

  /**
   *
   * @param userId
   * @returns find all chat rooms with mapped user
   */
  @UseGuards(JwtAccessTokenGuard)
  @ApiGetChatRoomsNew()
  @Get('new')
  findAllChatRoomsWithUserAndChat(
    @GetUserId() userId: number,
    @Query() pageQueryDto: PageQueryDto,
  ): Promise<ResponseGetChatRoomsPaginationDto> {
    return this.chatService.findAllChatRoomsWithUserAndChat(
      userId,
      pageQueryDto.page,
    );
  }

  /**
   *
   * @param userId
   * @param receivedUserDto
   * @returns findOneChatRoomByUserIds
   */
  @UseGuards(JwtAccessTokenGuard)
  @ApiGetOneChatRoomByUserId()
  @Get('check')
  findOneChatRoomByUserIds(
    @GetUserId() userId: number,
    @Body() receivedUserDto: ReceivedUserDto,
  ): Promise<ChatRoomDto> {
    return this.chatService.findOneChatRoomByUserIds(
      userId,
      receivedUserDto.receiverId,
    );
  }

  /**
   *
   * @param roomId
   * @returns find one chat room or fail
   */
  @ApiGetOneChatRoom()
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
  @UseGuards(JwtAccessTokenGuard)
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
  @UseGuards(JwtAccessTokenGuard)
  @ApiLeaveChatRoom()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':roomId')
  leaveChatRoom(
    @GetUserId() userId: number,
    @Param('roomId', ParseObjectIdPipe) roomId: mongoose.Types.ObjectId,
  ): Promise<void> {
    return this.chatService.leaveChatRoom(userId, roomId);
  }

  /**
   *
   * @param userId
   * @param roomId
   * @returns chatRoom
   */
  @UseGuards(JwtAccessTokenGuard)
  @ApiGetChats()
  @Get(':roomId/chat')
  findAllChats(
    @GetUserId() userId: number,
    @Query() pageQueryDto: PageQueryDto,
    @Param('roomId', ParseObjectIdPipe) roomId: mongoose.Types.ObjectId,
  ): Promise<AggregateChatRoomForChatsDto> {
    return this.chatService.findAllChats(userId, roomId, pageQueryDto.page);
  }

  @UseGuards(JwtAccessTokenGuard)
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

  @UseGuards(JwtAccessTokenGuard)
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

  // @ApiGetChatUnreadCounts()
  // @Get(':roomId/chat/unReads')
  //  getUnreadCounts(
  //   @Param('roomId', ParseObjectIdPipe) roomId: mongoose.Types.ObjectId,
  //   @Query('after', ParseIntPipe) after: number,
  // ) {
  //   return this.chatService.getUnreadCounts(roomId, after);
  // }
}
