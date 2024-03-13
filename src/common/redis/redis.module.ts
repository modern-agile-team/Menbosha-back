import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { CacheModuleOptionsFactory } from '@src/common/redis/factories/cache-module-options.factory';
import { RedisService } from '@src/common/redis/services/redis.service';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    CacheModule.registerAsync({
      useClass: CacheModuleOptionsFactory,
    }),
  ],
  providers: [RedisService, CacheModuleOptionsFactory],
  exports: [RedisService],
})
export class RedisModule {}
