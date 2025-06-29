// 简单的内存缓存机制，防止重复API请求

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

class SimpleCache {
  private cache = new Map<string, CacheItem<any>>();
  private pendingRequests = new Map<string, Promise<any>>();

  // 获取缓存数据
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    // 检查是否过期
    if (Date.now() > item.timestamp + item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  // 设置缓存数据
  set<T>(key: string, data: T, expiry: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiry,
    });
  }

  // 获取或执行请求（防止重复请求）
  async getOrFetch<T>(
    key: string,
    fetcher: () => Promise<T>,
    expiry: number = 5 * 60 * 1000
  ): Promise<T> {
    // 检查缓存
    const cached = this.get<T>(key);
    if (cached !== null) {
      console.log(`从缓存获取数据: ${key}`);
      return cached;
    }

    // 检查是否有正在进行的请求
    const pendingRequest = this.pendingRequests.get(key);
    if (pendingRequest) {
      console.log(`等待正在进行的请求: ${key}`);
      return pendingRequest;
    }

    // 执行新请求
    console.log(`执行新请求: ${key}`);
    const request = fetcher()
      .then((data) => {
        this.set(key, data, expiry);
        this.pendingRequests.delete(key);
        return data;
      })
      .catch((error) => {
        this.pendingRequests.delete(key);
        throw error;
      });

    this.pendingRequests.set(key, request);
    return request;
  }

  // 清除缓存
  clear(): void {
    this.cache.clear();
    this.pendingRequests.clear();
  }

  // 删除特定缓存
  delete(key: string): void {
    this.cache.delete(key);
    this.pendingRequests.delete(key);
  }
}

// 导出单例实例
export const cache = new SimpleCache();
