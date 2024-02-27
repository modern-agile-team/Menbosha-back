import { Provider } from '@src/auth/enums/provider.enum';

export interface UserInfo {
  uniqueId: string;
  provider: Provider;
  name: string;
  email: string;
}
