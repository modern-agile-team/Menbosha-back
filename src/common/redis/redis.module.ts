import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { RedisService } from '@src/common/redis/redis.service';
import * as redisStore from 'cache-manager-ioredis';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    CacheModule.register({
      isGlobal: false,
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
