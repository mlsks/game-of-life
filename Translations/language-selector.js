export default class LanguageSelector {
  constructor() {
    this.languageButton = document.getElementById("language-toggle");
    this.dropdown = null;
    this.isOpen = false;
    
    // Add default language names mapping for initial load
    this.languageNames = {
      "en": "English",
      "es": "Español",
      "fr": "Français",
      "de": "Deutsch",
      "zh": "中文",
      "ja": "日本語",
      "ar": "العربية",
      "el": "Ελληνικά",
      "hi": "हिन्दी",
      "it": "Italiano",
      "pt": "Português",
      "ru": "Русский"
    };
  }

  init() {
    // Add styling to prevent button resizing
    this.languageButton.style.width = "fit-content";
    this.languageButton.style.whiteSpace = "nowrap";

    this.languageButton.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggleDropdown();
    });

    document.addEventListener("click", () => {
      if (this.isOpen) {
        this.closeDropdown();
      }
    });
  }

  toggleDropdown() {
    if (this.isOpen) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  openDropdown() {
    if (!this.dropdown) {
      this.createDropdown();
    }
    this.dropdown.style.display = "flex";
    this.isOpen = true;
  }

  closeDropdown() {
    if (this.dropdown) {
      this.dropdown.style.display = "none";
      this.isOpen = false;
    }
  }

  createDropdown() {
    this.dropdown = document.createElement("div");
    this.dropdown.className = "language-dropdown";

    const languages = [
      { code: "en", name: "English" },
      { code: "es", name: "Español" },
      { code: "fr", name: "Français" },
      { code: "de", name: "Deutsch" },
      { code: "zh", name: "中文" },
      { code: "ja", name: "日本語" },
      { code: "ar", name: "العربية" },
      { code: "el", name: "Ελληνικά" },
      { code: "hi", name: "हिन्दी" },
      { code: "it", name: "Italiano" },
      { code: "pt", name: "Português" },
      { code: "ru", name: "Русский" },
    ];

    languages.forEach((lang) => {
      const option = document.createElement("div");
      option.className = "language-option";
      
      // Add flag image
      const flagImg = document.createElement("img");
      flagImg.src = `flags/${lang.code}.png`;
      flagImg.alt = lang.name;
      option.appendChild(flagImg);
      
      // Add language name
      const langName = document.createElement("span");
      langName.textContent = lang.name;
      option.appendChild(langName);
      
      // Add shine effect element
      const shine = document.createElement("span");
      shine.className = "shine";
      option.appendChild(shine);
      
      option.dataset.lang = lang.code;
      option.addEventListener("click", (e) => {
        e.stopPropagation();
        this.changeLanguage(lang.code);
        this.closeDropdown();
      });
      
      this.dropdown.appendChild(option);
    });

    // Position dropdown below the button
    const buttonRect = this.languageButton.getBoundingClientRect();
    this.dropdown.style.top = `${buttonRect.bottom + window.scrollY + 10}px`;
    this.dropdown.style.left = `${buttonRect.left + window.scrollX}px`;

    document.body.appendChild(this.dropdown);
  }

  changeLanguage(langCode) {
    // Dispatch language change event
    const event = new CustomEvent("languageChanged", {
      detail: { language: langCode },
    });
    document.dispatchEvent(event);

    // Update button with flag and text
    const span = this.languageButton.querySelector('.button-text');
    
    // Find language name from the dropdown, use the pre-defined mapping, or fallback to langCode
    let langName = this.languageNames[langCode] || langCode;
    
    if (this.dropdown) {
      const langOption = this.dropdown.querySelector(`[data-lang="${langCode}"]`);
      if (langOption) {
        // Get just the text content of the span inside the language option
        const nameSpan = langOption.querySelector('span');
        if (nameSpan) {
          langName = nameSpan.textContent;
        }
      }
    }
    
    // Create a new flag element if it doesn't exist
    let flagImg = this.languageButton.querySelector('.lang-flag');
    if (!flagImg) {
      flagImg = document.createElement('img');
      flagImg.className = 'lang-flag';
      
      // Check if there's an icon first
      const icon = this.languageButton.querySelector('i');
      
      // Insert the flag image in the appropriate location
      if (icon) {
        // Insert after icon if it exists
        icon.after(flagImg);
      } else if (span) {
        // Insert before span if icon doesn't exist but span does
        span.before(flagImg);
      } else {
        // Just append to button if neither icon nor span exists
        this.languageButton.appendChild(flagImg);
      }
    }
    
    // Update the flag image source
    flagImg.src = `flags/${langCode}.png`;
    flagImg.alt = langName;
    
    // Update the span text if it exists
    if (span) {
      span.textContent = langName;
    }
  }
}