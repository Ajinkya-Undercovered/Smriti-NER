import React, { useState, useEffect, useRef } from 'react';
import { usePatient } from '../../context/PatientContext.jsx';
import { soundFx } from '../../utils/audio.js';
import { speechService } from '../../i18n/speechService.js';
import confetti from 'canvas-confetti';
import { 
  Volume2, 
  RotateCcw, 
  HelpCircle, 
  Award, 
  Play, 
  Music, 
  CheckCircle2, 
  ArrowLeft 
} from 'lucide-react';

const SOUND_ITEMS = [
  {
    id: 'bird',
    nameAs: 'কুলি চৰাইৰ মাত (Kuli Bird Call)',
    nameEn: 'Kuli Cuckoo Bird',
    symbol: '🕊️',
    soundType: 'bird',
    descAs: 'বসন্তকালৰ মিঠ কুলি চৰাইৰ সুৰ',
    descEn: 'Sweet melody of the spring cuckoo in Assam gardens'
  },
  {
    id: 'flute',
    nameAs: 'পাহাৰীয়া বাঁহী (Bamboo Flute)',
    nameEn: 'Bamboo Flute Melody',
    symbol: '🪈',
    soundType: 'flute',
    descAs: 'শান্ত পাহাৰৰ সুমধুৰ বাঁহীৰ তান',
    descEn: 'Calming folk bamboo flute from the hills'
  },
  {
    id: 'river',
    nameAs: 'ব্ৰহ্মপুত্ৰৰ নদীৰ ঢৌ (River Waves)',
    nameEn: 'Brahmaputra River Waves',
    symbol: '🌊',
    soundType: 'river',
    descAs: 'ব্ৰহ্মপুত্ৰৰ পানীৰ শান্ত কলধ্বনি',
    descEn: 'Gentle ripples of the mighty Brahmaputra river'
  },
  {
    id: 'temple',
    nameAs: 'মন্দিৰৰ কাঁহ-শংখ (Temple Bell & Conch)',
    nameEn: 'Namghar Temple Bell',
    symbol: '🔔',
    soundType: 'bell',
    descAs: 'নামঘৰৰ পৱিত্ৰ কাঁহ আৰু শংখৰ ধ্বনি',
    descEn: 'Sacred meditative bell and temple sound'
  }
];

export const FolkSoundIdentifier = ({ onBack, onSessionComplete }) => {
  const { logGameSession } = usePatient();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [options, setOptions] = useState([]);
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);

  const startTimeRef = useRef(Date.now());
  const roundStartTimeRef = useRef(Date.now());
  const latenciesRef = useRef([]);

  useEffect(() => {
    loadRound(0);
  }, []);

  const playSynthesizedSound = (type) => {
    setIsPlayingSound(true);
    if (type === 'flute') {
      soundFx.playAmbient('flute');
      setTimeout(() => {
        soundFx.stopAmbient();
        setIsPlayingSound(false);
      }, 2500);
    } else if (type === 'river') {
      soundFx.playAmbient('river');
      setTimeout(() => {
        soundFx.stopAmbient();
        setIsPlayingSound(false);
      }, 2500);
    } else if (type === 'bell') {
      soundFx.playSingingBowl();
      setTimeout(() => setIsPlayingSound(false), 2200);
    } else if (type === 'bird') {
      // Bird chirping synthesizer
      try {
        const ctx = soundFx.getAudioContext();
        const now = ctx.currentTime;
        [1800, 2400, 2100, 2600].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.18);
          osc.frequency.exponentialRampToValueAtTime(freq + 400, now + idx * 0.18 + 0.12);
          gain.gain.setValueAtTime(0.12, now + idx * 0.18);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.18 + 0.15);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.18);
          osc.stop(now + idx * 0.18 + 0.16);
        });
      } catch (e) {}
      setTimeout(() => setIsPlayingSound(false), 1500);
    }
  };

  const loadRound = (roundIdx) => {
    if (roundIdx >= SOUND_ITEMS.length) {
      handleGameOver();
      return;
    }

    setCurrentIndex(roundIdx);
    setSelectedAnswer(null);
    setIsCorrect(null);
    roundStartTimeRef.current = Date.now();

    const target = SOUND_ITEMS[roundIdx];
    const others = SOUND_ITEMS.filter(s => s.id !== target.id);
    const shuffled = [target, ...others.sort(() => 0.5 - Math.random()).slice(0, 2)].sort(() => 0.5 - Math.random());
    setOptions(shuffled);

    setTimeout(() => {
      playSynthesizedSound(target.soundType);
    }, 400);

    speechService.speakBilingual(
      'এই ধ্বনিটো কাৰ? শুনক আৰু তলৰ সঠিক ছবিত স্পৰ্শ কৰক।',
      'Listen to this sound. Which card does it match below?'
    );
  };

  const handleSelectOption = (item) => {
    if (selectedAnswer !== null) return;

    const target = SOUND_ITEMS[currentIndex];
    const latency = Date.now() - roundStartTimeRef.current;
    latenciesRef.current.push(latency);

    setSelectedAnswer(item.id);

    if (item.id === target.id) {
      setIsCorrect(true);
      setScore(s => s + 1);
      soundFx.playMatchSound();
      confetti({ particleCount: 35, spread: 50 });

      speechService.speakBilingual(
        `সঠিক উত্তৰ! এইটো হ’ল ${target.nameAs}`,
        `Correct! This is the sound of ${target.nameEn}`
      );

      setTimeout(() => {
        loadRound(currentIndex + 1);
      }, 1600);
    } else {
      setIsCorrect(false);
      soundFx.playCardFlip();
      speechService.speakBilingual(
        `একো নাই, ধ্বনিটো পুনৰ শুনক।`,
        `No worries, tap the button to listen again.`
      );
      setTimeout(() => {
        setSelectedAnswer(null);
        setIsCorrect(null);
      }, 1600);
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
      : 3100;

    const sessionData = {
      gameId: 'folk-sound-identifier',
      accuracy: 1.0,
      averageLatencyMs: avgLatency,
      moves: SOUND_ITEMS.length,
      optimalMoves: SOUND_ITEMS.length,
      durationSec: totalDuration
    };

    const { fullSession } = logGameSession(sessionData);
    if (onSessionComplete) onSessionComplete(fullSession);

    speechService.speakBilingual(
      'বহুত ধুনীয়া! আপুনি সকলো লোকধ্বনি আৰু চৰাইৰ মাত চিনাক্ত কৰিলে।',
      'Wonderful! You recognized all the traditional sounds and bird calls.'
    );
  };

  const currentTarget = SOUND_ITEMS[currentIndex];

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
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 text-cyan-800 text-xs font-bold border border-cyan-200">
              <Music size={14} className="text-cyan-600" />
              <span>Auditory Memory & Sound Recognition</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Folk Sound & Bird Identifier (লোকধ্বনি আৰু সুৰ চিনি উলিওৱা)
            </h2>
          </div>
        </div>
      </div>

      {!isGameOver ? (
        <div className="space-y-6">
          
          {/* Audio Player Card */}
          <div className="bg-gradient-to-b from-cyan-900 to-slate-900 rounded-3xl p-8 text-center text-white shadow-lg flex flex-col items-center justify-center space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-300">
              Sound {currentIndex + 1} of {SOUND_ITEMS.length} • Listen & Identify
            </span>

            <button
              onClick={() => playSynthesizedSound(currentTarget.soundType)}
              className={`w-28 h-28 rounded-full flex items-center justify-center text-white shadow-2xl transition-all cursor-pointer ${
                isPlayingSound
                  ? 'bg-cyan-500 ring-8 ring-cyan-300 scale-108 animate-pulse'
                  : 'bg-gradient-to-tr from-rose-500 to-amber-500 hover:scale-105 ring-4 ring-white/30'
              }`}
              title="Tap to listen to the sound"
            >
              {isPlayingSound ? <Volume2 size={52} /> : <Play size={52} className="ml-2" />}
            </button>

            <p className="text-xs sm:text-sm font-bold text-cyan-100">
              {isPlayingSound ? 'ধ্বনি বাজি আছে... (Playing Sound)' : 'Tap to Listen Sound (ধ্বনি শুনক)'}
            </p>
          </div>

          {/* 3 Option Picture Cards */}
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
                        : 'bg-white border-cyan-200 hover:border-cyan-400 hover:shadow-md'
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
        <div className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white rounded-3xl p-8 text-center space-y-4 shadow-xl animate-fade-in">
          <Award size={56} className="mx-auto text-amber-200 animate-breathe" />
          <h3 className="text-2xl sm:text-3xl font-black">
            খুব সুন্দৰ! (Splendid Auditory Recognition!)
          </h3>
          <p className="text-cyan-100 text-xs sm:text-sm max-w-md mx-auto">
            You successfully identified all traditional North Eastern acoustic sounds and melodies.
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
              className="px-6 py-3 rounded-2xl bg-white text-cyan-900 font-black text-xs sm:text-sm shadow-md hover:bg-cyan-50 cursor-pointer"
            >
              Play Again (পুনৰ খেলক)
            </button>
          </div>
        </div>
      )}

    </section>
  );
};
