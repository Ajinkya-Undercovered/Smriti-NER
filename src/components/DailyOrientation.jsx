import React from 'react';
import { usePatient } from '../context/PatientContext.jsx';
import { soundFx } from '../utils/audio.js';
import { speechService } from '../i18n/speechService.js';
import confetti from 'canvas-confetti';
import { 
  Calendar, 
  Clock, 
  Pill, 
  Droplet, 
  CheckCircle2, 
  Plus, 
  Volume2, 
  Sun, 
  Moon,
  Sparkles 
} from 'lucide-react';

export const DailyOrientation = () => {
  const { 
    patient, 
    medications, 
    toggleMedicationTaken, 
    routines, 
    waterCount, 
    incrementWater, 
    language, 
    t 
  } = usePatient();

  const todayDateStr = new Date().toLocaleDateString(undefined, { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const handleMedToggle = (med) => {
    toggleMedicationTaken(med.id);
    if (!med.taken) {
      soundFx.playSingingBowl();
      confetti({ particleCount: 40, spread: 50 });
      speechService.speak(`${med.name} marked as taken.`, language);
    }
  };

  const handleWaterClick = () => {
    incrementWater();
    soundFx.playWaterChime();
    speechService.speak(`Glass ${waterCount + 1} of 8 water logged. Stay refreshed!`, language);
  };

  const handleSpeakRoutine = (item) => {
    speechService.speak(`${item.title} at ${item.time}. ${item.description}`, language);
  };

  return (
    <section className="space-y-6">
      
      {/* Daily Orientation Card */}
      <div className="bg-gradient-to-r from-rose-500 to-rose-600 rounded-3xl p-6 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl">
            📅
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-200">
              Daily Chrono-Orientation
            </span>
            <h3 className="text-xl md:text-2xl font-black">{todayDateStr}</h3>
            <p className="text-xs text-rose-100 mt-0.5">
              {patient.location} • Peaceful morning in North East India
            </p>
          </div>
        </div>

        <button
          onClick={() => speechService.speak(`Today is ${todayDateStr}. You are in ${patient.location}.`, language)}
          className="self-start sm:self-auto px-4 py-2 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Volume2 size={16} />
          <span>Read Date & Place</span>
        </button>
      </div>

      {/* Grid of Medication & Hydration & Routine */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 1. Medication Blister Pack Schedule */}
        <div className="bg-white border-2 border-rose-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-rose-100 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl p-2 bg-rose-50 rounded-xl border border-rose-200">💊</span>
              <div>
                <h3 className="font-bold text-slate-900 text-base md:text-lg">{t.medicineTitle || 'Medication Schedule'}</h3>
                <p className="text-[11px] text-slate-500">Visual Pill Schedule & Adherence</p>
              </div>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-50 text-rose-900 border border-rose-200">
              {medications.filter(m => m.taken).length} / {medications.length} Done
            </span>
          </div>

          <div className="space-y-3">
            {medications.map(med => (
              <div
                key={med.id}
                className={`p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 ${
                  med.taken 
                    ? 'bg-emerald-50/70 border-emerald-300 opacity-90' 
                    : 'bg-white border-slate-200 hover:border-rose-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{med.pillIcon || '💊'}</span>
                  <div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <span>{med.timing}</span>
                      <span>•</span>
                      <span>{med.timeString}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">{med.name}</h4>
                    <p className="text-[11px] text-slate-500">{med.instructions}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleMedToggle(med)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                    med.taken
                      ? 'bg-emerald-600 text-white'
                      : 'bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-300'
                  }`}
                >
                  <CheckCircle2 size={14} />
                  <span>{med.taken ? 'Taken ✓' : 'Take Dose'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Hydration & Daily Routine Column */}
        <div className="space-y-6">
          
          {/* Hydration Logger */}
          <div className="bg-white border-2 border-rose-200 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-rose-100 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl p-2 bg-cyan-50 rounded-xl border border-cyan-200">💧</span>
                <div>
                  <h3 className="font-bold text-slate-900 text-base md:text-lg">{t.hydrationTitle || 'Hydration Assistant'}</h3>
                  <p className="text-[11px] text-slate-500">Daily Target: 8 Glasses of Fresh Water</p>
                </div>
              </div>
              <span className="text-xs font-black text-cyan-800 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-200">
                {waterCount} / 8 Glasses
              </span>
            </div>

            <div className="flex items-center justify-around gap-1 py-2 bg-slate-50 rounded-2xl px-2">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={idx}
                  className={`w-7 h-10 rounded-lg border-2 flex items-end justify-center overflow-hidden transition-all ${
                    idx < waterCount ? 'border-cyan-500 bg-cyan-100' : 'border-slate-300 bg-white opacity-40'
                  }`}
                >
                  {idx < waterCount && (
                    <div className="w-full bg-cyan-500 h-3/4 rounded-b-sm animate-pulse"></div>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={handleWaterClick}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-98 cursor-pointer"
            >
              <Plus size={16} />
              <span>{t.drinkGlassBtn || 'I Drank 1 Glass of Water'}</span>
            </button>
          </div>

          {/* Routine Steps Snapshot */}
          <div className="bg-white border-2 border-rose-200 rounded-3xl p-6 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-base border-b border-rose-100 pb-2 flex items-center justify-between">
              <span>Today's Routine Timeline</span>
              <Clock size={16} className="text-rose-500" />
            </h3>

            <div className="space-y-2">
              {routines.slice(0, 3).map(item => (
                <div key={item.id} className="flex items-center justify-between p-2.5 rounded-xl bg-rose-50/50 border border-rose-100 text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <p className="font-bold text-slate-900">{item.title}</p>
                      <p className="text-[10px] text-slate-500">{item.time}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSpeakRoutine(item)}
                    className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    <Volume2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </section>
  );
};
