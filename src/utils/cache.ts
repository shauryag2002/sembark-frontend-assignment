interface CacheEntry<T> {
  data: T
  timestamp: number
  expiresIn: number // milliseconds
}

const CACHE_PREFIX = 'ecommerce_cache_'
const DEFAULT_EXPIRE_TIME = 30 * 60 * 1000 // 30 minutes

class CacheManager {
  private getKey(key: string): string {
    return `${CACHE_PREFIX}${key}`
  }

  set<T>(key: string, data: T, expiresIn: number = DEFAULT_EXPIRE_TIME): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiresIn,
    }
    try {
      localStorage.setItem(this.getKey(key), JSON.stringify(entry))
    } catch (error) {
      console.warn('Failed to write to localStorage:', error)
    }
  }

  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.getKey(key))
      if (!item) return null

      const entry: CacheEntry<T> = JSON.parse(item)
      const now = Date.now()

      // Check if expired
      if (now - entry.timestamp > entry.expiresIn) {
        localStorage.removeItem(this.getKey(key))
        return null
      }

      return entry.data
    } catch (error) {
      console.warn('Failed to read from localStorage:', error)
      return null
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(this.getKey(key))
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error)
    }
  }

  clear(): void {
    try {
      const keys = Object.keys(localStorage)
      keys.forEach((key) => {
        if (key.startsWith(CACHE_PREFIX)) {
          localStorage.removeItem(key)
        }
      })
    } catch (error) {
      console.warn('Failed to clear cache:', error)
    }
  }
}

export const cacheManager = new CacheManager()
