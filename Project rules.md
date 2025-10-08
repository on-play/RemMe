# Email Tracker Browser Extension - AI Coding Agent Guide

## 🎯 Project Mission & End Goals

### Primary Objectives
1. **Build a production-ready browser extension** that helps users track which email they used on each website
2. **Create open-source, community-driven software** that others can contribute to and improve
3. **Establish proper documentation** for developers, contributors, and end-users
4. **Prepare for public GitHub release** with all necessary infrastructure (CI/CD, issues, PRs, etc.)
5. **Credit original creator** (Jain Yagi) appropriately throughout the project

### Success Criteria
- ✅ Working extension installable on Chromium browsers
- ✅ Clean, documented, maintainable codebase
- ✅ Comprehensive README, CONTRIBUTING, and API documentation
- ✅ Open-source license (MIT recommended)
- ✅ CI/CD pipeline for automated testing and builds
- ✅ Published on Chrome Web Store (optional but recommended)
- ✅ Community-ready: issue templates, PR guidelines, code of conduct

---

## 🧠 Context Retention System (For New AI Threads)

### When Starting a New Thread, Provide This Context:

```markdown
# Email Tracker Extension - Project Context

**Creator**: Jain Yagi
**Project**: Browser extension to track which email address was used on each website
**Tech Stack**: WXT + Vue 3 + TypeScript + Tailwind CSS + IndexedDB (Dexie.js)
**Architecture**: Clean Architecture (Domain-driven design)
**Status**: [Current phase - e.g., "Phase 1: MVP Development"]

## Current State
- [What's completed]
- [What's in progress]
- [What's blocking]

## Next Steps
- [Immediate next task]
- [Dependencies]

## Key Design Decisions
- Local-only storage (privacy-first, no external network calls)
- IndexedDB as primary storage with chrome.storage.local backup
- Domain-first approach (normalize domains, email as secondary)
- Clean separation: Domain → Service → Repository → Storage

## Architecture Recap
```
Presentation (Vue Components + Composables)
    ↓
Application (Services - Business Logic)
    ↓
Domain (Models + Validators)
    ↓
Infrastructure (Repositories + Storage)
```

## File Structure Key Areas
- `/entrypoints` - Extension entry points (popup, options, background)
- `/components` - Reusable Vue components
- `/composables` - Vue 3 composables (reactive logic)
- `/core` - Framework-agnostic business logic
  - `/models` - Domain entities
  - `/validators` - Validation rules
  - `/services` - Business logic
  - `/repositories` - Storage abstraction
- `/infrastructure` - External dependencies (DB, Chrome APIs)

## Current Decisions Log
[List any major decisions made, with reasoning]
```

### Quick Reference Card (Copy-Paste for Each New Thread)

```
PROJECT: Email Tracker Extension by Jain Yagi
GOAL: Privacy-first browser extension + Open-source release
STACK: WXT, Vue 3, TypeScript, Tailwind, IndexedDB
ARCHITECTURE: Clean/Domain-driven
STATUS: [Phase X - Current Task]
DOCS: See PROJECT_OVERVIEW.md, ARCHITECTURE.md, CONTRIBUTING.md
```

---

## 📁 Required Documentation Files

### Essential Documentation Structure

```
email-tracker/
├── README.md                    # Main project README (public-facing)
├── ARCHITECTURE.md              # Technical architecture details
├── CONTRIBUTING.md              # How to contribute
├── CODE_OF_CONDUCT.md          # Community standards
├── LICENSE                      # MIT License
├── CHANGELOG.md                 # Version history
├── SECURITY.md                  # Security policy
│
├── docs/
│   ├── GETTING_STARTED.md      # Quick start for developers
│   ├── API_REFERENCE.md        # Code API documentation
│   ├── DEVELOPMENT.md          # Development workflow
│   ├── DEPLOYMENT.md           # Build and deployment
│   ├── DESIGN_DECISIONS.md     # Why we made certain choices
│   ├── USER_GUIDE.md           # End-user documentation
│   ├── ROADMAP.md              # Future plans
│   └── FAQ.md                  # Frequently asked questions
│
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   ├── feature_request.md
│   │   └── question.md
│   ├── PULL_REQUEST_TEMPLATE.md
│   ├── workflows/
│   │   ├── ci.yml              # Continuous Integration
│   │   ├── release.yml         # Automated releases
│   │   └── deploy.yml          # Chrome Web Store deployment
│   └── FUNDING.yml             # Optional: sponsorship info
│
└── examples/
    ├── basic-usage.md
    └── advanced-features.md
```

---

## 📄 Documentation Templates

### 1. README.md (Main Project README)

```markdown
# Email Tracker - Browser Extension

<div align="center">

![Email Tracker Logo](./assets/logo.png)

**Never forget which email you used on which website**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/[YOUR_EXTENSION_ID])](https://chrome.google.com/webstore/detail/[YOUR_EXTENSION_ID])
[![GitHub Stars](https://img.shields.io/github/stars/[USERNAME]/email-tracker)](https://github.com/[USERNAME]/email-tracker/stargazers)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)

[Install Extension](#installation) • [Documentation](./docs) • [Contributing](./CONTRIBUTING.md) • [Report Bug](https://github.com/[USERNAME]/email-tracker/issues)

</div>

---

## 🎯 Overview

Email Tracker is a privacy-first browser extension that helps you remember which email address you used to sign up for each website. No more password reset loops, no more "wait, which email did I use here?"

**Key Features:**
- 🔒 **100% Local** - All data stored locally, zero external network calls
- ⚡ **Instant Lookup** - See which email you used in one click
- 🔍 **Search Across Sites** - Find all sites using a specific email
- 📤 **Export/Import** - Backup and restore your data anytime
- 🎨 **Beautiful UI** - Modern, intuitive interface with dark mode
- 🌐 **Cross-Browser** - Works on Chrome, Brave, Edge, Opera, Vivaldi

## 🚀 Installation

### From Chrome Web Store (Recommended)
1. Visit the [Chrome Web Store page](#)
2. Click "Add to Chrome"
3. Start tracking your emails!

### From Source (For Developers)
```bash
# Clone the repository
git clone https://github.com/[USERNAME]/email-tracker.git
cd email-tracker

# Install dependencies
npm install

# Build the extension
npm run build

# Load unpacked extension in Chrome
# 1. Go to chrome://extensions/
# 2. Enable "Developer mode"
# 3. Click "Load unpacked"
# 4. Select the `dist` folder
```

## 📖 How to Use

1. **Visit any website** (e.g., github.com)
2. **Click the extension icon** in your browser toolbar
3. **Add your email** if not already saved
4. **Next time you visit**, see instantly which email you used

![Demo GIF](./docs/assets/demo.gif)

## 🏗️ Tech Stack

- **Framework**: [WXT](https://wxt.dev/) (Vite-powered extension framework)
- **Frontend**: Vue 3 (Composition API) + TypeScript
- **Styling**: Tailwind CSS
- **Storage**: IndexedDB (via Dexie.js) with chrome.storage backup
- **Architecture**: Clean Architecture / Domain-Driven Design

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

**Quick Start for Contributors:**
```bash
# Fork and clone the repo
git clone https://github.com/YOUR_USERNAME/email-tracker.git

# Create a feature branch
git checkout -b feature/amazing-feature

# Make your changes and commit
git commit -m "Add amazing feature"

# Push and create a Pull Request
git push origin feature/amazing-feature
```

## 📚 Documentation

- [Architecture Overview](./ARCHITECTURE.md)
- [Development Guide](./docs/DEVELOPMENT.md)
- [API Reference](./docs/API_REFERENCE.md)
- [User Guide](./docs/USER_GUIDE.md)
- [Design Decisions](./docs/DESIGN_DECISIONS.md)

## 🗺️ Roadmap

- [x] Phase 1: MVP (Save, view, search emails)
- [x] Phase 2: Export/import, bulk operations
- [ ] Phase 3: Auto-detection on forms
- [ ] Phase 4: Browser sync, advanced features
- [ ] Phase 5: Firefox & Safari support

See the [full roadmap](./docs/ROADMAP.md) for details.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 👤 Author

**Jain Yagi**
- GitHub: [@JainYagi](https://github.com/JainYagi)
- Project Link: [https://github.com/JainYagi/email-tracker](https://github.com/JainYagi/email-tracker)

## 🙏 Acknowledgments

- Built with [WXT](https://wxt.dev/)
- Icons from [Lucide](https://lucide.dev/)
- Inspired by the frustration of forgotten emails

## ⭐ Star History

If you find this project useful, please consider giving it a star!

[![Star History Chart](https://api.star-history.com/svg?repos=[USERNAME]/email-tracker&type=Date)](https://star-history.com/#[USERNAME]/email-tracker&Date)

---

<div align="center">
Made with ❤️ by <a href="https://github.com/JainYagi">Jain Yagi</a>
</div>
```

---

### 2. CONTRIBUTING.md

```markdown
# Contributing to Email Tracker

First off, thank you for considering contributing to Email Tracker! 🎉

This document provides guidelines for contributing to this project. Following these guidelines helps communicate that you respect the time of the developers managing and developing this open-source project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Project Structure](#project-structure)

## 📜 Code of Conduct

This project adheres to a [Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [maintainer-email].

## 🤝 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates.

**When reporting a bug, include:**
- Clear, descriptive title
- Steps to reproduce the issue
- Expected vs actual behavior
- Screenshots (if applicable)
- Browser version and OS
- Extension version

**Use our [bug report template](.github/ISSUE_TEMPLATE/bug_report.md)**

### Suggesting Features

Feature suggestions are welcome! Please:
- Use a clear, descriptive title
- Explain the problem your feature would solve
- Provide examples of how it would work
- Explain why this would be useful to most users

**Use our [feature request template](.github/ISSUE_TEMPLATE/feature_request.md)**

### Your First Code Contribution

Unsure where to begin? Look for issues tagged:
- `good-first-issue` - Good for newcomers
- `help-wanted` - Need community help
- `documentation` - Improve docs

### Pull Requests

1. Fork the repo and create your branch from `main`
2. Follow our coding standards
3. Write meaningful commit messages
4. Ensure the test suite passes
5. Update documentation as needed
6. Submit the PR with a clear description

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ and npm
- Git
- Chrome/Chromium browser

### Setup Steps

```bash
# 1. Fork and clone
git clone https://github.com/YOUR_USERNAME/email-tracker.git
cd email-tracker

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. In another terminal, build the extension
npm run build

# 5. Load extension in Chrome
# - Go to chrome://extensions/
# - Enable "Developer mode"
# - Click "Load unpacked"
# - Select the `.output/chrome-mv3` folder
```

### Available Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run build:firefox # Build for Firefox
npm run type-check   # Run TypeScript type checking
npm run lint         # Lint code
npm run lint:fix     # Fix linting issues
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run zip          # Create distributable ZIP
```

## 📝 Coding Standards

### TypeScript

```typescript
// ✅ Good: Explicit types, clear names
interface EmailRecord {
  domain: string;
  email: string;
  provider: EmailProvider;
}

// ❌ Bad: Implicit any, unclear names
function doStuff(x: any, y: any) {
  return x + y;
}
```

### Vue 3 Components

```vue
<script setup lang="ts">
// ✅ Good: Script setup, TypeScript, clear prop types
interface Props {
  record: EmailRecord;
  editable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  editable: true
});

// ❌ Bad: Options API, no types
export default {
  props: ['record', 'editable']
}
</script>
```

### File Naming
- Components: `PascalCase.vue` (e.g., `EmailCard.vue`)
- Composables: `camelCase.ts` with `use` prefix (e.g., `useEmailTracker.ts`)
- Services: `PascalCase.ts` (e.g., `EmailTrackerService.ts`)
- Types: `PascalCase.ts` (e.g., `EmailRecord.ts`)

### Code Style
- Use **2 spaces** for indentation
- Use **single quotes** for strings
- Add **semicolons** at end of statements
- Max line length: **100 characters**
- Use **template literals** for string interpolation

Run `npm run lint:fix` to auto-format code.

## 💬 Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format
<type>(<scope>): <subject>

# Examples
feat(popup): add copy email button
fix(storage): resolve IndexedDB transaction error
docs(readme): update installation instructions
refactor(service): simplify domain extraction logic
test(repository): add unit tests for EmailRepository
chore(deps): update dependencies
```

### Commit Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

## 🔄 Pull Request Process

### Before Submitting

- [ ] Code follows the style guidelines
- [ ] Self-review of code completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings introduced
- [ ] Tests added/updated and passing
- [ ] Build succeeds (`npm run build`)
- [ ] Extension tested manually

### PR Description Template

```markdown
## Description
[Clear description of what this PR does]

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
[Describe how you tested these changes]

## Screenshots (if applicable)
[Add screenshots for UI changes]

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Documentation updated
- [ ] Tests pass
- [ ] Build succeeds
```

### Review Process

1. Maintainer will review within 3-5 days
2. Address any feedback
3. Once approved, maintainer will merge
4. Your contribution will be included in the next release!

## 📐 Project Structure

```
email-tracker/
├── entrypoints/          # Extension entry points
│   ├── popup/           # Popup UI
│   ├── options/         # Options page
│   └── background.ts    # Background service worker
├── components/          # Vue components
├── composables/         # Vue composables
├── core/               # Business logic (framework-agnostic)
│   ├── models/         # Domain entities
│   ├── validators/     # Validation logic
│   ├── services/       # Business services
│   └── repositories/   # Storage abstraction
├── infrastructure/     # External dependencies
│   ├── storage/       # Database setup
│   └── chrome/        # Chrome API wrappers
├── utils/             # Utility functions
└── tests/             # Test files
```

### Where to Add Your Code

| Task | Location |
|------|----------|
| Add new Vue component | `/components/` |
| Add business logic | `/core/services/` |
| Add domain model | `/core/models/` |
| Add validation rule | `/core/validators/` |
| Add storage logic | `/core/repositories/` or `/infrastructure/storage/` |
| Add utility function | `/utils/` |
| Add composable | `/composables/` |

## 🎨 Design Principles

This project follows these principles:

1. **Privacy First**: No external network calls, all data local
2. **Domain-Driven Design**: Business logic in core, UI separate
3. **Type Safety**: TypeScript everywhere
4. **Clean Architecture**: Clear separation of concerns
5. **User-Centric**: Simple, intuitive UI
6. **Performance**: Fast load times, minimal memory

## 📞 Getting Help

- 💬 [GitHub Discussions](https://github.com/JainYagi/email-tracker/discussions) - Ask questions
- 🐛 [GitHub Issues](https://github.com/JainYagi/email-tracker/issues) - Report bugs
- 📧 Email: [maintainer-email]

## 🏆 Recognition

Contributors will be recognized in:
- GitHub contributors list (automatic)
- CHANGELOG.md (for significant contributions)
- README.md acknowledgments section

Thank you for contributing to Email Tracker! 🙌

---

**Created by Jain Yagi** • [GitHub](https://github.com/JainYagi)
```

---

### 3. ARCHITECTURE.md

```markdown
# Email Tracker - Architecture Documentation

**Author**: Jain Yagi  
**Last Updated**: [Date]  
**Version**: 1.0.0

## 🏗️ Overview

Email Tracker follows **Clean Architecture** principles with a strong emphasis on **Domain-Driven Design (DDD)**. This document explains the architectural decisions, patterns, and rationale behind the codebase.

## 🎯 Architectural Goals

1. **Separation of Concerns** - Clear boundaries between layers
2. **Testability** - Easy to test business logic in isolation
3. **Maintainability** - Easy to understand and modify
4. **Flexibility** - Easy to swap implementations (e.g., storage providers)
5. **Type Safety** - Compile-time guarantees via TypeScript
6. **Performance** - Fast, memory-efficient operations

## 📊 Architecture Layers

```
┌─────────────────────────────────────────┐
│     Presentation Layer (Vue 3)          │  ← User Interface
│  - Components                            │
│  - Composables                           │
│  - Entry Points (Popup, Options)        │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│     Application Layer (Services)        │  ← Business Logic
│  - EmailTrackerService                   │
│  - ExportService                         │
│  - ImportService                         │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│     Domain Layer (Core)                  │  ← Business Rules
│  - Models (EmailRecord, etc.)           │
│  - Validators (Rules)                    │
│  - Value Objects                         │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│     Infrastructure Layer                 │  ← External Dependencies
│  - Repositories (Storage abstraction)   │
│  - Database (IndexedDB via Dexie)       │
│  - Chrome APIs                           │
└──────────────────────────────────────────┘
```

### Dependency Rule

**Dependencies point inward only**:
- Presentation depends on Application
- Application depends on Domain
- Infrastructure depends on Domain
- Domain depends on nothing (pure business logic)

## 🏛️ Core Patterns

### 1. Repository Pattern

**Purpose**: Abstract storage details from business logic

```typescript
// Interface (in domain layer)
interface IEmailRepository {
  save(record: EmailRecord): Promise<void>;
  getByDomain(domain: string): Promise<EmailRecord | undefined>;
  getAll(): Promise<EmailRecord[]>;
  delete(domain: string): Promise<void>;
}

// Implementation (in infrastructure layer)
class EmailRepository implements IEmailRepository {
  // Uses IndexedDB, but business logic doesn't know
}
```

**Benefits**:
- Business logic doesn't know about IndexedDB
- Easy to test (mock repository)
- Easy to swap storage (e.g., to SQL, Firebase)

### 2. Service Layer Pattern

**Purpose**: Orchestrate business operations

```typescript
class EmailTrackerService {
  async saveEmail(domain, email, provider, notes) {
    // 1. Validate
    // 2. Create domain model
    // 3. Apply business rules
    // 4. Save via repository
  }
}
```

**Benefits**:
- Centralized business logic
- Reusable across UI components
- Easy to test

### 3. Composable Pattern (Vue 3)

**Purpose**: Reactive business logic for UI

```typescript
function useEmailTracker() {
  const currentRecord = ref<EmailRecord>();
  
  async function loadCurrentTab() {
    currentRecord.value = await service.getEmailForCurrentTab();
  }
  
  return { currentRecord, loadCurrentTab };
}
```

**Benefits**:
- Reactive state management
- Reusable logic across components
- Clean separation from UI

### 4. Domain-Driven Design

**Core Entity**: `EmailRecord`

```typescript
interface EmailRecord {
  domain: string;        // Aggregate root ID
  email: string;
  provider: EmailProvider;
  dateAdded: string;
  // ... metadata
}
```

**Value Objects**: Immutable, validated types

```typescript
class Email {
  private constructor(private value: string) {}
  
  static create(email: string): Email {
    // Validation
    return new Email(email);
  }
}
```

**Validation Rules**: Business invariants

```typescript
class EmailRecordRules {
  static validateRecord(record: EmailRecord): ValidationResult {
    // Domain-specific validation
  }
}
```

## 🗂️ Directory Structure Explained

```
email-tracker/
├── entrypoints/              # 🔌 Extension entry points
│   ├── popup/               # Main popup UI
│   ├── options/             # Full-page settings UI
│   └── background.ts        # Service worker
│
├── components/              # 🎨 Vue components (Presentation)
│   ├── common/             # Reusable UI components
│   ├── email/              # Domain-specific components
│   └── layout/             # Layout components
│
├── composables/             # 🔄 Vue composables (Presentation)
│   └── useEmailTracker.ts  # Main reactive logic
│
├── core/                    # 💼 Business logic (Framework-agnostic)
│   ├── models/             # 📋 Domain entities
│   │   └── EmailRecord.ts
│   ├── validators/         # ✅ Business rules
│   │   └── EmailRecordRules.ts
│   ├── services/           # ⚙️ Application services
│   │   └── EmailTrackerService.ts
│   └── repositories/       # 🗄️ Storage interfaces
│       └── IEmailRepository.ts
│
├── infrastructure/          # 🔧 External dependencies
│   ├── storage/            # Database implementation
│   │   ├── database.ts    # Dexie.js setup
│   │   └── EmailRepository.ts  # Concrete implementation
│   └── chrome/             # Chrome API wrappers
│
├── utils/                   # 🛠️ Utility functions
└── types/                   # 📘 TypeScript types
```

### Layer Responsibilities

| Layer | Contains | Depends On | Example |
|-------|----------|------------|---------|
| **Presentation** | Vue components, composables | Application | `Popup.vue` |
| **Application** | Services, use cases | Domain | `EmailTrackerService` |
| **Domain** | Models, validators, rules | Nothing | `EmailRecord`, `EmailRecordRules` |
| **Infrastructure** | DB, APIs, external libs | Domain | `EmailRepository`, `database.ts` |

## 🔀 Data Flow

### Example: Saving an Email

```
1. User enters email in Popup.vue
   ↓
2. Component calls composable method
   useEmailTracker.saveEmail()
   ↓
3. Composable calls service
   EmailTrackerService.saveEmail()
   ↓
4. Service validates and creates EmailRecord
   EmailRecordRules.validateRecord()
   ↓
5. Service calls repository
   EmailRepository.save()
   ↓
6. Repository persists to IndexedDB
   db.emails.put()
   ↓
7. Success bubbles back up
   Composable updates reactive state
   ↓
8. Vue component re-renders automatically
```

## 🎨 Design Decisions

### Why WXT over create-chrome-ext?

**Decision**: Use WXT framework  
**Reason**:
- Built on Vite (fast HMR)
- Auto-generates manifest.json
- Hot reload for content scripts
- Better TypeScript support
- Active development and community

### Why IndexedDB over chrome.storage.local?

**Decision**: IndexedDB as primary, chrome.storage as backup  
**Reason**:
- IndexedDB: Larger capacity (50MB+), better query performance
- chrome.storage.local: Limited to 10MB, simpler API
- Using both provides redundancy

### Why Clean Architecture?

**Decision**: Implement Clean Architecture pattern  
**Reason**:
- Testable business logic (no UI dependencies)
- Easy to swap implementations
- Clear separation of concerns
- Scales well as project grows
- Industry best practice

### Why Domain-Driven Design?

**Decision**: Model business domain explicitly  
**Reason**:
- `EmailRecord` is the core concept
- Business rules (validation) stay with domain
- Makes code self-documenting
- Easier for new contributors to understand

### Why TypeScript?

**Decision**: Use TypeScript throughout  
**Reason**:
- Catch errors at compile-time
- Better IDE support (autocomplete)
- Self-documenting code
- Easier refactoring
- Industry standard for large projects

## 🧪 Testing Strategy

### Unit Tests
- Test domain logic in isolation
- Mock repositories
- Fast, no dependencies

```typescript
describe('EmailRecordRules', () => {
  it('should validate email format', () => {
    expect(EmailRecordRules.isValidEmail('test@example.com')).toBe(true);
  });
});
```

### Integration Tests
- Test service + repository together
- Use in-memory database
- Verify data persistence

```typescript
describe('EmailTrackerService', () => {
  it('should save and retrieve email', async () => {
    await service.saveEmail('github.com', 'test@example.com', 'Google');
    const result = await service.getEmailForDomain('github.com');
    expect(result.email).toBe('test@example.com');
  });
});
```

### E2E Tests
- Test full user workflows
- Use Playwright
- Verify UI interactions

```typescript
test('user can save email for site', async ({ page }) => {
  await page.goto('chrome-extension://[id]/popup.html');
  await page.fill('[data-testid="email-input"]', 'test@example.com');
  await page.click('[data-testid="save-button"]');
  await expect(page.locator('.success-message')).toBeVisible();
});
```

## 📈 Performance Considerations

### Storage
- **IndexedDB**: Indexed queries on `domain`, `email`, `provider`
- **Caching**: No in-memory cache needed (IndexedDB is fast enough)
- **Batch Operations**: Use `bulkPut()` for imports

### UI
- **Lazy Loading**: Options page loads records on demand
- **Debounce Search**: 300ms delay to avoid excessive queries
- **Virtual Scrolling**: For large record lists (future enhancement)

### Memory
- **Cleanup**: Remove event listeners on unmount
- **Reactive Refs**: Use `shallowRef` for large objects
- **Computed Properties**: Memoize expensive calculations

## 🔐 Security & Privacy

### Core Principles
1. **No External Network Calls** - All data stays local
2. **No Telemetry** - Zero tracking or analytics
3. **Minimal Permissions** - Only `storage`, `tabs`, `activeTab`
4. **Open Source** - Auditable by anyone

### Data Storage
- **Encryption at Rest**: Browser handles (IndexedDB is encrypted on disk)
- **No Cloud Sync** - Unless user explicitly enables `chrome.storage.sync`
- **User Owns Data** - Export anytime

## 🚀 Deployment Architecture

### Build Process

```bash
npm run build
   ↓
1. TypeScript compilation
2. Vue SFC compilation
3. Vite bundling
4. Manifest generation
5. Asset optimization
   ↓
Output: .output/chrome-mv3/ (ready to upload)
```

### CI/CD Pipeline

```yaml
1. On Push: Run tests, lint, type-check
2. On PR: Build extension, manual QA
3. On Release: Build, sign, upload to Chrome Web Store
```

## 📚 Further Reading

- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [WXT Documentation](https://wxt.dev/)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)

## 🤔 FAQ

**Q: Why not use Pinia for state management?**  
A: Composables provide sufficient reactivity for this app's scope. Pinia can be added if state becomes more complex.

**Q: Why not use a monorepo?**  
A: Extension code is small enough for a single repo. Can split later if needed (e.g., separate landing page).

**Q: Why no backend/API?**  
A: Privacy-first principle. All logic local. Future: optional self-hosted sync server.

---

**Document maintained by**: Jain Yagi  
**Questions?** Open an issue or discussion on GitHub.
```

---

### 4. LICENSE (MIT)

```
MIT License

Copyright (c) 2025 Jain Yagi (goforce inc.)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software