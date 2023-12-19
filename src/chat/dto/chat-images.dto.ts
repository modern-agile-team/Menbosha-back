import { Types } from 'mongoose';
import { ChatImages } from '../schemas/chat-images.schemas';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { TransformMongoId } from './transform/transform-mongo-id';

export class ChatImagesDto implements Omit<ChatImages, 'unprotectedData'> {
  @ApiProperty({
    description: '채팅 id',
    type: 'string',
    format: 'ObjectId',
  })
  @TransformMongoId()
  @Expose()
  _id: Types.ObjectId;

  @ApiProperty({
    description: '채팅방 id',
    type: 'string',
    format: 'ObjectId',
  })
  @TransformMongoId()
  @Expose()
  chatRoomId: Types.ObjectId;

  @ApiProperty({
    description: '채탕 송신 유저 id',
    format: 'integer',
  })
  @Expose()
  sender: number;

  @ApiProperty({
    description: '채팅 내용',
  })
  @Expose()
  imageUrl: string;

  @ApiProperty({
    description: '생성 날짜',
  })
  @Expose()
  createdAt: Date;
}
