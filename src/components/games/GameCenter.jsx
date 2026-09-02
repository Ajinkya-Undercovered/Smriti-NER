import React, { useState } from 'react';
import { usePatient } from '../../context/PatientContext.jsx';
import { speechService } from '../../i18n/speechService.js';
import { soundFx } from '../../utils/audio.js';
import { MemoryGame } from '../MemoryGame.jsx';
import { TeaLeafSorter } from './TeaLeafSorter.jsx';
import { DailyRoutineSequencer } from './DailyRoutineSequencer.jsx';
import { BambooBeatsGame } from './BambooBeatsGame.jsx';
import { TribalPatternSpotter } from './TribalPatternSpotter.jsx';
import { ShadowSilhouetteMatcher } from './ShadowSilhouetteMatcher.jsx';
import { FlowerColorSorter } from './FlowerColorSorter.jsx';
import { FolkSoundIdentifier } from './FolkSoundIdentifier.jsx';
import { 
  Brain, 
  Sparkles, 
  ArrowLeft, 
  Volume2, 
  Play, 
  Gamepad2, 
  Palette, 
  Eye, 
  Music, 
  Clock, 
  Layers 
} from 'lucide-react';

export const GameCenter = ({ onBackHome }) => {
  const { currentDifficulty } = usePatient();
  const [activeGameId, setActiveGameId] = useState(null);

  const GAMES_LIST = [
    {
      id: 'cultural-memory',
      titleAs: 'স্মৃতি মেলা (Memory Match)',
      titleEn: 'Heritage Memory Match',
      descAs: 'উত্তৰ-পূবৰ চিনাকী প্ৰতীক আৰু পৰিয়ালৰ ফটো মিলাই স্মৃতিশক্তি বঢ়াওক',
      descEn: 'Match cultural symbols and personal family photos',
      icon: '🦏',
      category: 'Memory Recall (স্মৃতিশক্তি)',
      themeBg: 'bg-rose-50 border-rose-300 hover:border-rose-500 hover:bg-rose-100/70',
      badgeColor: 'bg-rose-100 text-rose-900 border-rose-200'
    },
    {
      id: 'shadow-matcher',
      titleAs: 'ছাঁ চিনি উলিওৱা (Shadow Match)',
      titleEn: 'Shadow & Silhouette Matcher',
      descAs: 'ছাঁটো চাই কোনটো বস্তু চিনাক্ত কৰক (দৃষ্টি বিভ্ৰম নিৰাময়)',
      descEn: 'Match glowing dark shadows to their real cultural objects',
      icon: '👁️',
      category: 'Visual Shape Recognition (দৃষ্টি চিনাক্তকৰণ)',
      themeBg: 'bg-purple-50 border-purple-300 hover:border-purple-500 hover:bg-purple-100/70',
      badgeColor: 'bg-purple-100 text-purple-900 border-purple-200'
    },
    {
      id: 'flower-color',
      titleAs: 'ফুলৰ ৰং মিলোৱা (Color Sorter)',
      titleEn: 'Flower & Tea Color Sorter',
      descAs: 'নাহৰ ফুল, পদুম আৰু চাহ পাত সঠিক ৰঙৰ বাটিত থওক',
      descEn: 'Sort blooming Nahor flowers & tea leaves into matching colored bowls',
      icon: '🌸',
      category: 'Color Discrimination & Calm (ৰং আৰু স্থিৰতা)',
      themeBg: 'bg-emerald-50 border-emerald-300 hover:border-emerald-500 hover:bg-emerald-100/70',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-200'
    },
    {
      id: 'folk-sound',
      titleAs: 'লোকধ্বনি আৰু সুৰ (Sound Identifier)',
      titleEn: 'Folk Sound & Bird Call Matcher',
      descAs: 'কুলি চৰাই, বাঁহী আৰু কাঁহৰ ধ্বনি শুনি সঠিক ছবি বাছক',
      descEn: 'Listen to birds and bamboo flutes, then match the picture card',
      icon: '🎵',
      category: 'Auditory Memory (শ্ৰৱণ স্মৃতি)',
      themeBg: 'bg-cyan-50 border-cyan-300 hover:border-cyan-500 hover:bg-cyan-100/70',
      badgeColor: 'bg-cyan-100 text-cyan-900 border-cyan-200'
    },
    {
      id: 'tea-sorter',
      titleAs: 'চাহ পাত আৰু বাঁহৰ সঁজুলি (Tea Sorter)',
      titleEn: 'Tea Leaf & Cane Sorter',
      descAs: 'দুটিকৈ পাত আৰু এটি কুঁহি বাছি একাগ্রতা বৃদ্ধি কৰক',
      descEn: 'Identify tender tea shoots and indigenous cane crafts',
      icon: '🍃',
      category: 'Visual Attention (মনোযোগ আৰু একাগ্ৰতা)',
      themeBg: 'bg-teal-50 border-teal-300 hover:border-teal-500 hover:bg-teal-100/70',
      badgeColor: 'bg-teal-100 text-teal-900 border-teal-200'
    },
    {
      id: 'daily-routine',
      titleAs: 'দৈনন্দিন সময়ক্ৰম (Routine Sequence)',
      titleEn: 'Daily Routine Sequencer',
      descAs: 'ৰাতিপুৱাৰ চাহ, প্ৰাৰ্থনা আৰু ঔষধৰ নিয়ম সঠিক ক্ৰমত সজাওক',
      descEn: 'Sequence morning tea, prayers, and medicines in correct daily order',
      icon: '⏳',
      category: 'Chrono-Cognitive Orientation (সময় জ্ঞান)',
      themeBg: 'bg-amber-50 border-amber-300 hover:border-amber-500 hover:bg-amber-100/70',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-200'
    },
    {
      id: 'bamboo-beats',
      titleAs: 'বিহু আৰু লোকবাদ্যৰ লয় (Bamboo Beats)',
      titleEn: 'Bamboo Beats Rhythm Tap',
      descAs: 'বিহু ঢোল আৰু লোকবাদ্যৰ শান্ত লয়ৰ সৈতে আনন্দ লওক',
      descEn: 'Tap gently in rhythm with traditional dhol and folk instruments',
      icon: '🥁',
      category: 'Audio-Motor Coordination (লয় আৰু সমন্বয়)',
      themeBg: 'bg-orange-50 border-orange-300 hover:border-orange-500 hover:bg-orange-100/70',
      badgeColor: 'bg-orange-100 text-orange-900 border-orange-200'
    },
    {
      id: 'pattern-spotter',
      titleAs: 'জনজাতীয় বস্ত্ৰৰ আৰ্হি (Pattern Spotter)',
      titleEn: 'Tribal Weave Pattern Spotter',
      descAs: 'ঐতিহ্যবাহী মূগা, এৰী আৰু নগা চাদৰৰ আৰ্হি চিনি উলিওৱক',
      descEn: 'Recognize authentic North Eastern Eri silk and tribal shawl motifs',
      icon: '👘',
      category: 'Visual-Spatial Weave (আকাৰ আৰু আৰ্হি)',
      themeBg: 'bg-indigo-50 border-indigo-300 hover:border-indigo-500 hover:bg-indigo-100/70',
      badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-200'
    }
  ];

  const handleLaunchGame = (game) => {
    soundFx.playCardFlip();
    speechService.speakBilingual(
      `খেল আৰম্ভ কৰা হ’ল: ${game.titleAs}`,
      `Starting ${game.titleEn}`
    );
    setActiveGameId(game.id);
  };

  const handleSpeakGameDesc = (e, game) => {
    e.stopPropagation();
    speechService.speakBilingual(
      `${game.titleAs}. ${game.descAs}`,
      `${game.titleEn}. ${game.descEn}`
    );
  };

  // Render individual active game
  if (activeGameId === 'cultural-memory') {
    return (
      <div className="space-y-4 animate-fade-in">
        <button
          onClick={() => setActiveGameId(null)}
          className="px-4 py-2.5 rounded-2xl bg-white border-2 border-rose-200 hover:bg-rose-50 text-rose-900 font-black text-xs flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <ArrowLeft size={16} />
          <span>All Games (সকলো খেলৰ তালিকা)</span>
        </button>
        <MemoryGame />
      </div>
    );
  }

  if (activeGameId === 'shadow-matcher') {
    return <ShadowSilhouetteMatcher onBack={() => setActiveGameId(null)} />;
  }

  if (activeGameId === 'flower-color') {
    return <FlowerColorSorter onBack={() => setActiveGameId(null)} />;
  }

  if (activeGameId === 'folk-sound') {
    return <FolkSoundIdentifier onBack={() => setActiveGameId(null)} />;
  }

  if (activeGameId === 'tea-sorter') {
    return <TeaLeafSorter onBack={() => setActiveGameId(null)} />;
  }

  if (activeGameId === 'daily-routine') {
    return <DailyRoutineSequencer onBack={() => setActiveGameId(null)} />;
  }

  if (activeGameId === 'bamboo-beats') {
    return <BambooBeatsGame onBack={() => setActiveGameId(null)} />;
  }

  if (activeGameId === 'pattern-spotter') {
    return <TribalPatternSpotter onBack={() => setActiveGameId(null)} />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-1">
            <Gamepad2 size={15} />
            <span>Culturally Tailored Dementia Therapeutic Suite (8 Games)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">
            স্মৃতি আৰু আনন্দৰ খেলসমূহ (Memory & Joy Games)
          </h2>
          <p className="text-xs sm:text-sm text-rose-100 max-w-xl">
            Choose any friendly game below. Designed for zero-stress, relaxation, and cognitive stimulation.
          </p>
        </div>

        {onBackHome && (
          <button
            onClick={onBackHome}
            className="self-start sm:self-auto px-5 py-3 rounded-2xl bg-white text-rose-900 font-black text-xs sm:text-sm shadow-md hover:bg-rose-50 flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
          >
            <ArrowLeft size={18} />
            <span>Home (মুখ্য পৃষ্ঠা)</span>
          </button>
        )}
      </div>

      {/* 8 Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {GAMES_LIST.map((game) => (
          <div
            key={game.id}
            onClick={() => handleLaunchGame(game)}
            className={`p-6 rounded-3xl border-3 transition-all cursor-pointer shadow-xs flex flex-col justify-between gap-4 group ${game.themeBg}`}
          >
            <div className="flex items-start gap-4">
              <span className="text-5xl sm:text-6xl p-3 bg-white rounded-3xl border border-slate-200/80 shadow-xs group-hover:scale-108 transition-transform">
                {game.icon}
              </span>
              <div className="flex-1">
                <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${game.badgeColor} inline-block mb-1.5`}>
                  {game.category}
                </span>
                <h3 className="font-black text-slate-900 text-lg sm:text-xl leading-tight group-hover:text-rose-900">
                  {game.titleAs}
                </h3>
                <h4 className="text-xs font-bold text-slate-600 mb-1">{game.titleEn}</h4>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{game.descAs}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
              <button
                onClick={(e) => handleSpeakGameDesc(e, game)}
                className="p-2 rounded-xl bg-white/80 hover:bg-white text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="Listen game explanation"
              >
                <Volume2 size={15} className="text-rose-600" />
                <span>Listen (শুনক)</span>
              </button>

              <button
                onClick={() => handleLaunchGame(game)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs group-hover:from-rose-700 group-hover:to-rose-800 transition-all cursor-pointer"
              >
                <Play size={14} />
                <span>Play (খেলক)</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
