/**
 * Translation utility for Mini Life Explorers
 * This module handles loading and managing translations for the application
 */

import LanguageSelector from "./language-selector.js";

class TranslationManager {
  constructor() {
    this.currentLanguage = "en";
    this.translations = {};
    this.supportedLanguages = [
      "en",
      "es",
      "ar",
      "zh",
      "fr",
      "de",
      "el",
      "hi",
      "it",
      "ja",
      "pt",
      "ru",
    ];

    // Language names will be loaded from translation files
    this.languageNames = {};

    // Fallback translations will be loaded from en.json
    this.fallbackTranslations = {};
  }

  /**
   * Initialize the translation system
   * @param {string} defaultLanguage - The default language to use
   * @returns {Promise} - A promise that resolves when translations are loaded
   */
  async init(defaultLanguage = "en") {
    // Set default language to English regardless of browser settings
    this.currentLanguage = defaultLanguage;

    // Load the current language translations
    await this.loadTranslation(this.currentLanguage);

    // Initialize language selector
    this.languageSelector = new LanguageSelector();
    this.languageSelector.init();
    
    // Set initial flag in language button (ensure it's English)
    this.languageSelector.changeLanguage(this.currentLanguage);

    // Listen for language change events
    document.addEventListener("languageChanged", async (e) => {
      const lang = e.detail.language;
      if (this.supportedLanguages.includes(lang)) {
        await this.loadTranslation(lang);
        this.updateUITranslations();
      }
    });

    return this;
  }
  
  /**
   * Update all UI elements with new translations
   */
  updateUITranslations() {
    // Find all elements with data-translate attribute
    const translatableElements = document.querySelectorAll("[data-translate]");
    translatableElements.forEach((element) => {
      const key = element.getAttribute("data-translate");
      const translation = this.getTranslation(key);
      if (translation) {
        element.textContent = translation;
      }
    });
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
      const translations = await response.json();
      this.translations[lang] = translations;
      this.currentLanguage = lang;

      // Store the language name if available
      if (translations.language?.languageName) {
        this.languageNames[lang] = translations.language.languageName;
      }
    } catch (error) {
      console.error(`Error loading translations for ${lang}:`, error);
      // If loading fails and it's not English, try to fall back to English
      if (lang !== "en") {
        console.log("Falling back to English translations");
        await this.loadTranslation("en");
      } else {
        // If even English fails, use minimal hardcoded fallback
        this.translations[lang] = this.fallbackTranslations;
        this.currentLanguage = lang;
      }
    }
  }

  /**
   * Get translation for current language
   * @param {string} key - Translation key in format "category.subkey"
   * @returns {string} - Translated text
   */
  getTranslation(key) {
    const keys = key.split(".");
    let translation = this.translations[this.currentLanguage];

    for (const k of keys) {
      translation = translation?.[k];
      if (!translation) break;
    }

    return translation || this.fallbackTranslations[key] || key;
  }

  /**
   * Get current language code
   * @returns {string} - Current language code
   */
  getCurrentLanguage() {
    return this.currentLanguage;
  }

  /**
   * Get supported languages
   * @returns {Array} - Array of supported language codes
   */
  getSupportedLanguages() {
    return this.supportedLanguages;
  }

  /**
   * Get language name for display
   * @param {string} lang - Language code
   * @returns {string} - Language name
   */
  getLanguageName(lang) {
    return this.languageNames[lang] || lang;
  }
}

// Export as singleton instance
export const translationManager = new TranslationManager();