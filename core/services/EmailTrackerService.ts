import { emailRepository } from '../repositories';
import { EmailRecordRules } from '../validators';
import type { EmailRecord, EmailProvider } from '../models';

/**
 * EmailTrackerService
 * Main business logic service for email tracking operations
 */
export class EmailTrackerService {
  /**
   * Extract clean domain from any URL
   */
  extractDomain(url: string): string {
    return EmailRecordRules.normalizeDomain(url);
  }

  /**
   * Get current browser tab information
   */
  async getCurrentTab(): Promise<{ url: string; title: string } | null> {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab?.url) return null;

      return {
        url: tab.url,
        title: tab.title || '',
      };
    } catch (error) {
      console.error('[RemMe] Failed to get current tab:', error);
      return null;
    }
  }

  /**
   * Get email record for current browser tab
   */
  async getEmailForCurrentTab(): Promise<EmailRecord | undefined> {
    const tab = await this.getCurrentTab();
    if (!tab) return undefined;

    const domain = this.extractDomain(tab.url);
    return await emailRepository.getByDomain(domain);
  }

  /**
   * Save email for a specific domain
   */
  async saveEmail(
    domain: string,
    email: string,
    provider: EmailProvider,
    notes?: string,
  ): Promise<void> {
    // Normalize and create record
    const record: EmailRecord = {
      domain: this.extractDomain(domain),
      email: EmailRecordRules.normalizeEmail(email),
      provider,
      dateAdded: new Date().toISOString(),
      notes: notes?.trim(),
    };

    // Validate
    const validation = EmailRecordRules.validateRecord(record);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    // Save
    await emailRepository.save(record);
  }

  /**
   * Update existing email record
   */
  async updateEmail(
    domain: string,
    updates: Partial<Omit<EmailRecord, 'domain' | 'dateAdded'>>,
  ): Promise<void> {
    const existing = await emailRepository.getByDomain(domain);
    if (!existing) {
      throw new Error(`No record found for domain: ${domain}`);
    }

    const updated: EmailRecord = {
      ...existing,
      ...updates,
      lastVerified: new Date().toISOString(),
    };

    // Validate updated record
    const validation = EmailRecordRules.validateRecord(updated);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    await emailRepository.save(updated);
  }

  /**
   * Delete email record for a domain
   */
  async deleteEmail(domain: string): Promise<void> {
    await emailRepository.delete(domain);
  }

  /**
   * Search records by query string
   */
  async searchRecords(query: string): Promise<EmailRecord[]> {
    if (!query.trim()) {
      return await emailRepository.getAll();
    }

    const allRecords = await emailRepository.getAll();
    const lowerQuery = query.toLowerCase();

    return allRecords.filter((record) => {
      return (
        record.domain.toLowerCase().includes(lowerQuery) ||
        record.email.toLowerCase().includes(lowerQuery) ||
        record.notes?.toLowerCase().includes(lowerQuery) ||
        record.provider.toLowerCase().includes(lowerQuery)
      );
    });
  }

  /**
   * Find all domains using a specific email
   */
  async findDomainsByEmail(email: string): Promise<string[]> {
    const records = await emailRepository.findByEmail(email);
    return records.map((r) => r.domain);
  }

  /**
   * Get usage statistics
   */
  async getStats() {
    return await emailRepository.getStats();
  }

  /**
   * Export all data to JSON
   */
  async exportData(): Promise<string> {
    return await emailRepository.exportToJson();
  }

  /**
   * Import data from JSON
   */
  async importData(json: string): Promise<number> {
    return await emailRepository.importFromJson(json);
  }

  /**
   * Mark a record as recently used
   */
  async markAsUsed(domain: string): Promise<void> {
    const record = await emailRepository.getByDomain(domain);
    if (record) {
      await emailRepository.save({
        ...record,
        lastUsed: new Date().toISOString(),
      });
    }
  }

  /**
   * Check if a domain has a saved email
   */
  async hasEmail(domain: string): Promise<boolean> {
    const record = await emailRepository.getByDomain(domain);
    return !!record;
  }
}

// Singleton instance
export const emailTrackerService = new EmailTrackerService();

