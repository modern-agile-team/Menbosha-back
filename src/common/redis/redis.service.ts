import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  getToken(userId: string): Promise<string | undefined | null> {
    return this.cacheManager.get<string>(userId); // ? Retrieve data from the cache
  }
  async setToken(userId: string, token: string) {
    await this.cacheManager.set(userId, token, 604800); //  ? Set data in the cache for 7 days
  }

  async delToken(userId: string) {
    await this.cacheManager.del(userId); // ? Delete data from the cache
  }
}
