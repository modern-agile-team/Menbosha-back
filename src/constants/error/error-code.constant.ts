import { AUTH_ERROR_CODE } from './auth/auth-error-code.constant';

export const ERROR_CODE = {
  ...AUTH_ERROR_CODE,
} as const;
