import { db } from '../../infrastructure/storage/database';
import type { EmailRecord, DomainStats } from '../models';

/**
 * EmailRepository
 * Storage abstraction for EmailRecord entities
 */
export class EmailRepository {
  /**
   * Save or update an email record
   */
  async save(record: EmailRecord): Promise<void> {
    await db.emails.put(record);

    // Backup to chrome.storage.local for redundancy
    await this.backupToChrome(record);
  }

  /**
   * Get email record by domain
   */
  async getByDomain(domain: string): Promise<EmailRecord | undefined> {
    return await db.emails.get(domain);
  }

  /**
   * Get all email records
   */
  async getAll(): Promise<EmailRecord[]> {
    return await db.emails.toArray();
  }

  /**
   * Find records by email address
   */
  async findByEmail(email: string): Promise<EmailRecord[]> {
    return await db.emails.where('email').equals(email).toArray();
  }

  /**
   * Delete email record by domain
   */
  async delete(domain: string): Promise<void> {
    await db.emails.delete(domain);

    // Also remove from chrome.storage backup
    await this.deleteFromChromeBackup(domain);
  }

  /**
   * Get statistics
   */
  async getStats(): Promise<DomainStats> {
    const records = await this.getAll();

    const uniqueEmails = new Set(records.map((r) => r.email));
    const providerBreakdown: Record<string, number> = {};

    records.forEach((r) => {
      providerBreakdown[r.provider] = (providerBreakdown[r.provider] || 0) + 1;
    });

    const dates = records
      .map((r) => new Date(r.dateAdded))
      .sort((a, b) => a.getTime() - b.getTime());

    const emailCounts: Record<string, number> = {};
    records.forEach((r) => {
      emailCounts[r.email] = (emailCounts[r.email] || 0) + 1;
    });

    let mostUsedEmail = '';
    let maxCount = 0;
    for (const [email, count] of Object.entries(emailCounts)) {
      if (count > maxCount) {
        maxCount = count;
        mostUsedEmail = email;
      }
    }

    return {
      totalRecords: records.length,
      uniqueEmails: uniqueEmails.size,
      providerBreakdown,
      oldestRecord: dates[0]?.toISOString() || '',
      newestRecord: dates[dates.length - 1]?.toISOString() || '',
      mostUsedEmail,
    };
  }

  /**
   * Export all records to JSON
   */
  async exportToJson(): Promise<string> {
    const records = await this.getAll();
    const stats = await this.getStats();

    const exportData = {
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      recordCount: records.length,
      stats,
      records,
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Import records from JSON
   */
  async importFromJson(json: string): Promise<number> {
    try {
      const data = JSON.parse(json);
      const records = Array.isArray(data) ? data : data.records;

      if (!Array.isArray(records)) {
        throw new Error('Invalid format: Expected array of records');
      }

      // Bulk insert (overwrites existing)
      await db.emails.bulkPut(records);

      return records.length;
    } catch (error) {
      console.error('[RemMe] Import failed:', error);
      throw new Error('Failed to import data');
    }
  }

  /**
   * Backup record to chrome.storage.local
   */
  private async backupToChrome(record: EmailRecord): Promise<void> {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        const key = `email_${record.domain}`;
        await chrome.storage.local.set({ [key]: record });
      }
    } catch (error) {
      console.warn('[RemMe] Chrome storage backup failed:', error);
    }
  }

  /**
   * Delete from chrome.storage backup
   */
  private async deleteFromChromeBackup(domain: string): Promise<void> {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        const key = `email_${domain}`;
        await chrome.storage.local.remove(key);
      }
    } catch (error) {
      console.warn('[RemMe] Chrome storage deletion failed:', error);
    }
  }
}

// Singleton instance
export const emailRepository = new EmailRepository();

