// Ultra-Fluent Natural Multilingual Speech Synthesis Engine
class SpeechService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.audioLanguageMode = localStorage.getItem('smriti_ner_audio_mode') || 'as';
    this.currentLang = 'as';
    this.voiceSpeed = 0.90; // Natural, crisp conversational pace for clarity
    this.selectedVoiceURI = localStorage.getItem('smriti_ner_browser_voice') || '';
    this.voices = [];
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
    localStorage.setItem('smriti_ner_browser_voice', uri);
  }

  getSelectedVoiceURI() {
    return this.selectedVoiceURI;
  }

  setAudioLanguageMode(mode) {
    this.audioLanguageMode = mode;
    localStorage.setItem('smriti_ner_audio_mode', mode);
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

  cleanTextForSpeech(text, isEnglish = false) {
    if (!text) return '';
    let cleaned = String(text)
      .replace(/\(.*?\)/g, ' ') // Remove brackets
      .replace(/[•★✓➔🌿💊💧🩺🌸🎮👁️🍃⏳🥁👘🎵🕊️🪈🔔🌊🔴🟢🔵🟡]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    return cleaned;
  }

  getBestVoice(lang = 'en') {
    const all = this.getAvailableVoices();
    if (all.length === 0) return null;

    if (this.selectedVoiceURI) {
      const explicit = all.find(v => v.voiceURI === this.selectedVoiceURI);
      if (explicit) return explicit;
    }

    if (lang === 'en') {
      const preferred = [
        'Google UK English Female',
        'Google US English',
        'Microsoft Sonia Online (Natural) - English (India)',
        'Microsoft Neerja Online (Natural) - Hindi (India)',
        'Microsoft Natural',
        'Samantha',
        'Karen',
        'Victoria',
        'en-IN',
        'en-GB',
        'en-US'
      ];

      for (const name of preferred) {
        const found = all.find(v => v.name.includes(name) || v.lang === name);
        if (found) return found;
      }
      return all.find(v => v.lang.startsWith('en')) || all[0];
    } else {
      const regionalPreferred = [
        'Google বাংলা',
        'Google हिन्दी',
        'Microsoft Swara Online (Natural)',
        'Microsoft Madhur Online (Natural)',
        'Microsoft Neerja Online (Natural)',
        'bn-IN',
        'hi-IN',
        'en-IN'
      ];

      for (const name of regionalPreferred) {
        const found = all.find(v => v.name.includes(name) || v.lang === name);
        if (found) return found;
      }
      return all.find(v => v.lang.startsWith('bn') || v.lang.startsWith('hi')) || all[0];
    }
  }

  async speak(text, lang = this.currentLang, onEnd = null) {
    if (!text || !this.synth) return;
    const isEnglish = lang === 'en';
    const cleanedText = this.cleanTextForSpeech(text, isEnglish);

    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    utterance.rate = this.voiceSpeed;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    const selectedVoice = this.getBestVoice(lang);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    }

    if (onEnd) {
      utterance.onend = onEnd;
    }

    this.synth.speak(utterance);
  }

  speakBilingual(assameseText, englishText, onEnd = null) {
    const mode = this.audioLanguageMode;
    if (mode === 'as') {
      this.speak(assameseText || englishText, 'as', onEnd);
    } else if (mode === 'en') {
      this.speak(englishText || assameseText, 'en', onEnd);
    } else {
      this.speak(assameseText, 'as', () => {
        setTimeout(() => {
          this.speak(englishText, 'en', onEnd);
        }, 500);
      });
    }
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
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
