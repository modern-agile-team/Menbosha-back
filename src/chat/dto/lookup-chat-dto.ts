import { PickType } from '@nestjs/swagger';
import { ChatDto } from './chat.dto';

export class LookupChatsDto extends PickType(ChatDto, [
  'content',
  'createdAt',
  'seenUsers',
]) {}
