// modules/mascot.js
const mascotSpeechElement = document.getElementById('mascot-speech');
let speechTimeout;

const speeches = {
    welcome: "Hi there, Explorer! Let's build a town!",
    firstFriend: "Yay, our first friend! Keep going!",
    gridCleared: "A fresh start! What will you create?",
    gettingCrowded: "Lots of friends now! So lively!",
    emptyTown: "Oh no, everyone left! Try again?",
    stableTown: "The town is perfectly balanced! Amazing!"
    // Add more as needed
};

export function updateMascotSpeech(eventKey, temporary = true, duration = 4000) {
    if (!mascotSpeechElement) {
        // Try to get the element again in case this function is called before DOM is fully ready
        // or if the element was not found initially.
        const el = document.getElementById('mascot-speech');
        if (!el) return; // Still not found, exit.
        // mascotSpeechElement = el; // This line would cause an error due to const reassignment.
                               // Instead, the function should rely on the module-scoped const.
                               // For robustness, it might be better to pass mascotSpeechElement as an arg
                               // or ensure this module is initialized after DOM content loaded.
    }


    const message = speeches[eventKey] || "Let's have fun!";
    // Ensure mascotSpeechElement is accessible for update
    const currentMascotSpeechElement = document.getElementById('mascot-speech');
    if (currentMascotSpeechElement) {
        currentMascotSpeechElement.textContent = message;
    }


    if (temporary) {
        if (speechTimeout) {
            clearTimeout(speechTimeout);
        }
        speechTimeout = setTimeout(() => {
            const speechEl = document.getElementById('mascot-speech');
            if (speechEl) {
                 speechEl.textContent = getDefaultSpeech();
            }
        }, duration);
    }
}

function getDefaultSpeech() {
    // Could vary this based on game state if desired
    return "Click on homes to build your town!";
}

// Initial speech setup needs to happen after DOM is loaded
// and mascotSpeechElement is available.
// A good practice is to have an init function for the module.
export function initMascot() {
    const el = document.getElementById('mascot-speech');
    if (el) {
        // mascotSpeechElement = el; // Error: const reassignment. This logic needs rethinking for module scope.
                                  // The top-level const mascotSpeechElement will be null if script loads before DOM.
        el.textContent = speeches.welcome;
    } else {
        // Retry after DOM load if mascotSpeechElement was initially null
        document.addEventListener('DOMContentLoaded', () => {
            const domEl = document.getElementById('mascot-speech');
            if (domEl) {
                domEl.textContent = speeches.welcome;
            }
        });
    }
}

// Call initMascot if this module is loaded and executed directly,
// otherwise, the importing module should call initMascot.
// For robustness, DOMContentLoaded is better.
document.addEventListener('DOMContentLoaded', () => {
    const el = document.getElementById('mascot-speech');
    if (el) {
        el.textContent = speeches.welcome;
    }
});
