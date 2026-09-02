import React from 'react';
import { usePatient } from '../../context/PatientContext.jsx';
import { useSound } from '../../context/SoundContext.jsx';
import { speechService } from '../../i18n/speechService.js';
import confetti from 'canvas-confetti';
import { 
  Droplet, 
  Plus, 
  Sparkles, 
  Award, 
  Volume2 
} from 'lucide-react';

export const HydrationAssistant = () => {
  const { waterCount, incrementWater, language, t } = usePatient();
  const { playWaterChime, playCelebration } = useSound();

  const TARGET_GLASSES = 8;
  const progressPct = Math.min(100, Math.round((waterCount / TARGET_GLASSES) * 100));

  const handleDrink = () => {
    incrementWater();
    playWaterChime();

    if (waterCount + 1 >= TARGET_GLASSES) {
      playCelebration();
      confetti({ particleCount: 50, spread: 50 });
      speechService.speak(`Excellent! You reached your daily goal of 8 glasses of water.`, language);
    } else {
      speechService.speak(`Water logged. You have completed ${waterCount + 1} glasses today. Stay refreshed!`, language);
    }
  };

  return (
    <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
      
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-800 flex items-center justify-center text-2xl">
            💧
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">{t.hydrationTitle}</h3>
            <p className="text-xs text-slate-500">{t.hydrationDesc}</p>
          </div>
        </div>

        <span className="text-sm font-black text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200">
          {waterCount} / {TARGET_GLASSES} Glasses
        </span>
      </div>

      {/* Visual Water Glasses Row */}
      <div className="flex items-center justify-around gap-1 sm:gap-2 py-4 bg-slate-50 rounded-2xl px-2">
        {Array.from({ length: TARGET_GLASSES }).map((_, idx) => {
          const isFilled = idx < waterCount;
          return (
            <div
              key={idx}
              className={`flex flex-col items-center gap-1 transition-all ${
                isFilled ? 'scale-110' : 'opacity-40'
              }`}
            >
              <div className={`w-8 sm:w-11 h-12 sm:h-16 rounded-xl border-2 flex items-end justify-center overflow-hidden shadow-xs ${
                isFilled ? 'border-cyan-500 bg-cyan-100' : 'border-slate-300 bg-white'
              }`}>
                {isFilled && (
                  <div className="w-full bg-gradient-to-t from-cyan-600 to-cyan-400 h-4/5 animate-pulse rounded-b-lg"></div>
                )}
              </div>
              <span className="text-[10px] font-bold text-slate-500">{idx + 1}</span>
            </div>
          );
        })}
      </div>

      {/* Progress & Giant Button */}
      <div className="space-y-3">
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
          <div 
            className="bg-gradient-to-r from-cyan-500 to-blue-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          ></div>
        </div>

        <button
          onClick={handleDrink}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-black text-base sm:text-lg flex items-center justify-center gap-2 shadow-md transition-transform active:scale-98 cursor-pointer"
        >
          <Plus size={20} />
          <span>{t.drinkGlassBtn}</span>
        </button>
      </div>

    </div>
  );
};
