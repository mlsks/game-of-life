// Language dropdown fix
document.addEventListener('DOMContentLoaded', function() {
  // Wait for a moment to ensure DOM is fully ready
  setTimeout(function() {
    // Get current language from browser or use 'en' as default
    const currentLang = navigator.language.split("-")[0] || 'en';
    const supportedLangs = ['en', 'es', 'fr', 'de', 'zh', 'ja', 'ar', 'el', 'hi', 'it', 'pt', 'ru'];
    const langCode = supportedLangs.includes(currentLang) ? currentLang : 'en';
    
    // Find the language button
    const languageButton = document.getElementById('language-toggle');
    if (languageButton) {
      // Check if flag already exists
      let flagImg = languageButton.querySelector('.lang-flag');
      if (!flagImg) {
        // Create and insert flag
        flagImg = document.createElement('img');
        flagImg.className = 'lang-flag';
        flagImg.src = `flags/${langCode}.png`;
        flagImg.alt = 'Language flag';
        
        // Insert after the globe icon
        const icon = languageButton.querySelector('i');
        if (icon) {
          icon.after(flagImg);
        }
      }
    }
    
    // Override any existing language dropdown
    document.addEventListener('click', function(e) {
      // If it's the language toggle button
      if (e.target.closest('#language-toggle')) {
        e.stopPropagation();
        
        // Check if dropdown already exists
        let dropdown = document.querySelector('.language-dropdown');
        
        // If dropdown exists and is visible, hide it
        if (dropdown && dropdown.style.display !== 'none') {
          dropdown.style.display = 'none';
          return;
        }
        
        // If dropdown doesn't exist or is hidden, create or show it
        if (!dropdown) {
          // Create dropdown
          dropdown = document.createElement('div');
          dropdown.className = 'language-dropdown';
          document.body.appendChild(dropdown);
          
          // Position dropdown
          const buttonRect = languageButton.getBoundingClientRect();
          dropdown.style.position = 'absolute';
          dropdown.style.top = `${buttonRect.bottom + window.scrollY + 10}px`;
          dropdown.style.left = `${buttonRect.left + window.scrollX}px`;
          
          // Add language options
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
          
          languages.forEach(lang => {
            const option = document.createElement('div');
            option.className = 'language-option';
            
            // Create flag image
            const flagImg = document.createElement('img');
            flagImg.src = `flags/${lang.code}.png`;
            flagImg.alt = lang.name;
            option.appendChild(flagImg);
            
            // Add language name
            const langName = document.createElement('span');
            langName.textContent = lang.name;
            option.appendChild(langName);
            
            // Add shine effect
            const shine = document.createElement('span');
            shine.className = 'shine';
            option.appendChild(shine);
            
            // Add click handler
            option.addEventListener('click', function(e) {
              e.stopPropagation();
              
              // Dispatch language change event
              const event = new CustomEvent('languageChanged', {
                detail: { language: lang.code }
              });
              document.dispatchEvent(event);
              
              // Update button with flag
              let buttonFlag = languageButton.querySelector('.lang-flag');
              if (!buttonFlag) {
                buttonFlag = document.createElement('img');
                buttonFlag.className = 'lang-flag';
                languageButton.querySelector('i').after(buttonFlag);
              }
              buttonFlag.src = `flags/${lang.code}.png`;
              buttonFlag.alt = lang.name;
              
              // Update button text
              const buttonText = languageButton.querySelector('.button-text');
              if (buttonText) {
                buttonText.textContent = lang.name;
              }
              
              // Hide dropdown
              dropdown.style.display = 'none';
            });
            
            dropdown.appendChild(option);
          });
        }
        
        // Show dropdown
        dropdown.style.display = 'flex';
      } else if (!e.target.closest('.language-dropdown')) {
        // Hide dropdown if click is outside
        const dropdown = document.querySelector('.language-dropdown');
        if (dropdown) {
          dropdown.style.display = 'none';
        }
      }
    });
  }, 500);
});