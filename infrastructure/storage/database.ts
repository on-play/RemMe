import Dexie, { type Table } from 'dexie';
import type { EmailRecord } from '../../core/models';

/**
 * EmailTrackerDatabase
 * IndexedDB database using Dexie.js wrapper
 */
export class EmailTrackerDatabase extends Dexie {
  emails!: Table<EmailRecord, string>;

  constructor() {
    super('RemMeDB');

    this.version(1).stores({
      // Primary key: domain
      // Indexes: email, provider, dateAdded, lastUsed
      emails: 'domain, email, provider, dateAdded, lastUsed',
    });
  }

  /**
   * Clear all data
   */
  async clearAll(): Promise<void> {
    await this.emails.clear();
  }

  /**
   * Get database size estimate
   */
  async getSize(): Promise<number> {
    if (navigator.storage && navigator.storage.estimate) {
      const estimate = await navigator.storage.estimate();
      return estimate.usage || 0;
    }
    return 0;
  }

  /**
   * Check if persistent storage is granted
   */
  async isPersistent(): Promise<boolean> {
    if (navigator.storage && navigator.storage.persisted) {
      return await navigator.storage.persisted();
    }
    return false;
  }

  /**
   * Request persistent storage permission
   */
  async requestPersistentStorage(): Promise<boolean> {
    if (navigator.storage && navigator.storage.persist) {
      return await navigator.storage.persist();
    }
    return false;
  }
}

// Singleton instance
export const db = new EmailTrackerDatabase();

// Request persistent storage on initialization (browser environment only)
if (typeof window !== 'undefined') {
  db.requestPersistentStorage()
    .then((granted) => {
      console.log(`[RemMe] Persistent storage: ${granted ? 'granted' : 'denied'}`);
    })
    .catch((error) => {
      console.error('[RemMe] Failed to request persistent storage:', error);
    });
}

