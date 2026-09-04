import React, { useState, useEffect } from 'react';
import './LoginPage.css';
import { usePatient } from '../context/PatientContext.jsx';
import { soundFx } from '../utils/audio.js';
import { speechService } from '../i18n/speechService.js';
import { DEFAULT_AUTH_USERS } from '../storage/initialData.js';
import { supabaseService } from '../storage/supabaseService.js';
import { isSupabaseConfigured } from '../storage/supabaseClient.js';
import { 
  Lock, 
  UserCheck, 
  Volume2, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  KeyRound, 
  CheckSquare, 
  Square, 
  HeartHandshake,
  Users,
  Stethoscope,
  Database,
  CheckCircle2
} from 'lucide-react';

export const LoginPage = ({ onLoginSuccess }) => {
  const { language, t } = usePatient();
  const [users, setUsers] = useState(DEFAULT_AUTH_USERS);
  const [activeRoleTab, setActiveRoleTab] = useState('patient'); // 'patient', 'caregiver', 'asha_worker'
  const [pin, setPin] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isCloudConnected, setIsCloudConnected] = useState(isSupabaseConfigured);

  useEffect(() => {
    async function loadUsers() {
      const availableUsers = await supabaseService.getUsers();
      if (availableUsers && availableUsers.length > 0) {
        setUsers(availableUsers);
        setIsCloudConnected(true);
      }
    }
    loadUsers();

    setTimeout(() => {
      speechService.speakBilingual(
        'স্মৃতি-NER লৈ স্বাগতম। আপোনাৰ প্ৰফাইল নিৰ্বাচন কৰক।',
        'Welcome to Smriti-NER. Please select your role to log in.'
      );
    }, 400);
  }, []);

  const currentUserForRole = users.find(u => u.role === activeRoleTab) || users[0];

  const handleRoleTabChange = (role) => {
    setActiveRoleTab(role);
    setPin('');
    setErrorMsg('');
    soundFx.playCardFlip();

    const u = users.find(user => user.role === role);
    if (u) {
      if (role === 'patient') {
        speechService.speakBilingual('জ্যেষ্ঠ নাগৰিক বিপিন হাজৰিকাৰ একাউণ্ট', 'Patient portal selected');
      } else if (role === 'caregiver') {
        speechService.speakBilingual('পৰিয়ালৰ অভিভাৱক অনন্যা হাজৰিকাৰ একাউণ্ট', 'Caregiver portal selected');
      } else {
        speechService.speakBilingual('আশা কৰ্মী প্ৰতিমা দাসৰ স্বাস্থ্য পৰ্টেল', 'ASHA health worker portal selected');
      }
    }
  };

  const handleQuickLogin = (user) => {
    soundFx.playSingingBowl();
    soundFx.playMatchSound();
    onLoginSuccess(user, rememberMe);
  };

  const handlePinSubmit = (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (String(pin).trim() === String(currentUserForRole.passcode)) {
      handleQuickLogin(currentUserForRole);
    } else {
      setErrorMsg(`Incorrect Passcode. For demo: Patient is 1234, Caregiver is 4321, ASHA is 0000.`);
      soundFx.playCardFlip();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fef2f2] via-[#fff1f2] to-[#ffe4e6] flex flex-col items-center justify-center p-4 md:p-8">
      
      {/* Container Box */}
      <div className="max-w-xl w-full bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-10 shadow-2xl border-3 border-rose-200 animate-fade-in space-y-6">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-tr from-rose-500 to-amber-500 text-3xl shadow-md text-white font-bold mb-1 animate-breathe">
            🌿
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t.appTitle || 'Smriti-NER (স্মৃতি)'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-sm mx-auto">
            North Eastern AI Cognitive & Dementia Care Platform
          </p>

          {/* Cloud Database Connected Status Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border border-slate-200 bg-slate-50 text-slate-700">
            <Database size={13} className={isCloudConnected ? "text-emerald-600" : "text-amber-500"} />
            <span>{isCloudConnected ? "Supabase Cloud Database Connected (public.users)" : "Local Storage Active"}</span>
          </div>
        </div>

        {/* 3 Dedicated Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-2 p-1.5 bg-rose-50/80 rounded-2xl border border-rose-200">
          <button
            onClick={() => handleRoleTabChange('patient')}
            className={`py-3 px-2 rounded-xl text-xs font-black transition-all flex flex-col items-center gap-1 cursor-pointer ${
              activeRoleTab === 'patient'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-rose-100'
            }`}
          >
            <span className="text-2xl">👴</span>
            <span>Senior Patient</span>
            <span className="text-[9px] opacity-80 font-normal">বিপিন হাজৰিকা</span>
          </button>

          <button
            onClick={() => handleRoleTabChange('caregiver')}
            className={`py-3 px-2 rounded-xl text-xs font-black transition-all flex flex-col items-center gap-1 cursor-pointer ${
              activeRoleTab === 'caregiver'
                ? 'bg-teal-700 text-white shadow-md'
                : 'text-slate-600 hover:bg-teal-50'
            }`}
          >
            <span className="text-2xl">👩‍⚕️</span>
            <span>Caregiver</span>
            <span className="text-[9px] opacity-80 font-normal">অনন্যা হাজৰিকা</span>
          </button>

          <button
            onClick={() => handleRoleTabChange('asha_worker')}
            className={`py-3 px-2 rounded-xl text-xs font-black transition-all flex flex-col items-center gap-1 cursor-pointer ${
              activeRoleTab === 'asha_worker'
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-orange-50'
            }`}
          >
            <span className="text-2xl">🩺</span>
            <span>ASHA Officer</span>
            <span className="text-[9px] opacity-80 font-normal">প্ৰতিমা দাস</span>
          </button>
        </div>

        {/* Role Content Display */}
        {activeRoleTab === 'patient' && (
          /* 1. Senior Patient 1-Tap Fast-Pass */
          <div className="bg-rose-50/80 border-2 border-rose-200 rounded-3xl p-6 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                <Sparkles size={14} className="text-rose-600" />
                <span>Zero-Friction Senior Access</span>
              </span>
              <span className="text-[10px] font-bold text-rose-700 bg-rose-200 px-2 py-0.5 rounded-full">
                1-Tap Entry
              </span>
            </div>

            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-rose-200 shadow-xs">
              <span className="text-5xl p-2 bg-rose-50 rounded-2xl border border-rose-100">👴</span>
              <div className="flex-1">
                <h3 className="font-black text-slate-900 text-xl leading-tight">
                  {currentUserForRole.name}
                </h3>
                <p className="text-xs text-rose-800 font-bold">
                  {currentUserForRole.regionalName}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {currentUserForRole.location} • Mild Cognitive Impairment
                </p>
              </div>
            </div>

            <button
              onClick={() => handleQuickLogin(currentUserForRole)}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 text-white font-black text-lg shadow-lg flex items-center justify-center gap-2.5 transition-transform active:scale-98 cursor-pointer ring-4 ring-rose-200"
            >
              <span>প্ৰৱেশ কৰক (Enter as Bipin)</span>
              <ArrowRight size={22} />
            </button>
          </div>
        )}

        {activeRoleTab === 'caregiver' && (
          /* 2. Family Caregiver Login */
          <div className="bg-teal-50/80 border-2 border-teal-200 rounded-3xl p-6 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                <HeartHandshake size={14} className="text-teal-600" />
                <span>Caregiver Dashboard Access</span>
              </span>
              <span className="text-[10px] font-bold text-teal-700 bg-teal-200 px-2 py-0.5 rounded-full">
                Ananya Hazarika
              </span>
            </div>

            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-teal-200 shadow-xs">
              <span className="text-5xl p-2 bg-teal-50 rounded-2xl border border-teal-100">👩‍⚕️</span>
              <div className="flex-1">
                <h3 className="font-black text-slate-900 text-xl leading-tight">Ananya Hazarika</h3>
                <p className="text-xs text-teal-800 font-bold">অনন্যা হাজৰিকা (পৰিয়ালৰ অভিভাৱক)</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Guwahati, Assam • Patient: Bipin C. Hazarika</p>
              </div>
            </div>

            <form onSubmit={handlePinSubmit} className="space-y-3 pt-1">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Enter Passcode (PIN):</span>
                <span className="text-slate-400 font-mono">Demo PIN: 4321</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="password"
                  maxLength={6}
                  placeholder="PIN: 4321"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="flex-1 p-3 rounded-xl border border-slate-300 font-bold text-center tracking-widest text-lg bg-white focus:ring-2 focus:ring-teal-400"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs cursor-pointer shadow-xs"
                >
                  Sign In
                </button>
              </div>
            </form>

            <button
              onClick={() => handleQuickLogin(currentUserForRole)}
              className="w-full py-2.5 rounded-xl bg-teal-100 hover:bg-teal-200 text-teal-900 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>1-Tap Fast Pass (অনন্যা হিচাপে প্ৰৱেশ)</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}

        {activeRoleTab === 'asha_worker' && (
          /* 3. ASHA Health Officer Login */
          <div className="bg-orange-50/80 border-2 border-orange-200 rounded-3xl p-6 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-orange-900 flex items-center gap-1.5">
                <Stethoscope size={14} className="text-orange-600" />
                <span>Primary Health Centre Field Portal</span>
              </span>
              <span className="text-[10px] font-bold text-orange-800 bg-orange-200 px-2 py-0.5 rounded-full">
                Pratima Das
              </span>
            </div>

            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-orange-200 shadow-xs">
              <span className="text-5xl p-2 bg-orange-50 rounded-2xl border border-orange-100">🩺</span>
              <div className="flex-1">
                <h3 className="font-black text-slate-900 text-xl leading-tight">Pratima Das</h3>
                <p className="text-xs text-orange-800 font-bold">প্ৰতিমা দাস (আশা স্বাস্থ্য কৰ্মী)</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Tezpur UPHC, Sonitpur District • Health Officer</p>
              </div>
            </div>

            <form onSubmit={handlePinSubmit} className="space-y-3 pt-1">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Enter ASHA Access PIN:</span>
                <span className="text-slate-400 font-mono">Demo PIN: 0000</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="password"
                  maxLength={6}
                  placeholder="PIN: 0000"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="flex-1 p-3 rounded-xl border border-slate-300 font-bold text-center tracking-widest text-lg bg-white focus:ring-2 focus:ring-orange-400"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                >
                  Verify
                </button>
              </div>
            </form>

            <button
              onClick={() => handleQuickLogin(currentUserForRole)}
              className="w-full py-2.5 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>1-Tap Fast Pass (প্ৰতিমা দাসৰ পৰ্টেল)</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}

        {errorMsg && (
          <p className="text-xs font-bold text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200 text-center animate-shake">
            {errorMsg}
          </p>
        )}

        {/* Remember Credentials Toggle */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <label 
            onClick={() => setRememberMe(!rememberMe)}
            className="flex items-center gap-2 cursor-pointer font-medium select-none"
          >
            {rememberMe ? (
              <CheckSquare size={18} className="text-rose-600" />
            ) : (
              <Square size={18} className="text-slate-400" />
            )}
            <span>Remember session on this device</span>
          </label>

          <span className="text-[11px] text-slate-400">PostgreSQL RLS Protected</span>
        </div>

      </div>

      {/* Footer */}
      <div className="text-center mt-6 text-[11px] text-slate-500 space-y-1">
        <p>Smriti-NER • Integrated Dementia Care for Patients, Caregivers & ASHA Workers</p>
        <p className="text-[10px] text-slate-400">Tezpur • Guwahati • Imphal • Shillong • Aizawl • Kohima • Agartala • Gangtok</p>
      </div>

    </div>
  );
};
