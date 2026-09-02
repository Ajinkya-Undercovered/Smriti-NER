import React from 'react';
import { usePatient } from '../../context/PatientContext.jsx';
import { speechService } from '../../i18n/speechService.js';
import { 
  Gamepad2, 
  Sparkles, 
  Clock, 
  Pill, 
  Droplet, 
  HeartHandshake, 
  Volume2, 
  Users, 
  ChevronRight,
  Sun,
  ShieldAlert
} from 'lucide-react';

export const HomeView = ({ onNavigate }) => {
  const { patient, t, language, medications, waterCount, setIsVoiceOpen } = usePatient();

  const pendingMeds = medications.filter(m => !m.taken).length;

  const handleSpeakWelcome = () => {
    const greeting = `${t.greetingMorning} Welcome to ${t.appTitle}. ${t.listenPrompt}`;
    speechService.speak(greeting, language);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Warm Elderly Greeting Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-amber-100 text-xs font-bold mb-3">
              <Sun size={14} className="text-amber-300" />
              <span>North East India Cognitive Wellness</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black mb-2 tracking-tight">
              {t.greetingMorning} {patient.regionalName || patient.name}
            </h2>
            <p className="text-amber-100/90 text-sm sm:text-base leading-relaxed">
              {t.appSubtitle}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleSpeakWelcome}
              className="px-4 py-3 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Volume2 size={18} className="text-amber-200" />
              <span>Listen Greeting</span>
            </button>

            <button
              onClick={() => setIsVoiceOpen(true)}
              className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-md transition-transform active:scale-95 cursor-pointer"
            >
              <span>{t.voiceAssistant}</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Tiles for Seniors (Huge, Easy Touch Targets) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* 1. Play Games Tile */}
        <button
          onClick={() => onNavigate('games')}
          className="bg-white border-2 border-emerald-200 hover:border-emerald-500 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between space-y-4 group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-4xl p-3 bg-emerald-50 rounded-2xl border border-emerald-200 group-hover:scale-110 transition-transform">
              🎮
            </span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
              5 Games
            </span>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-1">
              {t.playGames}
            </h3>
            <p className="text-xs text-slate-500 line-clamp-2">
              Cultural memory matching, tea leaf sorter, bamboo beats & routine sequencer
            </p>
          </div>
          <div className="text-xs font-bold text-emerald-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            <span>Play Now</span>
            <ChevronRight size={14} />
          </div>
        </button>

        {/* 2. Reminiscence & Calm Tile */}
        <button
          onClick={() => onNavigate('reminiscence')}
          className="bg-white border-2 border-purple-200 hover:border-purple-500 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between space-y-4 group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-4xl p-3 bg-purple-50 rounded-2xl border border-purple-200 group-hover:scale-110 transition-transform">
              🌸
            </span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-900 border border-purple-300">
              Relax & Calm
            </span>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-1">
              {t.reminiscence}
            </h3>
            <p className="text-xs text-slate-500 line-clamp-2">
              Brahmaputra river waves, Cherrapunji rain, bamboo flute & folklore stories
            </p>
          </div>
          <div className="text-xs font-bold text-purple-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            <span>Listen Audio</span>
            <ChevronRight size={14} />
          </div>
        </button>

        {/* 3. Medicine Schedule Tile */}
        <button
          onClick={() => onNavigate('reminders')}
          className="bg-white border-2 border-blue-200 hover:border-blue-500 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between space-y-4 group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-4xl p-3 bg-blue-50 rounded-2xl border border-blue-200 group-hover:scale-110 transition-transform">
              💊
            </span>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
              pendingMeds > 0 
                ? 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse' 
                : 'bg-emerald-100 text-emerald-900 border-emerald-300'
            }`}>
              {pendingMeds > 0 ? `${pendingMeds} Pending` : 'All Taken ✓'}
            </span>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-1">
              {t.takeMeds}
            </h3>
            <p className="text-xs text-slate-500 line-clamp-2">
              Visual blister pillbox with morning, afternoon & bedtime doses
            </p>
          </div>
          <div className="text-xs font-bold text-blue-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            <span>Check Schedule</span>
            <ChevronRight size={14} />
          </div>
        </button>

        {/* 4. Caregiver Dashboard Tile */}
        <button
          onClick={() => onNavigate('caregiver')}
          className="bg-white border-2 border-rose-200 hover:border-rose-500 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between space-y-4 group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-4xl p-3 bg-rose-50 rounded-2xl border border-rose-200 group-hover:scale-110 transition-transform">
              🩺
            </span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-100 text-rose-900 border border-rose-300">
              ASHA Sync
            </span>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-1">
              {t.caregiver}
            </h3>
            <p className="text-xs text-slate-500 line-clamp-2">
              Cognitive score radar, MMSE trends, and medical report generator
            </p>
          </div>
          <div className="text-xs font-bold text-rose-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            <span>View Clinical Hub</span>
            <ChevronRight size={14} />
          </div>
        </button>

      </div>

    </div>
  );
};
