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