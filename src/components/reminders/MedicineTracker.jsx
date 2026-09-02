import React from 'react';
import { usePatient } from '../../context/PatientContext.jsx';
import { useSound } from '../../context/SoundContext.jsx';
import { speechService } from '../../i18n/speechService.js';
import confetti from 'canvas-confetti';
import { 
  Pill, 
  CheckCircle2, 
  Clock, 
  Volume2, 
  Sparkles, 
  AlertCircle,
  Sun,
  Sunset,
  Moon
} from 'lucide-react';

export const MedicineTracker = () => {
  const { medications, toggleMedicationTaken, language, t } = usePatient();
  const { playMedicineBell, playCelebration } = useSound();

  const handleToggle = (med) => {
    toggleMedicationTaken(med.id);
    if (!med.taken) {
      playMedicineBell();
      playCelebration();
      confetti({ particleCount: 50, spread: 50 });
      speechService.speak(`Medicine ${med.name} marked as taken. Well done!`, language);
    }
  };

  const handleSpeakMed = (med) => {
    speechService.speak(`${med.name}. Scheduled for ${med.timeString}. ${med.instructions}`, language);
  };

  const getTimingIcon = (timing) => {
    if (timing === 'morning') return <Sun size={18} className="text-amber-500" />;
    if (timing === 'afternoon') return <Sunset size={18} className="text-orange-500" />;
    return <Moon size={18} className="text-indigo-500" />;
  };

  const completedCount = medications.filter(m => m.taken).length;

  return (
    <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl">
            💊
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">{t.medicineTitle}</h3>
            <p className="text-xs text-slate-500">Visual Pill Schedule with Regional Voice Alerts</p>
          </div>
        </div>

        <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 self-start sm:self-auto">
          Adherence: {completedCount} / {medications.length} Doses Taken
        </span>
      </div>

      {/* Medications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {medications.map(med => (
          <div
            key={med.id}
            className={`p-5 rounded-3xl border-2 transition-all flex flex-col justify-between space-y-3 ${
              med.taken 
                ? 'bg-emerald-50/70 border-emerald-300 opacity-90' 
                : 'bg-white border-slate-200 hover:border-amber-300 shadow-xs'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-2 bg-slate-50 rounded-2xl">{med.pillIcon}</span>
                <div>
                  <div className="flex items-center gap-1.5">
                    {getTimingIcon(med.timing)}
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {med.timing.toUpperCase()} • {med.timeString}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-base leading-tight mt-0.5">
                    {med.name}
                  </h4>
                </div>
              </div>

              <button
                onClick={() => handleSpeakMed(med)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-600 hover:text-amber-800 transition-colors cursor-pointer"
                title="Read dosage aloud"
              >
                <Volume2 size={16} />
              </button>
            </div>

            <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl">
              <span className="font-bold">Instructions:</span> {med.instructions}
            </p>

            {/* Checkbox Action Button */}
            <button
              onClick={() => handleToggle(med)}
              className={`w-full py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
                med.taken
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-600 hover:to-emerald-700 text-white active:scale-98'
              }`}
            >
              <CheckCircle2 size={18} />
              <span>{med.taken ? `${t.takenBtn} (${med.takenAt})` : t.takenBtn}</span>
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};
