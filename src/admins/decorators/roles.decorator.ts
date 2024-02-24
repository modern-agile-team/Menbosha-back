import { SetMetadata } from '@nestjs/common';
import { ROLES_TOKEN } from '@src/admins/constants/roles.token';
import { UserRole } from '@src/users/constants/user-role.enum';

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_TOKEN, roles);
