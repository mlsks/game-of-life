document.addEventListener('DOMContentLoaded', () => {
    // Game settings
    const CELL_SIZE = 30; // Larger cells for better visibility for kids
    const GRID_COLOR = '#FFD54F';
    const ALIVE_CELL_COLOR = '#4CAF50'; // Green for happy residents
    const DEAD_CELL_COLOR = '#FFF9C4'; // Light yellow for empty homes
    
    // Special state colors
    const UNDERPOPULATED_COLOR = '#ff6666'; // Red for residents leaving due to loneliness
    const OVERPOPULATED_COLOR = '#ff9933'; // Orange for residents leaving due to overcrowding
    const REPRODUCTION_COLOR = '#4287f5'; // Blue for new families moving in
    
    // Get canvas and context
    const canvas = document.getElementById('grid');
    const ctx = canvas.getContext('2d');
    
    // Get buttons
    const startButton = document.getElementById('start');
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
    let lastPopulationCount = 0;
    let stablePopulationTime = 0;
    let stableAnimationTriggered = false;
    
    // Emoji icons for different states - larger and more kid-friendly
    const HAPPY_RESIDENT = '😊';
    const LONELY_RESIDENT = '😢';
    const CROWDED_RESIDENT = '😫';
    const NEW_FAMILY = '👨‍👩‍👧';
    const EMPTY_HOME = '🏠';
    
    // Initialize the game
    function init() {
        // Set canvas size to fit the container
        const container = document.querySelector('.grid-container');
        width = Math.min(container.clientWidth - 30, 600);
        height = Math.min(width * 0.7, 400);
        
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
        
        // Button event listeners
        startButton.addEventListener('click', toggleSimulation);
        clearButton.addEventListener('click', clearGrid);
        randomButton.addEventListener('click', randomizeGrid);
        
        // Add keyboard shortcuts
        document.addEventListener('keydown', handleKeyPress);
        
        // Add some initial patterns
        addGlider(10, 10);
        drawGrid();
    }
    
    // Add a glider pattern
    function addGlider(x, y) {
        if (x + 2 < cols && y + 2 < rows) {
            grid[x][y+1] = 1;
            grid[x+1][y+2] = 1;
            grid[x+2][y] = 1;
            grid[x+2][y+1] = 1;
            grid[x+2][y+2] = 1;
        }
    }
    
    // Handle keyboard shortcuts
    function handleKeyPress(e) {
        if (e.key.toLowerCase() === 's') { // S key for start/pause
            toggleSimulation();
        } else if (e.key.toLowerCase() === 'c') {
            clearGrid();
        } else if (e.key.toLowerCase() === 'r') {
            randomizeGrid();
        }
    }
    
    // Toggle simulation (start/stop)
    function toggleSimulation() {
        if (isRunning) {
            stopGame();
        } else {
            startGame();
        }
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
        
        // Add a fun animation for counting up
        const currentPop = parseInt(populationCount.textContent);
        if (currentPop !== population) {
            animateCounter(populationCount, currentPop, population);
            
            // Update classes for zero population
            if (population === 0) {
                populationCount.classList.add('zero-population');
            } else {
                populationCount.classList.remove('zero-population');
            }
            
            // Check if Friends count has reached zero
            if (population === 0 && currentPop > 0) {
                triggerRainbowExplosion();
            }
            
            // Reset stable population counter since population changed
            stablePopulationTime = 0;
            stableAnimationTriggered = false;
            lastPopulationCount = population;
        } else if (isRunning && population > 0) {
            // Population is stable, track how long it's been stable
            if (population === lastPopulationCount) {
                stablePopulationTime += 1; // Increment every animation frame (roughly 0.5 seconds)
                
                // Check if we've been stable for about 15 seconds (30 frames at 0.5s interval)
                if (stablePopulationTime >= 30 && !stableAnimationTriggered) {
                    triggerStablePatternAnimation();
                    stableAnimationTriggered = true;
                }
            } else {
                stablePopulationTime = 0;
                stableAnimationTriggered = false;
            }
            lastPopulationCount = population;
        }
        
        // Update time counter with visual effects
        const oldGeneration = parseInt(generationCount.textContent);
        if (oldGeneration !== generation) {
            // Show a visual cue that time is passing
            if (generation > 0) {
                const timeCounterElement = document.querySelector('.stat-item[data-tooltip*="magical moment"]');
                timeCounterElement.style.animation = 'highlight 1s';
                setTimeout(() => {
                    timeCounterElement.style.animation = '';
                }, 1000);
            
                // Add a sun/moon animation every few steps
                if (generation % 3 === 0) {
                    showTimeAnimation();
                }
            }
            
            generationCount.textContent = generation;
        }
    }
    
    // Show an animation to indicate time passing
    function showTimeAnimation() {
        // Create and show a time animation element
        const timeIcon = document.createElement('div');
        timeIcon.classList.add('time-icon');
        timeIcon.innerHTML = generation % 6 === 0 ? '🌙' : '☀️';
        
        // Position it near the time counter
        const statsContainer = document.querySelector('.stats');
        statsContainer.appendChild(timeIcon);
        
        // Animate it across the screen
        setTimeout(() => {
            timeIcon.style.transform = 'translate(50px, -50px) scale(1.5)';
            timeIcon.style.opacity = '0';
            
            // Remove it after animation
            setTimeout(() => {
                timeIcon.remove();
            }, 1500);
        }, 100);
    }
    
    // Function to trigger rainbow explosion when Friends count reaches zero
    function triggerRainbowExplosion() {
        // Pause the game to appreciate the explosion
        if (isRunning) {
            stopGame();
        }
        
        // Create explosion container
        const explosionContainer = document.createElement('div');
        explosionContainer.className = 'explosion-container';
        document.querySelector('.grid-container').appendChild(explosionContainer);
        
        // Add colorful particles
        const numParticles = 200;
        const colors = [
            '#FF5252', '#FF4081', '#E040FB', '#7C4DFF', 
            '#536DFE', '#448AFF', '#40C4FF', '#18FFFF', 
            '#64FFDA', '#69F0AE', '#B2FF59', '#EEFF41', 
            '#FFFF00', '#FFD740', '#FFAB40', '#FF6E40'
        ];
        
        // Add a funny message at the bottom
        const message = document.createElement('div');
        message.className = 'explosion-message';
        message.innerHTML = 'BOOM! Everyone left! 🎉';
        explosionContainer.appendChild(message);
        
        // Create and position the particles
        for (let i = 0; i < numParticles; i++) {
            const particle = document.createElement('div');
            particle.className = 'explosion-particle';
            
            // Random position, size, and color
            const size = Math.floor(Math.random() * 20) + 10;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            // Shape variation
            const shape = Math.random() > 0.7 ? 'star' : (Math.random() > 0.5 ? 'circle' : 'heart');
            
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.backgroundColor = color;
            particle.style.boxShadow = `0 0 ${size/2}px ${color}`;
            
            if (shape === 'star') {
                particle.innerHTML = '★';
                particle.style.background = 'transparent';
                particle.style.color = color;
                particle.style.fontSize = (size * 1.5) + 'px';
                particle.style.textAlign = 'center';
                particle.style.lineHeight = size + 'px';
            } else if (shape === 'heart') {
                particle.innerHTML = '❤';
                particle.style.background = 'transparent';
                particle.style.color = color;
                particle.style.fontSize = (size * 1.5) + 'px';
                particle.style.textAlign = 'center';
                particle.style.lineHeight = size + 'px';
            } else {
                particle.style.borderRadius = '50%';
            }
            
            // Animation parameters - adjust to favor upward and sideways trajectories
            // to keep most particles away from the message at the bottom
            let angle;
            if (Math.random() < 0.7) {
                // More particles go upward and to sides
                angle = Math.random() * Math.PI * 1.5 - Math.PI * 0.75; // -135° to +135° (favoring up and sides)
            } else {
                // Fewer particles go downward
                angle = Math.random() * Math.PI * 2; // Full 360°
            }
            
            const speed = Math.random() * 15 + 5;
            const distance = Math.random() * 150 + 50;
            
            // Calculate final position
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            
            // Set animation
            particle.style.setProperty('--end-x', x + 'px');
            particle.style.setProperty('--end-y', y + 'px');
            particle.style.setProperty('--rotation', Math.random() * 720 - 360 + 'deg');
            particle.style.setProperty('--delay', Math.random() * 0.5 + 's');
            particle.style.setProperty('--duration', (Math.random() * 1.5 + 1) + 's');
            
            explosionContainer.appendChild(particle);
        }
        
        // Remove explosion after animation completes
        setTimeout(() => {
            explosionContainer.classList.add('fade-out');
            setTimeout(() => {
                explosionContainer.remove();
            }, 1000);
        }, 4000);
        
        // Play explosion sound
        playExplosionSound();
    }
    
    // Function to trigger animation when pattern becomes stable
    function triggerStablePatternAnimation() {
        // Pause the game to appreciate the stable pattern
        if (isRunning) {
            stopGame();
        }
        
        // Create animation container
        const stableContainer = document.createElement('div');
        stableContainer.className = 'stable-container';
        document.querySelector('.grid-container').appendChild(stableContainer);
        
        // Add sparkling stars around the stable pattern
        const numStars = 150;
        const colors = [
            '#FFD700', '#F0E68C', '#FFFF00', '#FFFACD', 
            '#FAFAD2', '#FFFFE0', '#FFF8DC', '#EEE8AA'
        ];
        
        for (let i = 0; i < numStars; i++) {
            const star = document.createElement('div');
            star.className = 'stable-star';
            
            // Random size and color
            const size = Math.floor(Math.random() * 10) + 5;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            star.style.width = size + 'px';
            star.style.height = size + 'px';
            star.style.backgroundColor = color;
            star.style.boxShadow = `0 0 ${size/2}px ${color}`;
            
            // Random position around the grid
            const gridRect = canvas.getBoundingClientRect();
            const containerRect = document.querySelector('.grid-container').getBoundingClientRect();
            
            const gridX = gridRect.left - containerRect.left + gridRect.width / 2;
            const gridY = gridRect.top - containerRect.top + gridRect.height / 2;
            
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 100 + (gridRect.width / 2);
            
            const x = gridX + Math.cos(angle) * distance;
            const y = gridY + Math.sin(angle) * distance;
            
            star.style.left = x + 'px';
            star.style.top = y + 'px';
            
            // Animation parameters
            star.style.setProperty('--delay', Math.random() * 2 + 's');
            star.style.setProperty('--duration', (Math.random() * 3 + 2) + 's');
            
            stableContainer.appendChild(star);
        }
        
        // Create crown animation at the top
        const crown = document.createElement('div');
        crown.className = 'stable-crown';
        crown.innerHTML = '👑';
        stableContainer.appendChild(crown);
        
        // Add message
        const message = document.createElement('div');
        message.className = 'stable-message';
        message.innerHTML = 'Perfect Balance Achieved! ✨';
        stableContainer.appendChild(message);
        
        // Add trophy
        const trophy = document.createElement('div');
        trophy.className = 'stable-trophy';
        trophy.innerHTML = '🏆';
        stableContainer.appendChild(trophy);
        
        // Frame the stable pattern with a glowing border
        const frame = document.createElement('div');
        frame.className = 'stable-frame';
        
        // Position frame around the canvas
        const canvasRect = canvas.getBoundingClientRect();
        const containerRect2 = document.querySelector('.grid-container').getBoundingClientRect();
        
        frame.style.left = (canvasRect.left - containerRect2.left - 10) + 'px';
        frame.style.top = (canvasRect.top - containerRect2.top - 10) + 'px';
        frame.style.width = (canvasRect.width + 20) + 'px';
        frame.style.height = (canvasRect.height + 20) + 'px';
        
        stableContainer.appendChild(frame);
        
        // Add a badge to the population counter
        const badge = document.createElement('div');
        badge.className = 'stable-badge';
        badge.innerHTML = '⭐';
        badge.setAttribute('title', 'Perfect Balance Achieved!');
        populationCount.parentNode.appendChild(badge);
        
        // Play success sound
        playStablePatternSound();
        
        // Remove animation after some time
        setTimeout(() => {
            stableContainer.classList.add('fade-out');
            // Also fade out the badge
            if (badge) {
                badge.classList.add('fade-out');
            }
            setTimeout(() => {
                stableContainer.remove();
                // Also remove the badge
                if (badge && badge.parentNode) {
                    badge.parentNode.removeChild(badge);
                }
            }, 1000);
        }, 7000);
    }
    
    // Play a celebratory sound when stable pattern is achieved
    function playStablePatternSound() {
        try {
            // Create audio context
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const audioCtx = new AudioContext();
            
            // Play a triumphant melody
            const notes = [
                { note: 523.25, duration: 0.2 }, // C5
                { note: 587.33, duration: 0.2 }, // D5
                { note: 659.25, duration: 0.4 }, // E5
                { note: 659.25, duration: 0.4 }, // E5
                { note: 698.46, duration: 0.2 }, // F5
                { note: 783.99, duration: 0.2 }, // G5
                { note: 880.00, duration: 0.8 }  // A5
            ];
            
            let time = audioCtx.currentTime;
            
            // Play a triumphant chord
            playChord(audioCtx, [523.25, 659.25, 783.99], time, 1.0);
            
            // Play the melody
            setTimeout(() => {
                time = audioCtx.currentTime;
                notes.forEach(noteInfo => {
                    playTriumphNote(audioCtx, noteInfo.note, time, noteInfo.duration);
                    time += noteInfo.duration;
                });
            }, 500);
            
            // Final chord
            setTimeout(() => {
                playChord(audioCtx, [523.25, 659.25, 783.99, 1046.50], audioCtx.currentTime, 1.5);
            }, 2500);
            
        } catch (e) {
            console.log('Web Audio API not supported or user interaction required');
        }
    }
    
    // Helper function to play a triumphant note
    function playTriumphNote(audioCtx, frequency, startTime, duration) {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = 'triangle';
        oscillator.frequency.value = frequency;
        
        gainNode.gain.setValueAtTime(0.3, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
    }
    
    // Helper function to play a chord
    function playChord(audioCtx, frequencies, startTime, duration) {
        frequencies.forEach(frequency => {
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            oscillator.type = 'sine';
            oscillator.frequency.value = frequency;
            
            gainNode.gain.setValueAtTime(0.15, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
            
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            oscillator.start(startTime);
            oscillator.stop(startTime + duration);
        });
    }
    
    // Play a fun sound when explosion happens
    function playExplosionSound() {
        try {
            // Create audio context
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const audioCtx = new AudioContext();
            
            // Create oscillator for fun sound
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
            oscillator.frequency.exponentialRampToValueAtTime(
                69.30, // C2
                audioCtx.currentTime + 1
            );
            
            gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1);
            
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 1.5);
            
            // Play some cheerful notes after the explosion
            setTimeout(() => {
                const notes = [
                    { note: 523.25, duration: 0.2 }, // C5
                    { note: 587.33, duration: 0.2 }, // D5
                    { note: 659.25, duration: 0.2 }, // E5
                    { note: 698.46, duration: 0.2 }, // F5
                    { note: 783.99, duration: 0.2 }, // G5
                    { note: 880.00, duration: 0.4 }  // A5
                ];
                
                let time = audioCtx.currentTime;
                notes.forEach(noteInfo => {
                    playNote(audioCtx, noteInfo.note, time, noteInfo.duration);
                    time += noteInfo.duration;
                });
            }, 1000);
            
        } catch (e) {
            console.log('Web Audio API not supported or user interaction required');
        }
    }
    
    // Helper function to play a note
    function playNote(audioCtx, frequency, startTime, duration) {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
        
        gainNode.gain.setValueAtTime(0.3, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
    }
    
    // Animate counter going up or down
    function animateCounter(element, from, to) {
        const duration = 500; // ms
        const start = performance.now();
        
        function step(timestamp) {
            const elapsed = timestamp - start;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = Math.floor(from + (to - from) * progress);
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }
        
        requestAnimationFrame(step);
    }
    
    // Draw the grid
    function drawGrid() {
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Draw background pattern for town
        ctx.fillStyle = '#FFFDE7';
        ctx.fillRect(0, 0, width, height);
        
        // Draw a rainbow border around the grid
        const borderColors = ['#FF5722', '#FF9800', '#FFC107', '#FFEB3B', '#CDDC39', '#8BC34A'];
        const borderWidth = 5;
        for (let i = 0; i < borderColors.length; i++) {
            ctx.strokeStyle = borderColors[i];
            ctx.lineWidth = borderWidth;
            ctx.strokeRect(i*borderWidth, i*borderWidth, width - i*borderWidth*2, height - i*borderWidth*2);
        }
        
        // Draw decorative elements in the corners
        drawCornerSun(10, 10, 25);
        drawCornerSun(width - 10, 10, 25);
        drawCornerSun(10, height - 10, 25);
        drawCornerSun(width - 10, height - 10, 25);
        
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
                // Draw rounded rectangle for a more friendly look
                roundRect(ctx, x + 2, y + 2, CELL_SIZE - 4, CELL_SIZE - 4, 8, true);
                
                // Draw home border
                ctx.strokeStyle = GRID_COLOR;
                ctx.lineWidth = 2;
                roundRect(ctx, x + 2, y + 2, CELL_SIZE - 4, CELL_SIZE - 4, 8, false, true);
                
                // Draw emoji
                ctx.font = '18px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = '#000';
                ctx.fillText(emoji, x + CELL_SIZE / 2, y + CELL_SIZE / 2);
            }
        }
        
        // Update counters
        updateCounters();
    }
    
    // Function to draw rounded rectangles
    function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        if (fill) {
            ctx.fill();
        }
        if (stroke) {
            ctx.stroke();
        }
    }
    
    // Function to draw a sun in the corner
    function drawCornerSun(x, y, radius) {
        ctx.save();
        
        // Draw sun circle
        ctx.fillStyle = '#FFEB3B';
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw sun rays
        ctx.strokeStyle = '#FFC107';
        ctx.lineWidth = 3;
        for (let i = 0; i < 8; i++) {
            const angle = i * Math.PI / 4;
            ctx.beginPath();
            ctx.moveTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
            ctx.lineTo(x + Math.cos(angle) * (radius + 15), y + Math.sin(angle) * (radius + 15));
            ctx.stroke();
        }
        
        // Draw sun face
        ctx.fillStyle = '#FF9800';
        // Eyes
        ctx.beginPath();
        ctx.arc(x - 7, y - 5, 3, 0, Math.PI * 2);
        ctx.arc(x + 7, y - 5, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Smile
        ctx.beginPath();
        ctx.arc(x, y + 5, 8, 0, Math.PI);
        ctx.stroke();
        
        ctx.restore();
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
            startButton.innerHTML = '<i class="fas fa-pause"></i> Pause Adventure';
            startButton.classList.add('pause-button');
            animate();
        }
    }
    
    // Stop the game
    function stopGame() {
        isRunning = false;
        startButton.innerHTML = '<i class="fas fa-play"></i> Start Adventure!';
        startButton.classList.remove('pause-button');
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
        
        // Add fun confetti effect when simulation is running
        if (generation % 5 === 0) {
            addConfetti();
        }
        
        // Schedule next frame with a delay
        setTimeout(() => {
            animationId = requestAnimationFrame(animate);
        }, 500); // Slightly longer delay for better visualization for kids
    }
    
    // Add confetti effect
    function addConfetti() {
        const confettiCount = 10;
        const colors = ['#FF5722', '#FF9800', '#FFC107', '#FFEB3B', '#CDDC39', '#8BC34A', '#4CAF50'];
        
        for (let i = 0; i < confettiCount; i++) {
            const x = Math.random() * width;
            const y = Math.random() * 50;
            const size = Math.random() * 10 + 5;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            // Draw confetti piece
            ctx.fillStyle = color;
            ctx.beginPath();
            if (Math.random() > 0.5) {
                // Draw circle
                ctx.arc(x, y, size/2, 0, Math.PI * 2);
            } else {
                // Draw star
                drawStar(ctx, x, y, 5, size/2, size/4);
            }
            ctx.fill();
        }
    }
    
    // Function to draw a star
    function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        let step = Math.PI / spikes;

        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
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
        }, 200);
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