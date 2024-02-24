import { CHAT_ERROR_CODE } from '@src/constants/error/chat/chat-error-code.constant';
import { ErrorMessage } from '@src/type/type';

export const CHAT_ERROR_MESSAGE: ErrorMessage<typeof CHAT_ERROR_CODE> = {
  [CHAT_ERROR_CODE.CHAT_ROOM_ALREADY_EXISTS]: `Chat room already exists`,
  [CHAT_ERROR_CODE.CHAT_ROOM_CREATION_FAILED]: 'Chat room creation failed',
} as const;
