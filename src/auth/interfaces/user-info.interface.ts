import { UserProvider } from '@src/auth/enums/user-provider.enum';

export interface UserInfo {
  uniqueId: string;
  provider: UserProvider;
  name: string;
  email: string;
}
