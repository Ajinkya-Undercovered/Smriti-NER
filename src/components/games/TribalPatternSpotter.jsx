import React, { useState, useEffect, useRef } from 'react';
import { usePatient } from '../../context/PatientContext.jsx';
import { useSound } from '../../context/SoundContext.jsx';
import { speechService } from '../../i18n/speechService.js';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, 
  RotateCcw, 
  Award, 
  Palette, 
  HelpCircle 
} from 'lucide-react';

export const TribalPatternSpotter = ({ onBack }) => {
  const { t, language, logGameSession } = usePatient();
  const { playMatchSound, playCelebration } = useSound();

  const WEAVE_PATTERNS = [
    {
      id: 'eri-diamond',
      name: 'Assam Eri Silk Diamond Motif (এৰী ৰেচমৰ হীৰা আৰ্হি)',
      state: 'Assam / Meghalaya',
      symbol: '🔶',
      color: 'bg-amber-100 border-amber-300 text-amber-900',
      clue: 'Traditional warm peace silk woven with geometric diamond patterns'
    },
    {
      id: 'meitei-phanek',
      name: 'Manipur Meitei Phanek Striped Border (ꯐꯅꯦꯛ ꯃꯌꯦꯛ)',
      state: 'Manipur',
      symbol: '🎋',
      color: 'bg-pink-100 border-pink-300 text-pink-900',
      clue: 'Iconic lotus and temple border embroidery worn by Manipuri women'
    },
    {
      id: 'naga-shawl',
      name: 'Nagaland Angami Warrior Shawl (নগা চাদৰ)',
      state: 'Nagaland',
      symbol: '🛡️',
      color: 'bg-rose-100 border-rose-300 text-rose-900',
      clue: 'Red, black, and white bold geometric weaves symbol of heritage'
    },
    {
      id: 'mizo-puan',
      name: 'Mizoram Puanchei Festival Weave (Puanchei)',
      state: 'Mizoram',
      symbol: '🏵️',
      color: 'bg-indigo-100 border-indigo-300 text-indigo-900',
      clue: 'Vibrant celebratory checked weave used in Chapchar Kut dances'
    }
  ];

  const [targetPattern, setTargetPattern] = useState(WEAVE_PATTERNS[0]);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [targetRounds, setTargetRounds] = useState(4);
  const [isComplete, setIsComplete] = useState(false);
  const [feedback, setFeedback] = useState('');

  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    startNewRound(0);
  }, []);

  const startNewRound = (currentScore) => {
    if (currentScore >= targetRounds) {
      setIsComplete(true);
      playCelebration();
      confetti({ particleCount: 70, spread: 65 });

      logGameSession({
        gameId: 'pattern-spotter',
        accuracy: 0.94,
        averageLatencyMs: 3300,
        moves: targetRounds,
        optimalMoves: targetRounds,
        durationSec: Math.round((Date.now() - startTimeRef.current) / 1000)
      });

      speechService.speak(t.gameComplete, language);
      return;
    }

    const randomTarget = WEAVE_PATTERNS[currentScore % WEAVE_PATTERNS.length];
    setTargetPattern(randomTarget);

    // Shuffle 3 options including target
    const pool = [...WEAVE_PATTERNS];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    setOptions(pool);
    setFeedback('');
    speechService.speak(`Find the matching motif: ${randomTarget.name}`, language);
  };

  const handleSelectOption = (option) => {
    if (isComplete) return;

    if (option.id === targetPattern.id) {
      playMatchSound();
      setFeedback(`✓ Exactly right! ${option.name}`);
      speechService.speak(t.voicePraise1, language);

      const nextScore = score + 1;
      setScore(nextScore);

      setTimeout(() => {
        startNewRound(nextScore);
      }, 1000);
    } else {
      setFeedback(`Almost! Look closely at the pattern symbols.`);
      speechService.speak(t.voiceEncouragement, language);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6 text-center">
      
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 text-xs sm:text-sm cursor-pointer"
        >
          <ArrowLeft size={18} />
          <span>{t.home}</span>
        </button>

        <span className="font-bold text-slate-800 text-sm sm:text-base">
          Motif Round: {score + 1} / {targetRounds}
        </span>

        <button
          onClick={() => { setScore(0); setIsComplete(false); startNewRound(0); }}
          className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      {!isComplete && (
        <div className="bg-white border-2 border-purple-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
          <p className="text-xs font-bold uppercase tracking-wider text-purple-700">
            Target North Eastern Traditional Weave
          </p>

          <div className="w-28 h-28 mx-auto rounded-3xl bg-purple-50 border-4 border-purple-300 flex items-center justify-center text-6xl shadow-inner">
            {targetPattern.symbol}
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-slate-900">
            {targetPattern.name}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">{targetPattern.clue}</p>

          {feedback && (
            <p className="text-xs sm:text-sm font-bold text-purple-700 bg-purple-50 py-1.5 px-4 rounded-full inline-block">
              {feedback}
            </p>
          )}

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-3">
            {options.map(opt => (
              <button
                key={opt.id}
                onClick={() => handleSelectOption(opt)}
                className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-3 text-left shadow-xs hover:shadow-md active:scale-98 cursor-pointer ${opt.color}`}
              >
                <span className="text-3xl">{opt.symbol}</span>
                <div>
                  <h4 className="font-bold text-sm sm:text-base leading-tight">{opt.name}</h4>
                  <span className="text-xs font-medium opacity-80">{opt.state}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Completion Banner */}
      {isComplete && (
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
          <Award size={48} className="mx-auto text-amber-300" />
          <h3 className="text-2xl sm:text-3xl font-black">{t.gameComplete}</h3>
          <p className="text-purple-100 text-sm sm:text-base max-w-md mx-auto">
            Superb visual-spatial pattern recognition! You identified all traditional North Eastern tribal weaves.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => { setScore(0); setIsComplete(false); startNewRound(0); }}
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
