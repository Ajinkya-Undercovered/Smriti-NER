import React, { useEffect, useState } from 'react';
import { ArrowRight, CheckSquare, HeartHandshake, LockKeyhole, Mail, ShieldCheck, Square, Stethoscope, UserRound } from 'lucide-react';
import { usePatient } from '../context/PatientContext.jsx';
import { soundFx } from '../utils/audio.js';
import { speechService } from '../i18n/speechService.js';
import { DEFAULT_AUTH_USERS } from '../storage/initialData.js';
import './LoginPage.css';

const ACCOUNT_KEY = 'smriti_ner_local_accounts';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ROLES = [
  { id: 'patient', label: 'Senior Patient', assamese: 'জ্যেষ্ঠ নাগৰিক', icon: UserRound },
  { id: 'caregiver', label: 'Caregiver', assamese: 'পৰিচৰ্যাকাৰী', icon: HeartHandshake },
  { id: 'asha_worker', label: 'ASHA Officer', assamese: 'আশা কৰ্মী', icon: Stethoscope }
];

const getAccounts = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(ACCOUNT_KEY) || '[]');
    const defaults = DEFAULT_AUTH_USERS.map(user => ({ ...user, email: `${user.id}@gmail.com`, password: user.passcode }));
    return [...defaults, ...(Array.isArray(stored) ? stored : [])];
  } catch {
    return DEFAULT_AUTH_USERS.map(user => ({ ...user, email: `${user.id}@gmail.com`, password: user.passcode }));
  }
};

const toAppUser = account => ({ ...account, regionalName: account.regionalName || account.name, patientId: account.patientId || account.id, condition: account.condition || 'Local account' });

export const LoginPage = ({ onLoginSuccess, onTryDemo }) => {
  const { t } = usePatient();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: '', linkedName: '', location: '', cognitiveStatus: '', phc: '', district: '' });
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [showDemoRoles, setShowDemoRoles] = useState(false);

  useEffect(() => { speechService.speakBilingual('স্মৃতি-NER লৈ স্বাগতম। ৰোগীৰ একাউণ্টেৰে লগ ইন কৰক।', 'Welcome to Smriti-NER. Log in or create your account.'); }, []);
  const updateField = (field, value) => setForm(previous => ({ ...previous, [field]: value }));
  const selectedRole = ROLES.find(role => role.id === form.role);

  const handleSubmit = event => {
    event.preventDefault();
    setErrorMsg('');
    setStatusMsg('');
    const email = form.email.trim().toLowerCase();
    if (!EMAIL_PATTERN.test(email)) return setErrorMsg('Please enter a valid email address.');
    if (form.password.length < 8) return setErrorMsg('Password must be at least 8 characters.');
    if (mode === 'create') {
      if (!form.name.trim()) return setErrorMsg('Please enter your full name.');
      if (form.password !== form.confirmPassword) return setErrorMsg('Passwords do not match.');
      if (!form.role) return setErrorMsg('Please select your role.');
      if ((form.role === 'patient' || form.role === 'caregiver') && (!form.linkedName.trim() || !form.location.trim())) return setErrorMsg('Please fill in the linked name and village or city.');
      if (form.role === 'asha_worker' && (!form.phc.trim() || !form.district.trim())) return setErrorMsg('Please enter your PHC and district.');
      if (getAccounts().some(account => account.email.toLowerCase() === email)) return setErrorMsg('This email is already registered. Please log in.');
      const account = { id: `local-${Date.now()}`, name: form.name.trim(), regionalName: form.name.trim(), email, password: form.password, passcode: form.password, role: form.role, patientId: `local-patient-${Date.now()}`, linkedName: form.linkedName.trim(), location: form.location.trim(), cognitiveStatus: form.cognitiveStatus.trim(), phc: form.phc.trim(), district: form.district.trim(), avatar: '👤', condition: form.cognitiveStatus.trim() || 'Local account' };
      const stored = JSON.parse(localStorage.getItem(ACCOUNT_KEY) || '[]');
      localStorage.setItem(ACCOUNT_KEY, JSON.stringify([...stored, account]));
      onLoginSuccess(toAppUser(account), rememberMe);
      return;
    }
    const account = getAccounts().find(item => item.email.toLowerCase() === email && String(item.password) === form.password);
    if (!account) return setErrorMsg('Email or password is incorrect. Please try again.');
    onLoginSuccess(toAppUser(account), rememberMe);
  };

  return <main className="min-h-screen bg-linear-to-b from-[#fef2f2] via-[#fff1f2] to-[#ffe4e6] flex items-center justify-center p-4 md:p-8"><section className="max-w-xl w-full bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-10 shadow-2xl border-3 border-rose-200 animate-fade-in"><header className="text-center space-y-2 mb-7"><div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-linear-to-tr from-rose-500 to-amber-500 text-white mb-1 animate-breathe"><ShieldCheck size={32} /></div><h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{t.appTitle || 'Smriti-NER (স্মৃতি)'}</h1><p className="text-sm text-slate-600 font-medium">North Eastern AI Cognitive & Dementia Care Platform</p></header><div className="flex items-center gap-2 bg-rose-50 border border-rose-200 rounded-2xl p-4 mb-5 text-xs font-black text-rose-800"><ShieldCheck size={18} /> Local authentication mode</div><div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl mb-6">{['login', 'create'].map(tab => <button key={tab} type="button" onClick={() => { setMode(tab); setErrorMsg(''); setStatusMsg(''); }} className={`py-3 rounded-xl text-sm font-black cursor-pointer ${mode === tab ? 'bg-white text-rose-700 shadow-sm' : 'text-slate-500'}`}>{tab === 'login' ? 'Log In' : 'Create Account'}</button>)}</div>{statusMsg ? <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-5 text-center text-emerald-900 font-bold">{statusMsg}</div> : <form onSubmit={handleSubmit} className="space-y-4">{mode === 'create' && <Field icon={<UserRound size={18} />} label="Full Name" value={form.name} onChange={value => updateField('name', value)} placeholder="Enter your full name" />}<Field icon={<Mail size={18} />} label="Email" type="email" value={form.email} onChange={value => updateField('email', value)} placeholder="name@gmail.com" /><Field icon={<LockKeyhole size={18} />} label="Password" type="password" value={form.password} onChange={value => updateField('password', value)} placeholder="At least 8 characters" />{mode === 'create' && <><Field icon={<LockKeyhole size={18} />} label="Confirm Password" type="password" value={form.confirmPassword} onChange={value => updateField('confirmPassword', value)} placeholder="Repeat your password" /><fieldset><legend className="text-sm font-bold text-slate-700 mb-2">Choose your role</legend><div className="grid grid-cols-3 gap-2">{ROLES.map(role => { const RoleIcon = role.icon; return <button type="button" key={role.id} onClick={() => updateField('role', role.id)} className={`p-3 rounded-xl border-2 text-xs font-black cursor-pointer ${form.role === role.id ? 'border-rose-500 bg-rose-50 text-rose-800' : 'border-slate-200 text-slate-600'}`}><span className="block text-2xl mb-1"><RoleIcon size={28} /></span>{role.label}<span className="block text-[10px] font-normal mt-1">{role.assamese}</span></button>; })}</div></fieldset>{(form.role === 'patient' || form.role === 'caregiver') && <div className="grid sm:grid-cols-2 gap-3"><Field label={form.role === 'patient' ? 'Caregiver Name' : 'Linked Patient Name'} value={form.linkedName} onChange={value => updateField('linkedName', value)} placeholder="Full name" /><Field label="Village / City" value={form.location} onChange={value => updateField('location', value)} placeholder="Tezpur, Assam" /></div>}{form.role === 'patient' && <Field label="Cognitive Status (optional)" value={form.cognitiveStatus} onChange={value => updateField('cognitiveStatus', value)} placeholder="For example, MCI" />}{form.role === 'asha_worker' && <div className="grid sm:grid-cols-2 gap-3"><Field label="PHC / Health Centre" value={form.phc} onChange={value => updateField('phc', value)} placeholder="Primary Health Centre" /><Field label="District" value={form.district} onChange={value => updateField('district', value)} placeholder="Sonitpur" /></div>}</>}{errorMsg && <p role="alert" className="text-sm font-bold text-rose-700 bg-rose-50 p-3 rounded-xl border border-rose-200 text-center">{errorMsg}</p>}<button type="submit" className="w-full py-4 rounded-2xl bg-linear-to-r from-rose-500 to-rose-600 text-white font-black text-lg shadow-lg flex items-center justify-center gap-2.5 cursor-pointer">{mode === 'login' ? 'Log In' : `Create ${selectedRole ? selectedRole.label : ''} Account`}<ArrowRight size={22} /></button></form>}<label onClick={() => setRememberMe(value => !value)} className="mt-5 flex items-center gap-2 cursor-pointer font-medium text-xs text-slate-600 select-none">{rememberMe ? <CheckSquare size={18} className="text-rose-600" /> : <Square size={18} className="text-slate-400" />}Remember session on this device</label><button type="button" onClick={() => setShowDemoRoles(true)} className="w-full mt-4 py-3 rounded-2xl border-2 border-rose-200 bg-rose-50 text-rose-800 font-black cursor-pointer hover:bg-rose-100">Try Demo / Continue as Demo</button></section>{showDemoRoles && <div className="fixed inset-0 z-50 bg-slate-950/40 flex items-center justify-center p-4" role="dialog" aria-modal="true"><section className="max-w-xl w-full bg-white rounded-3xl p-6 shadow-2xl"><div className="flex justify-between mb-5"><div><h2 className="text-2xl font-black text-slate-900">Choose Demo Role</h2><p className="text-sm text-slate-500">Explore sample data without an account.</p></div><button type="button" onClick={() => setShowDemoRoles(false)} aria-label="Back to login" className="text-xl font-black cursor-pointer">×</button></div><div className="space-y-3">{ROLES.map(role => { const RoleIcon = role.icon; return <button type="button" key={role.id} onClick={() => { setShowDemoRoles(false); onTryDemo(role.id); }} className="w-full flex items-center gap-4 text-left p-4 rounded-2xl border-2 border-slate-200 hover:border-rose-400 cursor-pointer"><RoleIcon size={32} className="text-teal-700" /><span className="flex-1"><strong className="block text-base font-black text-slate-900">Demo {role.id === 'asha_worker' ? 'Officer' : role.label}</strong><span className="block text-xs text-slate-500 mt-1">Sample {role.label.toLowerCase()} dashboard data.</span></span><ArrowRight size={20} /></button>; })}</div><button type="button" onClick={() => setShowDemoRoles(false)} className="w-full mt-5 py-3 rounded-2xl border border-slate-200 font-bold cursor-pointer">Back to Login</button></section></div>}</main>;
};

const Field = ({ icon, label, type = 'text', value, onChange, placeholder }) => <label className="block"><span className="text-sm font-bold text-slate-700">{label}</span><span className="mt-1 flex items-center gap-3 border border-slate-300 rounded-xl px-3 bg-white focus-within:ring-2 focus-within:ring-rose-300">{icon}<input required={label !== 'Cognitive Status (optional)'} type={type} value={value} onChange={event => onChange(event.target.value)} className="w-full py-3 outline-none font-medium" placeholder={placeholder} /></span></label>;
