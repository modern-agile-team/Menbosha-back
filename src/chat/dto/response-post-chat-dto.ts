import mongoose from 'mongoose';
import { ChatsDto } from './chats.dto';
import { ApiProperty } from '@nestjs/swagger';
import { TransformMongoId } from './transform/transform-mongo-id';

export class ResponsePostChatDto implements Omit<ChatsDto, 'chatRoomId'> {
  @ApiProperty({
    description: '채팅 id',
    type: 'string',
    format: 'ObjectId',
  })
  @TransformMongoId()
  _id: mongoose.Types.ObjectId;

  @ApiProperty({
    description: '채팅 내용',
  })
  content: string;

  @ApiProperty({
    description: '채팅을 전송한 유저의 id',
  })
  senderId: number;

  @ApiProperty({
    description: '채팅을 받은 유저의 id',
  })
  receiverId: number;

  @ApiProperty({
    description: '채팅 확인 여부',
  })
  isSeen: boolean;

  @ApiProperty({
    description: '생성 날짜',
  })
  createdAt: Date;

  constructor(responseChatDto: Partial<ResponsePostChatDto>) {
    this._id = responseChatDto._id;
    this.content = responseChatDto.content;
    this.senderId = responseChatDto.senderId;
    this.receiverId = responseChatDto.receiverId;
    this.isSeen = responseChatDto.isSeen;
    this.createdAt = responseChatDto.createdAt;
  }
}
