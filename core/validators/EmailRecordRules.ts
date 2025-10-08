import type { EmailRecord } from '../models/EmailRecord';
import { EmailProvider } from '../models/EmailProvider';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * EmailRecordRules - Business validation rules for EmailRecord
 */
export class EmailRecordRules {
  /**
   * Validate email address format
   */
  static isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email) && email.length >= 5 && email.length <= 254;
  }

  /**
   * Validate domain format
   */
  static isValidDomain(domain: string): boolean {
    // Must have at least one dot, no protocol, no path
    const regex = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}$/i;
    return regex.test(domain) && domain.length >= 4 && domain.length <= 253;
  }

  /**
   * Normalize domain for consistency
   * Removes protocol, www prefix, and converts to lowercase
   */
  static normalizeDomain(url: string): string {
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      return urlObj.hostname.replace(/^www\./, '').toLowerCase();
    } catch {
      return url.replace(/^www\./, '').toLowerCase();
    }
  }

  /**
   * Validate complete email record
   */
  static validateRecord(record: EmailRecord): ValidationResult {
    const errors: string[] = [];

    if (!this.isValidDomain(record.domain)) {
      errors.push('Invalid domain format');
    }

    if (!this.isValidEmail(record.email)) {
      errors.push('Invalid email format');
    }

    if (!record.provider || !Object.values(EmailProvider).includes(record.provider)) {
      errors.push('Invalid email provider');
    }

    if (record.notes && record.notes.length > 500) {
      errors.push('Notes too long (max 500 characters)');
    }

    if (record.tags && record.tags.length > 10) {
      errors.push('Too many tags (max 10)');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Normalize email address
   */
  static normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  /**
   * Suggest provider based on email domain
   */
  static suggestProvider(email: string): EmailProvider {
    const domain = email.split('@')[1]?.toLowerCase();

    const providerMap: Record<string, EmailProvider> = {
      'gmail.com': EmailProvider.Google,
      'googlemail.com': EmailProvider.Google,
      'outlook.com': EmailProvider.Outlook,
      'hotmail.com': EmailProvider.Outlook,
      'live.com': EmailProvider.Outlook,
      'yahoo.com': EmailProvider.Yahoo,
      'ymail.com': EmailProvider.Yahoo,
      'protonmail.com': EmailProvider.ProtonMail,
      'proton.me': EmailProvider.ProtonMail,
      'pm.me': EmailProvider.ProtonMail,
      'icloud.com': EmailProvider.iCloud,
      'me.com': EmailProvider.iCloud,
      'mac.com': EmailProvider.iCloud,
    };

    return providerMap[domain] || EmailProvider.Custom;
  }
}

