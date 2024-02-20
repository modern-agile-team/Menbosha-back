import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Ttl } from './ttl.enum';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  getToken(userId: string): Promise<string | undefined | null> {
    return this.cacheManager.get<string>(userId); // ? Retrieve data from the cache
  }
  async setToken(key: string, token: string, ttl: Ttl) {
    await this.cacheManager.set(key, token, { ttl }); // ? Save data to the cache
  }

  async delToken(key: string) {
    await this.cacheManager.del(key); // ? Delete data from the cache
  }

  async delTokens(keys: string[]) {
    await this.cacheManager.store.del(keys);
  }
}
