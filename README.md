# RemMe - Remember Your Emails

<div align="center">

**Never forget which email you used on which website**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub](https://img.shields.io/github/stars/on-play/RemMe?style=social)](https://github.com/on-play/RemMe)
[![Twitter Follow](https://img.shields.io/twitter/follow/jainyagi?style=social)](https://x.com/jainyagi)

[Install Extension](#installation) • [Features](#features) • [Documentation](#documentation) • [Contributing](./CONTRIBUTING.md)

</div>

---

## 🎯 Overview

RemMe is a privacy-first browser extension that helps you remember which email address you used to sign up for each website. No more password reset loops, no more "wait, which email did I use here?"

**Core Principles:**
- 🔒 **100% Local** - All data stored locally, zero external network calls
- ⚡ **Instant Lookup** - See which email you used in one click
- 🔐 **Privacy First** - No tracking, no telemetry, no data collection
- 🎨 **Beautiful UI** - Modern, intuitive interface with dark mode
- 🌐 **Cross-Browser** - Works on Chrome, Brave, Edge, Opera, Vivaldi

## ✨ Features

- **Quick Save** - Save email-to-domain mappings with one click
- **Instant Recall** - View saved email when visiting a site
- **Smart Search** - Find all sites using a specific email
- **Export/Import** - Backup and restore your data anytime
- **Multiple Providers** - Track Google, Outlook, Yahoo, iCloud, ProtonMail, and custom providers
- **Notes Support** - Add context like "Work account" or "Newsletter email"
- **Dark Mode** - Easy on the eyes, day or night

## 🚀 Installation

### From Chrome Web Store (Coming Soon)
The extension will be available on the Chrome Web Store within 48 hours.

### Install from Source (Now)

```bash
# Clone the repository
git clone https://github.com/on-play/RemMe.git
cd RemMe

# Install dependencies
npm install

# Build the extension
npm run build

# Load in Chrome
# 1. Go to chrome://extensions/
# 2. Enable "Developer mode"
# 3. Click "Load unpacked"
# 4. Select the .output/chrome-mv3 folder
```

## 📖 How to Use

1. **Visit any website** (e.g., github.com)
2. **Click the RemMe icon** in your browser toolbar
3. **Add your email** if not already saved
4. **Next time you visit**, see instantly which email you used

![Demo](./docs/assets/demo.gif)

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
# Fork and clone
git clone https://github.com/YOUR_USERNAME/RemMe.git

# Install dependencies
npm install

# Start development
npm run dev

# In another terminal, build
npm run build
```

## 📚 Documentation

- [Architecture Overview](./docs/ARCHITECTURE.md) (Coming soon)
- [Development Guide](./docs/DEVELOPMENT.md) (Coming soon)
- [User Guide](./docs/USER_GUIDE.md) (Coming soon)

## 🗺️ Roadmap

- [x] **v1.0** - MVP (Save, view, search emails) - Launching in 48h
- [ ] **v1.1** - Enhanced UI, statistics dashboard
- [ ] **v1.2** - Auto-detection on login forms
- [ ] **v2.0** - Firefox & Safari support
- [ ] **v3.0** - Optional sync across devices

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 👤 Author

**Jain Yagi** (goforce inc.)
- GitHub: [@on-play](https://github.com/on-play)
- Twitter: [@jainyagi](https://x.com/jainyagi)
- Project: [github.com/on-play/RemMe](https://github.com/on-play/RemMe)

## 🙏 Acknowledgments

- Built with [WXT](https://wxt.dev/)
- Inspired by the frustration of forgotten emails
- Made with ❤️ for privacy-conscious users

## ⭐ Support

If you find RemMe useful, please consider:
- ⭐ Starring the repo
- 🐛 Reporting bugs
- 💡 Suggesting features
- 🔄 Sharing with friends

---

<div align="center">

**Made with ❤️ by [Jain Yagi](https://x.com/jainyagi)**

[Report Bug](https://github.com/on-play/RemMe/issues) • [Request Feature](https://github.com/on-play/RemMe/issues)

</div>

