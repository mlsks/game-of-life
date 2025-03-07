/**
 * Animation and visual effects
 */

// Create a global namespace for our animation module
window.AnimationModule = {
  /**
   * Draw the grid on the canvas
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} width - Canvas width
   * @param {number} height - Canvas height
   */
  drawGrid: function(ctx, width, height) {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background pattern for town
    ctx.fillStyle = "#FFFDE7";
    ctx.fillRect(0, 0, width, height);

    // Draw a rainbow border around the grid
    const borderColors = [
      "#FF5722",
      "#FF9800",
      "#FFC107",
      "#FFEB3B",
      "#CDDC39",
      "#8BC34A",
    ];
    const borderWidth = 5;
    for (let i = 0; i < borderColors.length; i++) {
      ctx.strokeStyle = borderColors[i];
      ctx.lineWidth = borderWidth;
      ctx.strokeRect(
        i * borderWidth,
        i * borderWidth,
        width - i * borderWidth * 2,
        height - i * borderWidth * 2
      );
    }

    // Draw decorative elements in the corners
    this.drawCornerSun(ctx, 10, 10, 25);
    this.drawCornerSun(ctx, width - 10, 10, 25);
    this.drawCornerSun(ctx, 10, height - 10, 25);
    this.drawCornerSun(ctx, width - 10, height - 10, 25);

    const currentGrid = window.GridModule.getGrid();
    const cellStates = window.GridModule.getCellStates();
    const { cols, rows, CELL_SIZE } = window.GridModule.getGridDimensions();

    // Draw cells
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = i * CELL_SIZE;
        const y = j * CELL_SIZE;

        // Determine cell color based on state
        let cellColor;
        let emoji = "";

        if (currentGrid[i][j] === 1) {
          // Live cell (resident)
          if (cellStates[i][j] === 1) {
            cellColor = window.GameConfig.UNDERPOPULATED_COLOR; // Leaving due to loneliness
            emoji = window.GameConfig.LONELY_RESIDENT;
          } else if (cellStates[i][j] === 2) {
            cellColor = window.GameConfig.OVERPOPULATED_COLOR; // Leaving due to overcrowding
            emoji = window.GameConfig.CROWDED_RESIDENT;
          } else {
            cellColor = window.GameConfig.ALIVE_CELL_COLOR; // Happy resident
            emoji = window.GameConfig.HAPPY_RESIDENT;
          }
        } else {
          // Dead cell (empty home)
          if (cellStates[i][j] === 3) {
            cellColor = window.GameConfig.REPRODUCTION_COLOR; // New family moving in
            emoji = window.GameConfig.NEW_FAMILY;
          } else {
            cellColor = window.GameConfig.DEAD_CELL_COLOR; // Empty home
            emoji = window.GameConfig.EMPTY_HOME;
          }
        }

        // Draw home background
        ctx.fillStyle = cellColor;
        // Draw rounded rectangle for a more friendly look
        this.roundRect(ctx, x + 2, y + 2, CELL_SIZE - 4, CELL_SIZE - 4, 8, true);

        // Draw home border
        ctx.strokeStyle = window.GameConfig.GRID_COLOR;
        ctx.lineWidth = 2;
        this.roundRect(
          ctx,
          x + 2,
          y + 2,
          CELL_SIZE - 4,
          CELL_SIZE - 4,
          8,
          false,
          true
        );

        // Draw emoji
        ctx.font = "18px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#000";
        ctx.fillText(emoji, x + CELL_SIZE / 2, y + CELL_SIZE / 2);
      }
    }
  },

  /**
   * Function to draw rounded rectangles
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {number} width - Rectangle width
   * @param {number} height - Rectangle height
   * @param {number} radius - Corner radius
   * @param {boolean} fill - Whether to fill the rectangle
   * @param {boolean} stroke - Whether to stroke the rectangle
   */
  roundRect: function(ctx, x, y, width, height, radius, fill, stroke) {
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
  },

  /**
   * Function to draw a sun in the corner
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {number} radius - Sun radius
   */
  drawCornerSun: function(ctx, x, y, radius) {
    ctx.save();

    // Draw sun circle
    ctx.fillStyle = "#FFEB3B";
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    // Draw sun rays
    ctx.strokeStyle = "#FFC107";
    ctx.lineWidth = 3;
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
      ctx.lineTo(
        x + Math.cos(angle) * (radius + 15),
        y + Math.sin(angle) * (radius + 15)
      );
      ctx.stroke();
    }

    // Draw sun face
    ctx.fillStyle = "#FF9800";
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
  },

  /**
   * Add confetti effect
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} width - Canvas width
   * @param {number} height - Canvas height
   */
  addConfetti: function(ctx, width, height) {
    const confettiCount = 10;
    const colors = [
      "#FF5722",
      "#FF9800",
      "#FFC107",
      "#FFEB3B",
      "#CDDC39",
      "#8BC34A",
      "#4CAF50",
    ];

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
        ctx.arc(x, y, size / 2, 0, Math.PI * 2);
      } else {
        // Draw star
        this.drawStar(ctx, x, y, 5, size / 2, size / 4);
      }
      ctx.fill();
    }
  },

  /**
   * Function to draw a star
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} cx - Center X coordinate
   * @param {number} cy - Center Y coordinate
   * @param {number} spikes - Number of spikes
   * @param {number} outerRadius - Outer radius
   * @param {number} innerRadius - Inner radius
   */
  drawStar: function(ctx, cx, cy, spikes, outerRadius, innerRadius) {
    let rot = (Math.PI / 2) * 3;
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
  },

  /**
   * Show an animation to indicate time passing
   * @param {HTMLElement} statsContainer - Stats container element
   */
  showTimeAnimation: function(statsContainer) {
    // Create and show a time animation element
    const timeIcon = document.createElement("div");
    timeIcon.classList.add("time-icon");
    timeIcon.innerHTML = window.GameLogic.getGeneration() % 6 === 0 ? "🌙" : "☀️";

    // Position it near the time counter
    statsContainer.appendChild(timeIcon);

    // Animate it across the screen
    setTimeout(() => {
      timeIcon.style.transform = "translate(50px, -50px) scale(1.5)";
      timeIcon.style.opacity = "0";

      // Remove it after animation
      setTimeout(() => {
        timeIcon.remove();
      }, 1500);
    }, 100);
  },

  /**
   * Animate counter going up or down
   * @param {HTMLElement} element - Element to animate
   * @param {number} from - Starting value
   * @param {number} to - Ending value
   */
  animateCounter: function(element, from, to) {
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
  },

  /**
   * Trigger rainbow explosion when Friends count reaches zero
   * @param {HTMLElement} gridContainer - Grid container element
   */
  triggerRainbowExplosion: function(gridContainer) {
    // Stop music 10ms before the explosion
    if (window.gameMusicPlayer) {
      setTimeout(() => {
        window.gameMusicPlayer.stop();
      }, 0);
    }

    // Pause the game to appreciate the explosion
    if (window.GameLogic.isGameRunning()) {
      window.GameLogic.setGameRunning(false);
    }

    // Wait 25ms before starting the animation
    setTimeout(() => {
      // Create explosion container
      const explosionContainer = document.createElement("div");
      explosionContainer.className = "explosion-container";
      gridContainer.appendChild(explosionContainer);

      // Add colorful particles
      const numParticles = 200;
      const colors = [
        "#FF5252",
        "#FF4081",
        "#E040FB",
        "#7C4DFF",
        "#536DFE",
        "#448AFF",
        "#40C4FF",
        "#18FFFF",
        "#64FFDA",
        "#69F0AE",
        "#B2FF59",
        "#EEFF41",
        "#FFFF00",
        "#FFD740",
        "#FFAB40",
        "#FF6E40",
      ];

      // Add a funny message at the bottom
      const message = document.createElement("div");
      message.className = "explosion-message";
      message.innerHTML = "BOOM! Everyone left! 🎉";
      explosionContainer.appendChild(message);

      // Create and position the particles
      for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement("div");
        particle.className = "explosion-particle";

        // Random position, size, and color
        const size = Math.floor(Math.random() * 20) + 10;
        const color = colors[Math.floor(Math.random() * colors.length)];

        // Shape variation
        const shape =
          Math.random() > 0.7
            ? "star"
            : Math.random() > 0.5
            ? "circle"
            : "heart";

        particle.style.width = size + "px";
        particle.style.height = size + "px";
        particle.style.backgroundColor = color;
        particle.style.boxShadow = `0 0 ${size / 2}px ${color}`;

        if (shape === "star") {
          particle.innerHTML = "★";
          particle.style.background = "transparent";
          particle.style.color = color;
          particle.style.fontSize = size * 1.5 + "px";
          particle.style.textAlign = "center";
          particle.style.lineHeight = size + "px";
        } else if (shape === "heart") {
          particle.innerHTML = "❤";
          particle.style.background = "transparent";
          particle.style.color = color;
          particle.style.fontSize = size * 1.5 + "px";
          particle.style.textAlign = "center";
          particle.style.lineHeight = size + "px";
        } else {
          particle.style.borderRadius = "50%";
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
        particle.style.setProperty("--end-x", x + "px");
        particle.style.setProperty("--end-y", y + "px");
        particle.style.setProperty(
          "--rotation",
          Math.random() * 720 - 360 + "deg"
        );
        particle.style.setProperty("--delay", Math.random() * 0.5 + "s");
        particle.style.setProperty("--duration", Math.random() * 1.5 + 1 + "s");

        explosionContainer.appendChild(particle);
      }

      // Remove explosion after animation completes
      setTimeout(() => {
        explosionContainer.classList.add("fade-out");
        setTimeout(() => {
          explosionContainer.remove();
        }, 1000);
      }, 4000);

      // Play explosion sound
      window.SoundEffects.playExplosionSound();
    }, 25);
  },

  /**
   * Function to trigger animation when pattern becomes stable
   * @param {HTMLElement} gridContainer - Grid container element
   * @param {HTMLElement} populationCount - Population count element
   * @param {HTMLElement} canvas - Canvas element
   */
  triggerStablePatternAnimation: function(gridContainer, populationCount, canvas) {
    // Stop music 10ms before the animation
    if (window.gameMusicPlayer) {
      setTimeout(() => {
        window.gameMusicPlayer.stop();
      }, 0);
    }

    // Pause the game to appreciate the stable pattern
    if (window.GameLogic.isGameRunning()) {
      window.GameLogic.setGameRunning(false);
    }

    // Wait 25ms before starting the animation
    setTimeout(() => {
      // Create animation container
      const stableContainer = document.createElement("div");
      stableContainer.className = "stable-container";
      gridContainer.appendChild(stableContainer);

      // Add sparkling stars around the stable pattern
      const numStars = 150;
      const colors = [
        "#FFD700",
        "#F0E68C",
        "#FFFF00",
        "#FFFACD",
        "#FAFAD2",
        "#FFFFE0",
        "#FFF8DC",
        "#EEE8AA",
      ];

      for (let i = 0; i < numStars; i++) {
        const star = document.createElement("div");
        star.className = "stable-star";

        // Random size and color
        const size = Math.floor(Math.random() * 10) + 5;
        const color = colors[Math.floor(Math.random() * colors.length)];

        star.style.width = size + "px";
        star.style.height = size + "px";
        star.style.backgroundColor = color;
        star.style.boxShadow = `0 0 ${size / 2}px ${color}`;

        // Random position around the grid
        const gridRect = canvas.getBoundingClientRect();
        const containerRect = gridContainer.getBoundingClientRect();

        const gridX = gridRect.left - containerRect.left + gridRect.width / 2;
        const gridY = gridRect.top - containerRect.top + gridRect.height / 2;

        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 100 + gridRect.width / 2;

        const x = gridX + Math.cos(angle) * distance;
        const y = gridY + Math.sin(angle) * distance;

        star.style.left = x + "px";
        star.style.top = y + "px";

        // Animation parameters
        star.style.setProperty("--delay", Math.random() * 2 + "s");
        star.style.setProperty("--duration", Math.random() * 3 + 2 + "s");

        stableContainer.appendChild(star);
      }

      // Create crown animation at the top
      const crown = document.createElement("div");
      crown.className = "stable-crown";
      crown.innerHTML = "👑";
      stableContainer.appendChild(crown);

      // Add message
      const message = document.createElement("div");
      message.className = "stable-message";
      message.innerHTML = "Perfect Balance Achieved! ✨";
      stableContainer.appendChild(message);

      // Add trophy
      const trophy = document.createElement("div");
      trophy.className = "stable-trophy";
      trophy.innerHTML = "🏆";
      stableContainer.appendChild(trophy);

      // Frame the stable pattern with a glowing border
      const frame = document.createElement("div");
      frame.className = "stable-frame";

      // Position frame around the canvas
      const canvasRect = canvas.getBoundingClientRect();
      const containerRect2 = gridContainer.getBoundingClientRect();

      frame.style.left = canvasRect.left - containerRect2.left - 10 + "px";
      frame.style.top = canvasRect.top - containerRect2.top - 10 + "px";
      frame.style.width = canvasRect.width + 20 + "px";
      frame.style.height = canvasRect.height + 20 + "px";

      stableContainer.appendChild(frame);

      // Add a badge to the population counter
      const badge = document.createElement("div");
      badge.className = "stable-badge";
      badge.innerHTML = "⭐";
      badge.setAttribute("title", "Perfect Balance Achieved!");
      populationCount.parentNode.appendChild(badge);

      // Play success sound
      window.SoundEffects.playStablePatternSound();

      // Remove animation after some time
      setTimeout(() => {
        stableContainer.classList.add("fade-out");
        // Also fade out the badge
        if (badge) {
          badge.classList.add("fade-out");
        }
        setTimeout(() => {
          stableContainer.remove();
          // Also remove the badge
          if (badge && badge.parentNode) {
            badge.parentNode.removeChild(badge);
          }
        }, 1000);
      }, 7000);
    }, 25);
  },
  
  /**
   * Trigger four-season animation when Time reaches multiples of 24
   * @param {HTMLElement} gridContainer - Grid container element
   */
  triggerSeasonAnimation: function(gridContainer) {
    // Create season animation container
    const seasonContainer = document.createElement("div");
    seasonContainer.className = "season-container";
    gridContainer.appendChild(seasonContainer);
    
    // Determine which season to show based on the current generation
    const generation = window.GameLogic.getGeneration();
    const seasonIndex = Math.floor((generation / 24) % 4);
    
    // Update the persistent season environment
    this.updateSeasonEnvironment(seasonIndex);
    
    // Season data
    const seasons = [
      { 
        name: "Spring", 
        emoji: "🌸", 
        color: "#F8BBD0", 
        bgColor: "#E8F5E9",
        elements: ["🌱", "🌷", "🌻", "🦋", "🐝", "🐞", "🌈", "☔"],
        message: "Spring has arrived! New life blooms! 🌱"
      },
      { 
        name: "Summer", 
        emoji: "☀️", 
        color: "#FFEB3B", 
        bgColor: "#FFF9C4",
        elements: ["🏖️", "🌊", "🍦", "🍉", "🏊", "🌴", "⛱️", "🌞"],
        message: "Summer is here! Time for fun in the sun! 🌞"
      },
      { 
        name: "Autumn", 
        emoji: "🍂", 
        color: "#FF9800", 
        bgColor: "#FFF3E0",
        elements: ["🍁", "🍄", "🌰", "🎃", "🦊", "🍎", "🥮", "🌫️"],
        message: "Autumn leaves are falling! 🍁"
      },
      { 
        name: "Winter", 
        emoji: "❄️", 
        color: "#90CAF9", 
        bgColor: "#E3F2FD",
        elements: ["☃️", "⛄", "🧣", "🧤", "🎿", "🏂", "🎄", "🎁"],
        message: "Winter wonderland has arrived! ❄️"
      }
    ];
    
    const currentSeason = seasons[seasonIndex];
    
    // Create season message
    const message = document.createElement("div");
    message.className = "season-message";
    message.innerHTML = `${currentSeason.emoji} ${currentSeason.message}`;
    message.style.backgroundColor = `${currentSeason.color}B3`; // Added B3 for 70% opacity in hex
    seasonContainer.appendChild(message);
    
    // Create falling elements
    const numElements = 40;
    
    for (let i = 0; i < numElements; i++) {
      const element = document.createElement("div");
      element.className = "season-element";
      
      // Random element from the season's elements array
      const randomElement = currentSeason.elements[Math.floor(Math.random() * currentSeason.elements.length)];
      element.innerHTML = randomElement;
      
      // Random position, size, and animation duration
      const size = Math.floor(Math.random() * 20) + 20;
      element.style.fontSize = `${size}px`;
      
      // Position randomly across the width of the container
      const left = Math.random() * 100;
      element.style.left = `${left}%`;
      
      // Animation parameters
      element.style.setProperty("--fall-duration", `${Math.random() * 5 + 3}s`);
      element.style.setProperty("--fall-delay", `${Math.random() * 3}s`);
      element.style.setProperty("--sway-amount", `${Math.random() * 30 + 10}px`);
      
      seasonContainer.appendChild(element);
    }
    
    // Create season background overlay
    const overlay = document.createElement("div");
    overlay.className = "season-overlay";
    overlay.style.backgroundColor = currentSeason.bgColor;
    seasonContainer.appendChild(overlay);
    
    // Play season sound if available
    if (window.SoundEffects && window.SoundEffects.playSeasonSound) {
      window.SoundEffects.playSeasonSound(seasonIndex);
    }
    
    // Remove animation after 5 seconds
    setTimeout(() => {
      seasonContainer.classList.add("fade-out");
      setTimeout(() => {
        seasonContainer.remove();
      }, 1000);
    }, 5000); // Changed from 8000 to 5000 (5 seconds)
  },
  
  /**
   * Initialize the season environment
   * Sets up the initial season (Spring) when the game starts
   */
  initializeSeasonEnvironment: function() {
    // Set initial season to Spring (index 0)
    this.updateSeasonEnvironment(0);
  },
  
  /**
   * Update the persistent season environment
   * @param {number} seasonIndex - Index of the season (0: Spring, 1: Summer, 2: Autumn, 3: Winter)
   */
  updateSeasonEnvironment: function(seasonIndex) {
    // Season data
    const seasons = [
      { 
        name: "Spring", 
        emoji: "🌸", 
        displayClass: "spring-display",
        environmentClass: "season-spring",
        elements: ["🌱", "🌷", "🌻", "🦋", "🐝", "🐞", "🌈", "☔"],
        weather: "rain-rainbow" // Light rain with rainbows
      },
      { 
        name: "Summer", 
        emoji: "☀️", 
        displayClass: "summer-display",
        environmentClass: "season-summer",
        elements: ["🏖️", "🌊", "🍦", "🍉", "🏊", "🌴", "⛱️", "🌞"],
        weather: "sunshine-clouds" // Sunshine with occasional clouds
      },
      { 
        name: "Autumn", 
        emoji: "🍂", 
        displayClass: "autumn-display",
        environmentClass: "season-autumn",
        elements: ["🍁", "🍄", "🌰", "🎃", "🦊", "🍎", "🥮", "🌫️"],
        weather: "leaves-fog" // Falling leaves with light fog
      },
      { 
        name: "Winter", 
        emoji: "❄️", 
        displayClass: "winter-display",
        environmentClass: "season-winter",
        elements: ["☃️", "⛄", "🧣", "🧤", "🎿", "🏂", "🎄", "🎁"],
        weather: "snow" // Snowfall
      }
    ];
    
    const currentSeason = seasons[seasonIndex];
    
    // Update season display in stats
    const seasonDisplay = document.getElementById("season-display");
    if (seasonDisplay) {
      // Remove all season classes
      seasonDisplay.classList.remove("spring-display", "summer-display", "autumn-display", "winter-display");
      // Add current season class
      seasonDisplay.classList.add(currentSeason.displayClass);
      // Update text to show only the emoji
      seasonDisplay.textContent = currentSeason.emoji;
    }
    
    // Update season environment
    const seasonEnvironment = document.getElementById("season-environment");
    if (seasonEnvironment) {
      // Clear previous season elements
      seasonEnvironment.innerHTML = "";
      
      // Remove all season classes
      seasonEnvironment.classList.remove("season-spring", "season-summer", "season-autumn", "season-winter");
      // Add current season class
      seasonEnvironment.classList.add(currentSeason.environmentClass);
      
      // Add weather effects
      this.createWeatherEffects(seasonEnvironment, currentSeason.weather);
      
      // Add persistent season elements
      const numElements = 12; // Fewer elements for persistent display
      
      for (let i = 0; i < numElements; i++) {
        const element = document.createElement("div");
        element.className = "persistent-element";
        
        // Random element from the season's elements array
        const randomElement = currentSeason.elements[Math.floor(Math.random() * currentSeason.elements.length)];
        element.innerHTML = randomElement;
        
        // Random position around the edges
        const position = Math.random();
        const size = Math.floor(Math.random() * 15) + 15;
        element.style.fontSize = `${size}px`;
        
        // Position elements around the edges of the container
        if (position < 0.25) {
          // Top edge
          element.style.top = "5%";
          element.style.left = `${Math.random() * 90 + 5}%`;
        } else if (position < 0.5) {
          // Right edge
          element.style.top = `${Math.random() * 90 + 5}%`;
          element.style.right = "5%";
          element.style.left = "auto";
        } else if (position < 0.75) {
          // Bottom edge
          element.style.bottom = "5%";
          element.style.top = "auto";
          element.style.left = `${Math.random() * 90 + 5}%`;
        } else {
          // Left edge
          element.style.top = `${Math.random() * 90 + 5}%`;
          element.style.left = "5%";
        }
        
        // Animation parameters for floating around
        const moveX = Math.random() * 30 - 15;
        const moveY = Math.random() * 30 - 15;
        const moveX2 = Math.random() * 30 - 15;
        const moveY2 = Math.random() * 30 - 15;
        const moveX3 = Math.random() * 30 - 15;
        const moveY3 = Math.random() * 30 - 15;
        const rotateDeg = Math.random() * 180 - 90;
        
        element.style.setProperty("--move-x", `${moveX}px`);
        element.style.setProperty("--move-y", `${moveY}px`);
        element.style.setProperty("--move-x2", `${moveX2}px`);
        element.style.setProperty("--move-y2", `${moveY2}px`);
        element.style.setProperty("--move-x3", `${moveX3}px`);
        element.style.setProperty("--move-y3", `${moveY3}px`);
        element.style.setProperty("--rotate-deg", `${rotateDeg}deg`);
        element.style.animationDelay = `${Math.random() * 5}s`;
        element.style.animationDuration = `${Math.random() * 10 + 10}s`;
        
        seasonEnvironment.appendChild(element);
      }
    }
  }
};

/**
 * Additional grid drawing function - this is now part of the AnimationModule object above
 * and should not be exported separately
 */
// This function is already implemented in the AnimationModule object above

// This function is already implemented in the AnimationModule object above

// This function is already implemented in the AnimationModule object above

// This function is already implemented in the AnimationModule object above

// This function is already implemented in the AnimationModule object above

// This function is already implemented in the AnimationModule object above

// This function is already implemented in the AnimationModule object above

// This function is already implemented in the AnimationModule object above

// This function is already implemented in the AnimationModule object above

// Add weather effect functions to the AnimationModule
window.AnimationModule.createWeatherEffects = function(container, weatherType) {
  // Create a weather container
  const weatherContainer = document.createElement("div");
  weatherContainer.className = "weather-container";
  container.appendChild(weatherContainer);
  
  switch (weatherType) {
    case "rain-rainbow":
      // Spring - Only light clouds
      this.createClouds(weatherContainer, 3, 'light');
      break;
      
    case "sunshine-clouds":
      // Summer - Only sunshine, no clouds
      const sunRay = document.createElement("div");
      sunRay.className = "sun-ray";
      weatherContainer.appendChild(sunRay);
      break;
      
    case "leaves-fog":
      // Autumn - Falling leaves with rain from clouds
      this.createFallingLeaves(weatherContainer, 15);
      this.createClouds(weatherContainer, 4, 'dark');
      this.createRainEffect(weatherContainer, 25, 'medium');
      
      // Add fog effect
      const fog = document.createElement("div");
      fog.className = "fog";
      weatherContainer.appendChild(fog);
      break;
      
    case "snow":
      // Winter - Clouds sending snow
      this.createClouds(weatherContainer, 5, 'white');
      this.createSnowEffect(weatherContainer, 30);
      
      // Add some light fog
      const winterFog = document.createElement("div");
      winterFog.className = "fog";
      winterFog.style.opacity = "0.1";
      weatherContainer.appendChild(winterFog);
      break;
  }
};

/**
 * Trigger a big rainbow effect at Time 60, 120, 180, 240
 * @param {HTMLElement} container - The container to add the rainbow to
 */
window.AnimationModule.triggerBigRainbow = function(container) {
  // Create the big rainbow
  const rainbow = document.createElement("div");
  rainbow.className = "big-rainbow";
  container.appendChild(rainbow);
  
  // Add clouds at the ends of the rainbow
  const leftCloud = document.createElement("div");
  leftCloud.className = "rainbow-cloud left-cloud";
  leftCloud.innerHTML = "☁️";
  leftCloud.style.position = "absolute";
  leftCloud.style.fontSize = "50px";
  leftCloud.style.left = "5%";
  leftCloud.style.top = "calc(10% + 300px - 25px)";
  leftCloud.style.zIndex = "16";
  container.appendChild(leftCloud);
  
  const rightCloud = document.createElement("div");
  rightCloud.className = "rainbow-cloud right-cloud";
  rightCloud.innerHTML = "☁️";
  rightCloud.style.position = "absolute";
  rightCloud.style.fontSize = "50px";
  rightCloud.style.right = "5%";
  rightCloud.style.top = "calc(10% + 300px - 25px)";
  rightCloud.style.zIndex = "16";
  container.appendChild(rightCloud);
  
  // Add a sun near the rainbow
  const sun = document.createElement("div");
  sun.className = "rainbow-sun";
  sun.innerHTML = "☀️";
  sun.style.position = "absolute";
  sun.style.fontSize = "60px";
  sun.style.left = "calc(50% - 30px)";
  sun.style.top = "5%";
  sun.style.zIndex = "16";
  sun.style.animation = "sun-spin 10s linear infinite";
  container.appendChild(sun);
  
  // Play a special sound if available
  if (window.SoundEffects && window.SoundEffects.playRainbowSound) {
    window.SoundEffects.playRainbowSound();
  }
  
  // Remove the rainbow and decorations after animation completes
  setTimeout(() => {
    rainbow.remove();
    leftCloud.remove();
    rightCloud.remove();
    sun.remove();
  }, 10000); // 10 seconds matches the animation duration
};

window.AnimationModule.createRainEffect = function(container, count, type) {
  for (let i = 0; i < count; i++) {
    const raindrop = document.createElement("div");
    raindrop.className = "rain-drop";
    
    // Random position
    raindrop.style.left = `${Math.random() * 100}%`;
    
    // Random speed based on type
    let speed, opacity, size;
    
    switch(type) {
      case 'light':
        speed = Math.random() * 3 + 2;
        opacity = 0.4 + Math.random() * 0.3;
        size = 1 + Math.random();
        break;
      case 'medium':
        speed = Math.random() * 2.5 + 3;
        opacity = 0.5 + Math.random() * 0.3;
        size = 1.5 + Math.random();
        break;
      case 'heavy':
      default:
        speed = Math.random() * 2 + 4;
        opacity = 0.6 + Math.random() * 0.3;
        size = 2 + Math.random();
    }
    
    raindrop.style.animationDuration = `${speed}s`;
    raindrop.style.opacity = opacity;
    
    // Random delay
    raindrop.style.animationDelay = `${Math.random() * 5}s`;
    
    // Set size
    raindrop.style.width = `${size}px`;
    raindrop.style.height = `${10 + Math.random() * 10}px`;
    
    // For autumn, make the rain start from the clouds
    if (type === 'medium') {
      // Position rain to start from random positions in the top 50% of the container
      raindrop.style.top = `${Math.random() * 50}%`;
    }
    
    container.appendChild(raindrop);
  }
};

window.AnimationModule.createSnowEffect = function(container, count) {
  const snowflakes = ["❄", "❅", "❆", "•"];
  
  for (let i = 0; i < count; i++) {
    const snowflake = document.createElement("div");
    snowflake.className = "snowflake";
    
    // Random snowflake character
    snowflake.textContent = snowflakes[Math.floor(Math.random() * snowflakes.length)];
    
    // Random position - make snow start from the top 50% to appear from clouds
    snowflake.style.left = `${Math.random() * 100}%`;
    snowflake.style.top = `${Math.random() * 50}%`;
    
    // Random speed
    const fallSpeed = Math.random() * 10 + 10;
    snowflake.style.animationDuration = `${fallSpeed}s, ${fallSpeed / 2}s`;
    
    // Random delay
    snowflake.style.animationDelay = `${Math.random() * 5}s, 0s`;
    
    // Random size
    const size = 10 + Math.random() * 15;
    snowflake.style.fontSize = `${size}px`;
    
    // Random sway amount
    snowflake.style.setProperty("--sway-amount", `${Math.random() * 50 - 25}px`);
    
    container.appendChild(snowflake);
  }
};

window.AnimationModule.createFallingLeaves = function(container, count) {
  const leaves = ["🍁", "🍂", "🍃"];
  
  for (let i = 0; i < count; i++) {
    const leaf = document.createElement("div");
    leaf.className = "leaf";
    
    // Random leaf character
    leaf.textContent = leaves[Math.floor(Math.random() * leaves.length)];
    
    // Random position
    leaf.style.left = `${Math.random() * 100}%`;
    
    // Random speeds for different animations
    const fallSpeed = Math.random() * 15 + 10;
    const swaySpeed = Math.random() * 5 + 3;
    const spinSpeed = Math.random() * 10 + 10;
    leaf.style.animationDuration = `${fallSpeed}s, ${swaySpeed}s, ${spinSpeed}s`;
    
    // Random delays
    leaf.style.animationDelay = `${Math.random() * 10}s, 0s, 0s`;
    
    // Random size
    const size = 15 + Math.random() * 10;
    leaf.style.fontSize = `${size}px`;
    
    // Random sway amount
    leaf.style.setProperty("--sway-amount", `${Math.random() * 100 - 50}px`);
    
    container.appendChild(leaf);
  }
};

window.AnimationModule.createClouds = function(container, count, type) {
  for (let i = 0; i < count; i++) {
    const cloud = document.createElement("div");
    cloud.className = "cloud";
    
    // Set cloud color based on type
    let cloudColor;
    switch (type) {
      case 'light':
        cloudColor = "rgba(255, 255, 255, 0.6)";
        break;
      case 'dark':
        cloudColor = "rgba(100, 100, 100, 0.7)";
        break;
      default: // white
        cloudColor = "rgba(255, 255, 255, 0.8)";
    }
    
    cloud.style.background = cloudColor;
    
    // Random position - different for each season
    if (type === 'light') {
      // Spring - higher, lighter clouds
      cloud.style.top = `${Math.random() * 30}%`;
    } else if (type === 'dark') {
      // Autumn - lower, darker clouds for rain
      cloud.style.top = `${Math.random() * 20 + 10}%`;
    } else {
      // Winter - mid-level clouds for snow
      cloud.style.top = `${Math.random() * 20 + 5}%`;
    }
    
    // Random size
    const size = 30 + Math.random() * 40;
    cloud.style.width = `${size}px`;
    cloud.style.height = `${size * 0.6}px`;
    
    // Random cloud shape using box-shadow
    cloud.style.setProperty("--cloud-shadow-x1", `${Math.random() * 20 - 10}px`);
    cloud.style.setProperty("--cloud-shadow-y1", `${Math.random() * 10 - 5}px`);
    cloud.style.setProperty("--cloud-shadow-size1", `${15 + Math.random() * 10}px`);
    
    cloud.style.setProperty("--cloud-shadow-x2", `${Math.random() * 20 - 10}px`);
    cloud.style.setProperty("--cloud-shadow-y2", `${Math.random() * 10 - 5}px`);
    cloud.style.setProperty("--cloud-shadow-size2", `${15 + Math.random() * 10}px`);
    
    cloud.style.setProperty("--cloud-shadow-x3", `${Math.random() * 20 - 10}px`);
    cloud.style.setProperty("--cloud-shadow-y3", `${Math.random() * 10 - 5}px`);
    cloud.style.setProperty("--cloud-shadow-size3", `${15 + Math.random() * 10}px`);
    
    // Random speed - different for each season
    let speed;
    if (type === 'light') {
      // Spring - faster moving clouds
      speed = 20 + Math.random() * 40;
    } else if (type === 'dark') {
      // Autumn - slower, heavier clouds
      speed = 40 + Math.random() * 60;
    } else {
      // Winter - medium speed clouds
      speed = 30 + Math.random() * 50;
    }
    
    cloud.style.animationDuration = `${speed}s`;
    
    // Random delay
    cloud.style.animationDelay = `${Math.random() * -30}s`;
    
    container.appendChild(cloud);
  }
};