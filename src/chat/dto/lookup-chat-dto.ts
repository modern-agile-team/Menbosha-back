import { PickType } from '@nestjs/swagger';
import { ChatDto } from '@src/chat/dto/chat.dto';

export class LookupChatsDto extends PickType(ChatDto, [
  'content',
  'createdAt',
  'seenUsers',
]) {}
