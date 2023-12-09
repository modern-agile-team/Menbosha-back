import { Types } from 'mongoose';
import { IsMongoId, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ChatUserDto } from 'src/users/dtos/chat-user.dto';
import { ChatDto } from './chat.dto';

export class ChatRoomDto extends ChatDto {
  // @ApiProperty({
  //   description: 'mongoDB objectId',
  // })
  // @IsMongoId()
  // _id: Types.ObjectId;

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

  // @ApiProperty({
  //   description: '가장 마지막 채팅',
  // })
  // chat: ChatDto;

  constructor(
    chatDto: Partial<ChatDto> = {},
    chatUserDto: ChatUserDto,
    myId: number,
  ) {
    super(chatDto);
    chatDto.sender === myId
      ? (this.host = chatUserDto)
      : (this.guest = chatUserDto);
    Object.seal(this);
  }
}
