# Email tracking browser extension

## Prompt:
10/8/2025, 1:38:16 PM

Let's build the extension with WXT. Write comprehensive project docuemtion, that helps AI coding agent build the extension form end-goal approach.



## Response:
10/8/2025, 1:40:17 PM

# Email Tracker Browser Extension - Comprehensive Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [End Goal & Success Criteria](#end-goal--success-criteria)
3. [Architecture & Technical Design](#architecture--technical-design)
4. [Domain Model](#domain-model)
5. [User Flows & Use Cases](#user-flows--use-cases)
6. [Implementation Roadmap](#implementation-roadmap)
7. [File Structure](#file-structure)
8. [Component Specifications](#component-specifications)
9. [Core Services & Business Logic](#core-services--business-logic)
10. [Storage Layer](#storage-layer)
11. [Testing Strategy](#testing-strategy)
12. [Performance Requirements](#performance-requirements)
13. [Security & Privacy](#security--privacy)
14. [Build & Deployment](#build--deployment)

---

## 1. Project Overview

### Vision
A privacy-first browser extension that remembers which email address you used to sign up for each website, eliminating the frustration of "which email did I use here?"

### Core Problem
Users have multiple email addresses (personal, work, throwaway) and frequently forget which one they used to register on specific websites, leading to failed login attempts and password reset loops.

### Solution
A lightweight Chromium browser extension that:
- Tracks email-to-domain mappings locally
- Shows which email you used when visiting a site
- Provides search across all your mappings
- Exports/imports data for backup
- Works completely offline with zero external dependencies

---

## 2. End Goal & Success Criteria

### Primary Success Metrics
```typescript
interface SuccessMetrics {
  // User Experience
  timeToFindEmail: '<3 seconds',        // From click to seeing saved email
  popupLoadTime: '<500ms',               // Popup opens instantly
  saveOperationTime: '<100ms',           // Saving feels instant
  
  // Technical Performance
  bundleSize: '<150KB',                  // Lightweight download
  memoryFootprint: '<50MB',              // Minimal RAM usage
  storageEfficiency: '100 records <100KB', // Efficient storage
  
  // Reliability
  dataIntegrity: '100%',                 // No data loss
  crashRate: '0%',                       // No crashes
  
  // Privacy
  externalNetworkCalls: '0',             // Completely local
  dataCollection: 'none',                // Zero telemetry
}
```

### User Success Scenario
```
User installs extension
→ Visits github.com
→ Clicks extension icon
→ Sees "No email saved for github.com"
→ Enters "work@company.com"
→ Clicks Save
→ Confirmation appears
→ 6 months later...
→ Visits github.com, forgot which email
→ Clicks extension icon
→ Instantly sees "You used: work@company.com"
→ Successfully logs in
✅ SUCCESS
```

---

## 3. Architecture & Technical Design

### Tech Stack
```typescript
const techStack = {
  framework: 'WXT (Vite + Extension APIs)',
  frontend: 'Vue 3 (Composition API)',
  language: 'TypeScript',
  styling: 'Tailwind CSS',
  storage: 'IndexedDB (via Dexie.js)',
  backup: 'chrome.storage.local',
  build: 'Vite',
  testing: 'Vitest + Playwright'
}
```

### Architectural Patterns
```typescript
// Clean Architecture Layers
interface Architecture {
  presentation: 'Vue Components + Composables',
  application: 'Services (Business Logic)',
  domain: 'Models + Validators + Types',
  infrastructure: 'Repositories (Storage Abstraction)'
}
```

### System Architecture Diagram
```
┌─────────────────────────────────────────────────────────────┐
│                    Browser Extension                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    Popup     │  │   Options    │  │   Content    │      │
│  │   (Vue 3)    │  │    Page      │  │   Script     │      │
│  │              │  │   (Vue 3)    │  │  (Optional)  │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │               │
│         └──────────────────┴──────────────────┘              │
│                            │                                  │
│                   ┌────────▼────────┐                        │
│                   │   Composables   │                        │
│                   │  (useEmailTrack)│                        │
│                   └────────┬────────┘                        │
│                            │                                  │
│                   ┌────────▼────────┐                        │
│                   │    Services     │                        │
│                   │ (Business Logic)│                        │
│                   └────────┬────────┘                        │
│                            │                                  │
│         ┌──────────────────┼──────────────────┐             │
│         │                  │                  │              │
│    ┌────▼─────┐    ┌──────▼──────┐    ┌─────▼─────┐       │
│    │  Domain  │    │ Repositories│    │ Validators│       │
│    │  Models  │    │  (Storage)  │    │           │       │
│    └──────────┘    └──────┬──────┘    └───────────┘       │
│                            │                                  │
│                   ┌────────▼────────┐                        │
│                   │   Storage Layer │                        │
│                   │  - IndexedDB    │                        │
│                   │  - chrome.store │                        │
│                   └─────────────────┘                        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Extension Entry Points
```typescript
interface EntryPoints {
  popup: {
    path: 'entrypoints/popup/main.ts',
    purpose: 'Main user interface - view/add email for current site',
    context: 'Isolated popup window',
    access: ['chrome.tabs', 'chrome.storage', 'IndexedDB']
  },
  
  options: {
    path: 'entrypoints/options/main.ts',
    purpose: 'Full management interface - search, export, bulk operations',
    context: 'Full page (chrome-extension://...)',
    access: ['chrome.storage', 'IndexedDB', 'chrome.downloads']
  },
  
  background: {
    path: 'entrypoints/background.ts',
    purpose: 'Service worker for extension lifecycle',
    context: 'Background service worker',
    access: ['All chrome APIs']
  },
  
  content: {
    path: 'entrypoints/content.ts',
    purpose: 'Optional: Auto-detect email inputs on pages',
    context: 'Injected into web pages',
    access: ['Page DOM', 'Limited chrome APIs'],
    note: 'Phase 2 feature'
  }
}
```

---

## 4. Domain Model

### Core Entity: EmailRecord
```typescript
/**
 * EmailRecord - The fundamental domain entity
 * Represents a single mapping of email address to website domain
 */
export interface EmailRecord {
  // Primary Key - unique identifier
  domain: string;           // e.g., "github.com" (normalized, no www)
  
  // Core Data
  email: string;            // e.g., "john@gmail.com"
  provider: EmailProvider;  // e.g., "Google"
  
  // Metadata
  dateAdded: string;        // ISO 8601 format: "2025-10-08T12:34:56Z"
  lastVerified?: string;    // Optional: last time user confirmed this is correct
  lastUsed?: string;        // Optional: last time popup was opened for this domain
  
  // User Context
  notes?: string;           // Optional: "Work account" or "Use for newsletters"
  tags?: string[];          // Optional: ["work", "important"] for future filtering
}

/**
 * Email Provider - Predefined providers for categorization
 */
export enum EmailProvider {
  Google = 'Google',
  Outlook = 'Outlook',
  Yahoo = 'Yahoo',
  ProtonMail = 'ProtonMail',
  iCloud = 'iCloud',
  Custom = 'Custom'     // For self-hosted or other providers
}

/**
 * Domain Stats - Aggregate statistics for analytics/insights
 */
export interface DomainStats {
  totalRecords: number;
  uniqueEmails: number;
  providerBreakdown: Record<EmailProvider, number>;
  oldestRecord: string;     // ISO date
  newestRecord: string;     // ISO date
  mostUsedEmail: string;    // Email with most domain mappings
}

/**
 * Search Result - Enhanced result with context
 */
export interface SearchResult extends EmailRecord {
  matchScore: number;       // 0-1 relevance score
  matchedField: 'domain' | 'email' | 'notes';
}
```

### Domain Validation Rules
```typescript
/**
 * Business Rules for EmailRecord
 */
export class EmailRecordRules {
  // Email must be valid format
  static isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email) && email.length >= 5 && email.length <= 254;
  }
  
  // Domain must be valid format
  static isValidDomain(domain: string): boolean {
    // Must have at least one dot, no protocol, no path
    const regex = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}$/i;
    return regex.test(domain) && domain.length >= 4 && domain.length <= 253;
  }
  
  // Normalize domain for consistency
  static normalizeDomain(url: string): string {
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      return urlObj.hostname.replace(/^www\./, '').toLowerCase();
    } catch {
      return url.replace(/^www\./, '').toLowerCase();
    }
  }
  
  // Validate complete record
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
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}
```

### Domain Value Objects
```typescript
/**
 * Domain - Value object for website domain
 */
export class Domain {
  private constructor(private readonly value: string) {}
  
  static create(url: string): Domain {
    const normalized = EmailRecordRules.normalizeDomain(url);
    if (!EmailRecordRules.isValidDomain(normalized)) {
      throw new Error(`Invalid domain: ${url}`);
    }
    return new Domain(normalized);
  }
  
  toString(): string {
    return this.value;
  }
  
  equals(other: Domain): boolean {
    return this.value === other.value;
  }
}

/**
 * Email - Value object for email address
 */
export class Email {
  private constructor(private readonly value: string) {}
  
  static create(email: string): Email {
    const normalized = email.trim().toLowerCase();
    if (!EmailRecordRules.isValidEmail(normalized)) {
      throw new Error(`Invalid email: ${email}`);
    }
    return new Email(normalized);
  }
  
  toString(): string {
    return this.value;
  }
  
  getDomain(): string {
    return this.value.split('@')[1];
  }
  
  getLocalPart(): string {
    return this.value.split('@')[0];
  }
}
```

---

## 5. User Flows & Use Cases

### Primary User Flow: Save Email for Current Site
```typescript
/**
 * Use Case 1: Save Email for Current Domain
 * 
 * Actor: User visiting a website
 * Precondition: Extension installed, user on a website
 * Trigger: User clicks extension icon
 * 
 * Main Success Scenario:
 */
interface SaveEmailFlow {
  steps: [
    {
      step: 1,
      action: 'User clicks extension icon in browser toolbar',
      system: 'Popup opens, detects current tab URL',
      ui: 'Shows domain name: "github.com"'
    },
    {
      step: 2,
      action: 'User sees "No email saved" message',
      system: 'Checks IndexedDB for existing record',
      ui: 'Empty state with email input form'
    },
    {
      step: 3,
      action: 'User types email address',
      system: 'Real-time validation as user types',
      ui: 'Shows validation errors (if any) inline'
    },
    {
      step: 4,
      action: 'User selects provider from dropdown',
      system: 'Updates form state',
      ui: 'Provider dropdown shows common options'
    },
    {
      step: 5,
      action: 'User clicks "Save" button',
      system: 'Validates, creates EmailRecord, saves to IndexedDB',
      ui: 'Success message: "✓ Saved work@company.com for github.com"'
    },
    {
      step: 6,
      action: 'Popup auto-closes after 2 seconds',
      system: 'Updates lastUsed timestamp',
      ui: 'Smooth fade out'
    }
  ],
  
  alternativeFlows: {
    '3a': {
      condition: 'Invalid email format',
      action: 'Show error: "Please enter a valid email"',
      recovery: 'User corrects email'
    },
    '4a': {
      condition: 'User cancels',
      action: 'Click outside popup or press Escape',
      result: 'Popup closes without saving'
    },
    '5a': {
      condition: 'Save fails (storage error)',
      action: 'Show error toast',
      recovery: 'Retry save operation'
    }
  }
}
```

### Secondary User Flow: View Saved Email
```typescript
/**
 * Use Case 2: View Saved Email for Current Site
 * 
 * Actor: User visiting a website where they saved an email
 * Trigger: User clicks extension icon
 */
interface ViewEmailFlow {
  steps: [
    {
      step: 1,
      action: 'User clicks extension icon',
      system: 'Popup opens, queries IndexedDB for current domain',
      ui: 'Loading state (< 500ms)'
    },
    {
      step: 2,
      action: 'Record found',
      system: 'Retrieves EmailRecord from storage',
      ui: 'Shows saved email prominently with provider icon'
    },
    {
      step: 3,
      action: 'User views email',
      system: 'Updates lastUsed timestamp',
      ui: `
        ✓ You used: work@company.com (Google)
        Added: Oct 8, 2025
        [Edit] [Delete] [Copy Email]
      `
    }
  ],
  
  quickActions: {
    copyEmail: 'One-click copy email to clipboard',
    edit: 'Open edit form inline',
    delete: 'Confirm and remove record'
  }
}
```

### Tertiary User Flow: Search All Records
```typescript
/**
 * Use Case 3: Search All Email Mappings
 * 
 * Actor: User wants to find where they used a specific email
 * Context: Options page (full interface)
 * Trigger: User opens options page and uses search
 */
interface SearchFlow {
  steps: [
    {
      step: 1,
      action: 'User right-clicks extension → Options',
      system: 'Opens options page in new tab',
      ui: 'Full-page interface with search bar and list'
    },
    {
      step: 2,
      action: 'User types in search: "work@"',
      system: 'Debounced search (300ms), queries IndexedDB',
      ui: 'Live filtering of results as user types'
    },
    {
      step: 3,
      action: 'Results displayed',
      system: 'Searches domain, email, notes fields',
      ui: `
        Found 12 sites using "work@company.com":
        - github.com
        - stackoverflow.com
        - linkedin.com
        ...
      `
    },
    {
      step: 4,
      action: 'User clicks on result',
      system: 'Expands details inline',
      ui: 'Shows full record with edit/delete actions'
    }
  ],
  
  searchCapabilities: {
    fields: ['domain', 'email', 'notes'],
    operators: ['contains', 'startsWith', 'equals'],
    sorting: ['dateAdded', 'domain', 'email', 'lastUsed']
  }
}
```

### Quaternary User Flow: Export/Import Data
```typescript
/**
 * Use Case 4: Backup and Restore Data
 * 
 * Actor: User wants to backup their data or move to new device
 * Context: Options page
 */
interface BackupFlow {
  export: {
    steps: [
      {
        step: 1,
        action: 'User clicks "Export Data" button',
        system: 'Retrieves all records from IndexedDB',
        ui: 'Shows progress indicator'
      },
      {
        step: 2,
        action: 'System generates JSON file',
        system: 'Serializes all EmailRecords with metadata',
        format: {
          version: '1.0',
          exportDate: 'ISO 8601',
          recordCount: 'number',
          records: 'EmailRecord[]'
        }
      },
      {
        step: 3,
        action: 'Browser download dialog opens',
        system: 'chrome.downloads.download()',
        filename: 'email-tracker-backup-2025-10-08.json'
      }
    ]
  },
  
  import: {
    steps: [
      {
        step: 1,
        action: 'User clicks "Import Data" button',
        system: 'Opens file picker',
        ui: 'Accept only .json files'
      },
      {
        step: 2,
        action: 'User selects backup file',
        system: 'Reads and validates JSON structure',
        validation: ['Check version', 'Validate each record', 'Check duplicates']
      },
      {
        step: 3,
        action: 'System shows preview',
        system: 'Displays what will be imported',
        ui: `
          Found 45 records
          - 5 new domains
          - 40 existing domains (will be updated)
          [Cancel] [Import]
        `
      },
      {
        step: 4,
        action: 'User confirms import',
        system: 'Bulk insert/update to IndexedDB',
        ui: 'Progress bar → Success message'
      }
    ],
    
    conflictResolution: {
      strategy: 'Imported data overwrites existing',
      option: 'User can choose merge strategy in future'
    }
  }
}
```

---

## 6. Implementation Roadmap

### Phase 1: MVP (Minimum Viable Product)
**Goal**: Basic functionality - save, view, search emails
**Timeline**: Sprint 1-2

```typescript
interface Phase1Features {
  core: [
    'Save email for current domain (popup)',
    'View saved email for current domain (popup)',
    'Domain extraction from current tab URL',
    'IndexedDB storage with Dexie.js',
    'Basic validation (email format, domain format)'
  ],
  
  ui: [
    'Popup interface (Vue 3 + Tailwind)',
    'Empty state when no email saved',
    'Success/error feedback',
    'Basic styling and branding'
  ],
  
  data: [
    'EmailRecord domain model',
    'EmailRepository with CRUD operations',
    'EmailTrackerService business logic'
  ],
  
  deliverable: 'Working extension that saves and retrieves emails'
}
```

**Phase 1 Implementation Order:**
```typescript
const phase1Order = [
  {
    task: 'Project Setup',
    subtasks: [
      '1. Initialize WXT project with Vue 3',
      '2. Configure TypeScript + Tailwind',
      '3. Set up folder structure',
      '4. Install dependencies (Dexie, etc.)'
    ],
    timeEstimate: '2 hours'
  },
  {
    task: 'Domain Layer',
    subtasks: [
      '1. Create EmailRecord interface',
      '2. Create EmailProvider enum',
      '3. Implement validation rules',
      '4. Write domain unit tests'
    ],
    timeEstimate: '3 hours'
  },
  {
    task: 'Storage Layer',
    subtasks: [
      '1. Set up Dexie.js database schema',
      '2. Create EmailRepository class',
      '3. Implement save/get/getAll methods',
      '4. Test storage operations'
    ],
    timeEstimate: '4 hours'
  },
  {
    task: 'Service Layer',
    subtasks: [
      '1. Create EmailTrackerService',
      '2. Implement domain extraction logic',
      '3. Implement save email workflow',
      '4. Implement get email workflow'
    ],
    timeEstimate: '3 hours'
  },
  {
    task: 'Popup UI',
    subtasks: [
      '1. Create Popup.vue component',
      '2. Create useEmailTracker composable',
      '3. Implement empty state',
      '4. Implement save form',
      '5. Implement view state',
      '6. Add loading states'
    ],
    timeEstimate: '6 hours'
  },
  {
    task: 'Testing & Polish',
    subtasks: [
      '1. Manual testing all flows',
      '2. Fix bugs',
      '3. Add error handling',
      '4. Optimize performance'
    ],
    timeEstimate: '4 hours'
  }
];

// Total Phase 1: ~22 hours of focused work
```

### Phase 2: Enhanced Features
**Goal**: Full management interface, export/import, search
**Timeline**: Sprint 3-4

```typescript
interface Phase2Features {
  features: [
    'Options page with full list view',
    'Search across all records',
    'Edit existing records',
    'Delete records with confirmation',
    'Export data to JSON',
    'Import data from JSON',
    'Bulk operations (delete multiple)',
    'Statistics dashboard'
  ],
  
  improvements: [
    'Better error messages',
    'Keyboard shortcuts',
    'Dark mode support',
    'Accessibility (a11y) enhancements'
  ]
}
```

### Phase 3: Advanced Features (Future)
**Goal**: Power user features, automation
**Timeline**: Sprint 5+

```typescript
interface Phase3Features {
  advanced: [
    'Auto-detect email on login forms (content script)',
    'Suggest email based on domain pattern',
    'Email aliases support (+ addressing)',
    'Tags and categories',
    'Sync across devices (chrome.storage.sync)',
    'Browser action badge with record count',
    'Context menu integration',
    'Keyboard shortcut to open popup'
  ],
  
  optional: [
    'Optional encryption for export',
    'Cloud backup (user-provided storage)',
    'Multiple email accounts per domain',
    'Integration with password managers'
  ]
}
```

---

## 7. File Structure

### Complete Project Structure
```
email-tracker/
├── .github/
│   └── workflows/
│       └── ci.yml                    # CI/CD pipeline
│
├── entrypoints/                      # WXT entry points
│   ├── popup/
│   │   ├── App.vue                   # Main popup component
│   │   ├── main.ts                   # Popup entry point
│   │   └── style.css                 # Popup-specific styles
│   │
│   ├── options/
│   │   ├── App.vue                   # Options page component
│   │   ├── main.ts                   # Options entry point
│   │   └── style.css                 # Options-specific styles
│   │
│   ├── background.ts                 # Background service worker
│   │
│   └── content.ts                    # Content script (Phase 3)
│
├── components/                       # Shared Vue components
│   ├── common/
│   │   ├── Button.vue                # Reusable button component
│   │   ├── Input.vue                 # Reusable input component
│   │   ├── Select.vue                # Reusable select component
│   │   ├── Toast.vue                 # Toast notification
│   │   └── Modal.vue                 # Modal dialog
│   │
│   ├── email/
│   │   ├── EmailForm.vue             # Form to add/edit email
│   │   ├── EmailCard.vue             # Display email record
│   │   ├── EmailList.vue             # List of email records
│   │   └── EmptyState.vue            # No records state
│   │
│   └── layout/
│       ├── Header.vue                # Page header
│       └── Footer.vue                # Page footer
│
├── composables/                      # Vue 3 composables
│   ├── useEmailTracker.ts            # Main email tracking logic
│   ├── useCurrentTab.ts              # Get current tab info
│   ├── useToast.ts                   # Toast notifications
│   └── useSearch.ts                  # Search functionality
│
├── core/                             # Core domain logic (framework-agnostic)
│   ├── models/
│   │   ├── EmailRecord.ts            # EmailRecord interface
│   │   ├── EmailProvider.ts          # EmailProvider enum
│   │   ├── DomainStats.ts            # Statistics model
│   │   └── index.ts                  # Barrel export
│   │
│   ├── validators/
│   │   ├── EmailRecordRules.ts       # Validation rules
│   │   ├── DomainValidator.ts        # Domain validation
│   │   ├── EmailValidator.ts         # Email validation
│   │   └── index.ts                  # Barrel export
│   │
│   ├── services/
│   │   ├── EmailTrackerService.ts    # Main business logic
│   │   ├── DomainExtractor.ts        # Extract domain from URL
│   │   ├── ExportService.ts          # Export functionality
│   │   ├── ImportService.ts          # Import functionality
│   │   └── index.ts                  # Barrel export
│   │
│   └── repositories/
│       ├── EmailRepository.ts        # Storage abstraction
│       ├── interfaces/
│       │   └── IEmailRepository.ts   # Repository interface
│       └── index.ts                  # Barrel export
│
├── infrastructure/                   # External dependencies
│   ├── storage/
│   │   ├── database.ts               # Dexie.js setup
│   │   ├── indexeddb.ts              # IndexedDB wrapper
│   │   └── chrome-storage.ts        # Chrome storage wrapper
│   │
│   └── chrome/
│       ├── tabs.ts                   # Chrome tabs API wrapper
│       ├── downloads.ts              # Chrome downloads wrapper
│       └── storage.ts                # Chrome storage helpers
│
├── utils/                            # Utility functions
│   ├── date.ts                       # Date formatting
│   ├── string.ts                     # String utilities
│   ├── performance.ts                # Memoization, debounce
│   └── constants.ts                  # App constants
│
├── types/                            # TypeScript types
│   ├── global.d.ts                   # Global type declarations
│   ├── chrome.d.ts                   # Chrome API types
│   └── index.ts                      # Barrel export
│
├── assets/                           # Static assets
│   ├── icons/
│   │   ├── icon-16.png
│   │   ├── icon-48.png
│   │   ├── icon-128.png
│   │   └── providers/                # Email provider icons
│   │       ├── google.svg
│   │       ├── outlook.svg
│   │       └── ...
│   │
│   └── styles/
│       └── global.css                # Global styles
│
├── tests/                            # Test files
│   ├── unit/
│   │   ├── models/
│   │   ├── validators/
│   │   ├── services/
│   │   └── repositories/
│   │
│   ├── integration/
│   │   └── storage/
│   │
│   └── e2e/
│       └── popup.spec.ts
│
├── .env.example                      # Environment variables template
├── .eslintrc.js                      # ESLint config
├── .gitignore                        # Git ignore rules
├── .prettierrc                       # Prettier config
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript config
├── tailwind.config.js                # Tailwind config
├── vite.config.ts                    # Vite config (if needed)
├── wxt.config.ts                     # WXT config
├── vitest.config.ts                  # Vitest config
├── README.md                         # Project README
└── CONTRIBUTING.md                   # Contribution guidelines
```

### Key File Purposes

#### Configuration Files
```typescript
// wxt.config.ts - Main WXT configuration
export default defineConfig({
  modules: ['@wxt-dev/module-vue'],
  manifest: {
    name: 'Email Tracker',
    description: 'Remember which email you used for each website',
    version: '1.0.0',
    permissions: ['storage', 'tabs', 'activeTab'],
    action: {
      default_popup: 'popup.html',
      default_icon: {
        16: '/icon-16.png',
        48: '/icon-48.png',
        128: '/icon-128.png'
      }
    }
  }
});

// tailwind.config.js - Tailwind CSS configuration
export default {
  content: [
    './entrypoints/**/*.{vue,ts}',
    './components/**/*.vue'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',    // Blue
        success: '#10B981',    // Green
        danger: '#EF4444',     // Red
        warning: '#F59E0B'     // Orange
      }
    }
  },
  plugins: []
};

// tsconfig.json - TypeScript configuration
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "strict": true,



## Prompt:
10/8/2025, 1:40:39 PM

Continue



## Response:
10/8/2025, 1:42:14 PM

```json
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "paths": {
      "@/*": ["./src/*"],
      "@core/*": ["./core/*"],
      "@components/*": ["./components/*"],
      "@composables/*": ["./composables/*"],
      "@utils/*": ["./utils/*"]
    }
  },
  "include": [
    "entrypoints/**/*",
    "components/**/*",
    "composables/**/*",
    "core/**/*",
    "utils/**/*",
    "types/**/*"
  ],
  "exclude": ["node_modules", "dist"]
}
```

---

## 8. Component Specifications

### Popup Components

#### 8.1 Popup App.vue (Main Entry)
```vue
<!-- entrypoints/popup/App.vue -->
<script setup lang="ts">
import { onMounted } from 'vue';
import { useEmailTracker } from '@/composables/useEmailTracker';
import EmailCard from '@/components/email/EmailCard.vue';
import EmailForm from '@/components/email/EmailForm.vue';
import EmptyState from '@/components/email/EmptyState.vue';

const {
  currentRecord,
  currentDomain,
  loading,
  error,
  hasEmail,
  loadCurrentTab,
  saveEmail,
  updateEmail,
  deleteEmail
} = useEmailTracker();

onMounted(async () => {
  await loadCurrentTab();
});
</script>

<template>
  <div class="w-[400px] min-h-[300px] p-4 bg-white dark:bg-gray-900">
    <!-- Header -->
    <header class="mb-4 flex items-center justify-between">
      <h1 class="text-xl font-bold text-gray-900 dark:text-white">
        Email Tracker
      </h1>
      <button
        @click="openOptions"
        class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        title="Open settings"
      >
        <IconSettings class="w-5 h-5" />
      </button>
    </header>

    <!-- Current Domain Display -->
    <div v-if="currentDomain" class="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
      <p class="text-sm text-gray-600 dark:text-gray-400">Current site:</p>
      <p class="font-medium text-gray-900 dark:text-white">{{ currentDomain }}</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-8">
      <LoadingSpinner />
      <span class="ml-2 text-gray-600">Loading...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
      <p class="text-red-600 dark:text-red-400">{{ error }}</p>
    </div>

    <!-- Email Exists: Show Card -->
    <EmailCard
      v-else-if="hasEmail"
      :record="currentRecord!"
      @edit="onEdit"
      @delete="onDelete"
      @copy="onCopy"
    />

    <!-- No Email: Show Form -->
    <EmptyState
      v-else
      :domain="currentDomain"
      @save="saveEmail"
    />

    <!-- Footer -->
    <footer class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <button
        @click="openOptions"
        class="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
      >
        View all records →
      </button>
    </footer>
  </div>
</template>

<style scoped>
/* Component-specific styles if needed */
</style>
```

**Component Specification:**
```typescript
interface PopupAppSpec {
  purpose: 'Main popup interface for viewing/adding email for current site',
  
  state: {
    currentRecord: 'EmailRecord | undefined',
    currentDomain: 'string',
    loading: 'boolean',
    error: 'string | null',
    hasEmail: 'computed boolean'
  },
  
  lifecycle: {
    onMounted: 'Load current tab and check for existing email record'
  },
  
  interactions: {
    viewEmail: 'Display EmailCard with saved email',
    addEmail: 'Display EmptyState with form to add email',
    editEmail: 'Toggle EmailCard to edit mode',
    deleteEmail: 'Confirm and delete email record',
    copyEmail: 'Copy email to clipboard',
    openOptions: 'Open full options page in new tab'
  },
  
  dimensions: {
    width: '400px',
    minHeight: '300px',
    maxHeight: '600px'
  }
}
```

#### 8.2 EmailCard.vue
```vue
<!-- components/email/EmailCard.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue';
import type { EmailRecord } from '@/core/models';
import { useToast } from '@/composables/useToast';
import { formatDate } from '@/utils/date';

interface Props {
  record: EmailRecord;
  editable?: boolean;
}

interface Emits {
  (e: 'edit', record: EmailRecord): void;
  (e: 'delete', domain: string): void;
  (e: 'copy', email: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  editable: true
});

const emit = defineEmits<Emits>();
const { showToast } = useToast();

const isEditing = ref(false);
const editedNotes = ref(props.record.notes || '');

const providerIcon = computed(() => {
  const icons: Record<string, string> = {
    Google: '/assets/icons/providers/google.svg',
    Outlook: '/assets/icons/providers/outlook.svg',
    Yahoo: '/assets/icons/providers/yahoo.svg',
    ProtonMail: '/assets/icons/providers/protonmail.svg',
    iCloud: '/assets/icons/providers/icloud.svg',
    Custom: '/assets/icons/providers/custom.svg'
  };
  return icons[props.record.provider] || icons.Custom;
});

const formattedDate = computed(() => {
  return formatDate(props.record.dateAdded);
});

const copyEmail = async () => {
  try {
    await navigator.clipboard.writeText(props.record.email);
    showToast('Email copied to clipboard', 'success');
    emit('copy', props.record.email);
  } catch (error) {
    showToast('Failed to copy email', 'error');
  }
};

const handleDelete = () => {
  if (confirm(`Delete email for ${props.record.domain}?`)) {
    emit('delete', props.record.domain);
  }
};

const saveEdit = () => {
  const updated = {
    ...props.record,
    notes: editedNotes.value
  };
  emit('edit', updated);
  isEditing.value = false;
};
</script>

<template>
  <div class="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
    <!-- Success Header -->
    <div class="flex items-start justify-between mb-3">
      <div class="flex items-center space-x-2">
        <div class="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
          <IconCheck class="w-5 h-5 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <p class="text-sm text-gray-600 dark:text-gray-400">You used:</p>
        </div>
      </div>
    </div>

    <!-- Email Display -->
    <div class="mb-4">
      <div class="flex items-center space-x-2 mb-1">
        <img :src="providerIcon" :alt="record.provider" class="w-5 h-5" />
        <p class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ record.email }}
        </p>
      </div>
      <p class="text-xs text-gray-500 dark:text-gray-400">
        {{ record.provider }} • Added {{ formattedDate }}
      </p>
    </div>

    <!-- Notes Section -->
    <div v-if="record.notes || isEditing" class="mb-4">
      <label v-if="isEditing" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Notes
      </label>
      <textarea
        v-if="isEditing"
        v-model="editedNotes"
        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
        rows="2"
        placeholder="Add notes (optional)"
      />
      <p v-else class="text-sm text-gray-600 dark:text-gray-400 italic">
        "{{ record.notes }}"
      </p>
    </div>

    <!-- Actions -->
    <div v-if="editable" class="flex items-center space-x-2">
      <button
        v-if="!isEditing"
        @click="copyEmail"
        class="flex-1 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
      >
        <IconCopy class="inline w-4 h-4 mr-1" />
        Copy Email
      </button>
      
      <button
        v-if="!isEditing"
        @click="isEditing = true"
        class="px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
      >
        <IconEdit class="inline w-4 h-4" />
      </button>
      
      <button
        v-if="!isEditing"
        @click="handleDelete"
        class="px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
      >
        <IconTrash class="inline w-4 h-4" />
      </button>

      <template v-if="isEditing">
        <button
          @click="saveEdit"
          class="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
        >
          Save
        </button>
        <button
          @click="isEditing = false; editedNotes = record.notes || ''"
          class="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
      </template>
    </div>
  </div>
</template>
```

**Component Specification:**
```typescript
interface EmailCardSpec {
  purpose: 'Display existing email record with actions',
  
  props: {
    record: 'EmailRecord (required)',
    editable: 'boolean (default: true)'
  },
  
  emits: {
    edit: '(record: EmailRecord) => void',
    delete: '(domain: string) => void',
    copy: '(email: string) => void'
  },
  
  features: [
    'Display email with provider icon',
    'Show formatted date',
    'Copy email to clipboard',
    'Inline edit mode for notes',
    'Delete with confirmation',
    'Dark mode support'
  ],
  
  interactions: {
    copyButton: 'Copy email to clipboard, show toast',
    editButton: 'Toggle edit mode',
    deleteButton: 'Confirm deletion, emit delete event',
    saveButton: 'Save edited notes, exit edit mode',
    cancelButton: 'Revert changes, exit edit mode'
  }
}
```

#### 8.3 EmptyState.vue
```vue
<!-- components/email/EmptyState.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue';
import { EmailProvider } from '@/core/models';
import { EmailRecordRules } from '@/core/validators';

interface Props {
  domain: string;
}

interface Emits {
  (e: 'save', data: { email: string; provider: EmailProvider; notes?: string }): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const email = ref('');
const provider = ref<EmailProvider>(EmailProvider.Google);
const notes = ref('');
const isSubmitting = ref(false);

const emailError = ref('');
const showForm = ref(false);

const providers = computed(() => {
  return Object.values(EmailProvider).map(p => ({
    value: p,
    label: p,
    icon: `/assets/icons/providers/${p.toLowerCase()}.svg`
  }));
});

const isValidEmail = computed(() => {
  if (!email.value) return null;
  return EmailRecordRules.isValidEmail(email.value);
});

const canSubmit = computed(() => {
  return email.value && isValidEmail.value && !isSubmitting.value;
});

const validateEmail = () => {
  if (!email.value) {
    emailError.value = '';
    return;
  }
  
  if (!EmailRecordRules.isValidEmail(email.value)) {
    emailError.value = 'Please enter a valid email address';
  } else {
    emailError.value = '';
  }
};

const handleSubmit = async () => {
  validateEmail();
  
  if (!canSubmit.value) return;
  
  isSubmitting.value = true;
  
  try {
    emit('save', {
      email: email.value.trim().toLowerCase(),
      provider: provider.value,
      notes: notes.value.trim() || undefined
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="text-center py-8">
    <!-- Empty State Icon -->
    <div v-if="!showForm" class="mb-6">
      <div class="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
        <IconMailQuestion class="w-8 h-8 text-gray-400" />
      </div>
      
      <h3 class="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
        No email saved
      </h3>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Which email did you use for <strong>{{ domain }}</strong>?
      </p>
      
      <button
        @click="showForm = true"
        class="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        Add Email
      </button>
    </div>

    <!-- Add Email Form -->
    <form v-else @submit.prevent="handleSubmit" class="text-left space-y-4">
      <!-- Email Input -->
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Email Address *
        </label>
        <input
          id="email"
          v-model="email"
          type="email"
          placeholder="your@email.com"
          @blur="validateEmail"
          @input="validateEmail"
          class="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          :class="{
            'border-gray-300 dark:border-gray-600': !emailError,
            'border-red-500': emailError
          }"
          autocomplete="email"
          autofocus
        />
        <p v-if="emailError" class="mt-1 text-xs text-red-600 dark:text-red-400">
          {{ emailError }}
        </p>
      </div>

      <!-- Provider Select -->
      <div>
        <label for="provider" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Email Provider *
        </label>
        <select
          id="provider"
          v-model="provider"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option v-for="p in providers" :key="p.value" :value="p.value">
            {{ p.label }}
          </option>
        </select>
      </div>

      <!-- Notes (Optional) -->
      <div>
        <label for="notes" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Notes (optional)
        </label>
        <textarea
          id="notes"
          v-model="notes"
          placeholder="e.g., Work account, Personal, etc."
          rows="2"
          maxlength="500"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {{ notes.length }}/500
        </p>
      </div>

      <!-- Actions -->
      <div class="flex space-x-2 pt-2">
        <button
          type="submit"
          :disabled="!canSubmit"
          class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <LoadingSpinner v-if="isSubmitting" class="inline w-4 h-4 mr-2" />
          {{ isSubmitting ? 'Saving...' : 'Save Email' }}
        </button>
        <button
          type="button"
          @click="showForm = false"
          class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>
```

**Component Specification:**
```typescript
interface EmptyStateSpec {
  purpose: 'Display when no email saved for current domain, provide form to add',
  
  props: {
    domain: 'string (current website domain)'
  },
  
  emits: {
    save: '(data: { email, provider, notes? }) => void'
  },
  
  state: {
    email: 'string (user input)',
    provider: 'EmailProvider (selected)',
    notes: 'string (optional user notes)',
    showForm: 'boolean (toggle between empty state and form)',
    isSubmitting: 'boolean (async state)',
    emailError: 'string (validation error message)'
  },
  
  validation: {
    email: 'Real-time validation on input/blur',
    provider: 'Required, default to Google',
    notes: 'Optional, max 500 characters'
  },
  
  interactions: {
    addEmailButton: 'Show form',
    submitForm: 'Validate, emit save event',
    cancel: 'Hide form, return to empty state'
  }
}
```

### Options Page Components

#### 8.4 Options App.vue
```vue
<!-- entrypoints/options/App.vue -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { emailRepository } from '@/core/repositories';
import { useSearch } from '@/composables/useSearch';
import { useToast } from '@/composables/useToast';
import type { EmailRecord } from '@/core/models';
import EmailList from '@/components/email/EmailList.vue';
import Header from '@/components/layout/Header.vue';

const { showToast } = useToast();

const records = ref<EmailRecord[]>([]);
const loading = ref(true);
const stats = ref({
  total: 0,
  uniqueEmails: 0,
  byProvider: {} as Record<string, number>
});

const {
  searchQuery,
  searchResults,
  isSearching,
  search
} = useSearch();

const displayRecords = computed(() => {
  return searchQuery.value ? searchResults.value : records.value;
});

const loadRecords = async () => {
  loading.value = true;
  try {
    records.value = await emailRepository.getAll();
    stats.value = await emailRepository.getStats();
  } catch (error) {
    showToast('Failed to load records', 'error');
  } finally {
    loading.value = false;
  }
};

const handleSearch = async (query: string) => {
  searchQuery.value = query;
  if (query) {
    await search(query);
  }
};

const handleExport = async () => {
  try {
    const json = await emailRepository.exportToJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const filename = `email-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    
    await chrome.downloads.download({
      url,
      filename,
      saveAs: true
    });
    
    showToast('Data exported successfully', 'success');
  } catch (error) {
    showToast('Failed to export data', 'error');
  }
};

const handleImport = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  
  if (!file) return;
  
  try {
    const text = await file.text();
    const count = await emailRepository.importFromJson(text);
    await loadRecords();
    showToast(`Imported ${count} records`, 'success');
  } catch (error) {
    showToast('Failed to import data', 'error');
  }
};

const handleDelete = async (domain: string) => {
  if (!confirm(`Delete email for ${domain}?`)) return;
  
  try {
    await emailRepository.delete(domain);
    await loadRecords();
    showToast('Record deleted', 'success');
  } catch (error) {
    showToast('Failed to delete record', 'error');
  }
};

const handleBulkDelete = async (domains: string[]) => {
  if (!confirm(`Delete ${domains.length} records?`)) return;
  
  try {
    await Promise.all(domains.map(d => emailRepository.delete(d)));
    await loadRecords();
    showToast(`Deleted ${domains.length} records`, 'success');
  } catch (error) {
    showToast('Failed to delete records', 'error');
  }
};

onMounted(() => {
  loadRecords();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <Header />
    
    <main class="max-w-6xl mx-auto px-4 py-8">
      <!-- Stats Section -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Sites</h3>
          <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {{ stats.total }}
          </p>
        </div>
        
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Unique Emails</h3>
          <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {{ stats.uniqueEmails }}
          </p>
        </div>
        
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Most Used</h3>
          <p class="text-lg font-semibold text-gray-900 dark:text-white mt-2 truncate">
            {{ Object.keys(stats.byProvider)[0] || 'N/A' }}
          </p>
        </div>
      </div>

      <!-- Actions Bar -->
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <!-- Search -->
          <div class="flex-1">
            <input
              type="text"
              :value="searchQuery"
              @input="handleSearch(($event.target as HTMLInputElement).value)"
              placeholder="Search by domain, email, or notes..."
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <!-- Actions -->
          <div class="flex space-x-2">
            <button
              @click="handleExport"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <IconDownload class="inline w-4 h-4 mr-1" />
              Export
            </button>
            
            <label class="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors cursor-pointer">
              <IconUpload class="inline w-4 h-4 mr-1" />
              Import
              <input
                type="file"
                accept=".json"
                @change="handleImport"
                class="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      <!-- Records List -->
      <div v-if="loading" class="text-center py-12">
        <LoadingSpinner class="w-8 h-8 mx-auto" />
        <p class="mt-4 text-gray-600 dark:text-gray-400">Loading records...</p>
      </div>

      <div v-else-if="displayRecords.length === 0" class="text-center py-12">
        <p class="text-gray-600 dark:text-gray-400">
          {{ searchQuery ? 'No results found' : 'No records yet' }}
        </p>
      </div>

      <EmailList
        v-else
        :records="displayRecords"
        @delete="handleDelete"
        @bulkDelete="handleBulkDelete"
      />
    </main>
  </div>
</template>
```

---

## 9. Core Services & Business Logic

### 9.1 EmailTrackerService
```typescript
// core/services/EmailTrackerService.ts

import { emailRepository } from '@/core/repositories';
import { EmailRecordRules } from '@/core/validators';
import type { EmailRecord, EmailProvider } from '@/core/models';

/**
 * EmailTrackerService
 * 
 * Main business logic service for email tracking operations.
 * Orchestrates validation, storage, and retrieval of email records.
 */
export class EmailTrackerService {
  /**
   * Extract clean domain from any URL
   * @param url - Full URL or partial URL
   * @returns Normalized domain (e.g., "github.com")
   */
  extractDomain(url: string): string {
    return EmailRecordRules.normalizeDomain(url);
  }

  /**
   * Get current browser tab information
   * @returns Tab URL and title
   */
  async getCurrentTab(): Promise<{ url: string; title: string } | null> {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
      });
      
      if (!tab?.url) return null;
      
      return {
        url: tab.url,
        title: tab.title || ''
      };
    } catch (error) {
      console.error('Failed to get current tab:', error);
      return null;
    }
  }

  /**
   * Get email record for current browser tab
   * @returns EmailRecord if exists, undefined otherwise
   */
  async getEmailForCurrentTab(): Promise<EmailRecord | undefined> {
    const tab = await this.getCurrentTab();
    if (!tab) return undefined;
    
    const domain = this.extractDomain(tab.url);
    return await emailRepository.getByDomain(domain);
  }

  /**
   * Save email for a specific domain
   * @param domain - Website domain
   * @param email - User's email address
   * @param provider - Email provider
   * @param notes - Optional notes
   * @throws Error if validation fails
   */
  async saveEmail(
    domain: string,
    email: string,
    provider: EmailProvider,
    notes?: string
  ): Promise<void> {
    // Create record
    const record: EmailRecord = {
      domain: this.extractDomain(domain),
      email: email.trim().toLowerCase(),
      provider,
      dateAdded: new Date().toISOString(),
      notes: notes?.trim()
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
   * @param domain - Website domain
   * @param updates - Partial updates to apply
   */
  async updateEmail(
    domain: string,
    updates: Partial<Omit<EmailRecord, 'domain' | 'dateAdded'>>
  ): Promise



## Prompt:
10/8/2025, 1:42:33 PM

Continue



## Response:
10/8/2025, 1:43:47 PM

```typescript
  ): Promise<void> {
    const existing = await emailRepository.getByDomain(domain);
    if (!existing) {
      throw new Error(`No record found for domain: ${domain}`);
    }

    const updated: EmailRecord = {
      ...existing,
      ...updates,
      lastVerified: new Date().toISOString()
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
   * @param domain - Website domain
   */
  async deleteEmail(domain: string): Promise<void> {
    await emailRepository.delete(domain);
  }

  /**
   * Search records by query string
   * Searches across domain, email, and notes fields
   * @param query - Search query
   * @returns Matching records
   */
  async searchRecords(query: string): Promise<EmailRecord[]> {
    if (!query.trim()) {
      return await emailRepository.getAll();
    }

    const allRecords = await emailRepository.getAll();
    const lowerQuery = query.toLowerCase();

    return allRecords.filter(record => {
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
   * @param email - Email address to search for
   * @returns Array of domains
   */
  async findDomainsByEmail(email: string): Promise<string[]> {
    const records = await emailRepository.findByEmail(email);
    return records.map(r => r.domain);
  }

  /**
   * Get usage statistics
   * @returns Statistics about stored records
   */
  async getStats() {
    return await emailRepository.getStats();
  }

  /**
   * Export all data to JSON
   * @returns JSON string of all records
   */
  async exportData(): Promise<string> {
    return await emailRepository.exportToJson();
  }

  /**
   * Import data from JSON
   * @param json - JSON string containing records
   * @returns Number of records imported
   */
  async importData(json: string): Promise<number> {
    return await emailRepository.importFromJson(json);
  }

  /**
   * Mark a record as recently used
   * Updates lastUsed timestamp
   * @param domain - Website domain
   */
  async markAsUsed(domain: string): Promise<void> {
    const record = await emailRepository.getByDomain(domain);
    if (record) {
      await emailRepository.save({
        ...record,
        lastUsed: new Date().toISOString()
      });
    }
  }

  /**
   * Suggest email provider based on email domain
   * @param email - Email address
   * @returns Suggested EmailProvider
   */
  suggestProvider(email: string): EmailProvider {
    const domain = email.split('@')[1]?.toLowerCase();
    
    const providerMap: Record<string, EmailProvider> = {
      'gmail.com': EmailProvider.Google,
      'googlemail.com': EmailProvider.Google,
      'outlook.com': EmailProvider.Outlook,
      'hotmail.com': EmailProvider.Outlook,
      'live.com': EmailProvider.Outlook,
      'yahoo.com': EmailProvider.Yahoo,
      'protonmail.com': EmailProvider.ProtonMail,
      'proton.me': EmailProvider.ProtonMail,
      'icloud.com': EmailProvider.iCloud,
      'me.com': EmailProvider.iCloud
    };

    return providerMap[domain] || EmailProvider.Custom;
  }

  /**
   * Bulk delete records
   * @param domains - Array of domains to delete
   */
  async bulkDelete(domains: string[]): Promise<void> {
    await Promise.all(domains.map(d => emailRepository.delete(d)));
  }

  /**
   * Check if a domain has a saved email
   * @param domain - Website domain
   * @returns true if email exists
   */
  async hasEmail(domain: string): Promise<boolean> {
    const record = await emailRepository.getByDomain(domain);
    return !!record;
  }
}

// Singleton instance
export const emailTrackerService = new EmailTrackerService();
```

### 9.2 DomainExtractor
```typescript
// core/services/DomainExtractor.ts

/**
 * DomainExtractor
 * 
 * Utility service for extracting and normalizing domains from URLs
 */
export class DomainExtractor {
  /**
   * Extract domain from URL with extensive error handling
   * @param input - URL string (full or partial)
   * @returns Normalized domain or empty string
   */
  static extract(input: string): string {
    if (!input) return '';

    try {
      // Try parsing as URL
      let url: URL;
      
      // Add protocol if missing
      if (!input.startsWith('http://') && !input.startsWith('https://')) {
        url = new URL(`https://${input}`);
      } else {
        url = new URL(input);
      }

      const hostname = url.hostname;
      
      // Remove www. prefix
      const domain = hostname.replace(/^www\./, '');
      
      // Validate domain structure
      if (this.isValidDomain(domain)) {
        return domain.toLowerCase();
      }

      return '';
    } catch (error) {
      // Fallback: try to extract domain manually
      return this.manualExtract(input);
    }
  }

  /**
   * Manual domain extraction for edge cases
   * @param input - Input string
   * @returns Extracted domain or empty string
   */
  private static manualExtract(input: string): string {
    // Remove protocol
    let cleaned = input.replace(/^https?:\/\//, '');
    
    // Remove www.
    cleaned = cleaned.replace(/^www\./, '');
    
    // Remove path and query
    cleaned = cleaned.split('/')[0];
    cleaned = cleaned.split('?')[0];
    cleaned = cleaned.split('#')[0];
    
    // Remove port
    cleaned = cleaned.split(':')[0];

    if (this.isValidDomain(cleaned)) {
      return cleaned.toLowerCase();
    }

    return '';
  }

  /**
   * Validate domain format
   * @param domain - Domain string
   * @returns true if valid
   */
  private static isValidDomain(domain: string): boolean {
    // Must have at least one dot
    if (!domain.includes('.')) return false;
    
    // Must not have spaces
    if (domain.includes(' ')) return false;
    
    // Must not start or end with dot
    if (domain.startsWith('.') || domain.endsWith('.')) return false;
    
    // Basic format check
    const regex = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}$/i;
    return regex.test(domain);
  }

  /**
   * Get root domain from subdomain
   * e.g., "mail.google.com" -> "google.com"
   * @param domain - Full domain
   * @returns Root domain
   */
  static getRootDomain(domain: string): string {
    const parts = domain.split('.');
    
    // Handle special TLDs (e.g., .co.uk)
    if (parts.length > 2 && this.isSpecialTLD(parts.slice(-2).join('.'))) {
      return parts.slice(-3).join('.');
    }
    
    // Standard case: return last two parts
    if (parts.length >= 2) {
      return parts.slice(-2).join('.');
    }
    
    return domain;
  }

  /**
   * Check if TLD is a special two-part TLD
   * @param tld - Top-level domain
   * @returns true if special TLD
   */
  private static isSpecialTLD(tld: string): boolean {
    const specialTLDs = [
      'co.uk', 'co.jp', 'co.in', 'co.nz', 'co.za',
      'com.au', 'com.br', 'com.mx', 'com.ar',
      'ac.uk', 'gov.uk'
    ];
    return specialTLDs.includes(tld);
  }

  /**
   * Normalize URL for storage
   * Removes protocol, www, and trailing slashes
   * @param url - Input URL
   * @returns Normalized domain
   */
  static normalize(url: string): string {
    return this.extract(url);
  }

  /**
   * Check if input looks like a valid URL
   * @param input - Input string
   * @returns true if looks like URL
   */
  static looksLikeURL(input: string): boolean {
    return (
      input.startsWith('http://') ||
      input.startsWith('https://') ||
      /^[a-z0-9\-]+\.[a-z]{2,}/i.test(input)
    );
  }
}
```

### 9.3 ExportService
```typescript
// core/services/ExportService.ts

import type { EmailRecord, DomainStats } from '@/core/models';

interface ExportData {
  version: string;
  exportDate: string;
  recordCount: number;
  stats: DomainStats;
  records: EmailRecord[];
}

/**
 * ExportService
 * 
 * Handles data export/backup functionality
 */
export class ExportService {
  private static readonly VERSION = '1.0.0';

  /**
   * Export records to JSON format
   * @param records - Array of email records
   * @param stats - Optional statistics
   * @returns JSON string
   */
  static toJSON(records: EmailRecord[], stats?: DomainStats): string {
    const exportData: ExportData = {
      version: this.VERSION,
      exportDate: new Date().toISOString(),
      recordCount: records.length,
      stats: stats || this.calculateStats(records),
      records
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Export records to CSV format
   * @param records - Array of email records
   * @returns CSV string
   */
  static toCSV(records: EmailRecord[]): string {
    const headers = ['Domain', 'Email', 'Provider', 'Date Added', 'Notes'];
    const rows = records.map(r => [
      r.domain,
      r.email,
      r.provider,
      r.dateAdded,
      r.notes || ''
    ]);

    const csvRows = [
      headers.join(','),
      ...rows.map(row => 
        row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')
      )
    ];

    return csvRows.join('\n');
  }

  /**
   * Create downloadable blob from JSON
   * @param records - Array of email records
   * @param stats - Optional statistics
   * @returns Blob object
   */
  static createJSONBlob(records: EmailRecord[], stats?: DomainStats): Blob {
    const json = this.toJSON(records, stats);
    return new Blob([json], { type: 'application/json' });
  }

  /**
   * Create downloadable blob from CSV
   * @param records - Array of email records
   * @returns Blob object
   */
  static createCSVBlob(records: EmailRecord[]): Blob {
    const csv = this.toCSV(records);
    return new Blob([csv], { type: 'text/csv' });
  }

  /**
   * Generate filename for export
   * @param format - File format (json or csv)
   * @returns Filename string
   */
  static generateFilename(format: 'json' | 'csv' = 'json'): string {
    const date = new Date().toISOString().split('T')[0];
    return `email-tracker-backup-${date}.${format}`;
  }

  /**
   * Calculate statistics from records
   * @param records - Array of email records
   * @returns Domain statistics
   */
  private static calculateStats(records: EmailRecord[]): DomainStats {
    const uniqueEmails = new Set(records.map(r => r.email));
    const providerCounts = records.reduce((acc, r) => {
      acc[r.provider] = (acc[r.provider] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const dates = records
      .map(r => new Date(r.dateAdded))
      .sort((a, b) => a.getTime() - b.getTime());

    return {
      totalRecords: records.length,
      uniqueEmails: uniqueEmails.size,
      providerBreakdown: providerCounts,
      oldestRecord: dates[0]?.toISOString() || '',
      newestRecord: dates[dates.length - 1]?.toISOString() || '',
      mostUsedEmail: this.getMostUsedEmail(records)
    };
  }

  /**
   * Get the most frequently used email
   * @param records - Array of email records
   * @returns Most used email address
   */
  private static getMostUsedEmail(records: EmailRecord[]): string {
    const emailCounts = records.reduce((acc, r) => {
      acc[r.email] = (acc[r.email] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    let maxCount = 0;
    let mostUsed = '';

    for (const [email, count] of Object.entries(emailCounts)) {
      if (count > maxCount) {
        maxCount = count;
        mostUsed = email;
      }
    }

    return mostUsed;
  }

  /**
   * Trigger browser download
   * @param blob - Data blob
   * @param filename - Filename
   */
  static async triggerDownload(blob: Blob, filename: string): Promise<void> {
    const url = URL.createObjectURL(blob);
    
    try {
      await chrome.downloads.download({
        url,
        filename,
        saveAs: true
      });
    } finally {
      // Clean up object URL after a delay
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  }
}
```

### 9.4 ImportService
```typescript
// core/services/ImportService.ts

import type { EmailRecord } from '@/core/models';
import { EmailRecordRules } from '@/core/validators';

interface ImportResult {
  success: boolean;
  recordsImported: number;
  recordsSkipped: number;
  errors: string[];
}

interface ImportPreview {
  totalRecords: number;
  newRecords: number;
  existingRecords: number;
  invalidRecords: number;
  sampleRecords: EmailRecord[];
}

/**
 * ImportService
 * 
 * Handles data import/restore functionality
 */
export class ImportService {
  /**
   * Parse and validate imported JSON
   * @param json - JSON string
   * @returns Parsed records or throws error
   */
  static parseJSON(json: string): EmailRecord[] {
    try {
      const data = JSON.parse(json);

      // Handle different import formats
      if (Array.isArray(data)) {
        // Direct array of records
        return data;
      } else if (data.records && Array.isArray(data.records)) {
        // Wrapped in export format
        return data.records;
      } else {
        throw new Error('Invalid format: Expected array of records');
      }
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error('Invalid JSON format');
      }
      throw error;
    }
  }

  /**
   * Validate imported records
   * @param records - Array of records to validate
   * @returns Validation results
   */
  static validateRecords(records: EmailRecord[]): {
    valid: EmailRecord[];
    invalid: Array<{ record: any; errors: string[] }>;
  } {
    const valid: EmailRecord[] = [];
    const invalid: Array<{ record: any; errors: string[] }> = [];

    for (const record of records) {
      const validation = EmailRecordRules.validateRecord(record);
      
      if (validation.isValid) {
        // Normalize the record
        valid.push({
          ...record,
          domain: EmailRecordRules.normalizeDomain(record.domain),
          email: record.email.trim().toLowerCase()
        });
      } else {
        invalid.push({
          record,
          errors: validation.errors
        });
      }
    }

    return { valid, invalid };
  }

  /**
   * Generate import preview
   * @param records - Records to import
   * @param existing - Existing records in database
   * @returns Preview information
   */
  static generatePreview(
    records: EmailRecord[],
    existing: EmailRecord[]
  ): ImportPreview {
    const { valid, invalid } = this.validateRecords(records);
    const existingDomains = new Set(existing.map(r => r.domain));
    
    const newRecords = valid.filter(r => !existingDomains.has(r.domain));
    const existingRecords = valid.filter(r => existingDomains.has(r.domain));

    return {
      totalRecords: records.length,
      newRecords: newRecords.length,
      existingRecords: existingRecords.length,
      invalidRecords: invalid.length,
      sampleRecords: valid.slice(0, 5)
    };
  }

  /**
   * Import records with conflict resolution
   * @param records - Records to import
   * @param strategy - Conflict resolution strategy
   * @returns Import result
   */
  static async importRecords(
    records: EmailRecord[],
    strategy: 'overwrite' | 'skip' | 'merge' = 'overwrite'
  ): Promise<ImportResult> {
    const { valid, invalid } = this.validateRecords(records);
    const errors: string[] = [];
    
    let imported = 0;
    let skipped = 0;

    // Add validation errors
    invalid.forEach(({ record, errors: validationErrors }) => {
      errors.push(
        `Invalid record for ${record.domain}: ${validationErrors.join(', ')}`
      );
    });

    for (const record of valid) {
      try {
        // Import logic will be handled by repository
        // This service just prepares and validates
        imported++;
      } catch (error) {
        errors.push(
          `Failed to import ${record.domain}: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
        skipped++;
      }
    }

    return {
      success: errors.length === 0,
      recordsImported: imported,
      recordsSkipped: skipped + invalid.length,
      errors
    };
  }

  /**
   * Parse CSV format
   * @param csv - CSV string
   * @returns Array of email records
   */
  static parseCSV(csv: string): EmailRecord[] {
    const lines = csv.split('\n').filter(line => line.trim());
    
    // Skip header row
    const dataLines = lines.slice(1);
    
    const records: EmailRecord[] = [];

    for (const line of dataLines) {
      // Simple CSV parser (handles quoted fields)
      const matches = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);
      
      if (!matches || matches.length < 4) continue;

      const [domain, email, provider, dateAdded, notes = ''] = matches.map(
        field => field.replace(/^"|"$/g, '').replace(/""/g, '"')
      );

      records.push({
        domain,
        email,
        provider: provider as any,
        dateAdded,
        notes: notes || undefined
      });
    }

    return records;
  }

  /**
   * Detect import file format
   * @param content - File content
   * @returns Detected format
   */
  static detectFormat(content: string): 'json' | 'csv' | 'unknown' {
    const trimmed = content.trim();
    
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      return 'json';
    }
    
    if (trimmed.includes('Domain,Email,Provider')) {
      return 'csv';
    }
    
    return 'unknown';
  }
}
```

---

## 10. Storage Layer

### 10.1 Database Setup (Dexie.js)
```typescript
// infrastructure/storage/database.ts

import Dexie, { type Table } from 'dexie';
import type { EmailRecord } from '@/core/models';

/**
 * EmailTrackerDatabase
 * 
 * IndexedDB database using Dexie.js wrapper
 * Provides type-safe, promise-based storage for email records
 */
export class EmailTrackerDatabase extends Dexie {
  // Tables
  emails!: Table<EmailRecord, string>;

  constructor() {
    super('EmailTrackerDB');
    
    // Define schema
    this.version(1).stores({
      // Primary key: domain
      // Indexes: email, provider, dateAdded (for sorting/filtering)
      emails: 'domain, email, provider, dateAdded, lastUsed'
    });
  }

  /**
   * Clear all data (for testing or reset)
   */
  async clearAll(): Promise<void> {
    await this.emails.clear();
  }

  /**
   * Get database size estimate
   * @returns Estimated size in bytes
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
   * @returns true if persistent
   */
  async isPersistent(): Promise<boolean> {
    if (navigator.storage && navigator.storage.persisted) {
      return await navigator.storage.persisted();
    }
    return false;
  }

  /**
   * Request persistent storage
   * @returns true if granted
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

// Request persistent storage on initialization
if (typeof window !== 'undefined') {
  db.requestPersistentStorage()
    .then(granted => {
      console.log(`Persistent storage: ${granted ? 'granted' : 'denied'}`);
    })
    .catch(error => {
      console.error('Failed to request persistent storage:', error);
    });
}
```

### 10.2 EmailRepository
```typescript
// core/repositories/EmailRepository.ts

import { db } from '@/infrastructure/storage/database';
import type { EmailRecord, DomainStats, EmailProvider } from '@/core/models';

/**
 * EmailRepository
 * 
 * Repository pattern implementation for EmailRecord storage
 * Abstracts storage implementation details from business logic
 */
export class EmailRepository {
  /**
   * Save or update an email record
   * @param record - Email record to save
   */
  async save(record: EmailRecord): Promise<void> {
    await db.emails.put(record);
    
    // Backup to chrome.storage.local for redundancy
    await this.backupToChrome





---
Powered by [Claude Exporter](https://www.claudexporter.com)