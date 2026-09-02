import React from 'react';
import { usePatient } from '../../context/PatientContext.jsx';
import { MedicineTracker } from './MedicineTracker.jsx';
import { HydrationAssistant } from './HydrationAssistant.jsx';
import { RoutineTimeline } from './RoutineTimeline.jsx';
import { Clock, Sparkles } from 'lucide-react';

export const RemindersView = () => {
  const { t } = usePatient();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-blue-100 text-xs font-bold mb-3">
            <Clock size={14} className="text-amber-300" />
            <span>Daily Living & ADL Assistance</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black mb-2 tracking-tight">
            {t.reminders}
          </h2>
          <p className="text-blue-100/90 text-sm sm:text-base leading-relaxed">
            Personalized medication schedules with regional voice announcements, gentle hydration reminders, and circadian routine pacing.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <MedicineTracker />
          <HydrationAssistant />
        </div>
        <div>
          <RoutineTimeline />
        </div>
      </div>

    </div>
  );
};
