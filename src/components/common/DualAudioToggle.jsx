import React, { useState } from 'react';
import { speechService } from '../../i18n/speechService.js';
import { soundFx } from '../../utils/audio.js';
import { Volume2, Globe } from 'lucide-react';

export const DualAudioToggle = () => {
  const [audioMode, setAudioMode] = useState(() => speechService.getAudioLanguageMode());

  const handleModeChange = (mode) => {
    setAudioMode(mode);
    speechService.setAudioLanguageMode(mode);
    soundFx.playCardFlip();

    if (mode === 'as') {
      speechService.speak('মাতৃভাষা অসমীয়াত ধ্বনি সক্ৰিয় হ’ল', 'as');
    } else if (mode === 'en') {
      speechService.speak('English audio guidance activated', 'en');
    } else {
      speechService.speakBilingual('অসমীয়া আৰু ইংৰাজী দুয়োটা ভাষাত শুনা যাব', 'Dual Assamese and English audio activated');
    }
  };

  return (
    <div className="inline-flex items-center gap-1 bg-rose-50/90 p-1 rounded-2xl border border-rose-200 shadow-xs">
      <span className="text-[11px] font-black text-rose-800 px-2 flex items-center gap-1 hidden sm:inline-flex">
        <Volume2 size={13} className="text-rose-600" />
        <span>Audio:</span>
      </span>

      <button
        onClick={() => handleModeChange('as')}
        className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
          audioMode === 'as'
            ? 'bg-rose-600 text-white shadow-xs'
            : 'text-slate-700 hover:bg-rose-100'
        }`}
        title="Listen in Assamese (অসমীয়া)"
      >
        🌿 অসমীয়া
      </button>

      <button
        onClick={() => handleModeChange('en')}
        className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
          audioMode === 'en'
            ? 'bg-rose-600 text-white shadow-xs'
            : 'text-slate-700 hover:bg-rose-100'
        }`}
        title="Listen in English"
      >
        🇬🇧 English
      </button>

      <button
        onClick={() => handleModeChange('dual')}
        className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
          audioMode === 'dual'
            ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-xs'
            : 'text-slate-700 hover:bg-rose-100'
        }`}
        title="Listen in Both (দুয়োটা ভাষাত শুনা)"
      >
        🔄 Dual (দুয়োটা)
      </button>
    </div>
  );
};
