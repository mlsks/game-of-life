/**
 * Event handlers for user interaction
 */

// Create a global namespace for our event handlers
window.EventHandlers = {
  /**
   * Handle keyboard shortcuts
   * @param {KeyboardEvent} e - Keyboard event
   * @param {Function} toggleSimulation - Toggle simulation function
   * @param {Function} clearGrid - Clear grid function
   * @param {Function} randomizeGrid - Randomize grid function
   */
  handleKeyPress: function(e, toggleSimulation, clearGrid, randomizeGrid) {
    if (e.key === "1") {
      // 1 key for start/pause (previously S)
      toggleSimulation();
      // Directly call the appropriate music method based on the running state
      if (window.gameMusicPlayer) {
        if (window.GameLogic.isGameRunning()) {
          // Make sure audio is initialized first
          if (!window.gameMusicPlayer.isAudioInitialized) {
            window.gameMusicPlayer.unlockAudio();
          }
          window.gameMusicPlayer.play();
        } else {
          window.gameMusicPlayer.pause();
        }
      }
    } else if (e.key === "2") {
      // 2 key for clear (previously C)
      clearGrid();
    } else if (e.key === "3") {
      // 3 key for magic/random (previously R)
      randomizeGrid();
    }
  },

  /**
   * Update population and generation counters
   * @param {HTMLElement} populationCount - Population count element
   * @param {HTMLElement} generationCount - Generation count element
   * @param {HTMLElement} statsContainer - Stats container element
   */
  updateCounters: function(populationCount, generationCount, statsContainer) {
    const population = window.GameLogic.countPopulation();
    const generation = window.GameLogic.getGeneration();

    // Add a fun animation for counting up
    const currentPop = parseInt(populationCount.textContent);
    if (currentPop !== population) {
      window.AnimationModule.animateCounter(populationCount, currentPop, population);

      // Update classes for zero population
      if (population === 0) {
        populationCount.classList.add("zero-population");
      } else {
        populationCount.classList.remove("zero-population");
      }

      // Check if Friends count has reached zero
      if (population === 0 && currentPop > 0) {
        const gridContainer = document.querySelector(".grid-container");
        window.AnimationModule.triggerRainbowExplosion(gridContainer);
      }

      // Reset stable population counter since population changed
      window.GameLogic.setStablePopulationTime(0);
      window.GameLogic.setStableAnimationTriggered(false);
      window.GameLogic.setLastPopulationCount(population);
    } else if (window.GameLogic.isGameRunning() && population > 0) {
      // Population is stable, track how long it's been stable
      if (population === window.GameLogic.getLastPopulationCount()) {
        window.GameLogic.incrementStablePopulationTime();

        // Check if we've been stable for about 15 seconds (30 frames at 0.5s interval)
        if (window.GameLogic.getStablePopulationTime() >= 30 && !window.GameLogic.isStableAnimationTriggered()) {
          const gridContainer = document.querySelector(".grid-container");
          const canvas = document.getElementById("grid");
          window.AnimationModule.triggerStablePatternAnimation(gridContainer, populationCount, canvas);
          window.GameLogic.setStableAnimationTriggered(true);
        }
      } else {
        window.GameLogic.setStablePopulationTime(0);
        window.GameLogic.setStableAnimationTriggered(false);
      }
      window.GameLogic.setLastPopulationCount(population);
    }

    // Update time counter with visual effects
    const oldGeneration = parseInt(generationCount.textContent);
    if (oldGeneration !== generation) {
      // Show a visual cue that time is passing
      if (generation > 0) {
        const timeCounterElement = document.querySelector(
          '.stat-item[data-tooltip*="magical moment"]'
        );
        timeCounterElement.style.animation = "highlight 1s";
        setTimeout(() => {
          timeCounterElement.style.animation = "";
        }, 1000);

        // Add a sun/moon animation every few steps
        if (generation % 3 === 0) {
          window.AnimationModule.showTimeAnimation(statsContainer);
        }
      }

      generationCount.textContent = generation;
    }
  }
};