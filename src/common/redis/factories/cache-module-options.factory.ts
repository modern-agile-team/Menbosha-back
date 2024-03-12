import { CacheModuleOptions, CacheOptionsFactory } from '@nestjs/cache-manager';
import { Injectable } from '@nestjs/common';
import { ENV_KEY } from '@src/core/app-config/constants/app-config.constant';
import { AppConfigService } from '@src/core/app-config/services/app-config.service';
import * as redisStore from 'cache-manager-ioredis';

@Injectable()
export class CacheModuleOptionsFactory implements CacheOptionsFactory {
  constructor(private readonly appConfigService: AppConfigService) {}

  createCacheOptions(): CacheModuleOptions<Record<string, any>> {
    return {
      isGlobal: false,
      store: redisStore,
      host: this.appConfigService.get(ENV_KEY.REDIS_HOST),
      port: this.appConfigService.get(ENV_KEY.REDIS_PORT),
      password: this.appConfigService.get(ENV_KEY.REDIS_PASSWORD),
    };
  }
}
