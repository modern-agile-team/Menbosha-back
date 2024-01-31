import { RedisService } from './redis.service';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { RedisOptions } from 'src/config/redis-options.constants';

@Module({
  imports: [
    CacheModule.register({ isGlobal: true, RedisOptions }),
    // CacheModule.registerAsync(RedisOptions),
  ],
  controllers: [],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
