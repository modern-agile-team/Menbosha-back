import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  async getToken(userId: string): Promise<string | undefined | null> {
    return await this.cacheManager.get<string>(userId); // ? Retrieve data from the cache
  }
  async setToken(userId: string, token: string) {
    await this.cacheManager.set(userId, token); //  ? Set data in the cache
  }

  async delToken(userId: string) {
    await this.cacheManager.del(userId); // ? Delete data from the cache
  }
}
