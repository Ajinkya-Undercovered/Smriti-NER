import React, { useState, useEffect } from 'react';
import { usePatient } from '../context/PatientContext.jsx';
import { speechService, VOICE_PACKS } from '../i18n/speechService.js';
import { elevenLabsService, ELEVEN_DEFAULT_VOICES } from '../ai/elevenLabsService.js';
import { soundFx } from '../utils/audio.js';
import { SUPPORTED_LANGUAGES } from '../types.js';
import { 
  X, 
  Type, 
  Volume2, 
  Globe, 
  Sparkles, 
  LogOut,
  Sliders,
  CheckCircle2,
  Play,
  Key,
  Mic2
} from 'lucide-react';

export const DrawerMenu = ({ 
  isOpen, 
  onClose, 
  settings, 
  setSettings, 
  onOpenVoice 
}) => {
  const { language, setLanguage, currentUser, logout } = usePatient();
  const [browserVoices, setBrowserVoices] = useState([]);
  const [selectedBrowserVoiceURI, setSelectedBrowserVoiceURI] = useState(() => speechService.getSelectedVoiceURI());
  const [selectedVoicePack, setSelectedVoicePack] = useState(() => speechService.getVoicePack());
  const [voicePace, setVoicePace] = useState(0.88);
  const [elevenApiKey, setElevenApiKey] = useState(() => elevenLabsService.getApiKey());
  const [elevenVoiceId, setElevenVoiceId] = useState(() => elevenLabsService.getVoiceId());
  const [savedKeyMsg, setSavedKeyMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      const loadV = () => {
        const v = speechService.getAvailableVoices();
        setBrowserVoices(v);
      };
      loadV();
      setTimeout(loadV, 300);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLanguageChange = (code) => {
    setLanguage(code);
    speechService.setLanguage(code);
    setSettings(prev => ({ ...prev, language: code }));
  };

  const handlePaceChange = (val) => {
    const num = parseFloat(val);
    setVoicePace(num);
    speechService.setVoiceSpeed(num);
  };

  const handleVoicePackChange = (packId) => {
    setSelectedVoicePack(packId);
    speechService.setVoicePack(packId);
    soundFx.playCardFlip();
    if (packId === 'studio_as') {
      speechService.speak('স্পষ্ট অসমীয়া ষ্টুডিঅ’ কণ্ঠ নিৰ্বাচিত হ’ল।', 'as');
    } else if (packId === 'elevenlabs') {
      speechService.speak('ElevenLabs AI Studio voice selected.', 'en');
    } else {
      speechService.speak('System device voice selected.', 'en');
    }
  };

  const handleSaveElevenKey = () => {
    elevenLabsService.setApiKey(elevenApiKey);
    elevenLabsService.setVoiceId(elevenVoiceId);
    setSavedKeyMsg('Key saved successfully! ✓');
    setTimeout(() => setSavedKeyMsg(''), 3000);
    soundFx.playMatchSound();
  };

  const handleBrowserVoiceChange = (uri) => {
    setSelectedBrowserVoiceURI(uri);
    speechService.setSelectedVoiceURI(uri);
    soundFx.playCardFlip();
    speechService.speakBilingual(
      'স্পষ্ট কণ্ঠ নিৰ্বাচন কৰা হ’ল।',
      'Selected voice activated.'
    );
  };

  const handleTestVoiceClarity = () => {
    soundFx.playSingingBowl();
    speechService.speak(
      'নমস্কাৰ! এইটো স্মৃতি-NER ৰ স্পষ্ট অসমীয়া কণ্ঠ সহায়ক। আজি আপোনাৰ দিনটো শুভ আৰু শান্তিময় হওক।',
      'as'
    );
  };

  const handleTestEnglishVoice = () => {
    soundFx.playSingingBowl();
    speechService.speak(
      'Hello! This is Smriti-NER, your personal memory and cognitive companion. Wishing you a peaceful and cheerful day.',
      'en'
    );
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-start">
      <div className="bg-white w-full max-w-md h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto border-r-2 border-rose-200 animate-fade-in">
        
        {/* Drawer Header */}
        <div className="space-y-5">
          <div className="flex items-center justify-between border-b border-rose-100 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl p-2 bg-rose-50 rounded-xl border border-rose-200">⚙️</span>
              <div>
                <h3 className="text-lg font-black text-slate-900">Accessibility & Settings</h3>
                <p className="text-xs text-slate-500">Elderly Voice Packs & Clarity</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Current Profile */}
          {currentUser && (
            <div className="p-3 rounded-2xl bg-rose-50/80 border border-rose-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{currentUser.avatar || '👴'}</span>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs leading-tight">{currentUser.name}</h4>
                  <p className="text-[10px] text-slate-500">{currentUser.location}</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-200 text-rose-900">
                Active Profile
              </span>
            </div>
          )}

          {/* 1. Voice Fluency & Clarity Test */}
          <div className="bg-rose-50/80 border-2 border-rose-200 rounded-2xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-rose-900 flex items-center gap-1.5">
                <Volume2 size={15} className="text-rose-600" />
                <span>Voice Fluency Test (ধ্বনি স্পষ্টতা)</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Crystal Clear
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleTestVoiceClarity}
                className="py-2.5 px-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 text-white font-black text-[11px] flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Play size={13} />
                <span>অসমীয়া (Studio)</span>
              </button>
              <button
                onClick={handleTestEnglishVoice}
                className="py-2.5 px-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-700 hover:from-teal-700 text-white font-black text-[11px] flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Play size={13} />
                <span>English (👩 Lady)</span>
              </button>
            </div>
          </div>

          {/* 2. Voice Pack Selector */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
              <Sparkles size={15} className="text-rose-600" />
              <span>Select Voice Pack (কণ্ঠ পেক বাছক):</span>
            </label>
            <div className="space-y-1.5">
              {VOICE_PACKS.map((pack) => (
                <div
                  key={pack.id}
                  onClick={() => handleVoicePackChange(pack.id)}
                  className={`p-2.5 rounded-xl border-2 transition-all cursor-pointer flex items-start justify-between ${
                    selectedVoicePack === pack.id
                      ? 'border-rose-500 bg-rose-50/60 shadow-xs'
                      : 'border-slate-200 hover:border-rose-200 bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900">{pack.name}</span>
                      {pack.isRecommended && (
                        <span className="text-[9px] font-black bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full">
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">{pack.description}</p>
                  </div>
                  {selectedVoicePack === pack.id && (
                    <CheckCircle2 size={16} className="text-rose-600 shrink-0 mt-0.5" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ElevenLabs Configuration (Visible when ElevenLabs pack selected) */}
          {selectedVoicePack === 'elevenlabs' && (
            <div className="p-3 bg-amber-50/70 border border-amber-300 rounded-xl space-y-2 text-xs animate-fade-in">
              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                <Key size={13} className="text-amber-700" />
                <span>ElevenLabs API Key & Voice:</span>
              </div>
              <input
                type="password"
                placeholder="Enter ElevenLabs API Key..."
                value={elevenApiKey}
                onChange={(e) => setElevenApiKey(e.target.value)}
                className="w-full p-2 bg-white border border-amber-200 rounded-lg text-xs font-mono"
              />
              <div className="flex gap-2">
                <select
                  value={elevenVoiceId}
                  onChange={(e) => setElevenVoiceId(e.target.value)}
                  className="w-full p-2 bg-white border border-amber-200 rounded-lg text-xs"
                >
                  {ELEVEN_DEFAULT_VOICES.map(v => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
                <button
                  onClick={handleSaveElevenKey}
                  className="px-3 py-1.5 bg-amber-600 text-white rounded-lg font-bold text-xs shrink-0 cursor-pointer"
                >
                  Save
                </button>
              </div>
              {savedKeyMsg && <p className="text-[10px] text-emerald-700 font-bold">{savedKeyMsg}</p>}
            </div>
          )}

          {/* System Voice Selection (Visible when System pack selected) */}
          {selectedVoicePack === 'system' && (
            <div className="space-y-1.5 animate-fade-in">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Mic2 size={14} className="text-rose-600" />
                <span>Installed Browser Voice:</span>
              </label>
              <select
                value={selectedBrowserVoiceURI}
                onChange={(e) => handleBrowserVoiceChange(e.target.value)}
                className="w-full p-2 rounded-xl border border-slate-300 bg-slate-50 font-bold text-xs text-slate-800 cursor-pointer"
              >
                <option value="">✨ Auto-Select Best Lady Voice (মহিলা কণ্ঠ)</option>
                {browserVoices.map(v => {
                  const isFemale = speechService.isExplicitlyFemaleVoice(v);
                  const isMale = speechService.isExplicitlyMaleVoice(v);
                  const prefix = isFemale ? '👩 [Lady] ' : (isMale ? '👨 ' : '🎙️ ');
                  return (
                    <option key={v.voiceURI} value={v.voiceURI}>
                      {prefix}{v.name} ({v.lang})
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          {/* 3. Voice Speed / Pace Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Sliders size={14} className="text-rose-600" />
                <span>Speech Pace / Speed (কথা কোৱাৰ গতি)</span>
              </span>
              <span className="text-rose-700 font-mono text-xs">{voicePace.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.70"
              max="1.10"
              step="0.05"
              value={voicePace}
              onChange={(e) => handlePaceChange(e.target.value)}
              className="w-full accent-rose-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>Slower (শান্ত/ধীৰে)</span>
              <span>Normal (স্বাভাৱিক)</span>
              <span>Faster (দ্ৰুত)</span>
            </div>
          </div>

          {/* 4. Text Size Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Type size={15} className="text-rose-600" />
              <span>Elderly Text Sizing</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'normal', label: 'Default' },
                { id: 'large', label: 'Large (বড়)' },
                { id: 'xlarge', label: 'Extra Large' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setSettings(prev => ({ ...prev, textSize: opt.id }))}
                  className={`py-1.5 px-1 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    settings.textSize === opt.id
                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Regional Language */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Globe size={15} className="text-rose-600" />
              <span>Regional Language (উত্তৰ-পূব)</span>
            </label>
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="w-full p-2 rounded-xl border border-slate-300 bg-slate-50 font-bold text-xs text-slate-800 cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.name} ({lang.englishName} • {lang.region})
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Footer & Switch Account */}
        <div className="pt-3 border-t border-slate-200 space-y-2">
          <button
            onClick={handleLogout}
            className="w-full py-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-900 border border-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut size={14} />
            <span>Switch Profile / Sign Out</span>
          </button>
          <div className="text-center text-[10px] text-slate-400">
            Smriti-NER Cognitive Health Platform v2.0
          </div>
        </div>

      </div>
    </div>
  );
};
