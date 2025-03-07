/**
 * Game of Life rules and logic
 */

// Create a global namespace for our game logic module
window.GameLogic = (function() {
  // Game state variables
  let generation = 0;
  let isRunning = false;
  let animationId = null;
  let lastPopulationCount = 0;
  let stablePopulationTime = 0;
  let stableAnimationTriggered = false;

  return {
    /**
     * Get the current generation
     * @returns {number} - Current generation
     */
    getGeneration: function() {
      return generation;
    },

    /**
     * Set the generation
     * @param {number} gen - New generation value
     */
    setGeneration: function(gen) {
      generation = gen;
    },

    /**
     * Increment the generation
     */
    incrementGeneration: function() {
      generation++;
    },

    /**
     * Reset the generation counter
     */
    resetGeneration: function() {
      generation = 0;
    },

    /**
     * Check if the game is running
     * @returns {boolean} - True if the game is running
     */
    isGameRunning: function() {
      return isRunning;
    },

    /**
     * Set the game running state
     * @param {boolean} state - New running state
     */
    setGameRunning: function(state) {
      isRunning = state;
    },

    /**
     * Get the animation ID
     * @returns {number} - Animation ID
     */
    getAnimationId: function() {
      return animationId;
    },

    /**
     * Set the animation ID
     * @param {number} id - New animation ID
     */
    setAnimationId: function(id) {
      animationId = id;
    },

    /**
     * Get the last population count
     * @returns {number} - Last population count
     */
    getLastPopulationCount: function() {
      return lastPopulationCount;
    },

    /**
     * Set the last population count
     * @param {number} count - New population count
     */
    setLastPopulationCount: function(count) {
      lastPopulationCount = count;
    },

    /**
     * Get the stable population time
     * @returns {number} - Stable population time
     */
    getStablePopulationTime: function() {
      return stablePopulationTime;
    },

    /**
     * Set the stable population time
     * @param {number} time - New stable population time
     */
    setStablePopulationTime: function(time) {
      stablePopulationTime = time;
    },

    /**
     * Increment the stable population time
     */
    incrementStablePopulationTime: function() {
      stablePopulationTime += 1;
    },

    /**
     * Check if stable animation has been triggered
     * @returns {boolean} - True if stable animation has been triggered
     */
    isStableAnimationTriggered: function() {
      return stableAnimationTriggered;
    },

    /**
     * Set the stable animation triggered state
     * @param {boolean} state - New stable animation triggered state
     */
    setStableAnimationTriggered: function(state) {
      stableAnimationTriggered = state;
    },

    /**
     * Calculate the next state of the grid based on Game of Life rules
     * @returns {Array} - The next state of the grid
     */
    calculateNextGrid: function() {
      const { cols, rows } = window.GridModule.getGridDimensions();
      const currentGrid = window.GridModule.getGrid();
      const cellStates = window.GridModule.getCellStates();
      
      // First, calculate the next state and mark special states
      const nextGrid = new Array(cols);
      for (let i = 0; i < cols; i++) {
        nextGrid[i] = new Array(rows);
        for (let j = 0; j < rows; j++) {
          const state = currentGrid[i][j];
          const neighbors = window.GridModule.countNeighbors(i, j);

          // Reset cell state
          cellStates[i][j] = 0;

          // Apply rules and mark special states
          if (state === 0 && neighbors === 3) {
            // Rule 4: Empty home with 3 neighbors gets new family
            nextGrid[i][j] = 1;
            cellStates[i][j] = 3; // Mark as new family moving in
          } else if (state === 1) {
            if (neighbors < 2) {
              // Rule 1: Resident with <2 neighbors leaves due to loneliness
              nextGrid[i][j] = 0;
              cellStates[i][j] = 1; // Mark as leaving due to loneliness
            } else if (neighbors > 3) {
              // Rule 3: Resident with >3 neighbors leaves due to overcrowding
              nextGrid[i][j] = 0;
              cellStates[i][j] = 2; // Mark as leaving due to overcrowding
            } else {
              // Rule 2: Resident with 2-3 neighbors stays happy
              nextGrid[i][j] = 1;
            }
          } else {
            // Empty home stays empty
            nextGrid[i][j] = 0;
          }
        }
      }
      
      window.GridModule.setCellStates(cellStates);
      return nextGrid;
    },

    /**
     * Count the current population
     * @returns {number} - Current population count
     */
    countPopulation: function() {
      const currentGrid = window.GridModule.getGrid();
      const { cols, rows } = window.GridModule.getGridDimensions();
      
      let population = 0;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          if (currentGrid[i][j] === 1) {
            population++;
          }
        }
      }
      
      return population;
    }
  };
})();