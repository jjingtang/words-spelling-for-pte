// src/lib/audioCache.ts

interface CachedAudio {
    url: string;
    blob?: Blob;
    timestamp: number;
    word: string;
    success: boolean;
  }
  
  interface AudioCacheMetadata {
    version: string;
    lastUpdated: number;
    totalWords: number;
    successfulWords: number;
  }
  
  class AudioCacheManager {
    private dbName = 'WordsSpellingAudioCache';
    private version = 1;
    private storeName = 'audioBlobs';
    private metadataKey = 'audioCacheMetadata';
    private maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
    private db: IDBDatabase | null = null;
  
    async initDB(): Promise<IDBDatabase> {
      if (this.db) return this.db;
  
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.dbName, this.version);
  
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          this.db = request.result;
          resolve(request.result);
        };
  
        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          
          // Create audio blobs store
          if (!db.objectStoreNames.contains(this.storeName)) {
            const store = db.createObjectStore(this.storeName, { keyPath: 'word' });
            store.createIndex('timestamp', 'timestamp', { unique: false });
          }
        };
      });
    }
  
    async storeAudioBlob(word: string, blob: Blob, url: string): Promise<void> {
      const db = await this.initDB();
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
  
      const audioData: CachedAudio = {
        word,
        blob,
        url,
        timestamp: Date.now(),
        success: true
      };
  
      return new Promise((resolve, reject) => {
        const request = store.put(audioData);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }
  
    async getAudioBlob(word: string): Promise<CachedAudio | null> {
      const db = await this.initDB();
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
  
      return new Promise((resolve, reject) => {
        const request = store.get(word);
        request.onsuccess = () => {
          const result = request.result;
          if (result && this.isValidCache(result.timestamp)) {
            resolve(result);
          } else {
            resolve(null);
          }
        };
        request.onerror = () => reject(request.error);
      });
    }
  
    async getCachedAudioUrl(word: string): Promise<string | null> {
      try {
        const cached = await this.getAudioBlob(word);
        if (cached?.blob) {
          return URL.createObjectURL(cached.blob);
        }
      } catch (error) {
        console.warn('Failed to get cached audio:', error);
      }
      return null;
    }
  
    async storeMetadata(metadata: AudioCacheMetadata): Promise<void> {
      try {
        sessionStorage.setItem(this.metadataKey, JSON.stringify(metadata));
      } catch (error) {
        console.warn('Failed to store cache metadata:', error);
      }
    }
  
    getMetadata(): AudioCacheMetadata | null {
      try {
        const stored = sessionStorage.getItem(this.metadataKey);
        return stored ? JSON.parse(stored) : null;
      } catch (error) {
        console.warn('Failed to get cache metadata:', error);
        return null;
      }
    }
  
    async clearExpiredCache(): Promise<void> {
      const db = await this.initDB();
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const index = store.index('timestamp');
  
      const cutoffTime = Date.now() - this.maxAge;
      const range = IDBKeyRange.upperBound(cutoffTime);
  
      return new Promise((resolve, reject) => {
        const request = index.openCursor(range);
        request.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest).result;
          if (cursor) {
            cursor.delete();
            cursor.continue();
          } else {
            resolve();
          }
        };
        request.onerror = () => reject(request.error);
      });
    }
  
    async getStorageUsage(): Promise<{ used: number; quota: number }> {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        return {
          used: estimate.usage || 0,
          quota: estimate.quota || 0
        };
      }
      return { used: 0, quota: 0 };
    }
  
    private isValidCache(timestamp: number): boolean {
      return Date.now() - timestamp < this.maxAge;
    }
  
    async clearAllCache(): Promise<void> {
      const db = await this.initDB();
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
  
      return new Promise((resolve, reject) => {
        const request = store.clear();
        request.onsuccess = () => {
          sessionStorage.removeItem(this.metadataKey);
          resolve();
        };
        request.onerror = () => reject(request.error);
      });
    }
  }
  
  export const audioCacheManager = new AudioCacheManager();