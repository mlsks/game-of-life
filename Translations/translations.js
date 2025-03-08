/**
 * Translation utility for Mini Life Explorers
 * This module handles loading and managing translations for the application
 */

class TranslationManager {
  constructor() {
    this.currentLanguage = 'en';
    this.translations = {};
    this.supportedLanguages = ['en', 'es', 'ar', 'zh', 'fr', 'de', 'el', 'hi', 'it', 'ja', 'pt', 'ru']; // All supported languages
    
    // Language names for UI display
    this.languageNames = {
      'en': 'English',
      'es': 'Español (Spanish)',
      'ar': 'العربية (Arabic)',
      'zh': '中文 (Chinese)',
      'fr': 'Français (French)',
      'de': 'Deutsch (German)',
      'el': 'Ελληνικά (Greek)',
      'hi': 'हिन्दी (Hindi)',
      'it': 'Italiano (Italian)',
      'ja': '日本語 (Japanese)',
      'pt': 'Português (Portuguese)',
      'ru': 'Русский (Russian)'
    };

    // Fallback translations
    this.fallbackTranslations = {
      'language': {
        'changeLanguage': 'Change Language'
      }
    };
  }

  /**
   * Initialize the translation system
   * @param {string} defaultLanguage - The default language to use
   * @returns {Promise} - A promise that resolves when translations are loaded
   */
  async init(defaultLanguage = 'en') {
    // Set default language based on browser settings if available
    const browserLang = navigator.language.split('-')[0];
    if (this.supportedLanguages.includes(browserLang)) {
      this.currentLanguage = browserLang;
    } else {
      this.currentLanguage = defaultLanguage;
    }

    // Load the current language translations
    await this.loadTranslation(this.currentLanguage);
    
    return this;
  }

  /**
   * Load translations for a specific language
   * @param {string} lang - The language code to load
   * @returns {Promise} - A promise that resolves when the translation is loaded
   */
  async loadTranslation(lang) {
    try {
      const response = await fetch(`Translations/${lang}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load ${lang} translations`);
      }
      this.translations[lang] = await response.json();
      this.currentLanguage = lang;
    } catch (error) {
      console.error(`Error loading translations for ${lang}:`, error);
      // If loading fails and it's not English, try to fall back to English
      if (lang !== 'en') {
        console.log('Falling back to English translations');
        await this.loadTranslation('en');
      }
    }
  }

  /**
   * Change the current language
   * @param {string} lang - The language code to switch to
   * @returns {Promise} - A promise that resolves when the language is changed
   */
  async changeLanguage(lang) {
    if (!this.supportedLanguages.includes(lang)) {
      console.error(`Language ${lang} is not supported`);
      return false;
    }

    // Only load if we don't already have this language loaded
    if (!this.translations[lang]) {
      await this.loadTranslation(lang);
    } else {
      this.currentLanguage = lang;
    }

    // Update the UI with new translations
    this.updateUI();
    
    return true;
  }

  /**
   * Get a translated string by key
   * @param {string} key - The translation key in dot notation (e.g., 'controls.start')
   * @param {Object} replacements - Optional key-value pairs for string replacements
   * @returns {string} - The translated string
   */
  translate(key, replacements = {}) {
    // Split the key by dots to navigate the nested structure
    const keyParts = key.split('.');
    let value = this.translations[this.currentLanguage];
    
    // Navigate through the nested structure
    for (const part of keyParts) {
      if (value && value[part] !== undefined) {
        value = value[part];
      } else {
        // Try fallback translations
        let fallbackValue = this.fallbackTranslations;
        for (const part of keyParts) {
          if (fallbackValue && fallbackValue[part] !== undefined) {
            fallbackValue = fallbackValue[part];
          } else {
            console.warn(`Translation key not found: ${key}`);
            return key; // Return the key itself as fallback
          }
        }
        value = fallbackValue;
      }
    }

    // If the value is not a string, return it as is
    if (typeof value !== 'string') {
      return value;
    }

    // Replace placeholders with values
    let result = value;
    for (const [placeholder, replacement] of Object.entries(replacements)) {
      result = result.replace(new RegExp(`{${placeholder}}`, 'g'), replacement);
    }

    return result;
  }

  /**
   * Update all translatable elements in the UI
   */
  updateUI() {
    // Find all elements with data-i18n attribute
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.translate(key);
      
      // Check if the element has a data-i18n-attr attribute
      const attr = element.getAttribute('data-i18n-attr');
      if (attr) {
        // Update the specified attribute
        element.setAttribute(attr, translation);
      } else {
        // Update the element's text content
        element.textContent = translation;
      }
    });

    // Update elements with data-i18n-placeholder attribute
    const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
    placeholderElements.forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      element.placeholder = this.translate(key);
    });

    // Update elements with data-i18n-title attribute
    const titleElements = document.querySelectorAll('[data-i18n-title]');
    titleElements.forEach(element => {
      const key = element.getAttribute('data-i18n-title');
      element.title = this.translate(key);
    });
    
    // Update document title
    document.title = this.translate('general.title');
    
    // Dispatch an event that the language has changed
    window.dispatchEvent(new CustomEvent('languageChanged', {
      detail: { language: this.currentLanguage }
    }));
  }

  /**
   * Get the list of supported languages
   * @returns {Array} - Array of supported language codes
   */
  getSupportedLanguages() {
    return this.supportedLanguages;
  }

  /**
   * Get the language names for display
   * @returns {Object} - Object mapping language codes to display names
   */
  getLanguageNames() {
    return this.languageNames;
  }

  /**
   * Get the current language
   * @returns {string} - The current language code
   */
  getCurrentLanguage() {
    return this.currentLanguage;
  }
  
  /**
   * Get the display name for a language code
   * @param {string} langCode - The language code
   * @returns {string} - The display name for the language
   */
  getLanguageDisplayName(langCode) {
    return this.languageNames[langCode] || langCode;
  }
}

// Create and export a singleton instance
const i18n = new TranslationManager();

// For use in non-module environments
window.i18n = i18n;

// For use in module environments
export default i18n;