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
    description: '채팅 확인 여부',
  })
  seenUsers: number[];

  @ApiProperty({
    description: '생성 날짜',
  })
  createdAt: Date;

  constructor(responseChatDto: Partial<ResponsePostChatDto>) {
    this._id = responseChatDto._id;
    this.content = responseChatDto.content;
    this.senderId = responseChatDto.senderId;
    this.seenUsers = responseChatDto.seenUsers;
    this.createdAt = responseChatDto.createdAt;
  }
}
