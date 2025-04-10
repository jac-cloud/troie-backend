export class MemoryCache {
  private static instance: MemoryCache;

  private cache: Map<string, { value: any; expirationTime: number | null }>;

  private constructor() {
    this.cache = new Map();
  }

  public static getInstance(): MemoryCache {
    if (!MemoryCache.instance) {
      MemoryCache.instance = new MemoryCache();
    }
    return MemoryCache.instance;
  }

  public set<T>(key: string, value: T, expiration: number | null = null): void {
    const expirationTime = expiration ? Date.now() + expiration : null;
    this.cache.set(key, { value, expirationTime });
  }

  public get<T>(key: string): T | null {
    const cachedItem = this.cache.get(key);

    if (!cachedItem) {
      return null;
    }

    const { value, expirationTime } = cachedItem;

    if (expirationTime && Date.now() > expirationTime) {
      this.cache.delete(key);
      return null;
    }
    
    return value as T;
  }

  public delete(key: string): void {
    this.cache.delete(key);
  }

  public clear(): void {
    this.cache.clear();
  }
}
