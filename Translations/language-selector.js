/**
 * Language selector component for Mini Life Explorers
 * This module creates a dropdown menu for selecting different languages
 */

class LanguageSelector {
  constructor(containerId = 'language-selector', i18n) {
    this.containerId = containerId;
    this.i18n = i18n || window.i18n;
    this.container = null;
    this.dropdown = null;
    this.initialized = false;
  }

  /**
   * Initialize the language selector
   */
  init() {
    if (this.initialized) return;

    // Create container if it doesn't exist
    this.container = document.getElementById(this.containerId);
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = this.containerId;
      this.container.className = 'language-selector';
      document.body.appendChild(this.container);
    }

    // Create the dropdown
    this.createDropdown();
    
    // Mark as initialized
    this.initialized = true;
  }

  /**
   * Create the language dropdown
   */
  createDropdown() {
    // Create the select element
    this.dropdown = document.createElement('select');
    this.dropdown.className = 'language-dropdown';
    
    // Get supported languages and their display names
    const languages = this.i18n.getSupportedLanguages();
    const languageNames = this.i18n.getLanguageNames();
    
    // Add options for each language
    languages.forEach(langCode => {
      const option = document.createElement('option');
      option.value = langCode;
      option.textContent = languageNames[langCode] || langCode;
      
      // Set the current language as selected
      if (langCode === this.i18n.getCurrentLanguage()) {
        option.selected = true;
      }
      
      this.dropdown.appendChild(option);
    });
    
    // Add change event listener
    this.dropdown.addEventListener('change', this.handleLanguageChange.bind(this));
    
    // Create a label
    const label = document.createElement('label');
    label.htmlFor = 'language-dropdown';
    label.className = 'language-label';
    label.innerHTML = '<i class="fas fa-globe"></i> '; // Globe icon
    
    // Add elements to container
    this.container.appendChild(label);
    this.container.appendChild(this.dropdown);
    
    // Add some basic styling
    this.addStyles();
  }

  /**
   * Handle language change event
   * @param {Event} event - The change event
   */
  async handleLanguageChange(event) {
    const newLanguage = event.target.value;
    
    // Show loading indicator
    this.dropdown.classList.add('loading');
    
    // Change the language
    await this.i18n.changeLanguage(newLanguage);
    
    // Remove loading indicator
    this.dropdown.classList.remove('loading');
  }

  /**
   * Add basic styles for the language selector
   */
  addStyles() {
    // Check if styles already exist
    if (document.getElementById('language-selector-styles')) return;
    
    // Create style element
    const style = document.createElement('style');
    style.id = 'language-selector-styles';
    
    // Add CSS rules
    style.textContent = `
      .language-selector {
        display: flex;
        align-items: center;
        margin: 10px 0;
        font-family: inherit;
      }
      
      .language-label {
        margin-right: 8px;
        color: #555;
        display: flex;
        align-items: center;
      }
      
      .language-dropdown {
        padding: 6px 10px;
        border: 2px solid #ddd;
        border-radius: 8px;
        background-color: white;
        font-size: 14px;
        cursor: pointer;
        outline: none;
        transition: border-color 0.3s, box-shadow 0.3s;
      }
      
      .language-dropdown:hover {
        border-color: #aaa;
      }
      
      .language-dropdown:focus {
        border-color: #4a90e2;
        box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
      }
      
      .language-dropdown.loading {
        opacity: 0.7;
        cursor: wait;
      }
      
      /* RTL language support */
      [dir="rtl"] .language-label {
        margin-right: 0;
        margin-left: 8px;
      }
      
      /* For dark mode if needed */
      @media (prefers-color-scheme: dark) {
        .language-dropdown {
          background-color: #333;
          color: #fff;
          border-color: #555;
        }
        
        .language-label {
          color: #ccc;
        }
        
        .language-dropdown:hover {
          border-color: #777;
        }
        
        .language-dropdown:focus {
          border-color: #4a90e2;
          box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.3);
        }
      }
    `;
    
    // Add to document head
    document.head.appendChild(style);
  }
}

// Create and export a singleton instance
const languageSelector = new LanguageSelector();

// For use in non-module environments
window.languageSelector = languageSelector;

// For use in module environments
export default languageSelector;