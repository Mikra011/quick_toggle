# QuickToggle Extension Manager

**QuickToggle** is a simple and efficient Chrome extension that allows you to enable/disable other extensions in bulk — all at once or in customizable groups. Easily manage your extensions for different workflows or contexts, while keeping certain extensions always active with blacklist support.

---

## 🚀 Features

- 🔄 **Toggle All**: Instantly turn all your extensions ON or OFF.
- 📦 **Groups**: Create extension groups to manage them by purpose (e.g., Work, Gaming, Dev Tools).
- ❌ **Blacklist**: Protect essential extensions from being toggled accidentally.
- 🗑️ **Delete Groups**: Quickly remove groups you no longer need.
- ⚡ Fast and minimal interface via popup.
  
---

## 📦 Installation

1. Clone or download the repository.
2. Go to `chrome://extensions` in your Chrome browser.
3. Enable **Developer Mode** (top right).
4. Click **Load unpacked** and select the project folder.

---

## 🛠️ Usage

### 🔲 Blacklist

- Blacklisted extensions will **not** be affected by QuickToggle.
- They remain enabled or disabled as they are, regardless of bulk toggling.
  
### 🧩 Groups

- Create groups to manage sets of extensions (e.g., “Work Setup”, “Debugging Tools”).
- Toggle all extensions in a group on or off with one click.
- Delete a group using the trash icon.

## 🧪 Development

- Built with **React** + **TypeScript** + **Vite**
- Uses **Chrome Extension Manifest V3**
- Styled with CSS

To run locally:

```bash
npm install
npm run dev

