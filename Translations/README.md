# Mini Life Explorers Translation System

This folder contains the translation system for Mini Life Explorers. It allows the application to be translated into multiple languages.

## Structure

- `translations.js`: The main translation utility that handles loading and managing translations
- `language-selector.js`: A UI component for selecting different languages
- Language files (JSON): Each language has its own JSON file (e.g., `en.json`, `es.json`, etc.)

## Supported Languages

Currently, the following languages are supported:

- English (`en.json`)
- Spanish (`es.json`)
- Arabic (`ar.json`)
- Chinese (`zh.json`)
- French (`fr.json`)
- German (`de.json`)
- Greek (`el.json`)
- Hindi (`hi.json`)
- Italian (`it.json`)
- Japanese (`ja.json`)
- Portuguese (`pt.json`)
- Russian (`ru.json`)

## How to Use

### 1. Include the Translation Scripts

Add these scripts to your HTML file:

```html
<script src="Translations/translations.js"></script>
<script src="Translations/language-selector.js"></script>
```

### 2. Initialize the Translation System

Initialize the translation system when your application loads:

```javascript
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize the translation system
  await i18n.init();
  
  // Initialize the language selector
  languageSelector.init();
  
  // Update the UI with translations
  i18n.updateUI();
});
```

### 3. Mark HTML Elements for Translation

Add `data-i18n` attributes to elements that need to be translated:

```html
<h1 data-i18n="general.title">Mini Life Explorers</h1>
<button data-i18n="controls.start">Start Adventure!</button>
```

### 4. Translate Text in JavaScript

Use the `translate` method to translate text in JavaScript:

```javascript
const message = i18n.translate('controls.emptyGridMessage');
console.log(message); // "Adventure needs at least one happy friend to start!"
```

### 5. Add the Language Selector to Your UI

The language selector will be automatically added to the page. You can style it or position it as needed.

## Adding a New Language

To add a new language:

1. Create a new JSON file in the Translations folder (e.g., `fr.json`)
2. Copy the structure from `en.json` and translate all the strings
3. Add the language code to the `supportedLanguages` array in `translations.js`
4. Add the language name to the `languageNames` object in `translations.js`

## Translation Keys

The translation keys are organized in a hierarchical structure:

- `general`: General application strings
- `controls`: UI control labels
- `stats`: Statistics and counters
- `instructions`: User instructions
- `legend`: Legend items
- `rules`: Game rules
- `timeExplanation`: Time explanation
- `mathExplanation`: Math explanation
- `patterns`: Pattern descriptions
- `emojis`: Emoji characters

## RTL Language Support

For right-to-left (RTL) languages like Arabic, the translation system automatically sets the `dir="rtl"` attribute on the HTML element when such languages are selected.