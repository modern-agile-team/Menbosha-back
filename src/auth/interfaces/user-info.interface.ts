import { Provider } from 'src/auth/enums/provider.enum';

export interface UserInfo {
  provider: Provider;
  name: string;
  email: string;
}
