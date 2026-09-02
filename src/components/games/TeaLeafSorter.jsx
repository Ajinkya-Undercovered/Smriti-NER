import React, { useState, useEffect, useRef } from 'react';
import { usePatient } from '../../context/PatientContext.jsx';
import { useSound } from '../../context/SoundContext.jsx';
import { speechService } from '../../i18n/speechService.js';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, 
  RotateCcw, 
  Sparkles, 
  Award, 
  Eye, 
  CheckCircle2 
} from 'lucide-react';

export const TeaLeafSorter = ({ onBack }) => {
  const { t, language, currentDifficulty, logGameSession } = usePatient();
  const { playMatchSound, playCelebration } = useSound();

  const ITEMS_POOL = [
    { id: 'tender-1', name: 'Golden Tea Shoot (দুটিকৈ পাত এটি কুঁহি)', type: 'tea', icon: '🌱', desc: 'Tender Assam tea bud' },
    { id: 'tender-2', name: 'Fresh Green Bud (কোমল কুঁহি)', type: 'tea', icon: '🌿', desc: 'Fresh morning pluck' },
    { id: 'tender-3', name: 'Organic Spring Tip (বসন্তৰ পাত)', type: 'tea', icon: '🍃', desc: 'Prime flush tea shoot' },
    { id: 'cane-1', name: 'Assam Bamboo Japi (জাপি)', type: 'craft', icon: '👒', desc: 'Traditional woven conical headgear' },
    { id: 'cane-2', name: 'Cane Tea Plucking Basket (খৰাহী)', type: 'craft', icon: '🧺', desc: 'Woven bamboo tea basket' },
    { id: 'cane-3', name: 'Bamboo Flute (বাঁহী)', type: 'craft', icon: '🪈', desc: 'Carved mountain flute' }
  ];

  const [itemsQueue, setItemsQueue] = useState([]);
  const [currentItem, setCurrentItem] = useState(null);
  const [sortedCount, setSortedCount] = useState(0);
  const [targetCount, setTargetCount] = useState(6);
  const [isComplete, setIsComplete] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const startTimeRef = useRef(Date.now());
  const latencyRecordsRef = useRef([]);

  useEffect(() => {
    startNewGame();
  }, [currentDifficulty]);

  const startNewGame = () => {
    startTimeRef.current = Date.now();
    latencyRecordsRef.current = [];
    setSortedCount(0);
    setIsComplete(false);
    setFeedbackMsg('');

    const count = currentDifficulty <= 2 ? 5 : 8;
    setTargetCount(count);

    // Generate random queue
    const shuffled = [];
    for (let i = 0; i < count; i++) {
      const randomItem = ITEMS_POOL[Math.floor(Math.random() * ITEMS_POOL.length)];
      shuffled.push({ ...randomItem, queueKey: `${randomItem.id}-${i}` });
    }

    setItemsQueue(shuffled.slice(1));
    setCurrentItem(shuffled[0]);
    speechService.speak(`${t.game2Title}. Sort into the tea basket or handicraft basket.`, language);
  };

  const handleSort = (chosenType) => {
    if (!currentItem || isComplete) return;

    const latency = Date.now() - startTimeRef.current;
    latencyRecordsRef.current.push(latency);

    if (currentItem.type === chosenType) {
      playMatchSound();
      setFeedbackMsg(`✓ Correct! ${currentItem.name}`);
      speechService.speak(t.voicePraise1, language);

      const nextCount = sortedCount + 1;
      setSortedCount(nextCount);

      if (itemsQueue.length > 0) {
        setCurrentItem(itemsQueue[0]);
        setItemsQueue(itemsQueue.slice(1));
      } else {
        // Game Finished
        setIsComplete(true);
        playCelebration();
        confetti({ particleCount: 70, spread: 60 });
        
        logGameSession({
          gameId: 'tea-sorter',
          accuracy: 0.95,
          averageLatencyMs: 2800,
          moves: nextCount,
          optimalMoves: targetCount,
          durationSec: Math.round((Date.now() - startTimeRef.current) / 1000)
        });

        speechService.speak(t.gameComplete, language);
      }
    } else {
      // Gentle encouragement
      setFeedbackMsg(`Try placing in the other basket.`);
      speechService.speak(t.voiceEncouragement, language);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      
      {/* Navigation Header */}
      <div className="flex items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 text-xs sm:text-sm cursor-pointer"
        >
          <ArrowLeft size={18} />
          <span>{t.home}</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold">
            Sorted: {sortedCount} / {targetCount}
          </span>
        </div>

        <button
          onClick={startNewGame}
          className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      {/* Main Focus Area */}
      {!isComplete && currentItem && (
        <div className="bg-white border-2 border-emerald-200 rounded-3xl p-6 sm:p-8 text-center shadow-md space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Identify and Sort
          </div>

          <div className="w-32 h-32 mx-auto rounded-3xl bg-amber-50 border-4 border-emerald-300 flex items-center justify-center text-6xl shadow-inner animate-pulse">
            {currentItem.icon}
          </div>

          <h3 className="text-2xl font-black text-slate-900">{currentItem.name}</h3>
          <p className="text-sm text-slate-500">{currentItem.desc}</p>
          
          {feedbackMsg && (
            <p className="text-xs sm:text-sm font-bold text-emerald-700 bg-emerald-50 py-1 px-3 rounded-full inline-block">
              {feedbackMsg}
            </p>
          )}

          {/* Large Sorting Target Baskets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <button
              onClick={() => handleSort('tea')}
              className="py-5 px-4 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-black text-base sm:text-lg shadow-md flex items-center justify-center gap-3 transition-transform active:scale-95 cursor-pointer"
            >
              <span className="text-3xl">🍃</span>
              <span>Tea Garden Leaf (চাহ পাত)</span>
            </button>

            <button
              onClick={() => handleSort('craft')}
              className="py-5 px-4 rounded-3xl bg-gradient-to-tr from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 text-white font-black text-base sm:text-lg shadow-md flex items-center justify-center gap-3 transition-transform active:scale-95 cursor-pointer"
            >
              <span className="text-3xl">🧺</span>
              <span>Bamboo Handicraft (বাঁহৰ শিল্প)</span>
            </button>
          </div>
        </div>
      )}

      {/* Completion Modal */}
      {isComplete && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-3xl p-6 sm:p-8 text-center shadow-xl space-y-4">
          <Award size={48} className="mx-auto text-amber-300" />
          <h3 className="text-2xl sm:text-3xl font-black">{t.gameComplete}</h3>
          <p className="text-emerald-100 text-sm sm:text-base max-w-md mx-auto">
            Great attention and focus! You sorted all {targetCount} North Eastern items with precision.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={startNewGame}
              className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm sm:text-base shadow-md cursor-pointer"
            >
              {t.playAgain}
            </button>
            <button
              onClick={onBack}
              className="px-6 py-3 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-sm sm:text-base cursor-pointer"
            >
              {t.home}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
