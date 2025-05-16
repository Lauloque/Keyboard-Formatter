import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

export default class ObsidianKeyboardFormatter extends Plugin {
    async onload() {
        this.addCommand({
            id: 'format-keyboard-text',
            name: 'Format Keyboard Text',
            hotkeys: [{ modifiers: ['Ctrl'], key: 'y' }],
            editorCallback: (editor: Editor, ctx: MarkdownView | MarkdownFileInfo) => {
                if (ctx instanceof MarkdownView) {
                    this.formatText(editor);
                }
            }
        });
    }

    async onunload() {
        // Clean up resources if needed
    }

    formatText(editor: Editor) {
        const selection = editor.getSelection();
        const words = selection.match(/\S+/g) || [];
        const formattedText: string[] = [];

        for (const word of words) {
            const lowerWord = word.toLowerCase();
            let replacement = word;
            
            switch (lowerWord) {
                // Modifier Keys
                case "control":
                case "ctrl": replacement = "&#9096; Ctrl"; break;
                case "shift": replacement = "&#8679; Shift"; break;
                case "alt": replacement = "&#9095; Alt"; break;
                case "caps":
                case "capslock": replacement = "&#8682; Caps Lock"; break;

                // OS Keys
                case "win":
                case "windows":
                case "windowskey":
                case "winkey": replacement = "Win"; break;
                case "super":
                case "linux":
                case "linuxkey":
                case "tuxkey": replacement = "&#8984; Super"; break;
                case "meta": replacement = "&#9670; Meta"; break;
                case "command":
                case "cmd": replacement = "&#8984; Cmd"; break;
                case "option":
                case "opt": replacement = "&#8997; break";

                // Function Keys
                case "f1": case "f2": case "f3": case "f4":
                case "f5": case "f6": case "f7": case "f8":
                case "f9": case "f10": case "f11": case "f12":
                    replacement = lowerWord.toUpperCase();
                    break;

                // Navigation & Special Keys
                case "tab": replacement = "&#8633; Tab"; break;
                case "delete":
                case "del": replacement = "&#8998; Delete"; break;
                case "enter":
                case "return": replacement = "&#9166; Enter"; break;
                case "backspace": replacement = "&#10229; Backspace"; break;
                case "pageup":
                case "pgup": replacement = "&#8670; Page Up"; break;
                case "pagedown":
                case "pgdn": replacement = "&#8671; Page Down"; break;
                case "printscreen": replacement = "&#9113; Print Screen"; break;

                // Arrow Keys
                case "up": replacement = "&#8593; Up"; break;
                case "left": replacement = "&#8592; Left"; break;
                case "right": replacement = "&#8594; Right"; break;
                case "down": replacement = "&#8595; Down"; break;

                // Mouse Buttons
                case "lmb": replacement = "Left 🖱️"; break;
                case "rmb": replacement = "Right 🖱️"; break;
                case "mmb": replacement = "Middle 🖱️"; break;
                case "wheel":
                case "scrollwheel":
                case "mousewheel":
                case "mw": replacement = "Wheel 🖱️"; break;
            }

            if (replacement.length === 1) {
                replacement = replacement.toUpperCase();
            }

            formattedText.push(`<kbd>${replacement}</kbd>`);
        }

        editor.replaceSelection(formattedText.join(" "));
    }
}