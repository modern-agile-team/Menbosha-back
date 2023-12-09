import { Types } from 'mongoose';
import { ChatRoom } from '../schemas/chat-room.schemas';
import { IsMongoId, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ChatUserDto } from 'src/users/dtos/chat-user.dto';

export class ChatRoomDto implements Pick<ChatRoom, '_id'> {
  @ApiProperty({
    description: 'mongoDB objectId',
  })
  @IsMongoId()
  _id: Types.ObjectId;

  @ApiPropertyOptional({
    description: '상대 유저의 정보(guest_id)',
  })
  @IsOptional()
  host?: ChatUserDto;

  @ApiPropertyOptional({
    description: '상대 유저의 정보(host_id)',
  })
  @IsOptional()
  guest?: ChatUserDto;

  constructor(chatDto: Partial<ChatRoomDto> = {}) {
    Object.assign(this, chatDto);
  }
}
