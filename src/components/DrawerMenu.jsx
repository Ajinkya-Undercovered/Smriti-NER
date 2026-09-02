import React, { useState, useEffect } from 'react';
import { usePatient } from '../context/PatientContext.jsx';
import { speechService } from '../i18n/speechService.js';
import { elevenLabsService } from '../ai/elevenLabsService.js';
import { soundFx } from '../utils/audio.js';
import { SUPPORTED_LANGUAGES } from '../types.js';
import { 
  X, 
  Type, 
  Volume2, 
  Globe, 
  Sun, 
  Sparkles, 
  Mic, 
  ShieldCheck,
  LogOut,
  Sliders,
  CheckCircle2,
  Play
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
  const [voicePace, setVoicePace] = useState(0.90);

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
    setSettings(prev => ({ ...prev, language: code }));
  };

  const handlePaceChange = (val) => {
    const num = parseFloat(val);
    setVoicePace(num);
    speechService.setVoiceSpeed(num);
  };

  const handleBrowserVoiceChange = (uri) => {
    setSelectedBrowserVoiceURI(uri);
    speechService.setSelectedVoiceURI(uri);
    soundFx.playCardFlip();
    speechService.speakBilingual(
      'স্পষ্ট কণ্ঠ নিৰ্বাচন কৰা হ’ল।',
      'Selected clear voice activated.'
    );
  };

  const handleTestVoiceClarity = () => {
    soundFx.playSingingBowl();
    speechService.speakBilingual(
      'নমস্কাৰ! এইটো স্মৃতি-NER ৰ স্পষ্ট কণ্ঠ সহায়ক। আজি আপোনাৰ দিনটো শান্তিময় হওক।',
      'Hello! This is your clear and fluent memory companion. Wishing you a peaceful and healthy day.'
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
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-rose-100 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl p-2 bg-rose-50 rounded-xl border border-rose-200">⚙️</span>
              <div>
                <h3 className="text-lg font-black text-slate-900">Accessibility & Settings</h3>
                <p className="text-xs text-slate-500">Elderly Speech Clarity & Comfort</p>
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
            <div className="p-3.5 rounded-2xl bg-rose-50/80 border border-rose-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{currentUser.avatar || '👴'}</span>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-tight">{currentUser.name}</h4>
                  <p className="text-[10px] text-slate-500">{currentUser.location}</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-200 text-rose-900">
                Active Profile
              </span>
            </div>
          )}

          {/* 1. Voice Fluency & Clarity Test */}
          <div className="bg-rose-50/80 border-2 border-rose-200 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-rose-900 flex items-center gap-1.5">
                <Volume2 size={15} className="text-rose-600" />
                <span>Voice Fluency Test (ধ্বনি স্পষ্টতা)</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                High Clarity
              </span>
            </div>
            <button
              onClick={handleTestVoiceClarity}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <Play size={14} />
              <span>Test Speech Clarity Now (স্পষ্ট কণ্ঠ শুনক)</span>
            </button>
          </div>

          {/* 2. Device Voice Selector Dropdown */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Volume2 size={15} className="text-rose-600" />
              <span>Speech Voice (কণ্ঠস্বৰ বাছক):</span>
            </label>
            <select
              value={selectedBrowserVoiceURI}
              onChange={(e) => handleBrowserVoiceChange(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-bold text-xs text-slate-800 focus:ring-2 focus:ring-rose-400 cursor-pointer"
            >
              <option value="">✨ Auto-Select Best Natural Voice (Recommended)</option>
              {browserVoices.map(v => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          </div>

          {/* 3. Voice Speed / Pace Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Sliders size={15} className="text-rose-600" />
                <span>Speech Pace / Speed (কথা কোৱাৰ গতি)</span>
              </span>
              <span className="text-rose-700 font-mono">{voicePace.toFixed(2)}x</span>
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
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Type size={16} className="text-rose-600" />
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
                  className={`py-2 px-1 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
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
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Globe size={16} className="text-rose-600" />
              <span>Regional Language (উত্তৰ-পূব)</span>
            </label>
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 font-bold text-xs text-slate-800 focus:ring-2 focus:ring-rose-400 cursor-pointer"
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
        <div className="pt-4 border-t border-slate-200 space-y-3">
          <button
            onClick={handleLogout}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-900 border border-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut size={15} />
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
