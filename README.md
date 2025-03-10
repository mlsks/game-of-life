# Conway's Game of Life - Interactive Implementation

This is an interactive implementation of Conway's Game of Life, a cellular automaton devised by the British mathematician John Conway in 1970. This version features a kid-friendly interface, special effects, and musical accompaniment.

![Game of Life Screenshot](https://raw.githubusercontent.com/mlsks/game-of-life/refs/heads/main/screenshot.png)

## Live Demo

The game is live at [Conway's Game of Life Adventure](https://mlsks.github.io/game-of-life/).

## Features

- **Interactive Grid**: Click on cells to create your own patterns
- **Controls**: Start/pause the simulation, clear the grid, or create random patterns
- **Visual Effects**: Special animations for stable patterns and population changes
- **Musical Accompaniment**: Bach-inspired arpeggiated soundtrack that plays during the simulation
- **Special Events**:
  - "Seasons change
  - "Perfect Balance" celebration when a stable pattern is detected
  - "Boom Everyone" explosion when the population reaches zero
- **Keyboard Shortcuts**:
  - `1` - Start/pause the simulation
  - `2` - Clear the grid
  - `3` - Randomize the grid
- **Multi-language Support**: Available in 12 languages including Arabic, Spanish, French, and more via a language selector (button)

## Game Rules

Conway's Game of Life follows these simple rules:

1. Any live cell with fewer than two live neighbors dies (underpopulation)
2. Any live cell with two or three live neighbors lives on (survival)
3. Any live cell with more than three live neighbors dies (overpopulation)
4. Any dead cell with exactly three live neighbors becomes alive (reproduction)

In this implementation, these rules are visually represented with different colors and emoji:

- 😊 Happy residents (stable live cells)
- 😢 Lonely residents (cells about to die from underpopulation)
- 😫 Crowded residents (cells about to die from overpopulation)
- 👨‍👩‍👧 New families (cells about to become alive)
- 🏠 Empty homes (dead cells)

## Technologies Used

- HTML5 Canvas for grid rendering
- Modular JavaScript architecture with modules for game logic, animations, and sound effects (`modules/` directory)
- JSON-based localization system supporting 12+ languages (Translations/)
- Web Audio API for procedural soundtrack generation

## Music System

The game includes a procedurally generated musical accompaniment with these features:

- Arpeggiated patterns that create a flowing, pleasant background ambience
- Music that automatically starts/stops with the simulation
- Volume control via the mute button
- Special musical events that sync with game milestones
- Music stops 25ms before special events for dramatic effect

## Implementation Details

### Game Logic

The core game logic resides in `modules/gameLogic.js`, part of a modular architecture. Key modules include:

- Grid management (`grid.js`)
- Animation control (`animation.js`)
- Sound effects (`soundEffects.js`)
- Music system (`music.js`)

### Music System

The music system in `music.js` uses the Web Audio API to generate arpeggiated patterns in real-time, creating a procedural soundtrack that accompanies the simulation.

### Animations

Special CSS animations are used for events like:

- The "Perfect Balance" achievement (when a stable pattern is detected)
- The "Boom Everyone" event (when all cells die)
- Time passing indicators
- Population counter changes

## Getting Started

1. Clone this repository
2. Open `index.html` in your browser
3. Click on cells to create an initial pattern
4. Click "Start Adventure" or press 'S' to begin the simulation

## Browser Support

This game works best in modern browsers that support the Web Audio API and HTML5 Canvas. For optimal experience, use the latest versions of Chrome, Firefox, Safari, or Edge.

## License

This project is licensed under the MIT License.

## Acknowledgements

- John Conway for creating the Game of Life
- J.S. Bach for musical inspiration
- Nintendo for sound design inspiration

---

Created with ❤️ by Michel Sakkas
