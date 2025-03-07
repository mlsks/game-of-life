/**
 * Game of Life Music Player
 * A Bach and Mario fusion soundtrack that plays during the adventure
 */
class GameMusicPlayer {
  constructor() {
    this.isPlaying = false;
    this.isMuted = false;
    this.audioContext = null;
    this.mainGainNode = null;
    this.scheduledNotes = [];
    this.currentLoop = null;
    this.nextNoteTime = 0;
    this.tempo = 140; // Slower tempo as requested (160 BPM)
    this.lookahead = 25.0; // How frequently to call the scheduling function (in milliseconds)
    this.scheduleAheadTime = 0.1; // How far ahead to schedule audio (in seconds)
    this.currentNote = 0;
    this.timerID = null;
    this.originalVolume = 0.35; // Increased volume as requested
    this.isAudioInitialized = false;

    // Arpeggiated Nintendo-style melody with Bach influences
    // Format: [note, octave, duration in beats]
    this.bachMarioMelody = [
      // C major arpeggio pattern
      ["C", 4, 0.25],
      ["E", 4, 0.25],
      ["G", 4, 0.25],
      ["C", 5, 0.25],
      ["G", 4, 0.25],
      ["E", 4, 0.25],
      ["C", 4, 0.25],
      ["E", 4, 0.25],
      ["G", 4, 0.25],
      ["C", 5, 0.25],
      ["G", 4, 0.25],
      ["E", 4, 0.25],
      ["C", 4, 0.5],
      ["G", 4, 0.5],

      // G major arpeggio pattern
      ["G", 4, 0.25],
      ["B", 4, 0.25],
      ["D", 5, 0.25],
      ["G", 5, 0.25],
      ["D", 5, 0.25],
      ["B", 4, 0.25],
      ["G", 4, 0.25],
      ["B", 4, 0.25],
      ["D", 5, 0.25],
      ["G", 5, 0.25],
      ["D", 5, 0.25],
      ["B", 4, 0.25],
      ["G", 4, 0.5],
      ["D", 5, 0.5],

      // A minor arpeggio pattern
      ["A", 4, 0.25],
      ["C", 5, 0.25],
      ["E", 5, 0.25],
      ["A", 5, 0.25],
      ["E", 5, 0.25],
      ["C", 5, 0.25],
      ["A", 4, 0.25],
      ["C", 5, 0.25],
      ["E", 5, 0.25],
      ["A", 5, 0.25],
      ["E", 5, 0.25],
      ["C", 5, 0.25],
      ["A", 4, 0.5],
      ["E", 5, 0.5],

      // F major arpeggio pattern
      ["F", 4, 0.25],
      ["A", 4, 0.25],
      ["C", 5, 0.25],
      ["F", 5, 0.25],
      ["C", 5, 0.25],
      ["A", 4, 0.25],
      ["F", 4, 0.25],
      ["A", 4, 0.25],
      ["C", 5, 0.25],
      ["F", 5, 0.25],
      ["C", 5, 0.25],
      ["A", 4, 0.25],
      ["F", 4, 0.5],
      ["C", 5, 0.5],

      // Bach-inspired arpeggiated pattern in G
      ["G", 4, 0.25],
      ["D", 5, 0.25],
      ["B", 4, 0.25],
      ["G", 5, 0.25],
      ["D", 5, 0.25],
      ["B", 4, 0.25],
      ["G", 4, 0.25],
      ["B", 4, 0.25],
      ["D", 5, 0.25],
      ["B", 4, 0.25],
      ["G", 4, 0.25],
      ["D", 4, 0.25],
      ["G", 4, 0.5],
      ["B", 4, 0.5],

      // E minor arpeggiated pattern
      ["E", 4, 0.25],
      ["G", 4, 0.25],
      ["B", 4, 0.25],
      ["E", 5, 0.25],
      ["B", 4, 0.25],
      ["G", 4, 0.25],
      ["E", 4, 0.25],
      ["G", 4, 0.25],
      ["B", 4, 0.25],
      ["E", 5, 0.25],
      ["B", 4, 0.25],
      ["G", 4, 0.25],
      ["E", 4, 0.5],
      ["B", 4, 0.5],

      // C major 7th arpeggiated pattern
      ["C", 4, 0.25],
      ["E", 4, 0.25],
      ["G", 4, 0.25],
      ["B", 4, 0.25],
      ["G", 4, 0.25],
      ["E", 4, 0.25],
      ["C", 4, 0.25],
      ["E", 4, 0.25],
      ["G", 4, 0.25],
      ["B", 4, 0.25],
      ["G", 4, 0.25],
      ["E", 4, 0.25],
      ["C", 4, 0.5],
      ["G", 4, 0.5],

      // Flowing arpeggiated pattern
      ["C", 5, 0.25],
      ["G", 4, 0.25],
      ["E", 4, 0.25],
      ["C", 4, 0.25],
      ["D", 5, 0.25],
      ["A", 4, 0.25],
      ["F", 4, 0.25],
      ["D", 4, 0.25],
      ["E", 5, 0.25],
      ["B", 4, 0.25],
      ["G", 4, 0.25],
      ["E", 4, 0.25],
      ["C", 5, 0.25],
      ["G", 4, 0.25],
      ["E", 4, 0.25],
      ["C", 4, 0.25],

      // D minor arpeggiated pattern
      ["D", 4, 0.25],
      ["F", 4, 0.25],
      ["A", 4, 0.25],
      ["D", 5, 0.25],
      ["A", 4, 0.25],
      ["F", 4, 0.25],
      ["D", 4, 0.25],
      ["F", 4, 0.25],
      ["A", 4, 0.25],
      ["D", 5, 0.25],
      ["A", 4, 0.25],
      ["F", 4, 0.25],
      ["D", 4, 0.5],
      ["A", 4, 0.5],

      // G7 arpeggiated pattern
      ["G", 4, 0.25],
      ["B", 4, 0.25],
      ["D", 5, 0.25],
      ["F", 5, 0.25],
      ["D", 5, 0.25],
      ["B", 4, 0.25],
      ["G", 4, 0.25],
      ["B", 4, 0.25],
      ["D", 5, 0.25],
      ["F", 5, 0.25],
      ["D", 5, 0.25],
      ["B", 4, 0.25],
      ["G", 4, 0.5],
      ["D", 5, 0.5],

      // Classical cadence arpeggiated
      ["C", 5, 0.25],
      ["G", 4, 0.25],
      ["E", 4, 0.25],
      ["C", 4, 0.25],
      ["G", 4, 0.25],
      ["D", 4, 0.25],
      ["B", 3, 0.25],
      ["G", 3, 0.25],
      ["C", 4, 0.25],
      ["E", 4, 0.25],
      ["G", 4, 0.25],
      ["C", 5, 0.25],
      ["C", 4, 0.5],
      ["C", 5, 0.5],

      // A minor to E major arpeggiated
      ["A", 4, 0.25],
      ["C", 5, 0.25],
      ["E", 5, 0.25],
      ["A", 5, 0.25],
      ["G#", 4, 0.25],
      ["B", 4, 0.25],
      ["E", 5, 0.25],
      ["G#", 5, 0.25],
      ["A", 4, 0.25],
      ["C", 5, 0.25],
      ["E", 5, 0.25],
      ["A", 5, 0.25],
      ["E", 4, 0.25],
      ["G#", 4, 0.25],
      ["B", 4, 0.25],
      ["E", 5, 0.25],

      // Final arpeggiated resolution
      ["C", 4, 0.25],
      ["E", 4, 0.25],
      ["G", 4, 0.25],
      ["C", 5, 0.25],
      ["G", 4, 0.25],
      ["E", 4, 0.25],
      ["C", 4, 0.25],
      ["G", 3, 0.25],
      ["C", 4, 0.25],
      ["E", 4, 0.25],
      ["G", 4, 0.25],
      ["C", 5, 0.25],
      ["C", 4, 1],
    ];

    // Arpeggiated bass patterns
    this.bassLine = [
      // C major arpeggiated bass
      ["C", 3, 0.25],
      ["G", 3, 0.25],
      ["E", 3, 0.25],
      ["G", 3, 0.25],
      ["C", 3, 0.25],
      ["G", 3, 0.25],
      ["E", 3, 0.25],
      ["G", 3, 0.25],

      // G major arpeggiated bass
      ["G", 2, 0.25],
      ["D", 3, 0.25],
      ["B", 2, 0.25],
      ["D", 3, 0.25],
      ["G", 2, 0.25],
      ["D", 3, 0.25],
      ["B", 2, 0.25],
      ["D", 3, 0.25],

      // A minor arpeggiated bass
      ["A", 2, 0.25],
      ["E", 3, 0.25],
      ["C", 3, 0.25],
      ["E", 3, 0.25],
      ["A", 2, 0.25],
      ["E", 3, 0.25],
      ["C", 3, 0.25],
      ["E", 3, 0.25],

      // F major arpeggiated bass
      ["F", 2, 0.25],
      ["C", 3, 0.25],
      ["A", 2, 0.25],
      ["C", 3, 0.25],
      ["F", 2, 0.25],
      ["C", 3, 0.25],
      ["A", 2, 0.25],
      ["C", 3, 0.25],

      // D minor arpeggiated bass
      ["D", 2, 0.25],
      ["A", 2, 0.25],
      ["F", 2, 0.25],
      ["A", 2, 0.25],
      ["D", 2, 0.25],
      ["A", 2, 0.25],
      ["F", 2, 0.25],
      ["A", 2, 0.25],

      // E minor arpeggiated bass
      ["E", 2, 0.25],
      ["B", 2, 0.25],
      ["G", 2, 0.25],
      ["B", 2, 0.25],
      ["E", 2, 0.25],
      ["B", 2, 0.25],
      ["G", 2, 0.25],
      ["B", 2, 0.25],

      // C major 7th arpeggiated bass
      ["C", 2, 0.25],
      ["G", 2, 0.25],
      ["E", 2, 0.25],
      ["B", 2, 0.25],
      ["C", 2, 0.25],
      ["G", 2, 0.25],
      ["E", 2, 0.25],
      ["B", 2, 0.25],

      // G7 arpeggiated bass
      ["G", 2, 0.25],
      ["D", 3, 0.25],
      ["B", 2, 0.25],
      ["F", 3, 0.25],
      ["G", 2, 0.25],
      ["D", 3, 0.25],
      ["B", 2, 0.25],
      ["F", 3, 0.25],
    ];

    // Frequency mapping for notes
    this.noteToFreq = {
      C: 261.63,
      "C#": 277.18,
      D: 293.66,
      "D#": 311.13,
      E: 329.63,
      F: 349.23,
      "F#": 369.99,
      G: 392.0,
      "G#": 415.3,
      A: 440.0,
      "A#": 466.16,
      B: 493.88,
      R: 0,
    };

    // Make this instance globally available so script.js can access it directly
    window.gameMusicPlayer = this;

    this.setupEventListeners();
    // Don't initialize audio immediately - wait for user interaction
  }

  setupEventListeners() {
    // Immediately set up event listeners without waiting for DOMContentLoaded
    // since this script is loaded after the DOM is already loaded
    
    // Mute button functionality
    const muteButton = document.getElementById("mute-toggle");
    if (muteButton) {
      muteButton.addEventListener("click", () => {
        // Initialize audio on first user interaction
        if (!this.isAudioInitialized) {
          this.unlockAudio();
        }
        this.toggleMute();
        console.log("Mute toggled, isMuted:", this.isMuted);
      });
    } else {
      console.error("Mute button not found in the DOM");
    }

    // Stop music if clear button is clicked
    const clearButton = document.getElementById("clear");
    if (clearButton) {
      clearButton.addEventListener("click", () => {
        // Initialize audio on first user interaction
        if (!this.isAudioInitialized) {
          this.unlockAudio();
        }
        this.stop();
      });
    }

    // Initialize audio on any user interaction
    ["touchstart", "touchend", "mousedown", "keydown", "click"].forEach((event) => {
      document.addEventListener(
        event,
        () => {
          this.unlockAudio();
        },
        { once: true }
      );
    });
  }

  // Unlock audio on mobile devices
  unlockAudio() {
    if (!this.isAudioInitialized) {
      const initialized = this.initAudio();
      
      if (initialized && this.audioContext) {
        // Play a silent sound to unlock audio
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        gainNode.gain.value = 0;
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.start(0);
        oscillator.stop(0.001);

        console.log("Audio unlocked for playback");
      }
    } else if (this.audioContext && this.audioContext.state === "suspended") {
      // If already initialized but suspended, just resume
      this.audioContext.resume().then(() => {
        console.log("Audio context resumed after user interaction");
      });
    }
  }

  // Toggle mute state
  toggleMute() {
    // Make sure audio is initialized
    if (!this.isAudioInitialized) {
      this.unlockAudio();
    }
    
    this.isMuted = !this.isMuted;
    console.log("Mute state toggled:", this.isMuted);

    const muteButton = document.getElementById("mute-toggle");
    if (muteButton) {
      if (this.isMuted) {
        muteButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
        muteButton.classList.add("muted");
        if (this.mainGainNode) {
          this.mainGainNode.gain.setValueAtTime(
            0,
            this.audioContext.currentTime
          );
        }
      } else {
        muteButton.innerHTML = '<i class="fas fa-volume-up"></i>';
        muteButton.classList.remove("muted");
        if (this.mainGainNode && this.isPlaying) {
          this.mainGainNode.gain.setValueAtTime(
            0,
            this.audioContext.currentTime
          );
          this.mainGainNode.gain.linearRampToValueAtTime(
            this.originalVolume,
            this.audioContext.currentTime + 0.5
          );
        }
      }
    } else {
      console.error("Mute button not found when toggling mute state");
    }
  }

  // Initialize audio context and gain node
  initAudio() {
    try {
      // Create audio context if it doesn't exist
      if (!this.audioContext) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new AudioContext();

        // Create main gain node for volume control
        this.mainGainNode = this.audioContext.createGain();
        this.mainGainNode.gain.value = this.isMuted ? 0 : this.originalVolume;
        this.mainGainNode.connect(this.audioContext.destination);

        console.log("Audio context initialized");
        this.isAudioInitialized = true;
      }

      // Resume audio context if suspended
      if (this.audioContext && this.audioContext.state === "suspended") {
        this.audioContext.resume().then(() => {
          console.log("Audio context resumed successfully");
        }).catch(err => {
          console.error("Failed to resume audio context:", err);
        });
      }
      
      return true;
    } catch (e) {
      console.error("Failed to initialize audio:", e);
      return false;
    }
  }

  // Convert note, octave to frequency
  getFrequency(note, octave) {
    if (note === "R") return 0; // Rest
    const baseFreq = this.noteToFreq[note];
    if (octave === 4) return baseFreq; // Base octave

    // Adjust frequency for different octaves
    return baseFreq * Math.pow(2, octave - 4);
  }

  // Schedule upcoming notes
  scheduler() {
    // Exit if not playing
    if (!this.isPlaying) return;

    // Schedule notes until we reach the lookahead time
    while (
      this.nextNoteTime <
      this.audioContext.currentTime + this.scheduleAheadTime
    ) {
      this.scheduleNote(this.currentNote, this.nextNoteTime);
      this.advanceNote();
    }

    // Schedule next call
    this.timerID = setTimeout(() => this.scheduler(), this.lookahead);
  }

  // Schedule a single note with arpeggiated patterns
  scheduleNote(noteIndex, time) {
    // Get melody note
    const melodyIndex = noteIndex % this.bachMarioMelody.length;
    const melodyNote = this.bachMarioMelody[melodyIndex];

    // Use triangle wave for arpeggiated patterns - smoother sound
    const melodyType = "triangle";

    // Play melody note with gentle attack/release for arpeggios
    if (melodyNote[0] !== "R") {
      const noteObject = this.playTone(
        this.getFrequency(melodyNote[0], melodyNote[1]),
        time,
        melodyNote[2] * (60 / this.tempo) * 0.9,
        melodyType,
        0.25 // Balanced volume as requested
      );
      this.scheduledNotes.push(noteObject);
    }

    // Play bass note with sine wave for smooth foundation
    if (noteIndex % 2 === 0) {
      const bassIndex = Math.floor(noteIndex / 2) % this.bassLine.length;
      const bassNote = this.bassLine[bassIndex];

      const bassType = "sine"; // Smooth bass for arpeggiated melodies

      const bassNoteObject = this.playTone(
        this.getFrequency(bassNote[0], bassNote[1]),
        time,
        bassNote[2] * (60 / this.tempo) * 0.95, // Slightly longer for smoother feel
        bassType,
        0.2 // Balanced with melody
      );
      this.scheduledNotes.push(bassNoteObject);
    }
  }

  // Advance to next note
  advanceNote() {
    // Calculate time of next note
    const secondsPerBeat = 60.0 / this.tempo;
    this.nextNoteTime +=
      secondsPerBeat *
      this.bachMarioMelody[this.currentNote % this.bachMarioMelody.length][2];

    // Advance to next note
    this.currentNote++;
  }

  // Play a tone optimized for arpeggiated patterns
  playTone(frequency, startTime, duration, type = "sine", volume = 0.3) {
    if (!this.audioContext || frequency === 0) return null;
    
    // Check if audio context is in suspended state
    if (this.audioContext.state === "suspended") {
      // Try to resume the context
      this.audioContext.resume().catch(err => {
        console.error("Failed to resume audio context in playTone:", err);
        return null;
      });
    }

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.type = type;
      oscillator.frequency.value = frequency;

      // Smoother attack for arpeggiated patterns
      gainNode.gain.setValueAtTime(0.001, startTime);
      gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.03);

      // Slightly shortened sustain to create space between notes
      gainNode.gain.setValueAtTime(volume, startTime + duration * 0.6);

      // Gentle release for flowing arpeggios
      gainNode.gain.linearRampToValueAtTime(0.001, startTime + duration);

      oscillator.connect(gainNode);
      gainNode.connect(this.mainGainNode);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);

      return { oscillator, gainNode, startTime, duration };
    } catch (e) {
      console.error("Error playing tone:", e);
      return null;
    }
  }

  // Play the music
  play() {
    // Don't restart if already playing
    if (this.isPlaying) return;

    console.log("Attempting to play music");

    // Always ensure audio is initialized and resumed
    if (!this.isAudioInitialized) {
      const initialized = this.initAudio();
      if (!initialized) {
        console.error("Cannot play music - audio initialization failed");
        return;
      }
    }

    // Make sure the audio context is resumed
    if (this.audioContext && this.audioContext.state === "suspended") {
      this.audioContext.resume().then(() => {
        this.startPlayback();
      }).catch(err => {
        console.error("Failed to resume audio context:", err);
      });
    } else {
      this.startPlayback();
    }
  }

  // Start actual playback after audio context is ready
  startPlayback() {
    // Set playing flag
    this.isPlaying = true;

    // Set proper gain based on mute state
    if (this.mainGainNode) {
      const targetVolume = this.isMuted ? 0 : this.originalVolume;
      this.mainGainNode.gain.setValueAtTime(0, this.audioContext.currentTime);

      if (!this.isMuted) {
        this.mainGainNode.gain.linearRampToValueAtTime(
          targetVolume,
          this.audioContext.currentTime + 0.5
        );

        // Play a clear initial note to ensure audio is playing
        this.playTone(
          this.getFrequency("G", 4),
          this.audioContext.currentTime,
          0.1,
          "triangle",
          0.5
        );
        console.log("Initial note played, muted:", this.isMuted);
      } else {
        console.log("Playback started in muted state");
      }
    }

    // Only reset to beginning if we're not resuming from a pause
    // If nextNoteTime is 0, it means we're starting fresh, not resuming
    if (this.nextNoteTime === 0) {
      this.currentNote = 0;
      this.nextNoteTime = this.audioContext.currentTime;
    } else {
      // When resuming, just update the nextNoteTime to continue from current position
      this.nextNoteTime = this.audioContext.currentTime;
    }

    // Start scheduling notes
    this.scheduler();

    console.log("Adventure music started!");
  }

  // Pause the music
  pause() {
    // Set playing flag
    this.isPlaying = false;

    // Clear scheduler
    if (this.timerID) {
      clearTimeout(this.timerID);
      this.timerID = null;
    }

    // Fade out currently playing notes
    if (this.audioContext) {
      this.mainGainNode.gain.linearRampToValueAtTime(
        0,
        this.audioContext.currentTime + 0.5
      );

      // Cleanup scheduled notes
      setTimeout(() => {
        this.stopAllNotes();
      }, 500);
    }

    // We don't reset nextNoteTime or currentNote here to allow resuming from this position

    console.log("Adventure music paused.");
  }

  // Stop the music completely
  stop() {
    this.pause();
    this.currentNote = 0;
    this.nextNoteTime = 0; // Reset nextNoteTime to indicate a fresh start

    console.log("Adventure music stopped.");
  }

  // Stop all currently playing notes
  stopAllNotes() {
    if (!this.scheduledNotes.length) return;

    const currentTime = this.audioContext ? this.audioContext.currentTime : 0;

    // Stop all notes that are still playing
    this.scheduledNotes.forEach((note) => {
      if (note && note.startTime + note.duration > currentTime) {
        if (note.oscillator) {
          try {
            note.oscillator.stop();
          } catch (e) {
            // Note may have already stopped
          }
        }
      }
    });

    // Clear the notes array
    this.scheduledNotes = [];
  }
}

// Create a single instance of the music player
const gameMusicPlayer = new GameMusicPlayer();