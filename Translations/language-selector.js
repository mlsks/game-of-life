export default class LanguageSelector {
  constructor() {
    this.languageButton = document.getElementById("language-toggle");
    this.dropdown = null;
    this.isOpen = false;
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
    this.dropdown.style.display = "block";
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
    this.dropdown.style.position = "absolute";
    this.dropdown.style.backgroundColor = "#fff";
    this.dropdown.style.border = "1px solid #ccc";
    this.dropdown.style.borderRadius = "4px";
    this.dropdown.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
    this.dropdown.style.zIndex = "1000";
    this.dropdown.style.minWidth = "120px";

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
      option.style.padding = "8px 12px";
      option.style.cursor = "pointer";
      option.style.color = "#333";
      option.style.fontSize = "14px";
      option.style.transition = "background-color 0.2s";

      option.addEventListener("mouseenter", () => {
        option.style.backgroundColor = "#f5f5f5";
      });
      option.addEventListener("mouseleave", () => {
        option.style.backgroundColor = "transparent";
      });

      option.textContent = lang.name;
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
    this.dropdown.style.position = "absolute";
    this.dropdown.style.top = `${buttonRect.bottom + window.scrollY}px`;
    this.dropdown.style.left = `${buttonRect.left + window.scrollX}px`;

    document.body.appendChild(this.dropdown);
  }

  changeLanguage(langCode) {
    // Dispatch language change event
    const event = new CustomEvent("languageChanged", {
      detail: { language: langCode },
    });
    document.dispatchEvent(event);

    // Update button text
    const selectedLang = this.dropdown.querySelector(
      `[data-lang="${langCode}"]`
    );
    if (selectedLang) {
      this.languageButton.textContent = selectedLang.textContent;
    }
  }
}
