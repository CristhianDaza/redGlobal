import { logger } from '@/services/loggerService';

export interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
  key: string;
}

export interface CacheOptions {
  ttl?: number;
  maxSize?: number;
  cleanupInterval?: number;
}

class CacheService {
  private cache = new Map<string, CacheEntry>();
  private defaultTTL: number;
  private maxSize: number;
  private cleanupInterval: number;
  private cleanupTimer?: number;

  constructor(options: CacheOptions = {}) {
    this.defaultTTL = options.ttl || 5 * 60 * 1000;
    this.maxSize = options.maxSize || 100;
    this.cleanupInterval = options.cleanupInterval || 60 * 1000;
    
    this.startCleanupTimer();
  }

  private startCleanupTimer(): void {
    this.cleanupTimer = window.setInterval(() => {
      this.cleanup();
    }, this.cleanupInterval);
  }

  private cleanup(): void {
    const now = Date.now();
    let removedCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry, now)) {
        this.cache.delete(key);
        removedCount++;
      }
    }

    if (removedCount > 0) {
      logger.debug(`Cache cleanup removed ${removedCount} expired entries`, 'CacheService');
    }

    if (this.cache.size > this.maxSize) {
      const entries = Array.from(this.cache.entries())
        .sort(([, a], [, b]) => a.timestamp - b.timestamp);
      
      const toRemove = this.cache.size - this.maxSize;
      for (let i = 0; i < toRemove; i++) {
        this.cache.delete(entries[i][0]);
      }
      
      logger.debug(`Cache size limit reached, removed ${toRemove} oldest entries`, 'CacheService');
    }
  }

  private isExpired(entry: CacheEntry, now: number = Date.now()): boolean {
    return now - entry.timestamp > entry.ttl;
  }

  private generateKey(prefix: string, params?: Record<string, any>): string {
    if (!params) return prefix;
    
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${JSON.stringify(params[key])}`)
      .join('|');
    
    return `${prefix}:${sortedParams}`;
  }

  set<T>(key: string, data: T, ttl?: number): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
      key
    };

    this.cache.set(key, entry);
    logger.debug(`Cache set: ${key} (TTL: ${entry.ttl}ms)`, 'CacheService');

    if (this.cache.size > this.maxSize) {
      this.cleanup();
    }
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      logger.debug(`Cache miss: ${key}`, 'CacheService');
      return null;
    }

    if (this.isExpired(entry)) {
      this.cache.delete(key);
      logger.debug(`Cache expired: ${key}`, 'CacheService');
      return null;
    }

    logger.debug(`Cache hit: ${key}`, 'CacheService');
    return entry.data as T;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    if (this.isExpired(entry)) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      logger.debug(`Cache deleted: ${key}`, 'CacheService');
    }
    return deleted;
  }

  clear(): void {
    const size = this.cache.size;
    this.cache.clear();
    logger.info(`Cache cleared: ${size} entries removed`, 'CacheService');
  }

  async getOrSet<T>(
    key: string, 
    fetcher: () => Promise<T>, 
    ttl?: number
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    logger.debug(`Cache fetch: ${key}`, 'CacheService');
    const data = await fetcher();
    this.set(key, data, ttl);
    return data;
  }

  cacheApiCall<T>(
    apiName: string, 
    params: Record<string, any> = {}, 
    ttl?: number  
  ) {
    const key = this.generateKey(`api:${apiName}`, params);
    
    return {
      key,
      get: () => this.get<T>(key),
      set: (data: T) => this.set(key, data, ttl),
      getOrSet: (fetcher: () => Promise<T>) => this.getOrSet(key, fetcher, ttl)
    };
  }

  getStats() {
    const now = Date.now();
    let expiredCount = 0;
    let totalSize = 0;

    for (const entry of this.cache.values()) {
      if (this.isExpired(entry, now)) {
        expiredCount++;
      }
      totalSize += JSON.stringify(entry.data).length;
    }

    return {
      totalEntries: this.cache.size,
      expiredEntries: expiredCount,
      activeEntries: this.cache.size - expiredCount,
      approximateSize: totalSize,
      maxSize: this.maxSize,
      defaultTTL: this.defaultTTL
    };
  }

  destroy(): void {
    if (this.cleanupTimer) {
      window.clearInterval(this.cleanupTimer);
    }
    this.clear();
  }
}

export const cacheService = new CacheService({
  ttl: 5 * 60 * 1000,
  maxSize: 200,
  cleanupInterval: 2 * 60 * 1000
});

export const API_CACHE_CONFIG = {
  PRODUCTS_PROMOS: { ttl: 10 * 60 * 1000 },
  PRODUCTS_MARPICO: { ttl: 15 * 60 * 1000 },
  PRODUCTS_STOCKSUR: { ttl: 8 * 60 * 1000 },
  PRODUCTS_CATAPROM: { ttl: 12 * 60 * 1000 },
  CATEGORIES: { ttl: 30 * 60 * 1000 },
  STOCK: { ttl: 2 * 60 * 1000 },
  MENU: { ttl: 60 * 60 * 1000 },
  COLORS: { ttl: 24 * 60 * 60 * 1000 },
  FIREBASE_PRODUCTS: { ttl: 30 * 60 * 1000 },
  FIREBASE_MENU: { ttl: 60 * 60 * 1000 },
  FIREBASE_CATEGORIES: { ttl: 60 * 60 * 1000 },
  FIREBASE_USERS: { ttl: 15 * 60 * 1000 },
  FIREBASE_QUOTES: { ttl: 5 * 60 * 1000 },
  FIREBASE_COLORS: { ttl: 24 * 60 * 60 * 1000 },
  FIREBASE_MAINTENANCE: { ttl: 5 * 60 * 1000 },
};

export default cacheService;
