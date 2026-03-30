import { redis } from '@/lib/redis';

const CACHE_PREFIX = 'cache:';

export interface CacheOptions {
  ttl?: number;
  prefix?: string;
}

export class CacheService {
  private defaultTTL: number;

  constructor(defaultTTL: number = 3600) {
    this.defaultTTL = defaultTTL;
  }

  async get<T>(key: string, options?: CacheOptions): Promise<T | null> {
    const cacheKey = this.getCacheKey(key, options?.prefix);
    const data = await redis.get<string>(cacheKey);
    
    if (!data) return null;
    
    try {
      return JSON.parse(data) as T;
    } catch {
      return data as unknown as T;
    }
  }

  async set(key: string, value: any, options?: CacheOptions): Promise<void> {
    const cacheKey = this.getCacheKey(key, options?.prefix);
    const ttl = options?.ttl || this.defaultTTL;
    
    if (typeof value === 'object') {
      await redis.setex(cacheKey, ttl, JSON.stringify(value));
    } else {
      await redis.setex(cacheKey, ttl, String(value));
    }
  }

  async delete(key: string, options?: CacheOptions): Promise<void> {
    const cacheKey = this.getCacheKey(key, options?.prefix);
    await redis.del(cacheKey);
  }

  async invalidatePattern(pattern: string, prefix?: string): Promise<number> {
    const fullPattern = this.getCacheKey(pattern, prefix);
    const keys = await redis.keys(fullPattern);
    
    if (keys.length === 0) return 0;
    
    return await redis.del(...keys);
  }

  async exists(key: string, prefix?: string): Promise<boolean> {
    const cacheKey = this.getCacheKey(key, prefix);
    const result = await redis.exists(cacheKey);
    return result === 1;
  }

  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    options?: CacheOptions
  ): Promise<T> {
    const cached = await this.get<T>(key, options);
    
    if (cached !== null) {
      return cached;
    }

    const data = await fetcher();
    await this.set(key, data, options);
    
    return data;
  }

  async increment(key: string, by: number = 1, options?: CacheOptions): Promise<number> {
    const cacheKey = this.getCacheKey(key, options?.prefix);
    return await redis.incrby(cacheKey, by);
  }

  async decrement(key: string, by: number = 1, options?: CacheOptions): Promise<number> {
    const cacheKey = this.getCacheKey(key, options?.prefix);
    return await redis.decrby(cacheKey, by);
  }

  private getCacheKey(key: string, prefix?: string): string {
    const actualPrefix = prefix || CACHE_PREFIX;
    return `${actualPrefix}${key}`;
  }
}

export const cache = new CacheService();

export const cacheKeys = {
  post: (postId: string) => `post:${postId}`,
  company: (companyId: string) => `company:${companyId}`,
  analytics: (accountId: string, date: string) => `analytics:${accountId}:${date}`,
  socialAccount: (accountId: string) => `social:${accountId}`,
  user: (userId: string) => `user:${userId}`,
  schedule: (scheduleId: string) => `schedule:${scheduleId}`,
};
