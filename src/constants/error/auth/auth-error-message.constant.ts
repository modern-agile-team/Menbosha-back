import { AUTH_ERROR_CODE } from '@src/constants/error/auth/auth-error-code.constant';
import { ErrorMessage } from '@src/type/type';

export const AUTH_ERROR_MESSAGE: ErrorMessage<typeof AUTH_ERROR_CODE> = {
  [AUTH_ERROR_CODE.ACCOUNT_NOT_FOUND]: `Can't find account`,
} as const;
