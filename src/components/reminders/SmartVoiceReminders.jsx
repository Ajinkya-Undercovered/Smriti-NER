import React, { useState } from 'react';
import { usePatient } from '../../context/PatientContext.jsx';
import { soundFx } from '../../utils/audio.js';
import { speechService } from '../../i18n/speechService.js';
import confetti from 'canvas-confetti';
import { 
  Pill, 
  Droplet, 
  Clock, 
  Volume2, 
  CheckCircle2, 
  Plus, 
  ArrowLeft, 
  Sparkles, 
  Sun, 
  Moon,
  CalendarCheck
} from 'lucide-react';

export const SmartVoiceReminders = ({ onBackHome }) => {
  const { 
    patient, 
    medications, 
    toggleMedicationTaken, 
    waterCount, 
    incrementWater 
  } = usePatient();

  const [isSpeakingAll, setIsSpeakingAll] = useState(false);

  const handleToggleMed = (med) => {
    toggleMedicationTaken(med.id);
    if (!med.taken) {
      soundFx.playSingingBowl();
      confetti({ particleCount: 45, spread: 55 });
      speechService.speakBilingual(
        `${med.name} ঔষধ খোৱা হ’ল। খুব ভাল কাম কৰিলে!`,
        `${med.name} marked as taken. Great job staying healthy!`
      );
    }
  };

  const handleWaterClick = () => {
    incrementWater();
    soundFx.playWaterChime();
    speechService.speakBilingual(
      `আপুনি ${waterCount + 1} নম্বৰ গিলাচ পানী খালে। সতেজ হৈ থাকক!`,
      `You drank glass ${waterCount + 1} of 8 water. Stay refreshed and hydrated!`
    );
  };

  const handleSpeakAllReminders = () => {
    setIsSpeakingAll(true);
    const pendingMeds = medications.filter(m => !m.taken);
    const medNames = pendingMeds.map(m => m.name).join(', ');

    const asMsg = `নমস্কাৰ ${patient.name}! আজি আপোনাৰ ${pendingMeds.length} টা ঔষধ খাবলৈ বাকী আছে: ${medNames}। লগতে ৮ গিলাচ পানী খাবলৈ নাপাহৰিব।`;
    const enMsg = `Hello ${patient.name}! You have ${pendingMeds.length} medications scheduled: ${medNames}. Please remember to drink fresh water today.`;

    speechService.speakBilingual(asMsg, enMsg, () => {
      setIsSpeakingAll(false);
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-4xl mx-auto">
      
      {/* Top Header */}
      <div className="bg-gradient-to-r from-sky-600 to-blue-700 text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-1">
            <Sparkles size={14} />
            <span>AI Voice Assisted ADL Schedule & Reminders</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">
            মোৰ ঔষধ আৰু পানীৰ সোঁৱৰণী (Medicines & Hydration)
          </h2>
          <p className="text-xs sm:text-sm text-sky-100 max-w-xl">
            Clear visual dosage schedule with voice announcements and water intake tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onBackHome && (
            <button
              onClick={onBackHome}
              className="px-4 py-2.5 rounded-2xl bg-white text-sky-900 font-black text-xs sm:text-sm shadow-md hover:bg-sky-50 flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span>Home (ঘৰলৈ)</span>
            </button>
          )}
        </div>
      </div>

      {/* Proactive AI Voice Reminder Trigger Banner */}
      <div className="bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <span className="text-4xl p-2 bg-white/20 rounded-2xl">🎙️</span>
          <div>
            <h3 className="font-black text-base sm:text-lg">Smart Audio Voice Reminder (কণ্ঠ সোঁৱৰণী)</h3>
            <p className="text-xs text-rose-100">
              Listen to all your pending medications and health routine in Assamese & English.
            </p>
          </div>
        </div>

        <button
          onClick={handleSpeakAllReminders}
          disabled={isSpeakingAll}
          className={`px-5 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 shadow-md cursor-pointer transition-all ${
            isSpeakingAll
              ? 'bg-rose-950 text-white animate-pulse'
              : 'bg-white text-rose-900 hover:bg-rose-50'
          }`}
        >
          <Volume2 size={18} />
          <span>{isSpeakingAll ? 'Speaking Reminders...' : 'Speak All Reminders (শুনক)'}</span>
        </button>
      </div>

      {/* Medications List */}
      <div className="bg-white border-3 border-rose-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-rose-100 pb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2 bg-rose-50 rounded-2xl border border-rose-200">💊</span>
            <div>
              <h3 className="font-black text-slate-900 text-lg sm:text-xl">Daily Medication Schedule</h3>
              <p className="text-xs text-slate-500">Tap the dose when you take your medicine</p>
            </div>
          </div>
          <span className="text-xs font-black px-3 py-1 rounded-full bg-rose-100 text-rose-900 border border-rose-200">
            {medications.filter(m => m.taken).length} / {medications.length} Doses Completed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {medications.map((med) => (
            <div
              key={med.id}
              className={`p-5 rounded-3xl border-3 transition-all flex flex-col justify-between gap-3 ${
                med.taken
                  ? 'bg-emerald-50/70 border-emerald-400 opacity-90'
                  : 'bg-white border-slate-200 hover:border-rose-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-4xl p-2 bg-slate-50 rounded-2xl border border-slate-200">
                    {med.pillIcon || '💊'}
                  </span>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-rose-800 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                      {med.timing} • {med.timeString}
                    </span>
                    <h4 className="font-black text-slate-900 text-base mt-1 leading-tight">{med.name}</h4>
                    <p className="text-xs text-slate-500 font-medium">{med.instructions}</p>
                  </div>
                </div>

                <button
                  onClick={() => speechService.speakBilingual(
                    `${med.name} ঔষধ ${med.timeString} বজাত খাব লাগে। ${med.instructions}`,
                    `Time for ${med.name} at ${med.timeString}. ${med.instructions}`
                  )}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-700 cursor-pointer"
                  title="Read medicine details"
                >
                  <Volume2 size={18} />
                </button>
              </div>

              <button
                onClick={() => handleToggleMed(med)}
                className={`w-full py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
                  med.taken
                    ? 'bg-emerald-600 text-white shadow-emerald-200'
                    : 'bg-rose-50 hover:bg-rose-100 text-rose-900 border-2 border-rose-300'
                }`}
              >
                <CheckCircle2 size={18} />
                <span>{med.taken ? 'Dose Taken ✓ (খালোঁ)' : 'Mark as Taken (মই খালোঁ)'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Hydration Tracker */}
      <div className="bg-white border-3 border-cyan-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-cyan-100 pb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2 bg-cyan-50 rounded-2xl border border-cyan-200">💧</span>
            <div>
              <h3 className="font-black text-slate-900 text-lg sm:text-xl">Hydration Assistant (পানী খোৱা)</h3>
              <p className="text-xs text-slate-500">Daily Target: 8 Glasses of Fresh Cool Water</p>
            </div>
          </div>
          <span className="text-xs font-black text-cyan-900 bg-cyan-100 px-3 py-1 rounded-full border border-cyan-300">
            {waterCount} / 8 Glasses
          </span>
        </div>

        {/* 8 Glasses Bar */}
        <div className="flex items-center justify-between gap-2 p-3 bg-cyan-50/50 rounded-2xl border border-cyan-200">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className={`flex-1 h-14 rounded-xl border-2 flex items-end justify-center overflow-hidden transition-all ${
                idx < waterCount ? 'border-cyan-500 bg-cyan-100' : 'border-slate-300 bg-white opacity-40'
              }`}
            >
              {idx < waterCount && (
                <div className="w-full bg-gradient-to-t from-cyan-600 to-blue-500 h-4/5 rounded-b-sm animate-pulse"></div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={handleWaterClick}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-md transition-transform active:scale-98 cursor-pointer"
        >
          <Plus size={20} />
          <span>I Drank 1 Glass of Fresh Water (১ গিলাচ পানী খালোঁ)</span>
        </button>
      </div>

    </div>
  );
};
