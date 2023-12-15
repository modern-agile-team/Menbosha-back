import { PickType } from '@nestjs/swagger';
import { ChatsDto } from './chats.dto';

export class lookupChatsDto extends PickType(ChatsDto, [
  'content',
  'createdAt',
  'isSeen',
]) {}
