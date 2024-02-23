import { SetMetadata } from '@nestjs/common';
import { ONLY_ADMIN_TOKEN } from 'src/admins/constants/only-admin.token';

export const OnlyAdmin = (isOnlyAdmin: boolean) =>
  SetMetadata(ONLY_ADMIN_TOKEN, isOnlyAdmin);
