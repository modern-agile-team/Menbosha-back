import { ADMIN_ERROR_CODE } from 'src/constants/error/admin/admin-error-code.constant';
import { ErrorMessage } from 'src/type/type';

export const ADMIN_ERROR_MESSAGE: ErrorMessage<typeof ADMIN_ERROR_CODE> = {
  [ADMIN_ERROR_CODE.ADMIN_ONLY_ACCESS]: `Access to this API is restricted to admins only.`,
  [ADMIN_ERROR_CODE.DENIED_FOR_ADMINS]: `Access to admins is not allowed.`,
} as const;
