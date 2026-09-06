// Ultra-Fluent Natural Multilingual Speech Synthesis Engine
// Supports Multiple Voice Packs:
// 1. Studio Native Assamese (🌸 অসমীয়া স্পষ্ট কণ্ঠ — Pre-recorded Studio Audio Soundbank)
// 2. ElevenLabs Multilingual v2 (🎙️ ElevenLabs AI Studio)
// 3. System Speech Synthesis (💻 Device On-Board Voices)

import { transliterateAssameseToPhonetic } from './assamesePhonetics.js';
import { elevenLabsService } from '../ai/elevenLabsService.js';

export const VOICE_PACKS = [
  {
    id: 'studio_as',
    name: '🌸 Studio Native Assamese (স্পষ্ট অসমীয়া কণ্ঠ)',
    description: 'Crystal-clear native Eastern Nagari pronunciation with instant offline studio soundbank.',
    isRecommended: true,
    tag: 'Recommended'
  },
  {
    id: 'elevenlabs',
    name: '🎙️ ElevenLabs AI Studio (বহুভাষিক AI)',
    description: 'High-emotion neural voice powered by ElevenLabs Multilingual v2 model.',
    isRecommended: false,
    tag: 'Requires API Key'
  },
  {
    id: 'system',
    name: '💻 System Device Speech (ব্ৰাউজাৰ কণ্ঠ)',
    description: 'On-device speech synthesis using Windows, Android or Mac installed voices.',
    isRecommended: false,
    tag: 'Offline Standard'
  }
];

// Pre-recorded studio audio assets for instant zero-latency, 100% authentic Assamese pronunciation
const PRE_RECORDED_PHRASES = [
  { match: /মাতৃভাষা অসমীয়াত ধ্বনি সক্ৰিয় হ’ল/i, file: '/audio/voices/as_toggle_activated.mp3' },
  { match: /অসমীয়া আৰু ইংৰাজী দুয়োটা/i, file: '/audio/voices/dual_toggle_activated.mp3' },
  { match: /English audio guidance activated/i, file: '/audio/voices/en_toggle_activated.mp3' },
  
  // Games & Descriptions
  { match: /স্মৃতি মেলা/i, file: '/audio/voices/as_game1.mp3' },
  { match: /চাহ বাগিচা/i, file: '/audio/voices/as_game2.mp3' },
  { match: /সময়ক্ৰম/i, file: '/audio/voices/as_game3.mp3' },
  { match: /বিহু ঢোল/i, file: '/audio/voices/as_game4.mp3' },
  { match: /জনজাতীয় বস্ত্ৰ/i, file: '/audio/voices/as_game5.mp3' },
  { match: /মনোৰঞ্জন আৰু স্মৃতি খেল/i, file: '/audio/voices/as_games_tile.mp3' },
  { match: /খেল আৰম্ভ/i, file: '/audio/voices/as_start_game.mp3' },
  { match: /বৰ ধুনীয়া কাম/i, file: '/audio/voices/as_praise_good.mp3' },
  { match: /খুব ভাল হৈছে/i, file: '/audio/voices/as_praise_well.mp3' },
  { match: /একো চিন্তা নকৰিব/i, file: '/audio/voices/as_praise_calm.mp3' },
  { match: /সঠিক উত্তৰ/i, file: '/audio/voices/as_match_found.mp3' },
  { match: /সফলভাৱে.*সমাপ্ত/i, file: '/audio/voices/as_game_complete.mp3' },

  // Home Hub & Senior Tiles
  { match: /নমস্কাৰ.*কি কৰিব বিচাৰে/i, file: '/audio/voices/as_home_greeting.mp3' },
  { match: /নমস্কাৰ আইতা/i, file: '/audio/voices/as_welcome_aita.mp3' },
  { match: /নমস্কাৰ ককা/i, file: '/audio/voices/as_welcome_koka.mp3' },
  { match: /মোৰ ঔষধ আৰু পানী/i, file: '/audio/voices/as_meds_tile.mp3' },
  { match: /AI কণ্ঠ সহায়ক/i, file: '/audio/voices/as_voice_tile.mp3' },
  { match: /সোণালী স্মৃতি/i, file: '/audio/voices/as_calm_tile.mp3' },
  { match: /চিকিৎসক আৰু আশা/i, file: '/audio/voices/as_doctor_tile.mp3' },
  { match: /মোৰ অগ্ৰগতি/i, file: '/audio/voices/as_progress_tile.mp3' },
  { match: /শান্তিৰে.*আছে/i, file: '/audio/voices/as_orientation.mp3' },

  // Reminders & Routine
  { match: /ঔষধ খোৱা সম্পূৰ্ণ/i, file: '/audio/voices/as_med_taken.mp3' },
  { match: /ঔষধ খাবলৈ বাকী/i, file: '/audio/voices/as_meds_remaining.mp3' },
  { match: /পানী খোৱা লিপিবদ্ধ/i, file: '/audio/voices/as_water_logged.mp3' },
  { match: /পানী খোৱা হ’ল/i, file: '/audio/voices/as_glass_water.mp3' },
  { match: /গিলাচ পানী/i, file: '/audio/voices/as_glass_water.mp3' },
  { match: /উশাহ ভিতৰলৈ লওক/i, file: '/audio/voices/as_breathe_in.mp3' },
  { match: /উশাহ এৰি দিয়ক/i, file: '/audio/voices/as_breathe_out.mp3' },
  { match: /বাঁহৰ ঢোলৰ তালে/i, file: '/audio/voices/as_drum_rhythm.mp3' },
  { match: /কাৰ্ডখন লুটিওৱক/i, file: '/audio/voices/as_card_flip.mp3' },
  { match: /মই শুনি আছোঁ/i, file: '/audio/voices/as_listening.mp3' },
  { match: /জৰুৰীকালীন সহায়/i, file: '/audio/voices/as_emergency_sos.mp3' },
  { match: /স্পষ্ট.*কণ্ঠ সহায়ক/i, file: '/audio/voices/as_voice_clarity_test.mp3' },
  { match: /স্পষ্ট অসমীয়া ষ্টুডিঅ’ কণ্ঠ/i, file: '/audio/voices/as_voice_clarity_test.mp3' }
];

// Fallback auto-translation for components that pass English text when user is in Assamese mode!
const ENGLISH_TO_ASSAMESE_MAP = [
  { match: /opening cognitive games/i, as: 'মনোৰঞ্জন আৰু স্মৃতি খেলসমূহ আৰম্ভ কৰা হৈছে।' },
  { match: /starting memory matching game/i, as: 'স্মৃতি মেলা খেল আৰম্ভ কৰা হৈছে।' },
  { match: /here is your medication/i, as: 'আপোনাৰ ঔষধ আৰু পানীৰ সোঁৱৰণী তালিকা চাওক।' },
  { match: /checking (your )?medication schedule/i, as: 'আপোনাৰ ঔষধৰ তালিকা পৰীক্ষা কৰা হৈছে।' },
  { match: /remember to have a glass of fresh water/i, as: 'পানী খোৱাৰ সোঁৱৰণী। এতিয়া এগিলাচ পানী খাওক।' },
  { match: /checking hydration.*have a glass of water/i, as: 'পানী খোৱাৰ সোঁৱৰণী। এতিয়া এগিলাচ পানী খাওক।' },
  { match: /playing calming sounds/i, as: 'সোণালী স্মৃতি আৰু শান্ত সংগীত আৰম্ভ কৰা হৈছে।' },
  { match: /opening calming music/i, as: 'সোণালী স্মৃতি আৰু শান্ত সংগীত আৰম্ভ কৰা হৈছে।' },
  { match: /opening caregiver and asha/i, as: 'তত্ত্বাৱধায়ক আৰু আশা কৰ্মী পৰ্টেল খোলা হৈছে।' },
  { match: /marked as taken/i, as: 'ঔষধ খোৱা সম্পূৰ্ণ হ’ল। বৰ ভাল কাম কৰিলে!' },
  { match: /water logged.*completed/i, as: 'পানী খোৱা লিপিবদ্ধ কৰা হ’ল। শৰীৰ সুস্থ ৰাখক!' },
  { match: /water logged/i, as: 'পানী খোৱা লিপিবদ্ধ কৰা হ’ল। শৰীৰ সুস্থ ৰাখক!' },
  { match: /reached your daily goal of 8 glasses/i, as: 'বহুত ভাল! আপুনি আজি ৮ গিলাচ পানী খোৱাৰ লক্ষ্য সম্পূৰ্ণ কৰিলে!' },
  { match: /look for (.*)/i, as: 'বিচাৰক: $1' },
  { match: /find the matching motif:? (.*)/i, as: 'মিলা আৰ্হি বিচাৰক: $1' },
  { match: /tap the drum along with the glowing rhythm/i, as: 'বাঁহৰ ঢোলৰ তালে তালে আঙুলি বুলাওক।' },
  { match: /arrange your daily routine/i, as: 'ৰাতিপুৱাৰ পৰা গধূলিলৈ দৈনিক কামবোৰ ক্ৰম অনুসৰি সজাওক।' },
  { match: /sort into the tea basket/i, as: 'চাহৰ বাস্কেটত পাতবোৰ সঠিকভাৱে বাছক।' },
  { match: /hello (.*)! what would you like to do today\? play games or check medicines/i, as: 'নমস্কাৰ! আজি আপুনি কি কৰিব বিচাৰে? খেল খেলক বা ঔষধ চাওক।' },
  { match: /today is (.*)\. you are peacefully at home in (.*)/i, as: 'আজি $1। আপুনি শান্তিৰে $2ত আছে।' },
  { match: /today is (.*)\. you are in (.*)/i, as: 'আজি $1। আপুনি শান্তিৰে $2ত আছে।' },
  { match: /good morning/i, as: 'শুভ প্ৰভাত!' },
  { match: /good afternoon/i, as: 'শুভ অপৰাহ্ণ!' },
  { match: /good evening/i, as: 'শুভ সন্ধ্যা!' },
  { match: /play memory & joy games/i, as: 'মনোৰঞ্জন আৰু স্মৃতি খেলসমূহ খেলক।' },
  { match: /my medicines & water intake/i, as: 'মোৰ ঔষধ আৰু পানীৰ সোঁৱৰণী।' },
  { match: /talk to ai voice companion/i, as: 'AI কণ্ঠ সহায়কৰ সৈতে কথা পাতক।' },
  { match: /calm sounds & reminiscence stories/i, as: 'সোণালী স্মৃতি আৰু শান্ত সংগীত শুনক।' },
  { match: /doctor, asha worker & emergency/i, as: 'চিকিৎসক আৰু আশা কৰ্মীৰ সাহায্য।' },
  { match: /my cognitive progress/i, as: 'মোৰ অগ্ৰগতি আৰু স্বাস্থ্য তথ্য।' },
  { match: /selected (clear )?voice activated/i, as: 'স্পষ্ট কণ্ঠ নিৰ্বাচন কৰা হ’ল।' },
  { match: /english audio guidance activated/i, as: 'ইংৰাজী অডিঅ’ সক্ৰিয় হ’ল।' },
  { match: /dual assamese and english audio activated/i, as: 'অসমীয়া আৰু ইংৰাজী দুয়োটা ভাষাত শুনা যাব।' }
];

class SpeechService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.audioLanguageMode = (typeof localStorage !== 'undefined' && localStorage.getItem('smriti_ner_audio_mode')) || 'as';
    this.currentLang = this.audioLanguageMode === 'en' ? 'en' : 'as';
    this.voicePack = (typeof localStorage !== 'undefined' && localStorage.getItem('smriti_ner_voice_pack')) || 'studio_as';
    this.voiceSpeed = 0.88; // Gentle, clear elderly-friendly pace
    this.selectedVoiceURI = (typeof localStorage !== 'undefined' && localStorage.getItem('smriti_ner_browser_voice')) || '';
    this.voices = [];
    this.activeUtterance = null;
    this.currentAudio = null;
    this.audioCache = new Map();
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

  getVoicePack() {
    return this.voicePack;
  }

  setVoicePack(packId) {
    this.voicePack = packId;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('smriti_ner_voice_pack', packId);
    }
  }

  getVoicePacksList() {
    return VOICE_PACKS;
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
    this.currentLang = mode === 'en' ? 'en' : 'as';
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('smriti_ner_audio_mode', mode);
      localStorage.setItem('smriti_ner_language', mode === 'en' ? 'en' : 'as');
    }
  }

  getAudioLanguageMode() {
    return this.audioLanguageMode;
  }

  setLanguage(langCode) {
    this.currentLang = langCode;
    if (langCode === 'as' || langCode === 'bn') {
      this.audioLanguageMode = 'as';
    } else if (langCode === 'en') {
      this.audioLanguageMode = 'en';
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('smriti_ner_audio_mode', this.audioLanguageMode);
      localStorage.setItem('smriti_ner_language', langCode);
    }
  }

  setVoiceSpeed(speed) {
    this.voiceSpeed = speed;
  }

  cleanTextForSpeech(text) {
    if (!text) return '';
    return String(text)
      .replace(/\(.*?\)/g, ' ') // Remove parenthetical notes
      .replace(/[•★✓➔🌿💊💧🩺🌸🎮👁️🍃⏳🥁👘🎵🕊️🪈🔔🌊🔴🟢🔵🟡👴👵👩‍⚕️📋✨]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  hasIndicCharacters(text) {
    if (!text) return false;
    return /[\u0980-\u09FF\u0900-\u097F]/.test(text);
  }

  translateEnglishToAssamese(englishText) {
    if (!englishText) return '';
    let t = String(englishText).trim();
    for (const rule of ENGLISH_TO_ASSAMESE_MAP) {
      if (rule.match.test(t)) {
        return t.replace(rule.match, rule.as);
      }
    }
    return t;
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
      n.includes('assamese') ||
      n.includes('hindi') ||
      n.includes('swara') ||
      n.includes('madhur') ||
      n.includes('hemant') ||
      n.includes('kalpana') ||
      n.includes('neerja') ||
      n.includes('বাংলা') ||
      n.includes('हिन्दी')
    );
  }

  getBestVoice(lang = 'as') {
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
        'Microsoft Swara Online (Natural) - Hindi (India)',
        'Microsoft Madhur Online (Natural) - Hindi (India)',
        'Microsoft Neerja Online (Natural) - Hindi (India)',
        'Microsoft Hemant',
        'Microsoft Kalpana',
        'bn-IN',
        'as-IN',
        'hi-IN'
      ];

      for (const name of regionalPreferred) {
        const found = all.find(v => v.name.includes(name) || v.lang === name);
        if (found) return found;
      }

      const genericIndic = all.find(v => this.isIndicVoice(v));
      if (genericIndic) return genericIndic;

      const indianEnglish = all.find(v => 
        (v.lang || '').toLowerCase() === 'en-in' || 
        (v.name || '').toLowerCase().includes('india')
      );
      if (indianEnglish) return indianEnglish;
    }

    // Default English preferred voices
    const preferred = [
      'Microsoft Sonia Online (Natural) - English (India)',
      'en-IN',
      'Google UK English Female',
      'Google US English',
      'Microsoft Natural',
      'Samantha',
      'Karen',
      'en-GB',
      'en-US'
    ];

    for (const name of preferred) {
      const found = all.find(v => v.name.includes(name) || v.lang === name);
      if (found) return found;
    }

    return all.find(v => v.lang.startsWith('en')) || all[0];
  }

  stop() {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch (e) {}
      this.currentAudio = null;
    }

    if (this.synth) {
      this.synth.cancel();
      this.activeUtterance = null;
    }
  }

  /**
   * Find matching pre-recorded studio audio file
   */
  findPreRecordedAudio(text) {
    if (!text) return null;
    for (const item of PRE_RECORDED_PHRASES) {
      if (item.match.test(text)) {
        return item.file;
      }
    }
    return null;
  }

  /**
   * Plays an audio file via HTML5 Audio
   */
  playAudioUrl(url, onEnd, onError) {
    this.stop();

    try {
      const audio = new Audio(url);
      audio.playbackRate = this.voiceSpeed;
      this.currentAudio = audio;

      audio.onended = () => {
        this.currentAudio = null;
        if (onEnd) onEnd();
      };

      audio.onerror = (e) => {
        console.warn('Audio playback failed for', url, e);
        this.currentAudio = null;
        if (onError) onError(e);
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Audio play promise rejected', err);
          if (onError) onError(err);
        });
      }
      return true;
    } catch (err) {
      console.warn('Could not initialize Audio', err);
      if (onError) onError(err);
      return false;
    }
  }

  /**
   * Unified Speak Method
   */
  async speak(text, lang = this.currentLang, onEnd = null) {
    if (!text) return;

    this.stop();
    let cleanedText = this.cleanTextForSpeech(text);
    if (!cleanedText) return;

    // STRICT ASSAMESE ENFORCEMENT:
    // If the audio mode is Assamese ('as'), NEVER allow English text to pass through untreated!
    if (this.audioLanguageMode === 'as' || lang === 'as') {
      lang = 'as';
      if (!this.hasIndicCharacters(cleanedText)) {
        cleanedText = this.translateEnglishToAssamese(cleanedText);
      }
    }

    // -------------------------------------------------------------
    // ENGINE 1: Check Pre-recorded Studio Audio Pack (Instant & Offline)
    // -------------------------------------------------------------
    const preRecorded = this.findPreRecordedAudio(cleanedText);
    if (preRecorded) {
      this.playAudioUrl(preRecorded, onEnd, () => {
        this.speakViaSystemSynth(cleanedText, lang, onEnd);
      });
      return;
    }

    // -------------------------------------------------------------
    // ENGINE 2: ElevenLabs Multilingual Studio Pack
    // -------------------------------------------------------------
    if (this.voicePack === 'elevenlabs' && elevenLabsService.hasApiKey()) {
      try {
        const spoken = await elevenLabsService.speakEmpathetic(cleanedText, { onEnd });
        if (spoken) return;
      } catch (e) {
        console.warn('ElevenLabs failed, falling back to system speech', e);
      }
    }

    // -------------------------------------------------------------
    // ENGINE 3: Fallback to System Device Speech Synthesis
    // -------------------------------------------------------------
    this.speakViaSystemSynth(cleanedText, lang, onEnd);
  }

  speakViaSystemSynth(cleanedText, lang, onEnd = null) {
    if (!this.synth) {
      if (onEnd) onEnd();
      return;
    }

    if (this.synth.paused) {
      this.synth.resume();
    }
    this.synth.cancel();

    let selectedVoice = this.getBestVoice(lang);
    let targetText = cleanedText;
    let targetLang = lang === 'as' ? 'bn-IN' : (lang === 'hi' ? 'hi-IN' : 'en-US');

    if (lang === 'as' || this.hasIndicCharacters(cleanedText)) {
      if (selectedVoice && this.isIndicVoice(selectedVoice)) {
        targetText = cleanedText;
        targetLang = selectedVoice.lang || 'bn-IN';
      } else {
        targetText = transliterateAssameseToPhonetic(cleanedText);
        targetLang = selectedVoice?.lang || 'en-IN';
      }
    } else {
      targetText = cleanedText;
      targetLang = selectedVoice?.lang || 'en-US';
    }

    setTimeout(() => {
      try {
        const utterance = new SpeechSynthesisUtterance(targetText);
        utterance.rate = this.voiceSpeed;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
        utterance.lang = targetLang;

        utterance.onend = () => {
          this.activeUtterance = null;
          if (onEnd) onEnd();
        };

        utterance.onerror = (e) => {
          console.warn('SpeechSynthesis error:', e);
          this.activeUtterance = null;
          if (onEnd) onEnd();
        };

        this.activeUtterance = utterance;
        this.synth.speak(utterance);
      } catch (err) {
        console.warn('Synthesis invocation failed', err);
        if (onEnd) onEnd();
      }
    }, 40);
  }

  speakBilingual(assameseText, englishText, onEnd = null) {
    const mode = this.audioLanguageMode;

    if (mode === 'as') {
      // In Assamese mode, ALWAYS speak Assamese!
      this.speak(assameseText || this.translateEnglishToAssamese(englishText), 'as', onEnd);
    } else if (mode === 'dual' && assameseText && englishText) {
      // In Dual mode, speak Assamese first, then English!
      this.speak(assameseText, 'as', () => {
        setTimeout(() => {
          this.speak(englishText, 'en', onEnd);
        }, 400);
      });
    } else {
      // In English mode
      this.speak(englishText || assameseText, 'en', onEnd);
    }
  }

  initRecognition() {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'bn-IN';
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
