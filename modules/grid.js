/**
 * Grid creation and manipulation functions
 */

// Create a global namespace for our grid module
window.GridModule = (function() {
  // Grid variables
  let width, height;
  let cols, rows;
  let grid = [];
  let cellStates = []; // To track special states for coloring

  return {
    /**
     * Initialize the grid dimensions
     * @param {number} containerWidth - Width of the container
     * @param {number} containerHeight - Height of the container
     * @returns {Object} - Grid dimensions
     */
    initializeGridDimensions: function(containerWidth, containerHeight) {
      width = Math.min(containerWidth - 30, 600);
      height = Math.min(width * 0.7, 400);
      
      // Calculate grid dimensions
      cols = Math.floor(width / window.GameConfig.CELL_SIZE);
      rows = Math.floor(height / window.GameConfig.CELL_SIZE);
      
      return { width, height, cols, rows };
    },

    /**
     * Create an empty grid
     * @returns {Array} - The created grid
     */
    createEmptyGrid: function() {
      grid = new Array(cols);
      cellStates = new Array(cols);
      for (let i = 0; i < cols; i++) {
        grid[i] = new Array(rows).fill(0);
        cellStates[i] = new Array(rows).fill(0); // 0: normal, 1: underpopulated, 2: overpopulated, 3: reproduction
      }
      return grid;
    },

    /**
     * Get the current grid
     * @returns {Array} - The current grid
     */
    getGrid: function() {
      return grid;
    },

    /**
     * Set the grid to a new value
     * @param {Array} newGrid - The new grid
     */
    setGrid: function(newGrid) {
      grid = newGrid;
    },

    /**
     * Get the cell states
     * @returns {Array} - The cell states
     */
    getCellStates: function() {
      return cellStates;
    },

    /**
     * Set the cell states
     * @param {Array} newStates - The new cell states
     */
    setCellStates: function(newStates) {
      cellStates = newStates;
    },

    /**
     * Get the grid dimensions
     * @returns {Object} - The grid dimensions
     */
    getGridDimensions: function() {
      return { width, height, cols, rows, CELL_SIZE: window.GameConfig.CELL_SIZE };
    },

    /**
     * Add a glider pattern to the grid
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     */
    addGlider: function(x, y) {
      if (x + 2 < cols && y + 2 < rows) {
        grid[x][y + 1] = 1;
        grid[x + 1][y + 2] = 1;
        grid[x + 2][y] = 1;
        grid[x + 2][y + 1] = 1;
        grid[x + 2][y + 2] = 1;
      }
    },

    /**
     * Randomize the grid
     */
    randomizeGrid: function() {
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          grid[i][j] = Math.random() > 0.7 ? 1 : 0;
        }
      }
      return grid;
    },

    /**
     * Toggle a cell's state
     * @param {number} i - X coordinate
     * @param {number} j - Y coordinate
     */
    toggleCell: function(i, j) {
      if (i >= 0 && i < cols && j >= 0 && j < rows) {
        grid[i][j] = grid[i][j] ? 0 : 1;
        cellStates[i][j] = 0; // Reset special state
        return true;
      }
      return false;
    },

    /**
     * Count live neighbors for a cell
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {number} - Number of live neighbors
     */
    countNeighbors: function(x, y) {
      let count = 0;

      // Check all 8 neighboring cells
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          // Skip the cell itself
          if (i === 0 && j === 0) continue;

          // Calculate neighbor coordinates with wrapping
          const ni = (x + i + cols) % cols;
          const nj = (y + j + rows) % rows;

          // Count live neighbors
          count += grid[ni][nj];
        }
      }

      return count;
    }
  };
})();