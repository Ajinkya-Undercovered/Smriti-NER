import React, { useState, useEffect } from 'react';
import { usePatient } from '../context/PatientContext.jsx';
import { soundFx } from '../utils/audio.js';
import { speechService } from '../i18n/speechService.js';
import { 
  Wind, 
  Volume2, 
  Play, 
  Square, 
  BookOpen, 
  Sparkles,
  Heart
} from 'lucide-react';

export const CalmView = () => {
  const { t, language } = usePatient();
  const [playingType, setPlayingType] = useState(null);
  const [breathingPhase, setBreathingPhase] = useState('inhale'); // 'inhale', 'hold', 'exhale'

  useEffect(() => {
    const interval = setInterval(() => {
      setBreathingPhase(prev => {
        if (prev === 'inhale') return 'hold';
        if (prev === 'hold') return 'exhale';
        return 'inhale';
      });
    }, 4000);

    return () => {
      clearInterval(interval);
      soundFx.stopAmbient();
    };
  }, []);

  const handleToggleAmbient = (type) => {
    if (playingType === type) {
      soundFx.stopAmbient();
      setPlayingType(null);
    } else {
      soundFx.playAmbient(type);
      setPlayingType(type);
    }
  };

  const STORIES = [
    {
      id: 's1',
      title: 'Spring Bihu Memories (ৰঙালী বিহু)',
      desc: 'Nahor flower fragrance, dhol rhythms, and gentle village festivities across Brahmaputra valley.'
    },
    {
      id: 's2',
      title: 'Cherrapunji & Living Root Bridges',
      desc: 'Walking under the green canopy of Khasi hills with soothing gentle mist and fresh mountain breeze.'
    },
    {
      id: 's3',
      title: 'Loktak Lake & Dancing Deer',
      desc: 'Serene floating phumdi islands on Loktak Lake in Manipur with peaceful morning light.'
    }
  ];

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-800 to-rose-900 text-white rounded-3xl p-6 md:p-8 shadow-lg">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-2">
          <Wind size={14} />
          <span>Reminiscence & Emotional Well-Being</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-black">{t.reminiscenceTitle || 'Calm Mind & Nostalgic Memories'}</h2>
        <p className="text-purple-100 text-xs md:text-sm mt-1 max-w-xl">
          Soothing North Eastern soundscapes, gentle breathing, and folklore storytelling to ease anxiety and promote tranquility.
        </p>
      </div>

      {/* Guided Blooming Orchid Calm Breathing */}
      <div className="bg-white border-2 border-rose-200 rounded-3xl p-8 text-center shadow-xs max-w-md mx-auto space-y-6">
        <h3 className="text-xl font-black text-slate-900">{t.breatheWithMe || 'Take a Gentle Breath with Me'}</h3>

        <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
          <div className={`absolute inset-0 rounded-full bg-rose-200/40 transition-all duration-3000 ease-in-out ${
            breathingPhase === 'inhale' ? 'scale-125' : breathingPhase === 'hold' ? 'scale-115' : 'scale-90'
          }`}></div>

          <div className={`w-36 h-36 rounded-full bg-gradient-to-tr from-rose-500 to-purple-600 text-white flex flex-col items-center justify-center shadow-lg transition-all duration-3000 ease-in-out ${
            breathingPhase === 'inhale' ? 'scale-110' : breathingPhase === 'hold' ? 'scale-100' : 'scale-90'
          }`}>
            <span className="text-3xl mb-1">🌸</span>
            <span className="text-sm font-black uppercase tracking-wider">
              {breathingPhase === 'inhale' ? 'Breathe In' : breathingPhase === 'hold' ? 'Hold Softly' : 'Breathe Out'}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-500">
          Focus gently on the rhythm. Feel the refreshing cool breeze of North Eastern hills.
        </p>
      </div>

      {/* Ambient Soundscapes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white border-2 border-rose-200 rounded-3xl p-5 shadow-xs text-center space-y-3">
          <span className="text-4xl">🌊</span>
          <h4 className="font-bold text-slate-900 text-base">{t.ambientSound || 'Brahmaputra Waves'}</h4>
          <p className="text-xs text-slate-500">Gentle river water ripples</p>
          <button
            onClick={() => handleToggleAmbient('river')}
            className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              playingType === 'river'
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-cyan-50 text-cyan-900 border border-cyan-200 hover:bg-cyan-100'
            }`}
          >
            {playingType === 'river' ? <Square size={14} /> : <Play size={14} />}
            <span>{playingType === 'river' ? 'Stop Sound' : 'Play Gentle River'}</span>
          </button>
        </div>

        <div className="bg-white border-2 border-rose-200 rounded-3xl p-5 shadow-xs text-center space-y-3">
          <span className="text-4xl">🌧️</span>
          <h4 className="font-bold text-slate-900 text-base">{t.rainSound || 'Cherrapunji Rain'}</h4>
          <p className="text-xs text-slate-500">Misty hill rainfall</p>
          <button
            onClick={() => handleToggleAmbient('rain')}
            className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              playingType === 'rain'
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-teal-50 text-teal-900 border border-teal-200 hover:bg-teal-100'
            }`}
          >
            {playingType === 'rain' ? <Square size={14} /> : <Play size={14} />}
            <span>{playingType === 'rain' ? 'Stop Sound' : 'Play Valley Rain'}</span>
          </button>
        </div>

        <div className="bg-white border-2 border-rose-200 rounded-3xl p-5 shadow-xs text-center space-y-3">
          <span className="text-4xl">🪈</span>
          <h4 className="font-bold text-slate-900 text-base">{t.fluteSound || 'Bamboo Flute'}</h4>
          <p className="text-xs text-slate-500">Meditative mountain flute</p>
          <button
            onClick={() => handleToggleAmbient('flute')}
            className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              playingType === 'flute'
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            {playingType === 'flute' ? <Square size={14} /> : <Play size={14} />}
            <span>{playingType === 'flute' ? 'Stop Sound' : 'Play Bamboo Flute'}</span>
          </button>
        </div>

      </div>

      {/* Folklore Stories */}
      <div className="bg-white border-2 border-rose-200 rounded-3xl p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <BookOpen size={18} className="text-purple-600" />
          <span>North East Folklore & Stories</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {STORIES.map(st => (
            <div key={st.id} className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">{st.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{st.desc}</p>
              <button
                onClick={() => speechService.speak(`${st.title}. ${st.desc}`, language)}
                className="text-xs font-bold text-rose-700 flex items-center gap-1 hover:underline cursor-pointer pt-1"
              >
                <Volume2 size={14} />
                <span>Listen Narration</span>
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
