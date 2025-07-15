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
        
        // Add the custom document class and apply color variables
        document.body.addClass('fkt-plugin-active');
        this.applyCSSVariables();
        
        // Add custom keyboard shortcut
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
        // Remove the custom document class
        document.body.removeClass('fkt-plugin-active');
        this.removeCSSVariables();
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
        this.applyCSSVariables(); // Reapply CSS variables when settings change
    }

    applyCSSVariables() {
        // Set CSS custom properties for the colors
        document.documentElement.style.setProperty('--fkt-light-bg-color', this.settings.lightBgColor);
        document.documentElement.style.setProperty('--fkt-light-text-color', this.settings.lightTextColor);
        document.documentElement.style.setProperty('--fkt-dark-bg-color', this.settings.darkBgColor);
        document.documentElement.style.setProperty('--fkt-dark-text-color', this.settings.darkTextColor);
    }

    removeCSSVariables() {
        // Remove CSS custom properties
        document.documentElement.style.removeProperty('--fkt-light-bg-color');
        document.documentElement.style.removeProperty('--fkt-light-text-color');
        document.documentElement.style.removeProperty('--fkt-dark-bg-color');
        document.documentElement.style.removeProperty('--fkt-dark-text-color');
    }

    formatText(editor: Editor) {
        let selection = editor.getSelection();
        
        // Numpad case
        selection = selection.replace(/\b(Numpad|numpad)[\s_-]*(\d+|\+|\-|\*|\/|enter|return|dot|\.|decimal)/gi, function (match, prefix, key) {
            console.log("REGEX MATCHED:", match, "prefix:", prefix, "key:", key);
            if (key.toLowerCase() === "dot" || key === "." || key.toLowerCase() === "decimal") {
                return "Numpad&nbsp;•";
            } else if (key.toLowerCase() === "enter" || key.toLowerCase() === "return") {
                return "Numpad&nbsp;&#9166;Enter";
            } else {
                return "Numpad&nbsp;" + key;
            }
        });
        
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
                case "erase":
                case "delete":
                case "del": replacement = "&#9003; Delete"; break;
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
                
                default:
                    if (lowerWord.startsWith('numpad')) {
                        // Keep it as-is, it's already been processed
                        replacement = word;
                    }
                    break;
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

        containerEl.createEl('h2', {text: 'Keyboard formatter settings'});

        // Preview section
        const previewContainer = containerEl.createEl('div', {cls: 'fkt-preview-container'});
        previewContainer.createEl('h3', {text: 'Preview'});
        
        const previewsWrapper = previewContainer.createEl('div', {cls: 'fkt-previews-wrapper'});
        
        // Light theme preview
        const lightPreview = previewsWrapper.createEl('div', {cls: 'fkt-preview-section fkt-light-preview'});
        lightPreview.createEl('div', {text: 'Light theme', cls: 'fkt-preview-label'});
        const lightPreviewContent = lightPreview.createEl('div', {cls: 'fkt-preview-content'});
        
        const lightCtrlKbd = lightPreviewContent.createEl('kbd', {cls: 'fkt-preview-kbd'});
        // Use textContent for the symbol and text separately to avoid security issues
        lightCtrlKbd.textContent = '⎈ Ctrl';
        lightPreviewContent.createSpan(' ');
        lightPreviewContent.createEl('kbd', {cls: 'fkt-preview-kbd', text: 'S'});
        
        // Dark theme preview
        const darkPreview = previewsWrapper.createEl('div', {cls: 'fkt-preview-section fkt-dark-preview'});
        darkPreview.createEl('div', {text: 'Dark theme', cls: 'fkt-preview-label'});
        const darkPreviewContent = darkPreview.createEl('div', {cls: 'fkt-preview-content'});
        
        const darkCtrlKbd = darkPreviewContent.createEl('kbd', {cls: 'fkt-preview-kbd'});
        darkCtrlKbd.textContent = '⎈ Ctrl';
        darkPreviewContent.createSpan(' ');
        darkPreviewContent.createEl('kbd', {cls: 'fkt-preview-kbd', text: 'S'});

        // Update preview colors
        this.updatePreviewColors();

        // Light theme settings
        containerEl.createEl('h3', {text: 'Light theme colors'});

        new Setting(containerEl)
            .setName('Background color')
            .setDesc('Background color for kbd elements in light theme')
            .addColorPicker(colorPicker => {
                colorPicker.setValue(this.plugin.settings.lightBgColor);
                
                colorPicker.onChange(async (value) => {
                    this.plugin.settings.lightBgColor = value;
                    this.updatePreviewColors();
                    await this.plugin.saveSettings();
                });
            });

        new Setting(containerEl)
            .setName('Text color')
            .setDesc('Text color for kbd elements in light theme')
            .addColorPicker(colorPicker => colorPicker
                .setValue(this.plugin.settings.lightTextColor)
                .onChange(async (value) => {
                    this.plugin.settings.lightTextColor = value;
                    this.updatePreviewColors();
                    await this.plugin.saveSettings();
                }));

        // Dark theme settings
        containerEl.createEl('h3', {text: 'Dark theme colors'});

        new Setting(containerEl)
            .setName('Background color')
            .setDesc('Background color for kbd elements in dark theme')
            .addColorPicker(colorPicker => colorPicker
                .setValue(this.plugin.settings.darkBgColor)
                .onChange(async (value) => {
                    this.plugin.settings.darkBgColor = value;
                    this.updatePreviewColors();
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Text color')
            .setDesc('Text color for kbd elements in dark theme')
            .addColorPicker(colorPicker => colorPicker
                .setValue(this.plugin.settings.darkTextColor)
                .onChange(async (value) => {
                    this.plugin.settings.darkTextColor = value;
                    this.updatePreviewColors();
                    await this.plugin.saveSettings();
                }));

        // Reset button
        new Setting(containerEl)
            .setName('Reset to defaults')
            .setDesc('Reset all colors to default values')
            .addButton(button => button
                .setButtonText('Reset')
                .onClick(async () => {
                    this.plugin.settings = Object.assign({}, DEFAULT_SETTINGS);
                    await this.plugin.saveSettings();
                    this.display(); // Refresh the settings display
                }));
    }

    updatePreviewColors() {
        // Update CSS custom properties for preview colors
        document.documentElement.style.setProperty('--fkt-preview-light-bg', this.plugin.settings.lightBgColor);
        document.documentElement.style.setProperty('--fkt-preview-light-text', this.plugin.settings.lightTextColor);
        document.documentElement.style.setProperty('--fkt-preview-dark-bg', this.plugin.settings.darkBgColor);
        document.documentElement.style.setProperty('--fkt-preview-dark-text', this.plugin.settings.darkTextColor);
    }
}