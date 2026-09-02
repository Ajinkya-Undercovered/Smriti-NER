import React, { useState, useEffect, useRef } from 'react';
import { usePatient } from '../../context/PatientContext.jsx';
import { soundFx } from '../../utils/audio.js';
import { speechService } from '../../i18n/speechService.js';
import confetti from 'canvas-confetti';
import { 
  Palette, 
  RotateCcw, 
  HelpCircle, 
  Award, 
  Volume2, 
  CheckCircle2, 
  ArrowLeft 
} from 'lucide-react';

const FLOWER_ITEMS = [
  {
    id: 'f1',
    name: 'Nahor Flower (ৰঙা নাহৰ ফুল)',
    nameAs: 'ৰঙা নাহৰ ফুল',
    nameEn: 'Red Nahor Flower',
    symbol: '🌺',
    colorCategory: 'red',
    targetBowlNameAs: 'ৰঙা মাটিৰ বাটি',
    targetBowlNameEn: 'Red Terracotta Bowl'
  },
  {
    id: 'f2',
    name: 'Fresh Tea Leaves (সেউজীয়া চাহ পাত)',
    nameAs: 'সেউজীয়া চাহ পাত',
    nameEn: 'Green Tea Shoot',
    symbol: '🍃',
    colorCategory: 'green',
    targetBowlNameAs: 'সেউজীয়া বাটি',
    targetBowlNameEn: 'Green Bamboo Basket'
  },
  {
    id: 'f3',
    name: 'Blue Water Lily (নীল পদুম / ভেকুলী ফুল)',
    nameAs: 'নীল পদুম',
    nameEn: 'Blue Water Lily',
    symbol: '🪷',
    colorCategory: 'blue',
    targetBowlNameAs: 'নীলা নদীৰ বাটি',
    targetBowlNameEn: 'Blue Ceramic Bowl'
  },
  {
    id: 'f4',
    name: 'Assam Golden Orchid (সোণালী কপৌ ফুল)',
    nameAs: 'সোণালী কপৌ ফুল',
    nameEn: 'Golden Orchid',
    symbol: '🌼',
    colorCategory: 'yellow',
    targetBowlNameAs: 'হালধীয়া বাটি',
    targetBowlNameEn: 'Yellow Sun Bowl'
  }
];

const BOWLS = [
  { id: 'red', nameAs: 'ৰঙা বাটি', nameEn: 'Red Bowl', icon: '🔴', bg: 'bg-rose-100 border-rose-500 text-rose-900', ring: 'ring-rose-200' },
  { id: 'green', nameAs: 'সেউজীয়া বাটি', nameEn: 'Green Basket', icon: '🟢', bg: 'bg-emerald-100 border-emerald-500 text-emerald-900', ring: 'ring-emerald-200' },
  { id: 'blue', nameAs: 'নীলা বাটি', nameEn: 'Blue Bowl', icon: '🔵', bg: 'bg-cyan-100 border-cyan-500 text-cyan-900', ring: 'ring-cyan-200' },
  { id: 'yellow', nameAs: 'হালধীয়া বাটি', nameEn: 'Yellow Bowl', icon: '🟡', bg: 'bg-amber-100 border-amber-500 text-amber-900', ring: 'ring-amber-200' }
];

export const FlowerColorSorter = ({ onBack, onSessionComplete }) => {
  const { logGameSession } = usePatient();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'

  const startTimeRef = useRef(Date.now());
  const roundStartTimeRef = useRef(Date.now());
  const latenciesRef = useRef([]);

  useEffect(() => {
    loadRound(0);
  }, []);

  const loadRound = (roundIdx) => {
    if (roundIdx >= FLOWER_ITEMS.length) {
      handleGameOver();
      return;
    }

    setCurrentIndex(roundIdx);
    setFeedback(null);
    roundStartTimeRef.current = Date.now();

    const target = FLOWER_ITEMS[roundIdx];
    speechService.speakBilingual(
      `এই ${target.nameAs} একে ৰঙৰ বাটিত থওক।`,
      `Place this ${target.nameEn} into the matching colored bowl.`
    );
  };

  const handleSelectBowl = (bowlId) => {
    if (feedback !== null) return;

    const target = FLOWER_ITEMS[currentIndex];
    const latency = Date.now() - roundStartTimeRef.current;
    latenciesRef.current.push(latency);

    if (bowlId === target.colorCategory) {
      setFeedback('correct');
      setScore(s => s + 1);
      soundFx.playMatchSound();
      soundFx.playWaterChime();
      confetti({ particleCount: 35, spread: 50 });

      speechService.speakBilingual(
        `খুব ধুনীয়া! ${target.nameAs} সঠিক বাটিত থোৱা হ’ল।`,
        `Splendid! You placed the ${target.nameEn} in the right bowl.`
      );

      setTimeout(() => {
        loadRound(currentIndex + 1);
      }, 1500);
    } else {
      setFeedback('wrong');
      soundFx.playCardFlip();
      speechService.speakBilingual(
        `একো নাই, পুনৰ চেষ্টা কৰক। এই ফুলটোৰ ৰং চাওক।`,
        `No worries, try again. Match the color of the petal.`
      );
      setTimeout(() => {
        setFeedback(null);
      }, 1800);
    }
  };

  const handleGameOver = () => {
    setIsGameOver(true);
    soundFx.playSingingBowl();
    soundFx.playCelebration();
    confetti({ particleCount: 80, spread: 70 });

    const totalDuration = Math.round((Date.now() - startTimeRef.current) / 1000);
    const avgLatency = latenciesRef.current.length > 0 
      ? Math.round(latenciesRef.current.reduce((a, b) => a + b, 0) / latenciesRef.current.length) 
      : 3000;

    const sessionData = {
      gameId: 'flower-color-sorter',
      accuracy: 1.0,
      averageLatencyMs: avgLatency,
      moves: FLOWER_ITEMS.length,
      optimalMoves: FLOWER_ITEMS.length,
      durationSec: totalDuration
    };

    const { fullSession } = logGameSession(sessionData);
    if (onSessionComplete) onSessionComplete(fullSession);

    speechService.speakBilingual(
      'বৰ আনন্দদায়ক কাম কৰিলে! সকলো ফুল সঠিক বাটিত সজাই তুলিলে।',
      'Wonderful! You sorted all the flowers into their colored bowls.'
    );
  };

  const currentItem = FLOWER_ITEMS[currentIndex];

  return (
    <section className="bg-white border-3 border-rose-200 rounded-3xl p-5 sm:p-8 shadow-sm space-y-6 animate-fade-in max-w-3xl mx-auto">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-rose-100 pb-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 cursor-pointer font-bold text-xs flex items-center gap-1"
            >
              <ArrowLeft size={16} />
              <span>Back (উভতি যাওক)</span>
            </button>
          )}
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
              <Palette size={14} className="text-emerald-600" />
              <span>Color Discrimination & Motor Calm</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Flower & Tea Leaf Color Sorter (ফুলৰ ৰং মিলোৱা খেল)
            </h2>
          </div>
        </div>
      </div>

      {!isGameOver ? (
        <div className="space-y-6">
          
          {/* Active Flower Display */}
          <div className="bg-gradient-to-b from-rose-50 to-amber-50 rounded-3xl p-6 text-center border-2 border-rose-200 shadow-xs flex flex-col items-center justify-center min-h-[200px]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800 mb-1">
              Item {currentIndex + 1} of {FLOWER_ITEMS.length} • Match the Flower Color
            </span>
            <div className="text-6xl sm:text-7xl my-2 animate-breathe filter drop-shadow-md">
              {currentItem?.symbol}
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
              {currentItem?.nameAs}
            </h3>
            <p className="text-xs text-slate-500 font-medium">{currentItem?.nameEn}</p>
          </div>

          {/* Color Bowls Targets */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {BOWLS.map((bowl) => (
              <button
                key={bowl.id}
                onClick={() => handleSelectBowl(bowl.id)}
                disabled={feedback !== null}
                className={`p-5 rounded-3xl border-3 flex flex-col items-center justify-center text-center transition-all cursor-pointer shadow-sm active:scale-95 ${bowl.bg} ${bowl.ring} hover:scale-103`}
              >
                <span className="text-4xl sm:text-5xl mb-2">{bowl.icon}</span>
                <h4 className="font-black text-xs sm:text-sm leading-tight">{bowl.nameAs}</h4>
                <p className="text-[11px] opacity-80 mt-0.5">{bowl.nameEn}</p>
              </button>
            ))}
          </div>

        </div>
      ) : (
        /* Game Over Celebratory Screen */
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-3xl p-8 text-center space-y-4 shadow-xl animate-fade-in">
          <Award size={56} className="mx-auto text-amber-200 animate-breathe" />
          <h3 className="text-2xl sm:text-3xl font-black">
            বৰ সুন্দৰ! (Splendid Color Harmonization!)
          </h3>
          <p className="text-emerald-100 text-xs sm:text-sm max-w-md mx-auto">
            You successfully sorted all natural North Eastern flowers into their matching colored vessels.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => {
                startTimeRef.current = Date.now();
                latenciesRef.current = [];
                setIsGameOver(false);
                setScore(0);
                loadRound(0);
              }}
              className="px-6 py-3 rounded-2xl bg-white text-emerald-900 font-black text-xs sm:text-sm shadow-md hover:bg-emerald-50 cursor-pointer"
            >
              Play Again (পুনৰ খেলক)
            </button>
          </div>
        </div>
      )}

    </section>
  );
};
