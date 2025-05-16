# Obsidian Keyboard Formatter

[![License](https://img.shields.io/badge/License-0BSD-blue?style=for-the-badge&labelColor=555555)](LICENSE)
[![Ko-fi](https://img.shields.io/badge/Support-Ko--fi-FF5E5B?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/lauloque)

**Formats keyboard text (kbd) in your Obsidian notes quickly and consistently.**

This Obsidian plugin allows you to select text within your notes and, with a simple keyboard shortcut (Ctrl+Y by default), automatically format common keyboard keys and mouse buttons using HTML `<kbd>` tags. This provides a visually distinct and semantic way to represent user input instructions in your writing.

## Features

- **Effortless Formatting:** Select text containing keyboard key names and press <kbd>Ctrl</kbd> <kbd>Y</kbd> to format them. For example`ctrl shift a` will become <kbd>⌘ Ctrl</kbd> <kbd>⇧ Shift</kbd> <kbd>A</kbd>.
- **Intelligent Recognition:** Recognizes common modifier keys (Ctrl, Shift, Alt, Cmd, Win, etc.) like "ctrl" as <kbd>⌘ Ctrl</kbd>, "shift" as <kbd>⇧ Shift</kbd>, "alt" as <kbd>⌥ Alt</kbd>, "cmd" or "command" as <kbd>⌘ Cmd</kbd>, "win" or "windows" as <kbd>Win</kbd>, etc. Also handles function keys (<kbd>F1</kbd>-<kbd>F12</kbd>), navigation keys (e.g., "tab" as <kbd>⇥ Tab</kbd>, "delete" as <kbd>⌦ Delete</kbd>, "enter" as <kbd>⏎ Enter</kbd>), and arrow keys (e.g., "up" as <kbd>↑ Up</kbd>, "left" as <kbd>← Left</kbd>, etc.).
- **Mouse Button Formatting:** Formats mouse buttons like "lmb" as <kbd>Left 🖱️</kbd>, "rmb" as <kbd>Right 🖱️</kbd>, "mmb" as <kbd>Middle 🖱️</kbd>, and "wheel" or "scrollwheel" as <kbd>Wheel 🖱️</kbd>.
- **Case-Insensitive Matching:** Key names are recognized regardless of their capitalization (e.g., "Ctrl", "ctrl", and "CTRL" all become <kbd>⌘ Ctrl</kbd>).
- **Single Letter Capitalization:** Capitalizes single-letter words (useful for individual key presses), like "a" becoming <kbd>A</kbd>.
- **Consistent Styling:** Uses HTML `<kbd>` tags, which can be easily styled with custom CSS to match your Obsidian theme.
- **Light and Dark themes** for everyone to enjoy!

## How to Use

1. **Install the plugin:**
   
   - Open Obsidian.
   - Go to **Settings** -> **Community plugins**.
   - Make sure **Safe mode** is off.
   - Click **Browse** and search for "Obsidian Keyboard Formatter".
   - Click **Install** and then **Enable** the plugin.
   - Alternatively, you can manually install it by copying the contents of [the latest GitHub release](https://github.com/Lauloque/Obsidian-Keyboard-Formatter/releases/latest) from this repository into your Obsidian vault's plugins folder (`<your_vault>/.obsidian/plugins/obsidian-keyboard-formatter`), then enable the plugin from your Obsidian's Community plugins list.

2. **Format text:**
   
   - Open a Markdown note in Obsidian.
   - Select the text you want to format (e.g., `ctrl shift a`).
   - Press the default keyboard shortcut: <kbd>&#9096; Ctrl</kbd> <kbd>Y</kbd> (Windows/Linux) or <kbd>&#8984; Cmd</kbd> <kbd>Y</kbd> (macOS ).
   - The selected text will be transformed into: `<kbd>⌘ Ctrl</kbd> <kbd>⇧ Shift</kbd> <kbd>A</kbd>` which looks like this: <kbd>⌘ Ctrl</kbd> <kbd>⇧ Shift</kbd> <kbd>A</kbd>.

## Support My Work

[![Support me on Ko-fi](https://img.shields.io/badge/Support-Ko--fi-FF5E5B?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/lauloque)

If you find this plugin helpful and would like to support its development, you can buy me a coffee on Ko-fi! Your support is greatly appreciated.

---

Thank you for using Obsidian Keyboard Formatter! If you have any issues or suggestions, please feel free to open an issue on this repository.
