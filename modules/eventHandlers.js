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
      // First ensure audio is initialized on user interaction
      if (window.gameMusicPlayer) {
        window.gameMusicPlayer.unlockAudio();
      }
      
      // Check if the grid has any living cells before starting the game
      const population = window.GameLogic.countPopulation();
      if (!window.GameLogic.isGameRunning() && population === 0) {
        // Don't start the game if there are no living cells
        // Show helper text
        const emptyGridMessage = document.getElementById("empty-grid-message");
        emptyGridMessage.classList.remove("hidden");
        setTimeout(() => {
          emptyGridMessage.classList.add("hidden");
        }, 3000); // Hide after 3 seconds
        return;
      }
      
      // Then toggle the simulation
      toggleSimulation();
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
        
        // Trigger four-season animation when Time reaches 24 and every multiple of 24
        if (generation % 24 === 0 && generation > 0) {
          const gridContainer = document.querySelector(".grid-container");
          window.AnimationModule.triggerSeasonAnimation(gridContainer);
        }
        
        // Trigger big rainbow at Time 60, 120, 180, 240
        if (generation % 60 === 0 && generation > 0) {
          const gridContainer = document.querySelector(".grid-container");
          window.AnimationModule.triggerBigRainbow(gridContainer);
        }
      }

      generationCount.textContent = generation;
    }
  },

  /**
   * Handle canvas click events to toggle cell states and add click effects.
   * @param {MouseEvent} event - The click event.
   * @param {HTMLCanvasElement} canvas - The game canvas.
   * Assumes GridModule and AnimationModule are available on window.
   */
  handleCanvasClick: function(event, canvas) {
    if (!window.GridModule || !window.AnimationModule) {
      console.error("Required modules (GridModule or AnimationModule) not available.");
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const { CELL_SIZE, cols, rows } = window.GridModule.getGridDimensions();
    const iCol = Math.floor(x / CELL_SIZE);
    const jRow = Math.floor(y / CELL_SIZE);

    if (iCol >= 0 && iCol < cols && jRow >= 0 && jRow < rows) {
      // Toggle the state of the cell in the grid module
      window.GridModule.toggleCellState(iCol, jRow);

      // Add a click effect
      window.AnimationModule.addClickEffect(iCol, jRow, 'sparkle', 500);

      // Redraw the grid to show the cell state change and the effect
      // This assumes ctx is accessible or that drawGrid can get it.
      // Ideally, the main game loop handles drawing, or a dedicated draw function is called.
      // For immediate feedback when paused, a direct redraw might be needed.
      if (window.ctx && typeof window.AnimationModule.drawGrid === 'function') {
         // Ensure that if the game is paused, we still redraw for the click feedback.
         // The main game loop in runGame will handle this if isRunning is true.
         if (!window.GameLogic || !window.GameLogic.isGameRunning()) {
            window.AnimationModule.drawGrid(window.ctx, canvas.width, canvas.height);
         }
      } else {
          console.warn("Unable to redraw grid immediately after click effect. Ensure ctx is global or draw function is robust.");
      }
    }
  }
};