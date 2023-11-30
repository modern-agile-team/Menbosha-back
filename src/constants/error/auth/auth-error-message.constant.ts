import { ErrorMessage } from 'src/type/type';
import { AUTH_ERROR_CODE } from './auth-error-code.constant';

export const AUTH_ERROR_MESSAGE: ErrorMessage<typeof AUTH_ERROR_CODE> = {
  [AUTH_ERROR_CODE.ACCOUNT_NOT_FOUND]: `Can't find account`,
} as const;
