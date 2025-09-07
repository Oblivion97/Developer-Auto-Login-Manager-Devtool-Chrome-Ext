# Chrome Extension Manual Installation

This repository contains a Chrome extension for managing login credentials and autofilling forms.

## How to Install

1. **Download the Extension**
   - Click the green "Code" button and select "Download ZIP".
   - Unzip the downloaded file to a folder on your computer.

2. **Install in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (top right).
   - Click "Load unpacked".
   - Select the folder where you unzipped the extension files.

3. **Usage**
   - The extension icon will appear in your Chrome toolbar.
   - Click the icon to open the popup and manage your login instances.
   - The extension will autofill login forms based on your saved data.
   - This extension is designed for developers to easily test and develop applications with multiple instances and credentials. You only need to input your email to log in; if a user requires a special password, it can be configured as an exception for that email.

## Files
- `manifest.json`: Extension configuration
- `popup.html`: Popup UI
- `popup.js`: Popup logic
- `content.js`: Autofill logic

## Notes
- Your data is stored locally in Chrome's sync storage.
- No data is sent to any server.
- To update the extension, repeat the steps above with the new files.

## Support
If you have issues, open an issue in this repository.
