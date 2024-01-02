import { OmitType } from '@nestjs/swagger';
import { ChatRoomDto } from './chat-room.dto';

export class ChatRoomsWithoutChatsItemDto extends OmitType(ChatRoomDto, [
  'chats',
] as const) {}
