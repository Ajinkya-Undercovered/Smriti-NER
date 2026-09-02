// Web Audio API Sound Effects Engine
class SoundFxEngine {
  constructor() {
    this.ctx = null;
    this.ambientNodes = [];
    this.currentAmbient = null;
  }

  getAudioContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Resonant Meditative Singing Bowl Sound
  playSingingBowl() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Fundamental and harmonics
      const freqs = [216, 432, 648, 864];
      const gains = [0.3, 0.15, 0.08, 0.04];

      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(gains[i], now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 3.2);
      });
    } catch (e) {
      console.warn('Singing bowl error', e);
    }
  }

  // Tactile card flip click
  playCardFlip() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.08);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch (e) {
      console.warn('Card flip audio error', e);
    }
  }

  // Gentle correct match chime
  playMatchSound() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.25); // C6

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch (e) {
      console.warn('Match audio error', e);
    }
  }

  // Positive celebration fanfare
  playCelebration() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50];

      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.12);

        gain.gain.setValueAtTime(0, now + i * 0.12);
        gain.gain.linearRampToValueAtTime(0.22, now + i * 0.12 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.65);
      });
    } catch (e) {
      console.warn('Celebration audio error', e);
    }
  }

  // Water pouring sound
  playWaterChime() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      [650, 800, 950, 1150].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gain.gain.setValueAtTime(0.14, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.4);
      });
    } catch (e) {
      console.warn('Water audio error', e);
    }
  }

  // Ambient sound player (river, rain, flute)
  stopAmbient() {
    this.ambientNodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (err) {}
    });
    this.ambientNodes = [];
    this.currentAmbient = null;
  }

  playAmbient(type) {
    this.stopAmbient();
    try {
      const ctx = this.getAudioContext();
      this.currentAmbient = type;

      if (type === 'river' || type === 'rain') {
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
        this.ambientNodes = [noise, filter, gain];
      } else if (type === 'flute') {
        const osc = ctx.createOscillator();
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.value = 392.00; // G4 bamboo flute tone

        lfo.frequency.value = 4.5;
        lfoGain.gain.value = 6;
        lfo.connect(osc.frequency);

        gain.gain.value = 0.12;

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        lfo.start();
        this.ambientNodes = [osc, lfo, lfoGain, gain];
      }
    } catch (e) {
      console.warn('Ambient play error', e);
    }
  }
}

export const soundFx = new SoundFxEngine();
