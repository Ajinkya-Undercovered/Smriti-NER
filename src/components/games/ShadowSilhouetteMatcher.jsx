import React, { useState, useEffect, useRef } from 'react';
import { usePatient } from '../../context/PatientContext.jsx';
import { soundFx } from '../../utils/audio.js';
import { speechService } from '../../i18n/speechService.js';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  RotateCcw, 
  HelpCircle, 
  Award, 
  Volume2, 
  CheckCircle2, 
  Eye, 
  ArrowLeft 
} from 'lucide-react';

const SHADOW_ITEMS = [
  {
    id: 'rhino',
    name: 'One-Horned Rhino (এশিঙীয়া গঁড়)',
    nameAs: 'এশিঙীয়া গঁড়',
    nameEn: 'One-Horned Rhino',
    symbol: '🦏',
    silhouetteSvg: 'M10 20 L30 10 L50 15 L70 10 L85 25 L80 50 L65 70 L40 75 L20 60 Z',
    hint: 'Iconic wild guardian of Kaziranga with a single horn',
    hintAs: 'কাজিৰঙাৰ গৌৰৱ এশিঙীয়া গঁড়'
  },
  {
    id: 'hornbill',
    name: 'Great Hornbill (ধনেশ পক্ষী)',
    nameAs: 'ধনেশ পক্ষী',
    nameEn: 'Great Hornbill',
    symbol: '🦜',
    silhouetteSvg: 'M40 10 C60 10 80 30 75 60 C70 80 40 85 25 70 C15 50 25 20 40 10 Z',
    hint: 'Majestic bird celebrated in the Hornbill festival',
    hintAs: 'পাহাৰৰ ধুনীয়া ধনেশ পক্ষী'
  },
  {
    id: 'kettle',
    name: 'Warm Tea Kettle (চাহৰ কেটলি)',
    nameAs: 'চাহৰ কেটলি',
    nameEn: 'Warm Tea Kettle',
    symbol: '🫖',
    silhouetteSvg: 'M20 30 Q50 10 80 30 L85 65 Q50 85 15 65 Z',
    hint: 'Used for brewing fresh morning Assam red tea',
    hintAs: 'ৰাতিপুৱাৰ ৰঙা চাহ বনাবলৈ ব্যৱহাৰ কৰা কেটলি'
  },
  {
    id: 'dhol',
    name: 'Bihu Dhol (বিহু ঢোল)',
    nameAs: 'বিহু ঢোল',
    nameEn: 'Bihu Drum',
    symbol: '🥁',
    silhouetteSvg: 'M15 25 L85 25 L75 75 L25 75 Z',
    hint: 'Rhythmic folk drum played during Bohag Bihu spring festivals',
    hintAs: 'বিহুৰ আনন্দময় ঢোল'
  },
  {
    id: 'mask',
    name: 'Majuli Mask (মাজুলীৰ মুখা)',
    nameAs: 'মাজুলীৰ মুখা',
    nameEn: 'Majuli Mask Art',
    symbol: '🎭',
    silhouetteSvg: 'M25 15 C50 5 75 15 80 45 C85 75 50 85 20 70 C15 45 15 25 25 15 Z',
    hint: 'Spiritual bamboo and clay Vaishnavite mask craft',
    hintAs: 'মাজুলীৰ সত্ৰীয়া মুখাশিল্প'
  }
];

export const ShadowSilhouetteMatcher = ({ onBack, onSessionComplete }) => {
  const { logGameSession } = usePatient();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [options, setOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [hintActive, setHintActive] = useState(false);

  const startTimeRef = useRef(Date.now());
  const roundStartTimeRef = useRef(Date.now());
  const latenciesRef = useRef([]);

  useEffect(() => {
    loadRound(0);
  }, []);

  const loadRound = (roundIdx) => {
    if (roundIdx >= SHADOW_ITEMS.length) {
      handleGameOver();
      return;
    }

    setCurrentIndex(roundIdx);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setHintActive(false);
    roundStartTimeRef.current = Date.now();

    const currentTarget = SHADOW_ITEMS[roundIdx];
    const otherItems = SHADOW_ITEMS.filter(item => item.id !== currentTarget.id);
    // Shuffle and pick 2 distractors
    const shuffledOthers = [...otherItems].sort(() => 0.5 - Math.random()).slice(0, 2);
    const roundOptions = [currentTarget, ...shuffledOthers].sort(() => 0.5 - Math.random());
    setOptions(roundOptions);

    speechService.speakBilingual(
      'এই ছাঁটো কোনটো বস্তুৰ? তলৰ কাৰ্ডবোৰৰ পৰা বাছি লওক।',
      'Look at this shadow. Which item does it match below?'
    );
  };

  const handleSelectOption = (item) => {
    if (selectedAnswer !== null) return; // Prevent double tap

    const target = SHADOW_ITEMS[currentIndex];
    const latency = Date.now() - roundStartTimeRef.current;
    latenciesRef.current.push(latency);

    setSelectedAnswer(item.id);

    if (item.id === target.id) {
      setIsCorrect(true);
      setScore(s => s + 1);
      soundFx.playMatchSound();
      confetti({ particleCount: 35, spread: 50 });
      speechService.speakBilingual(
        `বৰ ধুনীয়া! এইটো হ’ল ${target.nameAs}`,
        `Wonderful! This is the ${target.nameEn}`
      );

      setTimeout(() => {
        loadRound(currentIndex + 1);
      }, 1500);
    } else {
      setIsCorrect(false);
      soundFx.playCardFlip();
      speechService.speakBilingual(
        `একো চিন্তা নকৰিব, পুনৰ চেষ্টা কৰক। এইটো ${target.nameAs} হয়নে?`,
        `No worries, try again. Could it be ${target.nameEn}?`
      );
      setTimeout(() => {
        setSelectedAnswer(null);
        setIsCorrect(null);
      }, 1800);
    }
  };

  const handleShowHint = () => {
    setHintActive(true);
    const target = SHADOW_ITEMS[currentIndex];
    speechService.speakBilingual(target.hintAs, target.hint);
    setTimeout(() => setHintActive(false), 3000);
  };

  const handleGameOver = () => {
    setIsGameOver(true);
    soundFx.playSingingBowl();
    soundFx.playCelebration();
    confetti({ particleCount: 80, spread: 70 });

    const totalDuration = Math.round((Date.now() - startTimeRef.current) / 1000);
    const avgLatency = latenciesRef.current.length > 0 
      ? Math.round(latenciesRef.current.reduce((a, b) => a + b, 0) / latenciesRef.current.length) 
      : 3200;

    const sessionData = {
      gameId: 'shadow-matcher',
      accuracy: 1.0,
      averageLatencyMs: avgLatency,
      moves: SHADOW_ITEMS.length,
      optimalMoves: SHADOW_ITEMS.length,
      durationSec: totalDuration
    };

    const { fullSession } = logGameSession(sessionData);
    if (onSessionComplete) onSessionComplete(fullSession);

    speechService.speakBilingual(
      'বহুত ভাল হ’ল! আপুনি সকলো ছাঁ সঠিকভাবে চিনি পালে!',
      'Splendid job! You recognized all cultural shapes perfectly!'
    );
  };

  const currentTarget = SHADOW_ITEMS[currentIndex];

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
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-800 text-xs font-bold border border-purple-200">
              <Eye size={14} className="text-purple-600" />
              <span>Visual Agnosia & Shape Recognition</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Shadow & Silhouette Matcher (ছাঁ চিনি উলিওৱা খেল)
            </h2>
          </div>
        </div>

        <button
          onClick={handleShowHint}
          className="p-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
        >
          <HelpCircle size={16} />
          <span className="hidden sm:inline">Hint (সহায়)</span>
        </button>
      </div>

      {!isGameOver ? (
        <div className="space-y-6">
          
          {/* Central Mystery Shadow Box */}
          <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-3xl p-8 text-center text-white relative overflow-hidden shadow-inner flex flex-col items-center justify-center min-h-[220px]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-300 mb-2">
              Question {currentIndex + 1} of {SHADOW_ITEMS.length} • Match the Silhouette
            </span>

            {/* Silhouette Display */}
            <div className="w-36 h-36 rounded-full bg-slate-950/80 border-4 border-rose-400/40 flex items-center justify-center shadow-2xl relative animate-pulse">
              <span className="text-6xl filter brightness-0 contrast-200 select-none opacity-85">
                {currentTarget?.symbol}
              </span>
            </div>

            {hintActive && (
              <p className="mt-3 text-xs text-amber-300 font-bold bg-amber-950/60 px-4 py-1.5 rounded-full border border-amber-500/40 animate-fade-in">
                💡 {currentTarget?.hintAs} • {currentTarget?.hint}
              </p>
            )}
          </div>

          {/* 3 Large Touch Option Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {options.map((item) => {
              const isSelected = selectedAnswer === item.id;
              const isOptionCorrect = isSelected && isCorrect === true;
              const isOptionWrong = isSelected && isCorrect === false;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectOption(item)}
                  disabled={selectedAnswer !== null}
                  className={`p-6 rounded-3xl border-3 transition-all flex flex-col items-center justify-center text-center cursor-pointer shadow-xs active:scale-95 ${
                    isOptionCorrect
                      ? 'bg-emerald-50 border-emerald-500 ring-4 ring-emerald-200'
                      : isOptionWrong
                        ? 'bg-rose-50 border-rose-500 ring-4 ring-rose-200'
                        : 'bg-white border-rose-200 hover:border-rose-400 hover:shadow-md'
                  }`}
                >
                  <span className="text-5xl sm:text-6xl mb-3">{item.symbol}</span>
                  <h3 className="font-black text-slate-900 text-sm sm:text-base leading-tight">
                    {item.nameAs}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {item.nameEn}
                  </p>
                </button>
              );
            })}
          </div>

        </div>
      ) : (
        /* Game Over Celebratory Screen */
        <div className="bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-3xl p-8 text-center space-y-4 shadow-xl animate-fade-in">
          <Award size={56} className="mx-auto text-amber-200 animate-breathe" />
          <h3 className="text-2xl sm:text-3xl font-black">
            বহুত ভাল হ’ল! (Wonderful Memory & Vision Recall!)
          </h3>
          <p className="text-rose-100 text-xs sm:text-sm max-w-md mx-auto">
            You accurately recognized all North Eastern silhouettes and cultural artifacts.
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
              className="px-6 py-3 rounded-2xl bg-white text-rose-900 font-black text-xs sm:text-sm shadow-md hover:bg-rose-50 cursor-pointer"
            >
              Play Again (পুনৰ খেলক)
            </button>
          </div>
        </div>
      )}

    </section>
  );
};
