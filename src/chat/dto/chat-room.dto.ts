import { Types } from 'mongoose';
import { ChatRoom } from '../schemas/chat-room.schemas';
import { IsMongoId } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ChatRoomDto implements Partial<ChatRoom> {
  @ApiProperty({
    description: 'mongoDB objectId',
  })
  @IsMongoId()
  _id: Types.ObjectId;

  @ApiPropertyOptional({
    description: '상대 유저의 id(guest_id)',
  })
  host_id?: Partial<UserDto>;

  @ApiPropertyOptional({
    description: '상대 유저의 id(host_id)',
  })
  guest_id?: Partial<UserDto>;

  constructor(chatDto: Partial<ChatRoomDto>) {
    Object.assign(this, chatDto);
  }
}
