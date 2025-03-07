document.addEventListener('DOMContentLoaded', () => {
    // Game settings
    const CELL_SIZE = 20; // Larger cells for better visibility
    const GRID_COLOR = '#ddd';
    const ALIVE_CELL_COLOR = '#4CAF50'; // Green for happy residents
    const DEAD_CELL_COLOR = '#f5f5f5'; // Light gray for empty homes
    
    // Special state colors
    const UNDERPOPULATED_COLOR = '#ff6666'; // Red for residents leaving due to loneliness
    const OVERPOPULATED_COLOR = '#ff9933'; // Orange for residents leaving due to overcrowding
    const REPRODUCTION_COLOR = '#4287f5'; // Blue for new families moving in
    
    // Get canvas and context
    const canvas = document.getElementById('grid');
    const ctx = canvas.getContext('2d');
    
    // Get buttons
    const startButton = document.getElementById('start');
    const stopButton = document.getElementById('stop');
    const clearButton = document.getElementById('clear');
    const randomButton = document.getElementById('random');
    
    // Get counter elements
    const populationCount = document.getElementById('population-count');
    const generationCount = document.getElementById('generation-count');
    
    // Game variables
    let width, height;
    let cols, rows;
    let grid = [];
    let cellStates = []; // To track special states for coloring
    let animationId = null;
    let isRunning = false;
    let generation = 0;
    
    // Emoji icons for different states
    const HAPPY_RESIDENT = '😊';
    const LONELY_RESIDENT = '😢';
    const CROWDED_RESIDENT = '😫';
    const NEW_FAMILY = '👨‍👩‍👧';
    const EMPTY_HOME = '🏠';
    
    // Initialize the game
    function init() {
        // Set canvas size to fit the container
        const container = document.querySelector('.grid-container');
        width = Math.min(container.clientWidth, 600);
        height = Math.min(width, 400);
        
        canvas.width = width;
        canvas.height = height;
        
        // Calculate grid dimensions
        cols = Math.floor(width / CELL_SIZE);
        rows = Math.floor(height / CELL_SIZE);
        
        // Create empty grid
        createEmptyGrid();
        
        // Draw initial grid
        drawGrid();
        
        // Add event listeners
        canvas.addEventListener('click', handleCanvasClick);
        startButton.addEventListener('click', startGame);
        stopButton.addEventListener('click', stopGame);
        clearButton.addEventListener('click', clearGrid);
        randomButton.addEventListener('click', randomizeGrid);
    }
    
    // Create an empty grid
    function createEmptyGrid() {
        grid = new Array(cols);
        cellStates = new Array(cols);
        for (let i = 0; i < cols; i++) {
            grid[i] = new Array(rows).fill(0);
            cellStates[i] = new Array(rows).fill(0); // 0: normal, 1: underpopulated, 2: overpopulated, 3: reproduction
        }
        generation = 0;
        updateCounters();
    }
    
    // Update population and generation counters
    function updateCounters() {
        let population = 0;
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                if (grid[i][j] === 1) {
                    population++;
                }
            }
        }
        populationCount.textContent = population;
        generationCount.textContent = generation;
    }
    
    // Draw the grid
    function drawGrid() {
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Draw background pattern for town
        ctx.fillStyle = '#f9fff9';
        ctx.fillRect(0, 0, width, height);
        
        // Draw cells
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                const x = i * CELL_SIZE;
                const y = j * CELL_SIZE;
                
                // Determine cell color based on state
                let cellColor;
                let emoji = '';
                
                if (grid[i][j] === 1) {
                    // Live cell (resident)
                    if (cellStates[i][j] === 1) {
                        cellColor = UNDERPOPULATED_COLOR; // Leaving due to loneliness
                        emoji = LONELY_RESIDENT;
                    } else if (cellStates[i][j] === 2) {
                        cellColor = OVERPOPULATED_COLOR;  // Leaving due to overcrowding
                        emoji = CROWDED_RESIDENT;
                    } else {
                        cellColor = ALIVE_CELL_COLOR;     // Happy resident
                        emoji = HAPPY_RESIDENT;
                    }
                } else {
                    // Dead cell (empty home)
                    if (cellStates[i][j] === 3) {
                        cellColor = REPRODUCTION_COLOR;   // New family moving in
                        emoji = NEW_FAMILY;
                    } else {
                        cellColor = DEAD_CELL_COLOR;      // Empty home
                        emoji = EMPTY_HOME;
                    }
                }
                
                // Draw home background
                ctx.fillStyle = cellColor;
                ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
                
                // Draw home border
                ctx.strokeStyle = GRID_COLOR;
                ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);
                
                // Draw emoji
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = '#000';
                ctx.fillText(emoji, x + CELL_SIZE / 2, y + CELL_SIZE / 2);
            }
        }
        
        // Update counters
        updateCounters();
    }
    
    // Handle canvas click
    function handleCanvasClick(event) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const i = Math.floor(x / CELL_SIZE);
        const j = Math.floor(y / CELL_SIZE);
        
        if (i >= 0 && i < cols && j >= 0 && j < rows) {
            // Toggle cell state
            grid[i][j] = grid[i][j] ? 0 : 1;
            cellStates[i][j] = 0; // Reset special state
            drawGrid();
        }
    }
    
    // Start the game
    function startGame() {
        if (!isRunning) {
            isRunning = true;
            animate();
        }
    }
    
    // Stop the game
    function stopGame() {
        isRunning = false;
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    }
    
    // Clear the grid
    function clearGrid() {
        stopGame();
        createEmptyGrid();
        drawGrid();
    }
    
    // Randomize the grid
    function randomizeGrid() {
        stopGame();
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                grid[i][j] = Math.random() > 0.7 ? 1 : 0;
            }
        }
        drawGrid();
    }
    
    // Animation loop
    function animate() {
        if (!isRunning) return;
        
        // Update grid (this now includes drawing with colors)
        updateGrid();
        
        // Schedule next frame with a delay to match our setTimeout in updateGrid
        setTimeout(() => {
            animationId = requestAnimationFrame(animate);
        }, 400); // Slightly longer delay for better visualization
    }
    
    // Update grid based on Game of Life rules
    function updateGrid() {
        // First, calculate the next state and mark special states
        const nextGrid = new Array(cols);
        for (let i = 0; i < cols; i++) {
            nextGrid[i] = new Array(rows);
            for (let j = 0; j < rows; j++) {
                const state = grid[i][j];
                const neighbors = countNeighbors(i, j);
                
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
        
        // Draw the current state with special colors
        drawGrid();
        
        // Delay the actual grid update to allow seeing the colors
        setTimeout(() => {
            // Update the grid
            grid = nextGrid;
            generation++;
            updateCounters();
        }, 300);
    }
    
    // Count live neighbors for a cell
    function countNeighbors(x, y) {
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
    
    // Initialize the game
    init();
});