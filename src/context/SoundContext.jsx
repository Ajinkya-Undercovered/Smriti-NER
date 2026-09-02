import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const SoundContext = createContext();

export const SoundProvider = ({ children }) => {
  const [isPlayingAmbient, setIsPlayingAmbient] = useState(false);
  const [ambientType, setAmbientType] = useState(null); // 'river', 'rain', 'flute', 'dhol'
  const audioCtxRef = useRef(null);
  const ambientNodesRef = useRef([]);

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // Play celebration fanfare (gentle, happy chime for seniors)
  const playCelebration = () => {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.12);
        
        gain.gain.setValueAtTime(0, now + i * 0.12);
        gain.gain.linearRampToValueAtTime(0.2, now + i * 0.12 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.6);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.7);
      });
    } catch (e) {
      console.warn('Audio play error', e);
    }
  };

  // Gentle correct match chime
  const playMatchSound = () => {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.2);
      
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {
      console.warn('Audio play error', e);
    }
  };

  // Card flip click sound
  const playCardFlip = () => {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.08);
      
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {
      console.warn('Audio play error', e);
    }
  };

  // Water pouring glass chime
  const playWaterChime = () => {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      [600, 750, 900, 1100].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        
        gain.gain.setValueAtTime(0.15, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.45);
      });
    } catch (e) {
      console.warn('Audio play error', e);
    }
  };

  // Medicine reminder gentle bell
  const playMedicineBell = () => {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now);
      osc.stop(now + 1.5);
    } catch (e) {
      console.warn('Audio play error', e);
    }
  };

  // Ambient sound synthesizer (river waves, rain, flute)
  const stopAmbient = () => {
    ambientNodesRef.current.forEach(node => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (err) {
        console.warn(err);
      }
    });
    ambientNodesRef.current = [];
    setIsPlayingAmbient(false);
    setAmbientType(null);
  };

  const playAmbientSound = (type) => {
    stopAmbient();
    try {
      const ctx = getAudioContext();
      setAmbientType(type);
      setIsPlayingAmbient(true);

      if (type === 'river' || type === 'rain') {
        // Pink noise generator for soothing water/rain
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          data[i] = (b0 + b1 + b2) * 0.05;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = type === 'rain' ? 'lowpass' : 'bandpass';
        filter.frequency.value = type === 'rain' ? 800 : 400;

        const gain = ctx.createGain();
        gain.gain.value = 0.15;

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        noise.start();
        ambientNodesRef.current = [noise, filter, gain];
      } else if (type === 'flute') {
        // Soft meditative bamboo flute tone
        const osc = ctx.createOscillator();
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.value = 392.00; // G4 bamboo tone

        lfo.frequency.value = 4.5; // Vibrato
        lfoGain.gain.value = 6;
        lfo.connect(osc.frequency);

        gain.gain.value = 0.12;

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        lfo.start();
        ambientNodesRef.current = [osc, lfo, lfoGain, gain];
      }
    } catch (e) {
      console.warn('Ambient error', e);
      setIsPlayingAmbient(false);
    }
  };

  useEffect(() => {
    return () => {
      stopAmbient();
    };
  }, []);

  return (
    <SoundContext.Provider value={{
      isPlayingAmbient,
      ambientType,
      playCelebration,
      playMatchSound,
      playCardFlip,
      playWaterChime,
      playMedicineBell,
      playAmbientSound,
      stopAmbient
    }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => useContext(SoundContext);
