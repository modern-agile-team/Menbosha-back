import { PickType } from '@nestjs/swagger';
import { ChatsDto } from './chats.dto';

export class LookupChatsDto extends PickType(ChatsDto, [
  'content',
  'createdAt',
  'seenUsers',
]) {}
