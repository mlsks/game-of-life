// script.js - Main entry point for the Mini Life Explorers application
// This file loads all necessary modules in a non-module way to avoid CORS issues with file:// protocol

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');
    
    // Variables to track loaded modules
    let loadedModules = 0;
    const totalModules = 8;
    
    // Function to check if all modules are loaded
    function checkAllModulesLoaded() {
        loadedModules++;
        if (loadedModules === totalModules) {
            console.log('All modules loaded successfully!');
            // Initialize the application
            if (typeof window.initGame === 'function') {
                window.initGame();
            } else {
                console.error('Application initialization failed. Main module not properly loaded.');
            }
        }
    }
    
    // Create script elements for each module in the correct order
    const moduleScripts = [
        'modules/config.js',         // Configuration settings
        'modules/grid.js',           // Grid setup and rendering
        'modules/gameLogic.js',      // Game rules and logic
        'modules/animation.js',      // Visual animations
        'modules/music.js',          // Background music
        'modules/soundEffects.js',   // Sound effects
        'modules/eventHandlers.js',  // User interaction handlers
        'modules/main.js'            // Main application logic
    ];
    
    // Load each script
    moduleScripts.forEach(function(scriptSrc) {
        const script = document.createElement('script');
        script.src = scriptSrc;
        script.onload = checkAllModulesLoaded;
        script.onerror = function() {
            console.error('Error loading script:', scriptSrc);
            checkAllModulesLoaded(); // Continue even if there's an error
        };
        document.body.appendChild(script);
    });
});

// Assuming toggleMute, isMuted, gameMusicPlayer, and SoundEffects become globally available
// or are part of an object that this function can access.
// This is added here as per prompt instruction to modify script.js for toggleMute.
function toggleMute() {
  if (typeof window.isMuted === 'undefined') {
    // Initialize if not already (e.g. by music.js or main.js)
    window.isMuted = false;
  }
  window.isMuted = !window.isMuted;

  if (window.isMuted) {
    if (window.gameMusicPlayer && typeof window.gameMusicPlayer.pause === 'function') {
      window.gameMusicPlayer.pause();
    }
    if (window.SoundEffects && typeof window.SoundEffects.mute === 'function') {
      window.SoundEffects.mute();
    }
  } else {
    if (window.gameMusicPlayer && typeof window.gameMusicPlayer.play === 'function') {
      window.gameMusicPlayer.play();
    }
    if (window.SoundEffects && typeof window.SoundEffects.unmute === 'function') {
      window.SoundEffects.unmute();
    }
  }

  const muteIcon = document.getElementById('mute-icon');
  if (muteIcon) {
    muteIcon.textContent = window.isMuted ? '🔇' : '🔊';
  }

  // Persist mute state (assuming a similar function exists or should exist)
  if (typeof window.saveMuteState === 'function') {
    window.saveMuteState(window.isMuted);
  } else {
    localStorage.setItem("isMuted", window.isMuted); // Fallback to localStorage
  }
}

// Example of how mute state might be loaded initially (needs to be called after DOM is ready and mute-icon exists)
// This would typically be in main.js or eventHandlers.js after DOMContentLoaded.
// For the purpose of this task, placing a self-invoking function to update icon on load.
(function() {
  document.addEventListener('DOMContentLoaded', () => {
    // Ensure isMuted is loaded from localStorage or defaults to false
    if (typeof window.isMuted === 'undefined') {
        window.isMuted = localStorage.getItem("isMuted") === "true" || false;
    }
    const muteIcon = document.getElementById('mute-icon');
    if (muteIcon) {
        muteIcon.textContent = window.isMuted ? '🔇' : '🔊';
    }
    // Ensure the mute toggle button has the event listener if it's not added elsewhere
    const muteButton = document.getElementById('mute-toggle');
    if (muteButton && !muteButton.onclick) { // Check if an onclick is already set
        muteButton.onclick = toggleMute;
    }
  });
})();