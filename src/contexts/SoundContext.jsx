import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const SoundContext = createContext();

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};

export const SoundProvider = ({ children }) => {
  const [isMuted, setIsMuted] = useState(false);
  const audioCtxRef = useRef(null);

  // Initialize AudioContext on first user interaction to comply with browser policies
  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  useEffect(() => {
    // Add global listeners to initialize audio context
    const handleInteraction = () => initAudio();
    window.addEventListener('click', handleInteraction, { once: true });
    window.addEventListener('touchstart', handleInteraction, { once: true });
    window.addEventListener('keydown', handleInteraction, { once: true });
    
    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, []);

  const toggleMute = () => setIsMuted(prev => !prev);

  // Helper to create an oscillator and gain node
  const playTone = (frequency, type, duration, vol = 0.1, pitchDrop = false) => {
    if (isMuted || !audioCtxRef.current) return;
    initAudio();

    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(frequency, now);
    
    if (pitchDrop) {
        osc.frequency.exponentialRampToValueAtTime(0.01, now + duration);
    }

    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.start(now);
    osc.stop(now + duration);
  };

  const playClick = () => {
    // Soft high-pitched "pop"
    playTone(600, 'sine', 0.05, 0.05, true);
  };

  const playCorrect = () => {
    // Ascending chime (Ding-Ding)
    if (isMuted || !audioCtxRef.current) return;
    initAudio();
    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;

    const playNote = (freq, time, dur) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(freq, time);
      gain.gain.setValueAtTime(0.1, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + dur);
      osc.start(time);
      osc.stop(time + dur);
    };

    playNote(523.25, now, 0.15);       // C5
    playNote(659.25, now + 0.1, 0.3);  // E5
  };

  const playWrong = () => {
    // Soft low "thud" or descending tone
    if (isMuted || !audioCtxRef.current) return;
    initAudio();
    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine'; // Soft wave instead of sawtooth
    osc.connect(gain);
    gain.connect(ctx.destination);

    // Pitch bends down slightly
    osc.frequency.setValueAtTime(250, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.2);

    // Soft volume curve
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.start(now);
    osc.stop(now + 0.2);
  };

  const playComplete = () => {
    // Happy Arpeggio
    if (isMuted || !audioCtxRef.current) return;
    initAudio();
    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      const startTime = now + i * 0.1;
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.1, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);
      
      osc.start(startTime);
      osc.stop(startTime + 0.4);
    });
  };

  // --- Real MP3 BGM Logic ---
  const [isBGMEnabled, setIsBGMEnabled] = useState(false);
  const bgmAudioRef = useRef(null);

  const toggleBGM = () => {
    setIsBGMEnabled(prev => !prev);
  };

  useEffect(() => {
    // Initialize audio object if not exists
    if (!bgmAudioRef.current) {
      bgmAudioRef.current = new Audio('/sounds/bgm/bgm-1.mp3');
      bgmAudioRef.current.loop = true;
      bgmAudioRef.current.volume = 0.3; // Set a comfortable background volume
    }

    if (isBGMEnabled && !isMuted) {
      bgmAudioRef.current.play().catch(err => console.log("BGM Playback failed:", err));
    } else {
      bgmAudioRef.current.pause();
    }

    return () => {
      if (bgmAudioRef.current) bgmAudioRef.current.pause();
    };
  }, [isBGMEnabled, isMuted]);

  return (
    <SoundContext.Provider value={{ 
      isMuted, toggleMute, 
      isBGMEnabled, toggleBGM,
      playClick, playCorrect, playWrong, playComplete 
    }}>
      {children}
    </SoundContext.Provider>
  );
};
