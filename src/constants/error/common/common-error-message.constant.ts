import { ErrorMessage } from '@src/type/type';
import { COMMON_ERROR_CODE } from './common-error-code.constant';

export const COMMON_ERROR_MESSAGE: ErrorMessage<typeof COMMON_ERROR_CODE> = {
  [COMMON_ERROR_CODE.SERVER_ERROR]:
    'Server error. Please contact server developer',
  [COMMON_ERROR_CODE.API_NOT_FOUND]:
    'Api not found. Please send request correctly',
} as const;
