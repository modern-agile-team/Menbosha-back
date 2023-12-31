import { OmitType } from '@nestjs/swagger';
import { ChatRoomsDto } from './chat-rooms.dto';

export class ChatRoomsWithoutChatsItemDto extends OmitType(ChatRoomsDto, [
  'chats',
] as const) {}
