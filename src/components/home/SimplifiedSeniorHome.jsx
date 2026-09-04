import React, { useEffect } from 'react';
import { usePatient } from '../../context/PatientContext.jsx';
import { speechService } from '../../i18n/speechService.js';
import { soundFx } from '../../utils/audio.js';
import { 
  Gamepad2, 
  Pill, 
  Mic, 
  Wind, 
  Stethoscope, 
  Volume2, 
  Calendar, 
  Sparkles, 
  Heart, 
  Droplet,
  BellRing,
  BarChart3,
  ListTodo
} from 'lucide-react';

export const SimplifiedSeniorHome = ({ onNavigate, onOpenVoice }) => {
  const { patient, medications, waterCount } = usePatient();

  const todayDateStr = new Date().toLocaleDateString(undefined, { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const pendingMedsCount = medications.filter(m => !m.taken).length;

  useEffect(() => {
    const timer = setTimeout(() => {
      speechService.speakBilingual(
        `নমস্কাৰ ${patient.name}! আজি আপুনি কি কৰিব বিচাৰে? খেল খেলক বা ঔষধ চাওক।`,
        `Hello ${patient.name}! What would you like to do today? Play games or check medicines.`
      );
    }, 500);
    return () => clearTimeout(timer);
  }, [patient.name]);

  const handleTileClick = (viewId, nameAs, nameEn) => {
    soundFx.playCardFlip();
    speechService.speakBilingual(nameAs, nameEn);
    onNavigate(viewId);
  };

  const handleReadOrientation = () => {
    soundFx.playSingingBowl();
    speechService.speakBilingual(
      `আজি ${todayDateStr}। আপুনি ${patient.location}ত শান্তিৰে আছে।`,
      `Today is ${todayDateStr}. You are peacefully at home in ${patient.location}.`
    );
  };

  const TILES = [
    {
      id: 'games',
      nameAs: 'মনোৰঞ্জন আৰু স্মৃতি খেল (৮ টা খেল)',
      nameEn: 'Play Memory & Joy Games (8 Games)',
      descAs: 'স্মৃতিশক্তি আৰু আনন্দৰ বাবে চিনেমাৰ দৰে সুন্দৰ খেল খেলক',
      descEn: 'Cultural card matching, shadow recognition, and flower sorting',
      icon: Gamepad2,
      colorBg: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white',
      badge: '8 Dementia Games Active',
      ringColor: 'ring-emerald-200 hover:ring-8'
    },
    {
      id: 'reminders',
      nameAs: 'মোৰ ঔষধ আৰু পানীৰ সোঁৱৰণী',
      nameEn: 'My Medicines & Water Intake',
      descAs: `${pendingMedsCount > 0 ? `${pendingMedsCount} টা ঔষধ খাবলৈ বাকী আছে` : 'সকলো ঔষধ খোৱা হ’ল'} • ${waterCount}/8 গিলাচ পানী`,
      descEn: `${pendingMedsCount} doses remaining • ${waterCount}/8 glasses of fresh water`,
      icon: Pill,
      colorBg: 'bg-gradient-to-br from-sky-500 to-blue-600 text-white',
      badge: `${pendingMedsCount} Meds Pending`,
      ringColor: 'ring-sky-200 hover:ring-8'
    },
    {
      id: 'voice',
      nameAs: 'AI কণ্ঠ সহায়ক (Voice Companion)',
      nameEn: 'Talk to AI Voice Companion',
      descAs: 'মোক কওক, মই আপোনাক সহায় কৰিম (ঔষধ, সময় বা গীত)',
      descEn: 'Tap to speak hands-free in Assamese or English',
      icon: Mic,
      colorBg: 'bg-gradient-to-br from-rose-500 to-pink-600 text-white',
      badge: 'Neural Voice AI',
      ringColor: 'ring-rose-200 hover:ring-8',
      action: onOpenVoice
    },
    {
      id: 'calm',
      nameAs: 'সোণালী স্মৃতি আৰু শান্ত সংগীত',
      nameEn: 'Calm Sounds & Reminiscence Stories',
      descAs: 'ব্ৰহ্মপুত্ৰৰ নদী, চেৰাপুঞ্জীৰ বৰষুণ আৰু পাহাৰীয়া বাঁহীৰ সুৰ',
      descEn: 'Gentle river waves, rain sounds, folklore, and breathing therapy',
      icon: Wind,
      colorBg: 'bg-gradient-to-br from-purple-600 to-indigo-700 text-white',
      badge: 'Relaxation & Calm',
      ringColor: 'ring-purple-200 hover:ring-8'
    },
    {
      id: 'doctor',
      nameAs: 'চিকিৎসক আৰু আশা (ASHA) সাহায্য',
      nameEn: 'Doctor, ASHA Worker & Emergency 108',
      descAs: 'ডাঃ ভূপেন শৰ্মা আৰু আশা বাইদেউৰ সৈতে পোনপটীয়া যোগাযোগ',
      descEn: 'View upcoming neurological appointments and emergency contacts',
      icon: Stethoscope,
      colorBg: 'bg-gradient-to-br from-amber-500 to-orange-600 text-white',
      badge: 'Health Network',
      ringColor: 'ring-amber-200 hover:ring-8'
    },
    {
      id: 'progress',
      nameAs: 'মোৰ অগ্ৰগতি',
      nameEn: 'My Progress',
      descAs: 'খেল আৰু দৈনন্দিন কাৰ্যকলাপৰ অগ্ৰগতি চাওক',
      descEn: 'Review cognitive performance and activity progress',
      icon: BarChart3,
      colorBg: 'bg-gradient-to-br from-teal-600 to-cyan-700 text-white',
      badge: 'Activity Progress',
      ringColor: 'ring-teal-200 hover:ring-8'
    },
    {
      id: 'todo',
      nameAs: 'আজিৰ কামসমূহ',
      nameEn: "Today's To-Do",
      descAs: 'আজিৰ কাম যোগ কৰক আৰু সম্পূৰ্ণ হোৱা চিহ্নিত কৰক',
      descEn: 'Add, complete, edit, and remove daily tasks',
      icon: ListTodo,
      colorBg: 'bg-gradient-to-br from-slate-600 to-slate-700 text-white',
      badge: 'Daily Tasks',
      ringColor: 'ring-slate-200 hover:ring-8'
    }
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-5xl mx-auto">
      
      {/* Friendly Senior Greeting Card */}
      <div className="bg-white border-3 border-rose-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 sm:gap-5">
          <span className="text-5xl sm:text-6xl p-3 bg-rose-50 rounded-3xl border-2 border-rose-200 shadow-2xs">
            👴
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-rose-700 bg-rose-50 px-3 py-0.5 rounded-full border border-rose-200">
                নমস্কাৰ (Welcome)
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mt-1">
              {patient.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              {patient.regionalName} • {patient.location}
            </p>
          </div>
        </div>

        {/* Date & Audio Reading Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="text-left sm:text-right">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Today's Date</span>
            <p className="text-sm sm:text-base font-black text-slate-800">{todayDateStr}</p>
          </div>
          <button
            onClick={handleReadOrientation}
            className="px-4 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer transition-transform active:scale-95"
            title="Listen date and location"
          >
            <Volume2 size={18} />
            <span>Read Date & Place (শুনক)</span>
          </button>
        </div>
      </div>

      {/* Main Action Hub - 5 Giant Senior Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {TILES.map((tile, idx) => (
          <div
            key={tile.id}
            onClick={() => {
              if (tile.action) {
                tile.action();
              } else {
                handleTileClick(tile.id, tile.nameAs, tile.nameEn);
              }
            }}
            className={`p-6 sm:p-7 rounded-3xl cursor-pointer shadow-md transition-all duration-300 transform active:scale-95 flex flex-col justify-between min-h-[220px] ring-4 ${tile.colorBg} ${tile.ringColor} ${
              idx === 0 ? 'md:col-span-2 lg:col-span-2' : ''
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-5xl sm:text-6xl text-teal-700"><tile.icon aria-hidden="true" strokeWidth={1.8} /></span>
                <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white">
                  {tile.badge}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black leading-tight mb-1 text-white">
                {tile.nameAs}
              </h3>
              <h4 className="text-xs sm:text-sm font-bold text-white/90 mb-2">{tile.nameEn}</h4>
            </div>

            <div className="pt-3 border-t border-white/20 flex items-center justify-between text-xs font-semibold text-white/95">
              <span className="line-clamp-1">{tile.descAs}</span>
              <span className="text-lg font-black ml-2">➔</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
