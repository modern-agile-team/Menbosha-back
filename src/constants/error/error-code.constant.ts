import { ADMIN_ERROR_CODE } from 'src/constants/error/admin/admin-error-code.constant';
import { AUTH_ERROR_CODE } from './auth/auth-error-code.constant';
import { COMMON_ERROR_CODE } from './common/common-error-code.constant';

export const ERROR_CODE = {
  ...COMMON_ERROR_CODE,
  ...AUTH_ERROR_CODE,
  ...ADMIN_ERROR_CODE,
} as const;
