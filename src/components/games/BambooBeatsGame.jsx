import React, { useState, useEffect, useRef } from 'react';
import { usePatient } from '../../context/PatientContext.jsx';
import { useSound } from '../../context/SoundContext.jsx';
import { speechService } from '../../i18n/speechService.js';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, 
  RotateCcw, 
  Music, 
  Award, 
  Volume2, 
  Sparkles,
  Heart
} from 'lucide-react';

export const BambooBeatsGame = ({ onBack }) => {
  const { t, language, logGameSession } = usePatient();
  const { playMatchSound, playCelebration } = useSound();

  const RHYTHM_THEMES = [
    { id: 'bihu', name: 'Assam Bihu Dhol (বিহু ঢোলৰ লয়)', tempoMs: 900, icon: '🥁', color: 'from-amber-500 to-rose-600' },
    { id: 'pung', name: 'Manipuri Pung Cholom (ꯄꯨꯡ ꯆꯣꯂꯣꯝ)', tempoMs: 1100, icon: '🪘', color: 'from-teal-600 to-emerald-600' },
    { id: 'cheraw', name: 'Mizo Cheraw Bamboo Beat (Cheraw)', tempoMs: 1000, icon: '🎋', color: 'from-indigo-600 to-purple-600' }
  ];

  const [currentTheme, setCurrentTheme] = useState(RHYTHM_THEMES[0]);
  const [pulseActive, setPulseActive] = useState(false);
  const [tapScore, setTapScore] = useState(0);
  const [targetTaps, setTargetTaps] = useState(8);
  const [feedback, setFeedback] = useState('Watch the rhythm pulse, then tap in harmony');
  const [isComplete, setIsComplete] = useState(false);

  const startTimeRef = useRef(Date.now());
  const timerRef = useRef(null);

  useEffect(() => {
    startRhythmLoop();
    return () => clearInterval(timerRef.current);
  }, [currentTheme]);

  const startRhythmLoop = () => {
    clearInterval(timerRef.current);
    setTapScore(0);
    setIsComplete(false);
    startTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      setPulseActive(true);
      setTimeout(() => setPulseActive(false), 400);
    }, currentTheme.tempoMs);

    speechService.speak(`${currentTheme.name}. Tap the drum along with the glowing rhythm.`, language);
  };

  const handleTap = () => {
    if (isComplete) return;

    playMatchSound();

    if (pulseActive) {
      // Synchronized tap!
      const nextScore = tapScore + 1;
      setTapScore(nextScore);
      setFeedback('🎵 Wonderful rhythm timing!');

      if (nextScore >= targetTaps) {
        setIsComplete(true);
        clearInterval(timerRef.current);
        playCelebration();
        confetti({ particleCount: 65, spread: 60 });

        logGameSession({
          gameId: 'bamboo-beats',
          accuracy: 0.92,
          averageLatencyMs: 950,
          moves: nextScore,
          optimalMoves: targetTaps,
          durationSec: Math.round((Date.now() - startTimeRef.current) / 1000)
        });

        speechService.speak(`${t.gameComplete} ${t.voicePraise1}`, language);
      }
    } else {
      setFeedback('Good try! Tap right as the drum glows.');
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
          {currentTheme.name}
        </span>

        <button
          onClick={startRhythmLoop}
          className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      {/* Theme Selectors */}
      <div className="flex justify-center gap-2">
        {RHYTHM_THEMES.map(theme => (
          <button
            key={theme.id}
            onClick={() => setCurrentTheme(theme)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              currentTheme.id === theme.id 
                ? 'bg-slate-900 text-white shadow-xs' 
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {theme.icon} {theme.name.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Interactive Big Drum Pulse Button */}
      {!isComplete && (
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-8 shadow-sm space-y-6">
          <p className="text-sm font-semibold text-slate-600">{feedback}</p>

          <button
            onClick={handleTap}
            className={`w-44 h-44 sm:w-56 sm:h-56 mx-auto rounded-full flex flex-col items-center justify-center text-white shadow-2xl transition-all transform active:scale-90 cursor-pointer select-none bg-gradient-to-tr ${currentTheme.color} ${
              pulseActive 
                ? 'scale-110 ring-12 ring-amber-300 shadow-amber-200/80 animate-pulse' 
                : 'ring-4 ring-slate-100 hover:scale-102'
            }`}
          >
            <span className="text-6xl sm:text-7xl mb-2">{currentTheme.icon}</span>
            <span className="text-base sm:text-lg font-black uppercase tracking-wider text-amber-100">
              TAP BEAT
            </span>
          </button>

          {/* Progress Bar */}
          <div className="max-w-xs mx-auto">
            <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
              <span>Harmonic Taps</span>
              <span>{tapScore} / {targetTaps}</span>
            </div>
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${(tapScore / targetTaps) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Completion Banner */}
      {isComplete && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
          <Award size={48} className="mx-auto text-amber-300" />
          <h3 className="text-2xl sm:text-3xl font-black">{t.gameComplete}</h3>
          <p className="text-emerald-100 text-sm sm:text-base max-w-md mx-auto">
            Exemplary audio-motor coordination! You tapped in harmony with {currentTheme.name}.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={startRhythmLoop}
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
