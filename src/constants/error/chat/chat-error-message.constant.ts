import { ErrorMessage } from '@src/type/type';
import { CHAT_ERROR_CODE } from './chat-error-code.constant';

export const CHAT_ERROR_MESSAGE: ErrorMessage<typeof CHAT_ERROR_CODE> = {
  [CHAT_ERROR_CODE.CHAT_ROOM_ALREADY_EXISTS]: `Chat room already exists`,
  [CHAT_ERROR_CODE.CHAT_ROOM_CREATION_FAILED]: 'Chat room creation failed',
} as const;
