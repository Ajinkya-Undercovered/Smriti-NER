// Ultra-Fluent Natural Multilingual Speech Synthesis Engine
class SpeechService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.audioLanguageMode = (typeof localStorage !== 'undefined' && localStorage.getItem('smriti_ner_audio_mode')) || 'en';
    this.currentLang = 'en';
    this.voiceSpeed = 0.90; // Natural, crisp conversational pace for clarity
    this.selectedVoiceURI = (typeof localStorage !== 'undefined' && localStorage.getItem('smriti_ner_browser_voice')) || '';
    this.voices = [];
    this.activeUtterance = null;
    this.recognition = null;

    if (this.synth) {
      this.loadVoices();
      if (typeof window !== 'undefined') {
        window.speechSynthesis.onvoiceschanged = () => this.loadVoices();
      }
    }

    this.initRecognition();
  }

  loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices() || [];
  }

  getAvailableVoices() {
    if (!this.voices || this.voices.length === 0) {
      this.loadVoices();
    }
    return this.voices || [];
  }

  setSelectedVoiceURI(uri) {
    this.selectedVoiceURI = uri;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('smriti_ner_browser_voice', uri);
    }
  }

  getSelectedVoiceURI() {
    return this.selectedVoiceURI;
  }

  setAudioLanguageMode(mode) {
    this.audioLanguageMode = mode;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('smriti_ner_audio_mode', mode);
    }
  }

  getAudioLanguageMode() {
    return this.audioLanguageMode;
  }

  setLanguage(langCode) {
    this.currentLang = langCode;
  }

  setVoiceSpeed(speed) {
    this.voiceSpeed = speed;
  }

  cleanTextForSpeech(text) {
    if (!text) return '';
    return String(text)
      .replace(/\(.*?\)/g, ' ') // Remove brackets
      .replace(/[•★✓➔🌿💊💧🩺🌸🎮👁️🍃⏳🥁👘🎵🕊️🪈🔔🌊🔴🟢🔵🟡]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  hasIndicCharacters(text) {
    if (!text) return false;
    // Checks for Assamese/Bengali (\u0980-\u09FF) or Devanagari (\u0900-\u097F)
    return /[\u0980-\u09FF\u0900-\u097F]/.test(text);
  }

  isIndicVoice(voice) {
    if (!voice) return false;
    const l = (voice.lang || '').toLowerCase();
    const n = (voice.name || '').toLowerCase();
    return (
      l.startsWith('as') ||
      l.startsWith('bn') ||
      l.startsWith('hi') ||
      n.includes('bengali') ||
      n.includes('hindi') ||
      n.includes('swara') ||
      n.includes('madhur') ||
      n.includes('বাংলা') ||
      n.includes('हिन्दी')
    );
  }

  getBestVoice(lang = 'en') {
    const all = this.getAvailableVoices();
    if (all.length === 0) return null;

    if (this.selectedVoiceURI) {
      const explicit = all.find(v => v.voiceURI === this.selectedVoiceURI);
      if (explicit) return explicit;
    }

    if (lang === 'as' || lang === 'bn' || lang === 'hi') {
      const regionalPreferred = [
        'Google বাংলা',
        'Google हिन्दी',
        'Microsoft Swara Online (Natural)',
        'Microsoft Madhur Online (Natural)',
        'Microsoft Neerja Online (Natural)',
        'bn-IN',
        'hi-IN'
      ];

      for (const name of regionalPreferred) {
        const found = all.find(v => v.name.includes(name) || v.lang === name);
        if (found) return found;
      }
      const genericIndic = all.find(v => this.isIndicVoice(v));
      if (genericIndic) return genericIndic;
    }

    // Default English preferred voices
    const preferred = [
      'Microsoft Sonia Online (Natural) - English (India)',
      'Microsoft Neerja Online (Natural) - Hindi (India)',
      'Google UK English Female',
      'Google US English',
      'Microsoft Natural',
      'Samantha',
      'Karen',
      'en-IN',
      'en-GB',
      'en-US'
    ];

    for (const name of preferred) {
      const found = all.find(v => v.name.includes(name) || v.lang === name);
      if (found) return found;
    }
    return all.find(v => v.lang.startsWith('en')) || all[0];
  }

  async speak(text, lang = this.currentLang, onEnd = null) {
    if (!text || !this.synth) return;

    // Wake up synth if paused in Chromium
    if (this.synth.paused) {
      this.synth.resume();
    }
    if (this.synth.speaking || this.synth.pending) {
      this.synth.cancel();
    }

    const cleanedText = this.cleanTextForSpeech(text);
    if (!cleanedText) return;

    let selectedVoice = this.getBestVoice(lang);
    let targetText = cleanedText;

    // If text is Indic (Assamese/Bengali) but the voice is English-only,
    // Latin voices output complete silence on Windows. Provide safe fallback message if needed.
    if (this.hasIndicCharacters(cleanedText) && (!selectedVoice || !this.isIndicVoice(selectedVoice))) {
      selectedVoice = this.getBestVoice('en');
    }

    setTimeout(() => {
      try {
        const utterance = new SpeechSynthesisUtterance(targetText);
        utterance.rate = this.voiceSpeed;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        if (selectedVoice) {
          utterance.voice = selectedVoice;
          utterance.lang = selectedVoice.lang || 'en-US';
        }

        utterance.onend = () => {
          this.activeUtterance = null;
          if (onEnd) onEnd();
        };

        utterance.onerror = (e) => {
          console.warn('SpeechSynthesis error:', e);
          this.activeUtterance = null;
          if (onEnd) onEnd();
        };

        // Pin to instance to prevent V8 garbage collection
        this.activeUtterance = utterance;

        this.synth.speak(utterance);
      } catch (err) {
        console.warn('Synthesis invocation failed', err);
        if (onEnd) onEnd();
      }
    }, 40);
  }

  speakBilingual(assameseText, englishText, onEnd = null) {
    const all = this.getAvailableVoices();
    const hasNativeIndic = all.some(v => this.isIndicVoice(v));
    const mode = this.audioLanguageMode;

    if (mode === 'as' && hasNativeIndic) {
      this.speak(assameseText || englishText, 'as', onEnd);
    } else if (mode === 'dual' && hasNativeIndic && assameseText && englishText) {
      this.speak(assameseText, 'as', () => {
        setTimeout(() => {
          this.speak(englishText, 'en', onEnd);
        }, 400);
      });
    } else {
      // If mode is 'en', OR system only has English voice installed:
      // Always speak English so the user gets loud, crystal-clear audio instead of silence!
      this.speak(englishText || assameseText, 'en', onEnd);
    }
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
      this.activeUtterance = null;
    }
  }

  initRecognition() {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-IN';
    }
  }

  startListening(onResult, onEnd, onError) {
    if (!this.recognition) {
      if (onError) onError('Speech recognition not supported in this browser');
      return;
    }
    this.recognition.lang = this.currentLang === 'as' || this.currentLang === 'bn' ? 'bn-IN' : 'en-IN';

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (onResult) onResult(transcript);
    };

    this.recognition.onend = () => {
      if (onEnd) onEnd();
    };

    this.recognition.onerror = (err) => {
      if (onError) onError(err.error);
    };

    try {
      this.recognition.start();
    } catch (e) {
      console.warn('SpeechRecognition start error', e);
    }
  }

  stopListening() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {}
    }
  }
}

export const speechService = new SpeechService();
