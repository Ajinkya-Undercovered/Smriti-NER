import React from 'react';
import { usePatient } from '../../context/PatientContext.jsx';
import { speechService } from '../../i18n/speechService.js';
import { 
  Clock, 
  CheckCircle2, 
  Volume2, 
  Calendar 
} from 'lucide-react';

export const RoutineTimeline = () => {
  const { routines, language } = usePatient();

  const handleSpeakRoutine = (item) => {
    speechService.speak(`${item.title} at ${item.time}. ${item.description}`, language);
  };

  return (
    <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
      
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-2xl">
          🗓️
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">Senior Daily Schedule</h3>
          <p className="text-xs text-slate-500">Structured Circadian Routine for Cognitive Well-Being</p>
        </div>
      </div>

      <div className="space-y-4">
        {routines.map((item, idx) => (
          <div
            key={item.id}
            className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-300 transition-colors"
          >
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-2xl shrink-0 shadow-2xs">
              {item.icon}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900">
                  {item.time}
                </span>
                <button
                  onClick={() => handleSpeakRoutine(item)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white transition-colors cursor-pointer"
                  title="Read aloud"
                >
                  <Volume2 size={16} />
                </button>
              </div>

              <h4 className="font-bold text-slate-900 text-sm sm:text-base mt-1">
                {item.title}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
