import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { ReceivedUserDto } from '@src/chat/dto/received-user.dto';
import { ChatRoomType } from '@src/chat/constants/chat-rooms-enum';

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
