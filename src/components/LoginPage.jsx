import React, { useEffect, useState } from 'react';
import { ArrowRight, CheckSquare, HeartHandshake, LockKeyhole, Mail, ShieldCheck, Square, Stethoscope, UserRound, Sparkles } from 'lucide-react';
import { usePatient } from '../context/PatientContext.jsx';
import { speechService } from '../i18n/speechService.js';
import { DEFAULT_AUTH_USERS } from '../storage/initialData.js';
import './LoginPage.css';

const ACCOUNT_KEY = 'smriti_ner_local_accounts';

const ROLES = [
  { id: 'patient', label: 'Senior Patient', assamese: 'জ্যেষ্ঠ নাগৰিক', icon: UserRound },
  { id: 'caregiver', label: 'Caregiver', assamese: 'পৰিচৰ্যাকাৰী', icon: HeartHandshake },
  { id: 'asha_worker', label: 'ASHA Officer', assamese: 'আশা কৰ্মী', icon: Stethoscope }
];

const getAccounts = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(ACCOUNT_KEY) || '[]');
    const defaults = DEFAULT_AUTH_USERS.map(user => ({ 
      ...user, 
      email: `${user.id}@gmail.com`, 
      password: user.passcode 
    }));
    return [...defaults, ...(Array.isArray(stored) ? stored : [])];
  } catch {
    return DEFAULT_AUTH_USERS.map(user => ({ 
      ...user, 
      email: `${user.id}@gmail.com`, 
      password: user.passcode 
    }));
  }
};

const toAppUser = account => ({
  ...account,
  name: account.name || 'User',
  regionalName: account.regionalName || account.name || 'ব্যৱহাৰকাৰী',
  patientId: account.patientId || account.id || 'patient-ner-001',
  condition: account.condition || 'Active Account',
  location: account.location || 'Tezpur, Assam'
});

export const LoginPage = ({ onLoginSuccess, onTryDemo }) => {
  const { t } = usePatient();
  const [mode, setMode] = useState('login'); // 'login' or 'create'
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '', 
    role: 'patient', 
    linkedName: '', 
    location: 'Tezpur, Assam', 
    cognitiveStatus: '', 
    phc: '', 
    district: 'Sonitpur' 
  });
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [showDemoRoles, setShowDemoRoles] = useState(false);
  const [demoName, setDemoName] = useState('');

  useEffect(() => { 
    speechService.speakBilingual(
      'স্মৃতি-NER লৈ স্বাগতম। আপোনাৰ নাম আৰু ভূমিকা বাছি লগ ইন কৰক।', 
      'Welcome to Smriti-NER. Enter your name and role to log in.'
    ); 
  }, []);

  const updateField = (field, value) => setForm(previous => ({ ...previous, [field]: value }));
  const selectedRole = ROLES.find(role => role.id === form.role) || ROLES[0];

  const handleSubmit = event => {
    event.preventDefault();
    setErrorMsg('');
    setStatusMsg('');

    const enteredName = form.name.trim();
    const enteredEmail = form.email.trim().toLowerCase();
    const enteredPassword = form.password.trim();

    if (!enteredName && !enteredEmail) {
      return setErrorMsg('Please enter your name or email to continue.');
    }

    const effectiveName = enteredName || (enteredEmail ? enteredEmail.split('@')[0] : 'User');
    const effectiveRole = form.role || 'patient';

    if (mode === 'create') {
      if (!enteredName) return setErrorMsg('Please enter your full name.');
      if (enteredPassword && form.confirmPassword && enteredPassword !== form.confirmPassword) {
        return setErrorMsg('Passwords do not match.');
      }
      
      const newAccount = {
        id: `local-${Date.now()}`,
        name: effectiveName,
        regionalName: effectiveName,
        email: enteredEmail || `${effectiveName.toLowerCase().replace(/\s+/g, '')}@smriti.in`,
        password: enteredPassword || '1234',
        passcode: enteredPassword || '1234',
        role: effectiveRole,
        patientId: `patient-${Date.now()}`,
        linkedName: form.linkedName.trim() || (effectiveRole === 'caregiver' ? 'Monitored Senior' : 'Caregiver'),
        location: form.location.trim() || 'Tezpur, Assam',
        cognitiveStatus: form.cognitiveStatus.trim() || 'MCI Stage 1',
        phc: form.phc.trim() || 'Tezpur UPHC',
        district: form.district.trim() || 'Sonitpur',
        avatar: effectiveRole === 'caregiver' ? '👩‍⚕️' : effectiveRole === 'asha_worker' ? '🩺' : '👴',
        condition: form.cognitiveStatus.trim() || 'Mild Cognitive Impairment (MCI)'
      };

      const stored = JSON.parse(localStorage.getItem(ACCOUNT_KEY) || '[]');
      localStorage.setItem(ACCOUNT_KEY, JSON.stringify([...stored, newAccount]));
      onLoginSuccess(toAppUser(newAccount), rememberMe);
      return;
    }

    // In 'login' mode:
    // First, check if there is an existing account with matching email/name
    const existing = getAccounts().find(item => 
      (enteredEmail && item.email && item.email.toLowerCase() === enteredEmail) ||
      (enteredName && item.name && item.name.toLowerCase() === enteredName.toLowerCase())
    );

    if (existing) {
      const loggedUser = {
        ...existing,
        name: enteredName || existing.name,
        role: form.role || existing.role
      };
      onLoginSuccess(toAppUser(loggedUser), rememberMe);
      return;
    }

    // Direct Quick Login with whatever Name and Role the user typed!
    const quickUser = {
      id: `user-${Date.now()}`,
      name: effectiveName,
      regionalName: effectiveName,
      email: enteredEmail || `${effectiveName.toLowerCase().replace(/\s+/g, '')}@smriti.in`,
      password: enteredPassword || '1234',
      passcode: enteredPassword || '1234',
      role: effectiveRole,
      patientId: `patient-${Date.now()}`,
      linkedName: form.linkedName.trim() || (effectiveRole === 'caregiver' ? 'Monitored Senior' : 'Caregiver'),
      location: form.location.trim() || 'Tezpur, Assam',
      avatar: effectiveRole === 'caregiver' ? '👩‍⚕️' : effectiveRole === 'asha_worker' ? '🩺' : '👴',
      condition: 'Active Account'
    };

    const stored = JSON.parse(localStorage.getItem(ACCOUNT_KEY) || '[]');
    localStorage.setItem(ACCOUNT_KEY, JSON.stringify([...stored, quickUser]));
    onLoginSuccess(toAppUser(quickUser), rememberMe);
  };

  const handleOpenDemo = () => {
    setDemoName(form.name.trim());
    setShowDemoRoles(true);
  };

  return (
    <main className="min-h-screen bg-linear-to-b from-[#fef2f2] via-[#fff1f2] to-[#ffe4e6] flex items-center justify-center p-4 md:p-8">
      <section className="max-w-xl w-full bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-10 shadow-2xl border-3 border-rose-200 animate-fade-in">
        
        {/* Header Branding */}
        <header className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-linear-to-tr from-rose-500 to-amber-500 text-white mb-1 animate-breathe">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t.appTitle || 'Smriti-NER (স্মৃতি)'}
          </h1>
          <p className="text-sm text-slate-600 font-medium">
            North Eastern AI Cognitive & Dementia Care Platform
          </p>
        </header>

        {/* Tab Toggle: Log In / Create Account */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl mb-5">
          {['login', 'create'].map(tab => (
            <button 
              key={tab} 
              type="button" 
              onClick={() => { setMode(tab); setErrorMsg(''); setStatusMsg(''); }} 
              className={`py-3 rounded-xl text-sm font-black cursor-pointer transition-all ${
                mode === tab ? 'bg-white text-rose-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab === 'login' ? 'Instant Log In' : 'Create Full Account'}
            </button>
          ))}
        </div>

        {statusMsg ? (
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-5 text-center text-emerald-900 font-bold">
            {statusMsg}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name Input (Appears in both tabs!) */}
            <Field 
              icon={<UserRound size={18} className="text-rose-600" />} 
              label="Your Full Name (আপোনাৰ নাম)" 
              value={form.name} 
              onChange={value => updateField('name', value)} 
              placeholder="e.g. Ajinkya / Bipin / Ananya" 
              required={true}
            />

            {/* Choose Role (Always visible so the user picks their role immediately!) */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Choose Your Role (ভূমিকা বাছক)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {ROLES.map(role => {
                  const RoleIcon = role.icon;
                  const isSelected = form.role === role.id;
                  return (
                    <button
                      type="button"
                      key={role.id}
                      onClick={() => updateField('role', role.id)}
                      className={`p-3 rounded-2xl border-2 text-xs font-black cursor-pointer transition-all flex flex-col items-center justify-center ${
                        isSelected 
                          ? 'border-rose-500 bg-rose-50 text-rose-900 shadow-xs ring-2 ring-rose-200' 
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <RoleIcon size={24} className={isSelected ? 'text-rose-600' : 'text-slate-400'} />
                      <span className="mt-1 block font-extrabold">{role.label}</span>
                      <span className="block text-[10px] font-normal text-slate-400">{role.assamese}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional Password or PIN */}
            <Field 
              icon={<LockKeyhole size={18} className="text-slate-400" />} 
              label={mode === 'create' ? "Password / PIN (গোপন সংকেত)" : "Passcode / PIN (Optional, default: 1234)"} 
              type="password" 
              value={form.password} 
              onChange={value => updateField('password', value)} 
              placeholder="e.g. 1234" 
              required={false}
            />

            {/* Extra fields only when creating full account */}
            {mode === 'create' && (
              <>
                <Field 
                  icon={<Mail size={18} />} 
                  label="Email Address (ঐচ্ছিক)" 
                  type="email" 
                  value={form.email} 
                  onChange={value => updateField('email', value)} 
                  placeholder="name@gmail.com" 
                  required={false}
                />
                
                <Field 
                  label={form.role === 'caregiver' ? 'Monitored Senior Name' : 'Linked Caregiver / Contact'} 
                  value={form.linkedName} 
                  onChange={value => updateField('linkedName', value)} 
                  placeholder="Full name of senior / caregiver" 
                />

                <Field 
                  label="Village or City (ঠাই / জিলা)" 
                  value={form.location} 
                  onChange={value => updateField('location', value)} 
                  placeholder="Tezpur, Assam" 
                />
              </>
            )}

            {errorMsg && (
              <p role="alert" className="text-sm font-bold text-rose-700 bg-rose-50 p-3 rounded-xl border border-rose-200 text-center">
                {errorMsg}
              </p>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              className="w-full py-4 rounded-2xl bg-linear-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-black text-lg shadow-lg flex items-center justify-center gap-2.5 cursor-pointer transition-transform active:scale-98"
            >
              <span>{mode === 'login' ? `Log In as ${selectedRole.label}` : `Create ${selectedRole.label} Account`}</span>
              <ArrowRight size={22} />
            </button>
          </form>
        )}

        {/* Remember Session Option */}
        <label 
          onClick={() => setRememberMe(value => !value)} 
          className="mt-4 flex items-center gap-2 cursor-pointer font-medium text-xs text-slate-600 select-none"
        >
          {rememberMe ? <CheckSquare size={18} className="text-rose-600" /> : <Square size={18} className="text-slate-400" />}
          Remember session on this laptop
        </label>

        {/* Try Demo Button */}
        <button 
          type="button" 
          onClick={handleOpenDemo} 
          className="w-full mt-3 py-3 rounded-2xl border-2 border-rose-200 bg-rose-50/80 hover:bg-rose-100 text-rose-800 font-black cursor-pointer transition-all flex items-center justify-center gap-2"
        >
          <Sparkles size={16} />
          <span>Quick Demo Roles (Try Without Account)</span>
        </button>
      </section>

      {/* Demo Roles Selection Modal */}
      {showDemoRoles && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <section className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-rose-200 animate-fade-in">
            <div className="flex justify-between items-start mb-5">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Choose Demo Role</h2>
                <p className="text-xs text-slate-500 mt-0.5">Explore with your name or demo data.</p>
              </div>
              <button 
                type="button" 
                onClick={() => setShowDemoRoles(false)} 
                aria-label="Back to login" 
                className="text-2xl font-black text-slate-400 hover:text-slate-700 cursor-pointer p-1"
              >
                ×
              </button>
            </div>

            {/* Custom Name for Demo */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Your Name for Demo:
              </label>
              <input 
                type="text" 
                value={demoName} 
                onChange={e => setDemoName(e.target.value)} 
                placeholder="Enter your name (e.g. Ajinkya)"
                className="w-full p-3 border border-slate-300 rounded-xl text-sm font-bold text-slate-800 outline-rose-500"
              />
            </div>

            <div className="space-y-3">
              {ROLES.map(role => {
                const RoleIcon = role.icon;
                const finalDisplayName = demoName.trim() || (
                  role.id === 'caregiver' ? 'Ananya Hazarika' : role.id === 'asha_worker' ? 'Pratima Das' : 'Bipin Chandra Hazarika'
                );
                return (
                  <button
                    type="button"
                    key={role.id}
                    onClick={() => {
                      setShowDemoRoles(false);
                      onTryDemo(role.id, demoName.trim());
                    }}
                    className="w-full flex items-center gap-4 text-left p-4 rounded-2xl border-2 border-slate-200 hover:border-rose-400 hover:bg-rose-50/50 transition-all cursor-pointer"
                  >
                    <div className="p-2.5 bg-rose-50 rounded-xl text-rose-600">
                      <RoleIcon size={26} />
                    </div>
                    <div className="flex-1">
                      <strong className="block text-sm font-black text-slate-900">
                        {role.label}: {finalDisplayName}
                      </strong>
                      <span className="block text-xs text-slate-500">
                        Launch {role.label.toLowerCase()} dashboard.
                      </span>
                    </div>
                    <ArrowRight size={18} className="text-slate-400" />
                  </button>
                );
              })}
            </div>

            <button 
              type="button" 
              onClick={() => setShowDemoRoles(false)} 
              className="w-full mt-5 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 cursor-pointer text-xs"
            >
              Back to Login
            </button>
          </section>
        </div>
      )}
    </main>
  );
};

const Field = ({ icon, label, type = 'text', value, onChange, placeholder, required = false }) => (
  <label className="block">
    <span className="text-sm font-bold text-slate-700">{label}</span>
    <span className="mt-1 flex items-center gap-3 border border-slate-300 rounded-xl px-3 bg-white focus-within:ring-2 focus-within:ring-rose-400 focus-within:border-rose-400">
      {icon}
      <input 
        required={required} 
        type={type} 
        value={value} 
        onChange={event => onChange(event.target.value)} 
        className="w-full py-3 outline-none font-medium text-slate-900" 
        placeholder={placeholder} 
      />
    </span>
  </label>
);
