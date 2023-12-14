import { ApiProperty } from '@nestjs/swagger';
import { TransformMongoId } from './transform/transform-mongo-id';
import { Chats } from '../schemas/chats.schemas';
import { Expose } from 'class-transformer';

export class ChatsDto
  implements
    Pick<Chats, 'chatRoomId' | 'content' | 'sender' | 'receiver' | 'isSeen'>
{
  @ApiProperty({
    description: '채팅 방 id',
    type: 'string',
    format: 'ObjectId',
  })
  @Expose()
  @TransformMongoId()
  chatRoomId: string;

  @ApiProperty({
    description: '채팅 내용',
  })
  @Expose()
  content: string;

  @ApiProperty({
    description: '채팅을 전송한 유저의 id',
  })
  @Expose()
  sender: number;

  @ApiProperty({
    description: '채팅을 받은 유저의 id',
  })
  @Expose()
  receiver: number;

  @ApiProperty({
    description: '채팅 확인 여부',
  })
  @Expose()
  isSeen: boolean;

  @ApiProperty({
    description: '생성 날짜',
  })
  @Expose()
  createdAt: Date;

  constructor(chatDto: Partial<ChatsDto>) {
    this.chatRoomId = chatDto.chatRoomId;
    this.content = chatDto.content;
    this.sender = chatDto.sender;
    this.receiver = chatDto.receiver;
    this.isSeen = chatDto.isSeen;
    this.createdAt = chatDto.createdAt;
  }
}
