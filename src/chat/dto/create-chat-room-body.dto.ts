import { ApiPropertyOptional } from '@nestjs/swagger';
import { ChatRoomType } from '../constants/chat-rooms-enum';
import { IsEnum, IsOptional } from 'class-validator';
import { ReceivedUserDto } from '@src/chat/dto/received-user.dto';

export class CreateChatRoomBodyDto extends ReceivedUserDto {
  @ApiPropertyOptional({
    description: '채팅룸 생성 시 타입 지정. 기본 생성 1:1',
    default: 'oneOnOne',
    enum: ChatRoomType,
  })
  @IsOptional()
  @IsEnum(ChatRoomType)
  chatRoomType: ChatRoomType = ChatRoomType.OneOnOne;
}
