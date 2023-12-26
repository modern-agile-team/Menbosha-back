import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { TransformMongoId } from './transform/transform-mongo-id';
import mongoose from 'mongoose';
import { ChatRooms } from '../schemas/chat-rooms.schemas';
import { TransformMongoIdToPlainOnly } from './transform/transform-mongo-id-to-plain-only';
import { ChatRoomType } from '../constants/chat-rooms-enum';
import { Chat } from '../schemas/chats.schemas';
import { ChatsDto } from './chats.dto';

export class ChatRoomsDto implements Omit<ChatRooms, 'unprotectedData'> {
  @ApiProperty({
    description: '채팅 방 id',
    type: 'string',
    format: 'ObjectId',
  })
  @TransformMongoId()
  @Expose()
  _id: mongoose.Types.ObjectId;

  @Exclude()
  originalMembers: number[];

  @ApiProperty({
    description: '채팅방에 속한 현재 유저들의 id',
  })
  @Expose()
  chatMembers: number[];

  @ApiProperty({
    description: '해당 채팅방 채팅 내역',
    type: 'object',
    // isArray: true,
    default: [],
  })
  @Expose()
  @TransformMongoIdToPlainOnly()
  chats: ChatsDto[] | [];

  @ApiProperty({
    description: '해당 채팅방 채팅 내역',
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

  @ApiProperty({
    description: '채팅방 삭제 날짜',
    default: null,
  })
  @Exclude()
  deletedAt: Date | null;

  constructor(chatRoomsDto: Partial<ChatRoomsDto> = {}) {
    this._id = chatRoomsDto._id;
    this.originalMembers = chatRoomsDto.originalMembers;
    this.chatMembers = chatRoomsDto.chatMembers;
    // this.chats = plainToInstance(ChatsDto, chatRoomsDto.chats);
    this.chats = chatRoomsDto.chats;
    this.chatRoomType = chatRoomsDto.chatRoomType;
    this.createdAt = chatRoomsDto.createdAt;
    this.updatedAt = chatRoomsDto.updatedAt;
  }
}
