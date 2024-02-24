import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, plainToInstance } from 'class-transformer';
import mongoose from 'mongoose';
import { ChatRooms } from '../schemas/chat-rooms.schemas';
import { ChatRoomType } from '../constants/chat-rooms-enum';
import { ChatDto } from '@src/chat/dto/chat.dto';
import { TransformMongoId } from '@src/chat/dto/transform/transform-mongo-id';

export class ChatRoomDto implements Omit<ChatRooms, 'unprotectedData'> {
  @ApiProperty({
    description: '채팅 방 id',
    type: 'string',
    format: 'ObjectId',
  })
  @TransformMongoId()
  @Expose()
  _id: mongoose.Types.ObjectId;

  @ApiProperty({
    description: '채팅 방에 속했던 모든 유저들의 id',
    isArray: true,
    type: Number,
  })
  @Exclude()
  originalMembers: number[];

  @ApiProperty({
    description: '채팅방에 속한 현재 유저들의 id',
    isArray: true,
    type: Number,
  })
  @Expose()
  chatMembers: number[];

  @ApiProperty({
    description: '해당 채팅방 채팅 내역',
    type: ChatDto,
    isArray: true,
    default: [],
  })
  @Expose()
  chats: ChatDto[] | [];

  @ApiProperty({
    description: '해당 채팅방 타입',
    type: 'object',
    isArray: true,
    enum: ChatRoomType,
  })
  @Expose()
  chatRoomType: ChatRoomType;

  @ApiProperty({
    description: '채팅방 생성 날짜',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: '채팅방 업데이트 날짜',
  })
  @Expose()
  updatedAt: Date;

  @Exclude()
  deletedAt: Date | null;

  constructor(chatRoomsDto: Partial<ChatRoomDto> = {}) {
    this._id = chatRoomsDto._id;
    this.chatMembers = chatRoomsDto.chatMembers;
    this.chats = plainToInstance(ChatDto, chatRoomsDto.chats);
    this.chatRoomType = chatRoomsDto.chatRoomType;
    this.createdAt = chatRoomsDto.createdAt;
    this.updatedAt = chatRoomsDto.updatedAt;
  }
}
