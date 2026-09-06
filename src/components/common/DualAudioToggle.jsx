import React, { useState } from 'react';
import { speechService } from '../../i18n/speechService.js';
import { soundFx } from '../../utils/audio.js';
import { usePatient } from '../../context/PatientContext.jsx';
import { Volume2, Sparkles, ChevronDown } from 'lucide-react';

export const DualAudioToggle = () => {
  const { setLanguage } = usePatient();
  const [audioMode, setAudioMode] = useState(() => speechService.getAudioLanguageMode());
  const [currentVoicePack, setCurrentVoicePack] = useState(() => speechService.getVoicePack());
  const [showPackMenu, setShowPackMenu] = useState(false);

  const handleModeChange = (mode) => {
    setAudioMode(mode);
    speechService.setAudioLanguageMode(mode);
    soundFx.playCardFlip();

    if (mode === 'as') {
      setLanguage('as');
      speechService.speak('মাতৃভাষা অসমীয়াত ধ্বনি সক্ৰিয় হ’ল। নমস্কাৰ!', 'as');
    } else if (mode === 'en') {
      setLanguage('en');
      speechService.speak('English audio guidance activated', 'en');
    } else {
      speechService.speakBilingual(
        'অসমীয়া আৰু ইংৰাজী দুয়োটা ভাষাত শুনা যাব',
        'Dual Assamese and English audio activated'
      );
    }
  };

  const handlePackSelect = (packId) => {
    setCurrentVoicePack(packId);
    speechService.setVoicePack(packId);
    setShowPackMenu(false);
    soundFx.playSingingBowl();

    if (packId === 'studio_as') {
      speechService.speak('স্পষ্ট অসমীয়া ষ্টুডিঅ’ কণ্ঠ সক্ৰিয় হ’ল।', 'as');
    } else if (packId === 'elevenlabs') {
      speechService.speak('ElevenLabs AI studio voice activated.', 'en');
    } else {
      speechService.speak('System device voice activated.', 'en');
    }
  };

  const packs = speechService.getVoicePacksList();

  return (
    <div className="relative inline-flex items-center gap-1 bg-rose-50/90 p-1 rounded-2xl border border-rose-200 shadow-xs">
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
        title="Listen in Assamese (অসমীয়া স্পষ্ট কণ্ঠ)"
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

      {/* Voice Pack Quick Pill */}
      <div className="relative border-l border-rose-200 pl-1 ml-0.5">
        <button
          onClick={() => setShowPackMenu(!showPackMenu)}
          className="px-2 py-1 rounded-xl text-[10px] font-black bg-white border border-rose-200 text-rose-800 hover:bg-rose-100 flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
          title="Change Speech Voice Pack"
        >
          <Sparkles size={11} className="text-amber-500" />
          <span className="hidden md:inline">
            {currentVoicePack === 'studio_as' ? 'Studio 🌸' : currentVoicePack === 'elevenlabs' ? 'ElevenLabs 🎙️' : 'System 💻'}
          </span>
          <ChevronDown size={10} />
        </button>

        {showPackMenu && (
          <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border-2 border-rose-200 p-2 z-50 animate-fade-in">
            <div className="text-[10px] font-black text-slate-400 px-2 py-1 uppercase tracking-wider">
              Voice Pack (কণ্ঠস্বৰ পেক)
            </div>
            {packs.map((pack) => (
              <button
                key={pack.id}
                onClick={() => handlePackSelect(pack.id)}
                className={`w-full text-left p-2 rounded-xl text-xs font-bold transition-all flex flex-col cursor-pointer ${
                  currentVoicePack === pack.id
                    ? 'bg-rose-50 text-rose-900 border border-rose-300'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{pack.name}</span>
                  {pack.isRecommended && (
                    <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full">
                      Native
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-normal text-slate-500 mt-0.5">
                  {pack.description}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
