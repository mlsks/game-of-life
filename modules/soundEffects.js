/**
 * Sound effects for game events
 */

// Create a global namespace for our sound effects
window.SoundEffects = {
  /**
   * Play a celebratory sound when stable pattern is achieved
   */
  playStablePatternSound: function() {
    try {
      // Create audio context
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContext();

      // Make sure the context is running
      if (audioCtx.state === "suspended") {
        audioCtx.resume().then(() => {
          this.playStablePatternSoundWithContext(audioCtx);
        });
      } else {
        this.playStablePatternSoundWithContext(audioCtx);
      }
    } catch (e) {
      console.log(
        "Web Audio API not supported or user interaction required:",
        e
      );
    }
  },

  /**
   * Helper function to play the stable pattern sound with a valid context
   * @param {AudioContext} audioCtx - Audio context
   */
  playStablePatternSoundWithContext: function(audioCtx) {
    // Play a triumphant melody
    const notes = [
      { note: 523.25, duration: 0.2 }, // C5
      { note: 587.33, duration: 0.2 }, // D5
      { note: 659.25, duration: 0.4 }, // E5
      { note: 659.25, duration: 0.4 }, // E5
      { note: 698.46, duration: 0.2 }, // F5
      { note: 783.99, duration: 0.2 }, // G5
      { note: 880.0, duration: 0.8 }, // A5
    ];

    let time = audioCtx.currentTime;

    // Play a triumphant chord
    this.playChord(audioCtx, [523.25, 659.25, 783.99], time, 1.0);

    // Play the melody
    setTimeout(() => {
      time = audioCtx.currentTime;
      notes.forEach((noteInfo) => {
        this.playTriumphNote(audioCtx, noteInfo.note, time, noteInfo.duration);
        time += noteInfo.duration;
      });
    }, 500);

    // Final chord
    setTimeout(() => {
      this.playChord(
        audioCtx,
        [523.25, 659.25, 783.99, 1046.5],
        audioCtx.currentTime,
        1.5
      );
    }, 2500);
  },

  /**
   * Helper function to play a triumphant note
   * @param {AudioContext} audioCtx - Audio context
   * @param {number} frequency - Note frequency
   * @param {number} startTime - Start time
   * @param {number} duration - Note duration
   */
  playTriumphNote: function(audioCtx, frequency, startTime, duration) {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = "triangle";
    oscillator.frequency.value = frequency;

    gainNode.gain.setValueAtTime(0.3, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  },

  /**
   * Helper function to play a chord
   * @param {AudioContext} audioCtx - Audio context
   * @param {Array} frequencies - Array of frequencies
   * @param {number} startTime - Start time
   * @param {number} duration - Chord duration
   */
  playChord: function(audioCtx, frequencies, startTime, duration) {
    frequencies.forEach((frequency) => {
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = "sine";
      oscillator.frequency.value = frequency;

      gainNode.gain.setValueAtTime(0.15, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    });
  },

  /**
   * Play a fun sound when explosion happens
   */
  playExplosionSound: function() {
    try {
      // Create audio context
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContext();

      // Make sure the context is running
      if (audioCtx.state === "suspended") {
        audioCtx.resume().then(() => {
          this.playExplosionSoundWithContext(audioCtx);
        });
      } else {
        this.playExplosionSoundWithContext(audioCtx);
      }
    } catch (e) {
      console.log(
        "Web Audio API not supported or user interaction required:",
        e
      );
    }
  },

  /**
   * Helper function to play explosion sound with a valid context
   * @param {AudioContext} audioCtx - Audio context
   */
  playExplosionSoundWithContext: function(audioCtx) {
    // Create oscillator for fun sound
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
    oscillator.frequency.exponentialRampToValueAtTime(
      69.3, // C2
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
        { note: 880.0, duration: 0.4 }, // A5
      ];

      let time = audioCtx.currentTime;
      notes.forEach((noteInfo) => {
        this.playNote(audioCtx, noteInfo.note, time, noteInfo.duration);
        time += noteInfo.duration;
      });
    }, 1000);
  },

  /**
   * Helper function to play a note
   * @param {AudioContext} audioCtx - Audio context
   * @param {number} frequency - Note frequency
   * @param {number} startTime - Start time
   * @param {number} duration - Note duration
   */
  playNote: function(audioCtx, frequency, startTime, duration) {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = frequency;

    gainNode.gain.setValueAtTime(0.3, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  }
};