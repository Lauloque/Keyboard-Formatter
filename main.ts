import { App, Editor, MarkdownView, MarkdownFileInfo, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

interface KeyboardFormatterSettings {
    lightBgColor: string;
    lightTextColor: string;
    darkBgColor: string;
    darkTextColor: string;
}

const DEFAULT_SETTINGS: KeyboardFormatterSettings = {
    lightBgColor: '#e3e6e8',
    lightTextColor: '#333',
    darkBgColor: '#30363d',
    darkTextColor: '#f0f0f0'
}

export default class KeyboardFormatter extends Plugin {
    settings: KeyboardFormatterSettings;

    async onload() {
        await this.loadSettings();
        
        // Add the document class and styles
        document.body.addClass('fkt-plugin-active');
        this.applyStyles();
        
        // Add custom shortcut
        this.addCommand({
            id: 'format-keyboard-text',
            name: 'Format keyboard text.',
            editorCallback: (editor: Editor, ctx: MarkdownView | MarkdownFileInfo) => {
                if (ctx instanceof MarkdownView) {
                    this.formatText(editor);
                }
            }
        });

        // Add settings tab
        this.addSettingTab(new KeyboardFormatterSettingTab(this.app, this));
    }

    async onunload() {
        // Remove the document class and styles
        document.body.removeClass('fkt-plugin-active');
        this.removeStyles();
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
        this.applyStyles(); // Reapply styles when settings change
    }

    applyStyles() {
        // Remove existing styles first
        this.removeStyles();
        
        const styleEl = document.createElement('style');
        styleEl.id = 'fkt-plugin-styles';
        styleEl.textContent = `
            .fkt-plugin-active kbd {
                background-color: ${this.settings.lightBgColor};
                color: ${this.settings.lightTextColor};
                border: 1px solid #ccc;
                border-radius: 3px;
                padding: 2px 5px;
                font-family: monospace;
                font-size: 0.9em;
            }

            @media (prefers-color-scheme: dark) {
                .fkt-plugin-active kbd {
                    background-color: ${this.settings.darkBgColor};
                    color: ${this.settings.darkTextColor};
                    border: 1px solid #555;
                }
            }
        `;
        document.head.appendChild(styleEl);
    }

    removeStyles() {
        const existingStyle = document.getElementById('fkt-plugin-styles');
        if (existingStyle) {
            existingStyle.remove();
        }
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
                case "opt": replacement = "&#8997; Option"; break;

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

class KeyboardFormatterSettingTab extends PluginSettingTab {
    plugin: KeyboardFormatter;

    constructor(app: App, plugin: KeyboardFormatter) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const {containerEl} = this;

        containerEl.empty();

        containerEl.createEl('h2', {text: 'Keyboard Formatter Settings'});

        // Light theme settings
        containerEl.createEl('h3', {text: 'Light Theme Colors'});

        new Setting(containerEl)
            .setName('Background Color')
            .setDesc('Background color for kbd elements in light theme')
            .addColorPicker(colorPicker => colorPicker
                .setValue(this.plugin.settings.lightBgColor)
                .onChange(async (value) => {
                    this.plugin.settings.lightBgColor = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Text Color')
            .setDesc('Text color for kbd elements in light theme')
            .addColorPicker(colorPicker => colorPicker
                .setValue(this.plugin.settings.lightTextColor)
                .onChange(async (value) => {
                    this.plugin.settings.lightTextColor = value;
                    await this.plugin.saveSettings();
                }));

        // Dark theme settings
        containerEl.createEl('h3', {text: 'Dark Theme Colors'});

        new Setting(containerEl)
            .setName('Background Color')
            .setDesc('Background color for kbd elements in dark theme')
            .addColorPicker(colorPicker => colorPicker
                .setValue(this.plugin.settings.darkBgColor)
                .onChange(async (value) => {
                    this.plugin.settings.darkBgColor = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Text Color')
            .setDesc('Text color for kbd elements in dark theme')
            .addColorPicker(colorPicker => colorPicker
                .setValue(this.plugin.settings.darkTextColor)
                .onChange(async (value) => {
                    this.plugin.settings.darkTextColor = value;
                    await this.plugin.saveSettings();
                }));

        // Reset button
        new Setting(containerEl)
            .setName('Reset to Defaults')
            .setDesc('Reset all colors to default values')
            .addButton(button => button
                .setButtonText('Reset')
                .onClick(async () => {
                    this.plugin.settings = Object.assign({}, DEFAULT_SETTINGS);
                    await this.plugin.saveSettings();
                    this.display(); // Refresh the settings display
                }));
    }
}