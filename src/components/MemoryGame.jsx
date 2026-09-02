import React, { useState, useEffect, useRef } from 'react';
import { usePatient } from '../context/PatientContext.jsx';
import { soundFx } from '../utils/audio.js';
import { speechService } from '../i18n/speechService.js';
import { NER_CULTURAL_CARDS } from '../storage/initialData.js';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  RotateCcw, 
  HelpCircle, 
  Award, 
  Users, 
  Brain, 
  Volume2, 
  CheckCircle2 
} from 'lucide-react';

export const MemoryGame = ({ onSessionComplete, voiceGuidanceEnabled = true }) => {
  const { t, language, familyAlbum, currentDifficulty, logGameSession } = usePatient();

  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedIds, setMatchedIds] = useState([]);
  const [moves, setMoves] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [hintActive, setHintActive] = useState(false);
  const [useFamilyMode, setUseFamilyMode] = useState(false);

  const startTimeRef = useRef(Date.now());
  const lastFlipRef = useRef(Date.now());
  const latencyRecordsRef = useRef([]);

  useEffect(() => {
    startNewGame();
  }, [currentDifficulty, useFamilyMode]);

  const startNewGame = () => {
    startTimeRef.current = Date.now();
    lastFlipRef.current = Date.now();
    latencyRecordsRef.current = [];
    setFlippedIndices([]);
    setMatchedIds([]);
    setMoves(0);
    setIsGameOver(false);
    setHintActive(false);

    let pairCount = 2;
    if (currentDifficulty === 2) pairCount = 3;
    if (currentDifficulty === 3) pairCount = 4;
    if (currentDifficulty === 4) pairCount = 6;

    let pool = [];
    if (useFamilyMode && familyAlbum && familyAlbum.length >= 2) {
      pool = familyAlbum.map(item => ({
        id: item.id,
        name: item.name,
        symbol: item.photoUrl,
        voiceText: item.voiceHintAs || item.voiceHint
      }));
    } else {
      pool = NER_CULTURAL_CARDS.map(item => ({
        id: item.id,
        name: item.name,
        symbol: item.symbol,
        voiceText: item.description
      }));
    }

    const selected = pool.slice(0, Math.min(pairCount, pool.length));
    const deck = [...selected, ...selected].map((c, idx) => ({
      ...c,
      key: `${c.id}-${idx}`,
      isFlipped: false,
      isMatched: false
    }));

    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    setCards(deck);

    if (voiceGuidanceEnabled) {
      speechService.speak(t.game1Title || 'Heritage Memory Matching Game', language);
    }
  };

  const handleCardClick = (index) => {
    if (flippedIndices.length >= 2 || cards[index].isFlipped || cards[index].isMatched || isGameOver) {
      return;
    }

    soundFx.playCardFlip();

    const now = Date.now();
    latencyRecordsRef.current.push(now - lastFlipRef.current);
    lastFlipRef.current = now;

    const nextFlipped = [...flippedIndices, index];
    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);
    setFlippedIndices(nextFlipped);

    if (nextFlipped.length === 2) {
      const [firstIdx, secondIdx] = nextFlipped;
      const firstCard = newCards[firstIdx];
      const secondCard = newCards[secondIdx];
      setMoves(m => m + 1);

      if (firstCard.id === secondCard.id) {
        // MATCH
        soundFx.playMatchSound();

        setTimeout(() => {
          newCards[firstIdx].isMatched = true;
          newCards[secondIdx].isMatched = true;
          setCards(newCards);
          setFlippedIndices([]);
          setMatchedIds(prev => [...prev, firstCard.id]);

          if (voiceGuidanceEnabled) {
            speechService.speak(firstCard.voiceText || t.matchFound || 'Wonderful match!', language);
          }

          const allMatched = newCards.every(c => c.isMatched);
          if (allMatched) {
            handleGameWin(newCards.length / 2);
          }
        }, 400);

      } else {
        // NO MATCH
        setTimeout(() => {
          newCards[firstIdx].isFlipped = false;
          newCards[secondIdx].isFlipped = false;
          setCards(newCards);
          setFlippedIndices([]);
        }, 1100);
      }
    }
  };

  const handleGameWin = (pairsTotal) => {
    setIsGameOver(true);
    soundFx.playSingingBowl();
    soundFx.playCelebration();
    confetti({ particleCount: 75, spread: 65, origin: { y: 0.6 } });

    const totalDurationSec = Math.round((Date.now() - startTimeRef.current) / 1000);
    const avgLatency = latencyRecordsRef.current.length > 0 
      ? Math.round(latencyRecordsRef.current.reduce((a, b) => a + b, 0) / latencyRecordsRef.current.length) 
      : 3000;

    const sessionData = {
      gameId: 'cultural-memory',
      accuracy: Math.min(1, pairsTotal / Math.max(pairsTotal, moves + 1)),
      averageLatencyMs: avgLatency,
      moves: moves + 1,
      optimalMoves: pairsTotal,
      durationSec: totalDurationSec
    };

    const { fullSession } = logGameSession(sessionData);
    if (onSessionComplete) onSessionComplete(fullSession);

    if (voiceGuidanceEnabled) {
      speechService.speak(`${t.gameComplete || 'Splendid job!'} ${t.voicePraise1 || 'Very well done!'}`, language);
    }
  };

  const handleShowHint = () => {
    setHintActive(true);
    const unmatched = cards.find(c => !c.isMatched);
    if (unmatched && voiceGuidanceEnabled) {
      speechService.speak(`Look for ${unmatched.name}`, language);
    }
    setTimeout(() => setHintActive(false), 2000);
  };

  return (
    <section className="bg-white border-2 border-rose-200 rounded-3xl p-5 md:p-8 shadow-sm space-y-6 mb-8">
      
      {/* Game Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rose-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 text-xs font-bold mb-1 border border-rose-200">
            <Brain size={14} className="text-rose-600" />
            <span>The Heritage Memory Match</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            {t.game1Title || 'Cultural & Memory Stimulation'}
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            AI Adaptive Level {currentDifficulty} • Relaxed & Zero Stress
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setUseFamilyMode(!useFamilyMode)}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              useFamilyMode
                ? 'bg-purple-700 text-white shadow-xs'
                : 'bg-purple-50 text-purple-900 border border-purple-200 hover:bg-purple-100'
            }`}
            title="Toggle personal family photos"
          >
            <Users size={15} />
            <span>{useFamilyMode ? 'Family Mode Active' : 'Family Album'}</span>
          </button>

          <button
            onClick={handleShowHint}
            className="p-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
            title="Show hint"
          >
            <HelpCircle size={16} />
            <span className="hidden sm:inline">Hint</span>
          </button>

          <button
            onClick={startNewGame}
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            title="Restart game"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Card Grid (Touch Targets tailored for elderly seniors) */}
      <div className={`grid gap-3 sm:gap-5 ${
        cards.length <= 4 
          ? 'grid-cols-2 max-w-sm mx-auto' 
          : cards.length <= 6 
            ? 'grid-cols-2 sm:grid-cols-3 max-w-lg mx-auto' 
            : 'grid-cols-2 sm:grid-cols-4 max-w-2xl mx-auto'
      }`}>
        {cards.map((card, index) => {
          const isRevealed = card.isFlipped || card.isMatched || hintActive;
          return (
            <button
              key={card.key}
              onClick={() => handleCardClick(index)}
              disabled={card.isMatched || isGameOver}
              className={`h-36 sm:h-44 rounded-3xl border-3 transition-all transform duration-300 flex flex-col items-center justify-center p-3 text-center cursor-pointer select-none shadow-xs ${
                card.isMatched
                  ? 'bg-emerald-50 border-emerald-400 opacity-90 scale-95 ring-2 ring-emerald-100'
                  : isRevealed
                    ? 'bg-white border-rose-400 shadow-md ring-4 ring-rose-100 rotate-0'
                    : 'bg-gradient-to-tr from-rose-500 via-rose-400 to-amber-500 border-rose-300 hover:scale-102 hover:shadow-md'
              }`}
            >
              {isRevealed ? (
                <div className="flex flex-col items-center justify-center h-full animate-fadeIn">
                  <span className="text-4xl sm:text-5xl mb-2">{card.symbol}</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 leading-tight">
                    {card.name}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-white/95">
                  <span className="text-3xl sm:text-4xl mb-1">🌿</span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-rose-100">
                    {useFamilyMode ? 'Family' : 'স্মৃতি'}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Win Banner */}
      {isGameOver && (
        <div className="bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-3xl p-6 sm:p-8 text-center shadow-lg animate-fade-in space-y-4">
          <Award size={48} className="mx-auto text-amber-200" />
          <h3 className="text-2xl sm:text-3xl font-black">{t.gameComplete || 'Splendid Memory Recall!'}</h3>
          <p className="text-rose-100 text-xs sm:text-sm max-w-md mx-auto">
            {t.voicePraise1 || 'Very well done!'} Completed in {moves} attempts.
          </p>
          <div className="flex justify-center gap-3 pt-1">
            <button
              onClick={startNewGame}
              className="px-6 py-3 rounded-2xl bg-white text-rose-900 font-black text-xs sm:text-sm shadow-md hover:bg-rose-50 transition-all cursor-pointer"
            >
              Play Again
            </button>
          </div>
        </div>
      )}

    </section>
  );
};
