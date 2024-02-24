import { ADMIN_ERROR_MESSAGE } from '@src/constants/error/admin/admin-error-message.constant';
import { AUTH_ERROR_MESSAGE } from './auth/auth-error-message.constant';
import { COMMON_ERROR_MESSAGE } from './common/common-error-message.constant';

export const ERROR_MESSAGE = {
  ...COMMON_ERROR_MESSAGE,
  ...AUTH_ERROR_MESSAGE,
  ...ADMIN_ERROR_MESSAGE,
} as const;
