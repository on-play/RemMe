import type { EmailProvider } from './EmailProvider';

/**
 * EmailRecord - Core domain entity
 * Represents a mapping of email address to website domain
 */
export interface EmailRecord {
  /** Primary key - normalized domain (e.g., "github.com") */
  domain: string;

  /** Email address used for this domain */
  email: string;

  /** Email provider (Google, Outlook, etc.) */
  provider: EmailProvider;

  /** ISO 8601 timestamp when record was created */
  dateAdded: string;

  /** ISO 8601 timestamp when record was last verified (optional) */
  lastVerified?: string;

  /** ISO 8601 timestamp when popup was last opened for this domain (optional) */
  lastUsed?: string;

  /** Optional user notes (e.g., "Work account", "Newsletter email") */
  notes?: string;

  /** Optional tags for future filtering (e.g., ["work", "important"]) */
  tags?: string[];
}

/**
 * DomainStats - Aggregate statistics
 */
export interface DomainStats {
  totalRecords: number;
  uniqueEmails: number;
  providerBreakdown: Record<string, number>;
  oldestRecord: string;
  newestRecord: string;
  mostUsedEmail: string;
}

/**
 * SearchResult - Enhanced search result with relevance scoring
 */
export interface SearchResult extends EmailRecord {
  matchScore: number;
  matchedField: 'domain' | 'email' | 'notes';
}

