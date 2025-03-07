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
  }
};

/**
 * Additional grid drawing function - this is now part of the AnimationModule object above
 * and should not be exported separately
 */
// This function is already implemented in the AnimationModule object above
// So we're removing the export version to fix the error

// This function is already implemented in the AnimationModule object above

// This function is already implemented in the AnimationModule object above

// This function is already implemented in the AnimationModule object above

// This function is already implemented in the AnimationModule object above

// This function is already implemented in the AnimationModule object above

// This function is already implemented in the AnimationModule object above

// This function is already implemented in the AnimationModule object above

// This function is already implemented in the AnimationModule object above