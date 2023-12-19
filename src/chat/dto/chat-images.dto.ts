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
    description: '채팅 id',
    type: 'string',
    format: 'ObjectId',
  })
  @TransformMongoId()
  @Expose()
  chatId: Types.ObjectId;

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
