/**
 * Game configuration and constants
 */

// Create a global namespace for our game
window.GameConfig = {
  // Game settings
  CELL_SIZE: 30, // Larger cells for better visibility for kids
  GRID_COLOR: "#FFD54F",
  ALIVE_CELL_COLOR: "#4CAF50", // Green for happy residents
  DEAD_CELL_COLOR: "#FFF9C4", // Light yellow for empty homes

  // Special state colors
  UNDERPOPULATED_COLOR: "#ff6666", // Red for residents leaving due to loneliness
  OVERPOPULATED_COLOR: "#ff9933", // Orange for residents leaving due to overcrowding
  REPRODUCTION_COLOR: "#4287f5", // Blue for new families moving in

  // Emoji icons for different states - larger and more kid-friendly
  HAPPY_RESIDENT: "😊",
  LONELY_RESIDENT: "😢",
  CROWDED_RESIDENT: "😫",
  NEW_FAMILY: "👨‍👩‍👧",
  EMPTY_HOME: "🏠"
};