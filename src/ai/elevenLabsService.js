// ElevenLabs AI Voice Agent & Text-to-Speech Engine
// Configured with Custom Voice ID: oO7sLA3dWfQXsKeSAjpA + Instant Fallbacks

export const ELEVEN_DEFAULT_VOICES = [
  { id: 'oO7sLA3dWfQXsKeSAjpA', name: 'Custom Selected Shared Voice (Your Link)', isCustom: true },
  { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel (Calm, Gentle & Clear Female)', isCustom: false },
  { id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi (Empathetic & Caring Female)', isCustom: false },
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah (Soft & Natural Female)', isCustom: false },
  { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam (Warm, Reassuring Male)', isCustom: false }
];

class ElevenLabsVoiceService {
  constructor() {
    this.apiKey = (import.meta.env.VITE_ELEVENLABS_API_KEY || localStorage.getItem('elevenlabs_api_key') || '').trim();
    this.customVoiceId = localStorage.getItem('elevenlabs_custom_voice_id') || 'oO7sLA3dWfQXsKeSAjpA';
    this.lastStatus = null; // { type: 'success' | 'error', message: string }
    this.audioCache = new Map();
  }

  setApiKey(key) {
    this.apiKey = (key || '').trim();
    localStorage.setItem('elevenlabs_api_key', this.apiKey);
    this.lastStatus = null;
  }

  getApiKey() {
    return this.apiKey;
  }

  setVoiceId(voiceId) {
    this.customVoiceId = (voiceId || '').trim();
    localStorage.setItem('elevenlabs_custom_voice_id', this.customVoiceId);
    this.audioCache.clear();
    this.lastStatus = null;
  }

  getVoiceId() {
    return this.customVoiceId;
  }

  hasApiKey() {
    return Boolean(this.apiKey && this.apiKey.length > 15 && !this.apiKey.includes('your-elevenlabs'));
  }

  getStatus() {
    return this.lastStatus;
  }

  /**
   * Generates or fetches speech audio from ElevenLabs API using your custom voice
   */
  async speakEmpathetic(text, options = {}) {
    const { voiceId = this.customVoiceId, stability = 0.75, similarityBoost = 0.85, onEnd } = options;

    if (!this.hasApiKey()) {
      return false; // Use browser Web Speech API fallback
    }

    const cacheKey = `${voiceId}_${text}`;
    if (this.audioCache.has(cacheKey)) {
      const audioUrl = this.audioCache.get(cacheKey);
      this.playAudioUrl(audioUrl, onEnd);
      this.lastStatus = { type: 'success', message: 'Playing cached studio voice' };
      return true;
    }

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability,
            similarity_boost: similarityBoost,
            style: 0.35,
            use_speaker_boost: true
          }
        })
      });

      if (!response.ok) {
        let errDetails = `Error ${response.status}: ${response.statusText}`;
        try {
          const errJson = await response.json();
          if (errJson?.detail?.message) {
            errDetails = errJson.detail.message;
          }
        } catch (e) {}

        this.lastStatus = { type: 'error', message: errDetails };
        console.warn('ElevenLabs API returned non-200:', errDetails);
        return false; // Fallback to browser voice
      }

      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      this.audioCache.set(cacheKey, audioUrl);
      this.playAudioUrl(audioUrl, onEnd);
      this.lastStatus = { type: 'success', message: 'ElevenLabs AI voice active and playing' };
      return true;
    } catch (err) {
      this.lastStatus = { type: 'error', message: err.message };
      console.warn('ElevenLabs speech generation fallback to Web Speech API:', err.message);
      return false;
    }
  }

  playAudioUrl(url, onEnd) {
    try {
      const audio = new Audio(url);
      audio.onended = () => {
        if (onEnd) onEnd();
      };
      audio.play().catch(e => console.warn('Audio play error:', e));
    } catch (e) {
      console.warn('Audio element error:', e);
    }
  }
}

export const elevenLabsService = new ElevenLabsVoiceService();
