import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import * as dotenv from 'dotenv';

dotenv.config();

export const RedisOptions: CacheModuleAsyncOptions = {
  isGlobal: true,
  useFactory: async () => {
    const store = await redisStore({
      socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
      ttl: 604800, // 7일 (초 단위)
    });
    return {
      store: () => store,
    };
  },
};
