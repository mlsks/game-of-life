/**
 * Main entry point for the game
 */

// Create a global function to initialize the game
window.initGame = function() {
  // Game variables
  let canvas, ctx;
  let startButton, clearButton, randomButton;
  let populationCount, generationCount;

  // Get canvas and context
  canvas = document.getElementById("grid");
  ctx = canvas.getContext("2d");

  // Get buttons
  startButton = document.getElementById("start");
  clearButton = document.getElementById("clear");
  randomButton = document.getElementById("random");

  // Get counter elements
  populationCount = document.getElementById("population-count");
  generationCount = document.getElementById("generation-count");

  // Set canvas size to fit the container
  const container = document.querySelector(".grid-container");
  const { width, height } = window.GridModule.initializeGridDimensions(container.clientWidth, container.clientHeight);

  canvas.width = width;
  canvas.height = height;

  // Create empty grid
  window.GridModule.createEmptyGrid();

  // Draw initial grid
  drawGrid();

  // Add event listeners
  canvas.addEventListener("click", (event) => handleCanvasClick(event, canvas, drawGrid));

  // Button event listeners
  startButton.addEventListener("click", toggleSimulation);
  clearButton.addEventListener("click", clearGrid);
  randomButton.addEventListener("click", randomizeGrid);

  // Add keyboard shortcuts
  document.addEventListener("keydown", (e) => window.EventHandlers.handleKeyPress(e, toggleSimulation, clearGrid, randomizeGrid));

  // Add some initial patterns
  window.GridModule.addGlider(10, 10);
  drawGrid();
  
  // Initialize the season environment
  window.AnimationModule.initializeSeasonEnvironment();
  
  // Initialize audio context if available
  if (window.gameMusicPlayer) {
    // Don't initialize audio yet - wait for user interaction
    console.log("Audio will be initialized on user interaction");
  }

  /**
   * Draw the grid
   */
  function drawGrid() {
    const { width, height } = window.GridModule.getGridDimensions();
    window.AnimationModule.drawGrid(ctx, width, height);
    
    // Update counters
    const statsContainer = document.querySelector(".stats");
    window.EventHandlers.updateCounters(populationCount, generationCount, statsContainer);
  }

  /**
   * Toggle simulation (start/stop)
   */
  function toggleSimulation() {
    // Ensure audio is initialized on user interaction
    if (window.gameMusicPlayer) {
      window.gameMusicPlayer.unlockAudio();
    }
    
    // Check if the grid has any living cells before starting the game
    const population = window.GameLogic.countPopulation();
    const emptyGridMessage = document.getElementById("empty-grid-message");
    
    if (!window.GameLogic.isGameRunning() && population === 0) {
      // Don't start the game if there are no living cells
      // Show helper text
      emptyGridMessage.classList.remove("hidden");
      setTimeout(() => {
        emptyGridMessage.classList.add("hidden");
      }, 3000); // Hide after 3 seconds
      return;
    }
    
    // Hide helper text if it's visible
    emptyGridMessage.classList.add("hidden");
    
    if (window.GameLogic.isGameRunning()) {
      stopGame();
      // Handle music when stopping the game
      if (window.gameMusicPlayer) {
        window.gameMusicPlayer.pause();
      }
    } else {
      startGame();
      // Handle music when starting the game
      if (window.gameMusicPlayer) {
        window.gameMusicPlayer.play();
      }
    }
  }

  /**
   * Start the game
   */
  function startGame() {
    if (!window.GameLogic.isGameRunning()) {
      window.GameLogic.setGameRunning(true);
      startButton.innerHTML = '<i class="fas fa-pause"></i> Pause Adventure';
      startButton.classList.add("pause-button");
      animate();
    }
  }

  /**
   * Stop the game
   */
  function stopGame() {
    window.GameLogic.setGameRunning(false);
    startButton.innerHTML = '<i class="fas fa-play"></i> Start Adventure!';
    startButton.classList.remove("pause-button");
    
    const animationId = window.GameLogic.getAnimationId();
    if (animationId) {
      cancelAnimationFrame(animationId);
      window.GameLogic.setAnimationId(null);
    }
  }

  /**
   * Clear the grid
   */
  function clearGrid() {
    stopGame();
    window.GridModule.createEmptyGrid();
    window.GameLogic.resetGeneration();
    drawGrid();
  }

  /**
   * Randomize the grid
   */
  function randomizeGrid() {
    stopGame();
    window.GridModule.randomizeGrid();
    window.GameLogic.resetGeneration();
    drawGrid();
  }

  /**
   * Animation loop
   */
  function animate() {
    if (!window.GameLogic.isGameRunning()) return;

    // Update grid (this now includes drawing with colors)
    updateGrid();

    // Add fun confetti effect when simulation is running
    if (window.GameLogic.getGeneration() % 5 === 0) {
      const { width, height } = window.GridModule.getGridDimensions();
      window.AnimationModule.addConfetti(ctx, width, height);
    }

    // Schedule next frame with a delay
    setTimeout(() => {
      const animationId = requestAnimationFrame(animate);
      window.GameLogic.setAnimationId(animationId);
    }, 500); // Slightly longer delay for better visualization for kids
  }

  /**
   * Update grid based on Game of Life rules
   */
  function updateGrid() {
    // First, calculate the next state and mark special states
    const nextGrid = window.GameLogic.calculateNextGrid();

    // Draw the current state with special colors
    drawGrid();

    // Delay the actual grid update to allow seeing the colors
    setTimeout(() => {
      // Update the grid
      window.GridModule.setGrid(nextGrid);
      window.GameLogic.incrementGeneration();
      
      const statsContainer = document.querySelector(".stats");
      window.EventHandlers.updateCounters(populationCount, generationCount, statsContainer);
    }, 200);
  }

  /**
   * Handle canvas click
   * @param {Event} event - Click event
   * @param {HTMLCanvasElement} canvas - Canvas element
   * @param {Function} drawGridCallback - Callback to redraw the grid
   */
  function handleCanvasClick(event, canvas, drawGridCallback) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const { CELL_SIZE } = window.GridModule.getGridDimensions();
    const i = Math.floor(x / CELL_SIZE);
    const j = Math.floor(y / CELL_SIZE);

    if (window.GridModule.toggleCell(i, j)) {
      drawGridCallback();
    }
  }
};