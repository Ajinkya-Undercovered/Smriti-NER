import React from 'react';
import { usePatient } from '../../context/PatientContext.jsx';
import { 
  Home, 
  Gamepad2, 
  Sparkles, 
  Clock, 
  HeartHandshake
} from 'lucide-react';

export const Navigation = ({ activeTab, setActiveTab }) => {
  const { t } = usePatient();

  const navItems = [
    { id: 'home', label: t.home, icon: Home, color: 'text-amber-600', activeBg: 'bg-amber-100/90 text-amber-950 font-bold border-amber-300 shadow-xs' },
    { id: 'games', label: t.games, icon: Gamepad2, color: 'text-emerald-600', activeBg: 'bg-emerald-100/90 text-emerald-950 font-bold border-emerald-300 shadow-xs' },
    { id: 'reminiscence', label: t.reminiscence, icon: Sparkles, color: 'text-purple-600', activeBg: 'bg-purple-100/90 text-purple-950 font-bold border-purple-300 shadow-xs' },
    { id: 'reminders', label: t.reminders, icon: Clock, color: 'text-blue-600', activeBg: 'bg-blue-100/90 text-blue-950 font-bold border-blue-300 shadow-xs' },
    { id: 'caregiver', label: t.caregiver, icon: HeartHandshake, color: 'text-rose-600', activeBg: 'bg-rose-100/90 text-rose-950 font-bold border-rose-300 shadow-xs' }
  ];

  return (
    <nav className="bg-white border-b border-slate-200 shadow-xs sticky top-[61px] z-20 overflow-x-auto scrollbar-none">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 flex items-center justify-around sm:justify-start gap-1.5 sm:gap-3 py-2 min-w-max">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-3.5 sm:px-5 py-2 rounded-2xl text-xs sm:text-sm transition-all border cursor-pointer ${
                isActive 
                  ? item.activeBg 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-transparent'
              }`}
            >
              <Icon size={19} className={isActive ? 'scale-110' : item.color} />
              <span className="whitespace-nowrap">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
