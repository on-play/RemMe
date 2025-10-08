# Contributing to RemMe

Thank you for considering contributing to RemMe! 🎉

## 🚀 Quick Start

```bash
# 1. Fork and clone
git clone https://github.com/YOUR_USERNAME/RemMe.git
cd RemMe

# 2. Install dependencies
npm install

# 3. Start development
npm run dev

# 4. Build extension
npm run build

# 5. Load in Chrome
# - Go to chrome://extensions/
# - Enable "Developer mode"
# - Click "Load unpacked"
# - Select .output/chrome-mv3 folder
```

## 🐛 Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates.

**When reporting a bug, include:**
- Clear, descriptive title
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Browser version and OS
- Extension version

## 💡 Suggesting Features

Feature suggestions are welcome! Please:
- Use a clear, descriptive title
- Explain the problem your feature would solve
- Provide examples of how it would work
- Explain why this would be useful

## 🔀 Pull Requests

1. **Fork** the repo and create your branch from `main`
2. **Follow** coding standards (TypeScript, Vue 3, Tailwind)
3. **Write** meaningful commit messages
4. **Test** your changes thoroughly
5. **Update** documentation if needed
6. **Submit** PR with clear description

### Commit Message Format

```bash
# Examples
feat: add copy email to clipboard button
fix: resolve IndexedDB transaction error
docs: update installation instructions
refactor: simplify domain extraction logic
```

## 📝 Coding Standards

### TypeScript
- Use explicit types (avoid `any`)
- Use interfaces for object shapes
- Use enums for fixed sets of values

### Vue 3
- Use Composition API with `<script setup>`
- Use TypeScript for prop types
- Keep components focused and reusable

### File Naming
- Components: `PascalCase.vue` (e.g., `EmailCard.vue`)
- Composables: `camelCase.ts` with `use` prefix (e.g., `useEmailTracker.ts`)
- Services: `PascalCase.ts` (e.g., `EmailTrackerService.ts`)

### Code Style
- **2 spaces** for indentation
- **Single quotes** for strings
- **Semicolons** at end of statements
- Run `npm run lint:fix` to auto-format

## 📐 Project Structure

```
RemMe/
├── entrypoints/          # Extension entry points
│   ├── popup/           # Popup UI
│   ├── options/         # Options page
│   └── background.ts    # Background service worker
├── components/          # Vue components
├── composables/         # Vue composables
├── core/               # Business logic
│   ├── models/         # Domain entities
│   ├── validators/     # Validation logic
│   ├── services/       # Business services
│   └── repositories/   # Storage abstraction
├── infrastructure/     # External dependencies
│   ├── storage/       # Database setup
│   └── chrome/        # Chrome API wrappers
└── utils/             # Utility functions
```

## ✅ Pull Request Checklist

- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Added comments for complex logic
- [ ] Documentation updated
- [ ] Tests added/updated (if applicable)
- [ ] Build succeeds (`npm run build`)
- [ ] Extension tested manually

## 🎨 Design Principles

1. **Privacy First** - No external network calls, all data local
2. **Type Safety** - TypeScript everywhere
3. **Clean Architecture** - Clear separation of concerns
4. **User-Centric** - Simple, intuitive UI
5. **Performance** - Fast load times, minimal memory

## 📞 Getting Help

- 💬 [GitHub Discussions](https://github.com/on-play/RemMe/discussions) - Ask questions
- 🐛 [GitHub Issues](https://github.com/on-play/RemMe/issues) - Report bugs

## 🏆 Recognition

Contributors will be recognized in:
- GitHub contributors list (automatic)
- Release notes (for significant contributions)
- README acknowledgments section

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to RemMe!** 🙌

Made with ❤️ by [Jain Yagi](https://x.com/jainyagi)

