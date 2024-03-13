import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENV_KEY } from '@src/core/app-config/constants/app-config.constant';

type Key = keyof typeof ENV_KEY;

@Injectable()
export class AppConfigService {
  private readonly PRODUCTION = 'production';
  private readonly DEVELOPMENT = 'development';
  private readonly LOCAL = 'local';

  constructor(
    private readonly configService: ConfigService<typeof ENV_KEY, true>,
  ) {}

  get<T extends string | number>(key: Key): T {
    return this.configService.get<T>(key);
  }

  getList(...keys: Key[]): (string | number)[] {
    return keys.map((key) => {
      return this.get(ENV_KEY[key]);
    });
  }

  getAll(): (string | number)[] {
    return Object.values(ENV_KEY).map((key) => {
      return this.get<typeof key>(key);
    });
  }

  getAllMap(): Record<Key, string | number> {
    return Object.entries(ENV_KEY).reduce(
      (
        acc: Record<Key, string | number>,
        [key, value]: [Key, (typeof ENV_KEY)[Key]],
      ) => {
        acc[key] = this.get<string | number>(value);

        return acc;
      },
      <Record<Key, string | number>>{},
    );
  }

  isLocal(): boolean {
    return this.get<string>(ENV_KEY.NODE_ENV) === this.LOCAL;
  }

  isDevelopment(): boolean {
    return this.get<string>(ENV_KEY.NODE_ENV) === this.DEVELOPMENT;
  }

  isProduction(): boolean {
    return this.get<string>(ENV_KEY.NODE_ENV) === this.PRODUCTION;
  }
}
