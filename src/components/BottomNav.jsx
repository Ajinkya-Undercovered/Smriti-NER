import React from 'react';
import { Home, Gamepad2, Pill, Wind, HeartPulse } from 'lucide-react';

export const BottomNav = ({ activeTab, setActiveTab }) => {
  const items = [
    { id: 'home', label: 'Home (ঘৰ)', icon: Home, color: 'text-rose-600' },
    { id: 'games', label: 'Games (খেল)', icon: Gamepad2, color: 'text-emerald-600' },
    { id: 'reminders', label: 'Meds (ঔষধ)', icon: Pill, color: 'text-sky-600' },
    { id: 'calm', label: 'Calm (শান্তি)', icon: Wind, color: 'text-purple-600' },
    { id: 'clinical', label: 'Clinical', icon: HeartPulse, color: 'text-amber-600' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t-2 border-rose-200 shadow-lg">
      <div className="max-w-5xl mx-auto flex items-center justify-around py-2 px-2 sm:py-3">
        {items.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-2xl transition-all cursor-pointer ${
                isActive
                  ? 'bg-rose-50 text-rose-900 font-black border border-rose-300 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon size={20} className={isActive ? item.color : 'text-slate-400'} />
              <span className="text-[10px] leading-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
