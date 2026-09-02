import React, { useState } from 'react';
import { usePatient } from '../../context/PatientContext.jsx';
import { soundFx } from '../../utils/audio.js';
import { speechService } from '../../i18n/speechService.js';
import confetti from 'canvas-confetti';
import { 
  Stethoscope, 
  UserCheck, 
  Activity, 
  ClipboardCheck, 
  PhoneCall, 
  Plus, 
  AlertCircle, 
  CheckCircle2, 
  Send, 
  Clock, 
  FileText, 
  TrendingDown, 
  TrendingUp, 
  Gamepad2,
  Calendar,
  HeartPulse
} from 'lucide-react';

export const AshaWorkerPortal = ({ onLaunchPatientMode, onNavigateClinical }) => {
  const { patient, gameSessions, medications } = usePatient();

  // Rapid 5-Item Digital Rural Cognitive Screening
  const [screeningAnswers, setScreeningAnswers] = useState({
    orientation: false, // 5 pts
    registration: false, // 3 pts
    attention: false, // 5 pts
    recall: false, // 3 pts
    language: false // 9 pts
  });
  const [screeningScore, setScreeningScore] = useState(23);

  // Home Visit Logging Form
  const [visitLog, setVisitLog] = useState({
    bp: '126/82 mmHg',
    pulse: '74 bpm',
    bloodSugar: '110 mg/dL',
    medsAdherence: 'Good (Regular)',
    caregiverStress: 'Low',
    ashaNotes: 'Patient was calm and cheerful. Drank morning tea and participated in visual games.'
  });

  const [visitHistory, setVisitHistory] = useState([
    { id: 1, date: 'Yesterday', bp: '128/84', pulse: '76', notes: 'Routine weekly checkup. Donepezil compliance verified with daughter Ananya.' },
    { id: 2, date: '7 Days Ago', bp: '130/86', pulse: '78', notes: 'Reviewed hydration tracker. Encouraged family reminiscence photos.' }
  ]);

  const [referralSent, setReferralSent] = useState(false);

  const handleToggleScreening = (key, weight) => {
    const updated = !screeningAnswers[key];
    setScreeningAnswers({ ...screeningAnswers, [key]: updated });
    setScreeningScore(prev => updated ? prev + weight : prev - weight);
    soundFx.playCardFlip();
  };

  const handleSaveVisit = (e) => {
    e.preventDefault();
    soundFx.playMatchSound();
    setVisitHistory([
      {
        id: Date.now(),
        date: 'Today, Just now',
        bp: visitLog.bp,
        pulse: visitLog.pulse,
        notes: visitLog.ashaNotes
      },
      ...visitHistory
    ]);
    speechService.speakBilingual('গৃহ পৰিদৰ্শনৰ তথ্য সংৰক্ষণ কৰা হ’ল', 'ASHA home visit record saved successfully');
  };

  const handleSendTeleReferral = () => {
    setReferralSent(true);
    soundFx.playSingingBowl();
    confetti({ particleCount: 50, spread: 60 });
    speechService.speakBilingual(
      'জিএমচিএইচ স্নায়ুৰোগ বিভাগলৈ টেলি-ৰেফাৰেল প্ৰেৰণ কৰা হ’ল।',
      'Tele-consultation referral forwarded to GMCH Neurology OPD.'
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-6xl mx-auto">
      
      {/* ASHA Header Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-1">
            <Stethoscope size={15} />
            <span>Community Health Field Portal • ASHA Officer Pratima Das</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">
            ASHA Cognitive Screening & Field Portal (আশা পৰ্টেল)
          </h2>
          <p className="text-xs sm:text-sm text-amber-100 max-w-xl">
            Tezpur Urban Primary Health Centre (UPHC) • Rural Dementia Screening & Longitudinal Surveillance.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <button
            onClick={onNavigateClinical}
            className="px-5 py-3 rounded-2xl bg-white text-orange-950 font-black text-xs sm:text-sm shadow-md hover:bg-orange-50 flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
          >
            <Activity size={18} className="text-orange-600" />
            <span>Clinical Radar & MMSE Curves (চিকিৎসাগত ৰাডাৰ)</span>
          </button>
        </div>
      </div>

      {/* Village Monitored Roster Card */}
      <div className="bg-white border-3 border-orange-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-orange-100 pb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2 bg-orange-50 rounded-2xl border border-orange-200">📋</span>
            <div>
              <h3 className="font-black text-slate-900 text-lg">Assigned Rural Patient Roster</h3>
              <p className="text-xs text-slate-500">Sub-Centre Catchment: Tezpur Sonitpur Sector 4</p>
            </div>
          </div>
          <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
            Active Surveillance: 1 High-Priority Patient
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-orange-50/50 border-2 border-orange-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-4xl p-2 bg-white rounded-2xl border border-orange-200 shadow-2xs">👴</span>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-black text-slate-900 text-base sm:text-lg">{patient.name}</h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-950">
                  MCI Stage 2
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                Age {patient.age} • {patient.location} • Caregiver: {patient.caregiverName} ({patient.caregiverPhone})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onLaunchPatientMode}
              className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Gamepad2 size={16} />
              <span>Assisted Test Mode</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Digital Screening Checklist + Home Visit Vitals Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Rapid Rural MoCA / MMSE Checklist */}
        <div className="bg-white border-3 border-amber-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-amber-100 pb-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl p-2 bg-amber-50 rounded-2xl border border-amber-200">📝</span>
              <div>
                <h3 className="font-black text-slate-900 text-lg">Digital Cognitive Field Checklist</h3>
                <p className="text-xs text-slate-500">Rapid rural screening adapted for Assamese elders</p>
              </div>
            </div>
            <span className="text-sm font-black px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
              Score: {screeningScore} / 30
            </span>
          </div>

          <div className="space-y-3">
            {[
              { id: 'orientation', label: 'Orientation: Knows Year, Season, Day & Place (সময় আৰু স্থান জ্ঞান)', pts: 5 },
              { id: 'registration', label: 'Word Recall: Repeats 3 items: Rice, River, Bell (ধান, নদী, ঘণ্টা)', pts: 3 },
              { id: 'attention', label: 'Attention: Counting backward by 7s / Sequence (গণনা আৰু মনোযোগ)', pts: 5 },
              { id: 'recall', label: 'Delayed Recall: Remembers 3 items after 5 mins (বিলম্বিত স্মৃতি)', pts: 3 },
              { id: 'language', label: 'Visual Naming: Identifies Rhino & Bamboo Craft (বস্তু চিনাক্তকৰণ)', pts: 4 }
            ].map(item => (
              <div
                key={item.id}
                onClick={() => handleToggleScreening(item.id, item.pts)}
                className={`p-3 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                  screeningAnswers[item.id]
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5 text-xs">
                  <CheckCircle2 size={18} className={screeningAnswers[item.id] ? 'text-emerald-600' : 'text-slate-300'} />
                  <span>{item.label}</span>
                </div>
                <span className="text-xs font-mono font-bold">+{item.pts} pts</span>
              </div>
            ))}
          </div>

          <div className="pt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>Clinical Benchmark: 24-30 Normal • 18-23 MCI • &lt;18 Dementia</span>
            <span className="font-black text-amber-800">
              {screeningScore >= 24 ? '🟢 Normal' : screeningScore >= 18 ? '🟡 MCI Stage' : '🔴 Severe'}
            </span>
          </div>
        </div>

        {/* Home Visit Vitals & Observation Log */}
        <div className="bg-white border-3 border-orange-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-orange-100 pb-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl p-2 bg-orange-50 rounded-2xl border border-orange-200">🩺</span>
              <div>
                <h3 className="font-black text-slate-900 text-lg">Log ASHA Home Visit</h3>
                <p className="text-xs text-slate-500">Record health vitals and field observations</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSaveVisit} className="space-y-3">
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <label className="font-bold text-slate-600 block mb-1">Blood Pressure:</label>
                <input
                  type="text"
                  value={visitLog.bp}
                  onChange={(e) => setVisitLog({ ...visitLog, bp: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-bold"
                />
              </div>
              <div>
                <label className="font-bold text-slate-600 block mb-1">Pulse Rate:</label>
                <input
                  type="text"
                  value={visitLog.pulse}
                  onChange={(e) => setVisitLog({ ...visitLog, pulse: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-bold"
                />
              </div>
              <div>
                <label className="font-bold text-slate-600 block mb-1">Blood Sugar:</label>
                <input
                  type="text"
                  value={visitLog.bloodSugar}
                  onChange={(e) => setVisitLog({ ...visitLog, bloodSugar: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Field Observations & Caregiver Notes:</label>
              <textarea
                rows={2}
                value={visitLog.ashaNotes}
                onChange={(e) => setVisitLog({ ...visitLog, ashaNotes: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs cursor-pointer shadow-xs"
            >
              Save Home Visit Record
            </button>
          </form>

          {/* Past Visit History */}
          <div className="space-y-2 pt-1 max-h-[160px] overflow-y-auto">
            {visitHistory.map(v => (
              <div key={v.id} className="p-2.5 rounded-xl bg-orange-50/40 border border-orange-200 text-xs flex items-center justify-between">
                <div>
                  <span className="font-bold text-orange-950">{v.date}</span>
                  <p className="text-[11px] text-slate-600">BP: {v.bp} • Pulse: {v.pulse} — {v.notes}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">Verified</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Tele-Consultation Referral to GMCH + SOS */}
      <div className="bg-gradient-to-r from-amber-500 to-rose-600 text-white rounded-3xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-black uppercase tracking-wider px-3 py-0.5 rounded-full bg-white/20">
            Rural Tele-Medicine Triaging
          </span>
          <h3 className="text-xl sm:text-2xl font-black">
            Refer to GMCH Neurology Specialist (টেলি-পৰামৰ্শ)
          </h3>
          <p className="text-xs sm:text-sm text-amber-100 max-w-xl">
            Forward patient's latest cognitive latency curves, screening score, and visit log to Dr. Bhupen Sarmah.
          </p>
        </div>

        <button
          onClick={handleSendTeleReferral}
          disabled={referralSent}
          className={`px-6 py-3.5 rounded-2xl font-black text-xs sm:text-sm shadow-lg flex items-center gap-2 cursor-pointer transition-all ${
            referralSent ? 'bg-emerald-950 text-emerald-200' : 'bg-white text-orange-950 hover:bg-orange-50'
          }`}
        >
          <Send size={16} />
          <span>{referralSent ? 'Referral Forwarded to GMCH ✓' : 'Send Tele-Referral Ticket'}</span>
        </button>
      </div>

    </div>
  );
};
