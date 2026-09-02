import React, { useState, useEffect, useRef } from 'react';
import { usePatient } from '../../context/PatientContext.jsx';
import { useSound } from '../../context/SoundContext.jsx';
import { speechService } from '../../i18n/speechService.js';
import { NER_CULTURAL_CARDS } from '../../storage/initialData.js';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, 
  RotateCcw, 
  HelpCircle, 
  Sparkles, 
  Award, 
  Clock, 
  CheckCircle2, 
  Brain,
  Volume2
} from 'lucide-react';

export const CulturalMemoryMatch = ({ onBack, familyMode = false }) => {
  const { t, language, familyAlbum, currentDifficulty, logGameSession } = usePatient();
  const { playCardFlip, playMatchSound, playCelebration } = useSound();

  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedIds, setMatchedIds] = useState([]);
  const [moves, setMoves] = useState(0);
  const [consecutiveMatches, setConsecutiveMatches] = useState(0);
  const [errorStreak, setErrorStreak] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [hintActive, setHintActive] = useState(false);
  
  // Timing & AI latency metrics
  const sessionStartTimeRef = useRef(Date.now());
  const lastFlipTimeRef = useRef(Date.now());
  const latencyRecordsRef = useRef([]);

  // Initialize Game Grid
  useEffect(() => {
    startNewGame();
  }, [currentDifficulty, familyMode]);

  const startNewGame = () => {
    sessionStartTimeRef.current = Date.now();
    lastFlipTimeRef.current = Date.now();
    latencyRecordsRef.current = [];
    setFlippedIndices([]);
    setMatchedIds([]);
    setMoves(0);
    setConsecutiveMatches(0);
    setErrorStreak(0);
    setIsGameOver(false);
    setHintActive(false);

    let pairCount = 2; // Level 1 (2 pairs = 4 cards)
    if (currentDifficulty === 2) pairCount = 3;
    if (currentDifficulty === 3) pairCount = 4;
    if (currentDifficulty === 4) pairCount = 6;

    let sourcePool = [];
    if (familyMode && familyAlbum && familyAlbum.length >= 2) {
      sourcePool = familyAlbum.map(item => ({
        id: item.id,
        name: item.name,
        symbol: item.photoUrl,
        badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
        voiceText: item.voiceHintAs || item.voiceHint
      }));
    } else {
      sourcePool = NER_CULTURAL_CARDS.map(item => ({
        id: item.id,
        name: item.name,
        symbol: item.symbol,
        badgeColor: item.badgeColor,
        voiceText: item.description
      }));
    }

    // Pick subset
    const selected = sourcePool.slice(0, Math.min(pairCount, sourcePool.length));
    
    // Duplicate for pairs
    const deck = [...selected, ...selected].map((card, idx) => ({
      ...card,
      uniqueKey: `${card.id}-${idx}`,
      isFlipped: false,
      isMatched: false
    }));

    // Shuffle deck
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    setCards(deck);
    speechService.speak(t.game1Title, language);
  };

  const handleCardClick = (index) => {
    if (flippedIndices.length >= 2 || cards[index].isFlipped || cards[index].isMatched || isGameOver) {
      return;
    }

    playCardFlip();

    // Record latency
    const now = Date.now();
    const latency = now - lastFlipTimeRef.current;
    lastFlipTimeRef.current = now;
    latencyRecordsRef.current.push(latency);

    const nextFlipped = [...flippedIndices, index];
    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);
    setFlippedIndices(nextFlipped);

    // If second card flipped, check match
    if (nextFlipped.length === 2) {
      const [firstIdx, secondIdx] = nextFlipped;
      const firstCard = newCards[firstIdx];
      const secondCard = newCards[secondIdx];
      setMoves(m => m + 1);

      if (firstCard.id === secondCard.id) {
        // MATCH FOUND
        playMatchSound();
        setConsecutiveMatches(c => c + 1);
        setErrorStreak(0);

        setTimeout(() => {
          newCards[firstIdx].isMatched = true;
          newCards[secondIdx].isMatched = true;
          setCards(newCards);
          setFlippedIndices([]);
          setMatchedIds(prev => [...prev, firstCard.id]);

          // Verbal praise
          speechService.speak(firstCard.voiceText || t.matchFound, language);

          // Check if game complete
          const allMatched = newCards.every(c => c.isMatched);
          if (allMatched) {
            handleGameWin(newCards.length / 2);
          }
        }, 500);

      } else {
        // NO MATCH - Compassionate delay
        setConsecutiveMatches(0);
        setErrorStreak(s => s + 1);

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
    playCelebration();
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });

    const totalDurationSec = Math.round((Date.now() - sessionStartTimeRef.current) / 1000);
    const avgLatency = latencyRecordsRef.current.length > 0 
      ? Math.round(latencyRecordsRef.current.reduce((a, b) => a + b, 0) / latencyRecordsRef.current.length) 
      : 3200;

    const accuracy = Math.min(1, pairsTotal / Math.max(pairsTotal, moves + 1));

    // Log to AI adaptive engine
    logGameSession({
      gameId: 'cultural-memory',
      accuracy,
      averageLatencyMs: avgLatency,
      moves: moves + 1,
      optimalMoves: pairsTotal,
      durationSec: totalDurationSec,
      consecutiveMatches,
      errorStreak
    });

    speechService.speak(`${t.gameComplete} ${t.voicePraise1}`, language);
  };

  const handleShowHint = () => {
    setHintActive(true);
    // Find first unmatched pair and briefly highlight
    const unmatched = cards.find(c => !c.isMatched);
    if (unmatched) {
      speechService.speak(`Look for ${unmatched.name}`, language);
    }
    setTimeout(() => setHintActive(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 text-xs sm:text-sm transition-colors cursor-pointer"
        >
          <ArrowLeft size={18} />
          <span>{t.home}</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold">
            <Sparkles size={14} className="text-amber-600" />
            <span>{t.difficulty}: {currentDifficulty}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold">
            <CheckCircle2 size={14} className="text-emerald-600" />
            <span>{t.moves}: {moves}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShowHint}
            className="p-2.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
            title="Get a gentle hint"
          >
            <HelpCircle size={18} />
            <span className="hidden sm:inline">{t.hintBtn}</span>
          </button>
          
          <button
            onClick={startNewGame}
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
            title="Restart game"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>

      {/* Game Card Grid */}
      <div className={`grid gap-4 sm:gap-6 ${
        cards.length <= 4 
          ? 'grid-cols-2 max-w-md mx-auto' 
          : cards.length <= 6 
            ? 'grid-cols-2 sm:grid-cols-3 max-w-xl mx-auto' 
            : cards.length <= 8 
              ? 'grid-cols-2 sm:grid-cols-4 max-w-3xl mx-auto' 
              : 'grid-cols-3 sm:grid-cols-4 max-w-4xl mx-auto'
      }`}>
        {cards.map((card, index) => {
          const isRevealed = card.isFlipped || card.isMatched || hintActive;
          return (
            <button
              key={card.uniqueKey}
              onClick={() => handleCardClick(index)}
              disabled={card.isMatched || isGameOver}
              className={`h-36 sm:h-44 rounded-3xl border-4 transition-all transform duration-300 flex flex-col items-center justify-center p-3 text-center cursor-pointer select-none shadow-sm ${
                card.isMatched
                  ? 'bg-emerald-50 border-emerald-400 opacity-90 scale-95'
                  : isRevealed
                    ? 'bg-white border-amber-400 rotate-0 shadow-md ring-4 ring-amber-100'
                    : 'bg-gradient-to-tr from-amber-600 via-amber-500 to-emerald-600 border-amber-300 hover:scale-102 hover:shadow-md'
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
                <div className="flex flex-col items-center justify-center text-white/90">
                  <span className="text-3xl sm:text-4xl mb-1">🌿</span>
                  <span className="text-xs font-black uppercase tracking-wider text-amber-100">
                    {familyMode ? 'Family' : 'স্মৃতি'}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Win Celebration Banner */}
      {isGameOver && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-3xl p-6 sm:p-8 text-center shadow-xl animate-bounce-short">
          <Award size={48} className="mx-auto text-amber-300 mb-2" />
          <h3 className="text-2xl sm:text-3xl font-black mb-1">{t.gameComplete}</h3>
          <p className="text-emerald-100 text-sm sm:text-base max-w-md mx-auto mb-5">
            {t.voicePraise1} {t.aiAdaptiveNote}
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={startNewGame}
              className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm sm:text-base shadow-md transition-transform active:scale-95 cursor-pointer"
            >
              {t.playAgain}
            </button>
            <button
              onClick={onBack}
              className="px-6 py-3 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-sm sm:text-base transition-colors cursor-pointer"
            >
              {t.home}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
