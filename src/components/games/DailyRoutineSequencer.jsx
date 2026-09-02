import React, { useState, useEffect, useRef } from 'react';
import { usePatient } from '../../context/PatientContext.jsx';
import { useSound } from '../../context/SoundContext.jsx';
import { speechService } from '../../i18n/speechService.js';
import { INITIAL_DAILY_ROUTINES } from '../../storage/initialData.js';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, 
  RotateCcw, 
  CheckCircle2, 
  Award, 
  ArrowUp, 
  ArrowDown, 
  Calendar,
  Volume2
} from 'lucide-react';

export const DailyRoutineSequencer = ({ onBack }) => {
  const { t, language, logGameSession } = usePatient();
  const { playMatchSound, playCelebration, playCardFlip } = useSound();

  const [sequence, setSequence] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [moves, setMoves] = useState(0);

  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    startTimeRef.current = Date.now();
    setMoves(0);
    setIsComplete(false);

    // Shuffle original 5 routines
    const deck = [...INITIAL_DAILY_ROUTINES];
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    setSequence(deck);
    speechService.speak(`${t.game3Title}. Arrange your daily routine in chronological order from morning to afternoon.`, language);
  };

  const moveItem = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= sequence.length || isComplete) return;

    playCardFlip();
    const newSeq = [...sequence];
    [newSeq[index], newSeq[targetIdx]] = [newSeq[targetIdx], newSeq[index]];
    setSequence(newSeq);
    setMoves(m => m + 1);

    // Check if sorted
    const isSorted = newSeq.every((item, i) => item.order === i + 1);
    if (isSorted) {
      playMatchSound();
      setIsComplete(true);
      playCelebration();
      confetti({ particleCount: 75, spread: 65 });

      logGameSession({
        gameId: 'daily-routine',
        accuracy: 0.9,
        averageLatencyMs: 3100,
        moves: moves + 1,
        optimalMoves: 4,
        durationSec: Math.round((Date.now() - startTimeRef.current) / 1000)
      });

      speechService.speak(`${t.gameComplete} ${t.voicePraise2}`, language);
    }
  };

  const handleSpeakItem = (item) => {
    speechService.speak(`${item.title}. Scheduled for ${item.time}. ${item.description}`, language);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 text-xs sm:text-sm cursor-pointer"
        >
          <ArrowLeft size={18} />
          <span>{t.home}</span>
        </button>

        <h3 className="font-bold text-slate-800 text-sm sm:text-base hidden sm:block">
          {t.game3Title}
        </h3>

        <button
          onClick={startNewGame}
          className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      <p className="text-xs sm:text-sm text-slate-600 text-center font-medium bg-amber-50 py-2 px-4 rounded-2xl border border-amber-200">
        Tap the ⬆ Up and ⬇ Down arrows to arrange your morning daily routine from earliest to latest.
      </p>

      {/* Routine Cards List */}
      <div className="space-y-3">
        {sequence.map((item, index) => {
          const isCorrectSpot = item.order === index + 1;
          return (
            <div
              key={item.id}
              className={`p-4 sm:p-5 rounded-3xl border-2 transition-all flex items-center justify-between gap-3 shadow-xs ${
                isCorrectSpot 
                  ? 'bg-emerald-50/80 border-emerald-300' 
                  : 'bg-white border-slate-200 hover:border-amber-300'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <span className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-700 text-sm">
                  {index + 1}
                </span>
                <span className="text-3xl">{item.icon}</span>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base">{item.title}</h4>
                  <p className="text-xs text-slate-500 font-medium">{item.time} • {item.description}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleSpeakItem(item)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-600 hover:text-amber-800 transition-colors cursor-pointer"
                  title="Read aloud"
                >
                  <Volume2 size={16} />
                </button>

                <button
                  onClick={() => moveItem(index, -1)}
                  disabled={index === 0 || isComplete}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700 font-bold transition-colors cursor-pointer"
                >
                  <ArrowUp size={18} />
                </button>

                <button
                  onClick={() => moveItem(index, 1)}
                  disabled={index === sequence.length - 1 || isComplete}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700 font-bold transition-colors cursor-pointer"
                >
                  <ArrowDown size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion Banner */}
      {isComplete && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-3xl p-6 sm:p-8 text-center shadow-xl space-y-4">
          <Award size={48} className="mx-auto text-amber-300" />
          <h3 className="text-2xl sm:text-3xl font-black">{t.gameComplete}</h3>
          <p className="text-emerald-100 text-sm sm:text-base max-w-md mx-auto">
            Wonderful time orientation and sequence recall! Your daily schedule is in perfect harmony.
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
