import { RedisService } from './redis.service';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-ioredis';
import { RedisOptions } from 'src/config/redis-options.constants';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
    }),
  ],
  controllers: [],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
