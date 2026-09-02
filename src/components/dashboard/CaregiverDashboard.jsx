import React, { useState } from 'react';
import { usePatient } from '../../context/PatientContext.jsx';
import { soundFx } from '../../utils/audio.js';
import { speechService } from '../../i18n/speechService.js';
import confetti from 'canvas-confetti';
import { 
  HeartHandshake, 
  Pill, 
  Droplet, 
  PhoneCall, 
  Plus, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Image as ImageIcon, 
  Activity, 
  Gamepad2, 
  UserCheck, 
  Volume2, 
  ShieldAlert,
  Edit3,
  Moon,
  Sun
} from 'lucide-react';

export const CaregiverDashboard = ({ onLaunchPatientMode, onNavigateTab }) => {
  const { 
    patient = {}, 
    medications = [], 
    toggleMedicationTaken, 
    addMedication, 
    waterCount = 0, 
    familyAlbum = [], 
    addFamilyMember, 
    gameSessions = [] 
  } = usePatient();

  const [showAddMed, setShowAddMed] = useState(false);
  const [newMed, setNewMed] = useState({ name: '', dosage: '', timing: 'morning', timeString: '09:00 AM', instructions: '' });

  const [showAddPhoto, setShowAddPhoto] = useState(false);
  const [newPhoto, setNewPhoto] = useState({ name: '', relation: '', photoUrl: '', location: '', voiceHint: '' });

  const [behaviorNote, setBehaviorNote] = useState('');
  const [savedNotes, setSavedNotes] = useState([
    { id: 1, time: '09:15 AM', text: 'Father had morning tea happily. Good mood, recognized old radio song.', mood: 'calm' },
    { id: 2, time: '02:30 PM', text: 'Mild confusion after lunch about afternoon time, settled after drinking fresh water.', mood: 'mild_confusion' }
  ]);

  const pendingMeds = (medications || []).filter(m => !m.taken);
  const takenMeds = (medications || []).filter(m => m.taken);

  const handleSaveMed = (e) => {
    e.preventDefault();
    if (!newMed.name) return;
    if (addMedication) {
      addMedication({
        id: `med-${Date.now()}`,
        name: newMed.name,
        dosage: newMed.dosage || '1 tablet',
        timing: newMed.timing,
        timeString: newMed.timeString,
        instructions: newMed.instructions || 'Take with warm water after food',
        taken: false,
        pillIcon: '💊'
      });
    }
    setShowAddMed(false);
    setNewMed({ name: '', dosage: '', timing: 'morning', timeString: '09:00 AM', instructions: '' });
    soundFx.playMatchSound();
    speechService.speakBilingual('নতুন ঔষধ যোগ কৰা হ’ল', 'New medication scheduled successfully');
  };

  const handleSavePhoto = (e) => {
    e.preventDefault();
    if (!newPhoto.name || !newPhoto.relation) return;
    if (addFamilyMember) {
      addFamilyMember({
        id: `fam-${Date.now()}`,
        name: newPhoto.name,
        relation: newPhoto.relation,
        photoUrl: newPhoto.photoUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop',
        location: newPhoto.location || 'Assam',
        voiceHint: newPhoto.voiceHint || `${newPhoto.name}, your dear ${newPhoto.relation}`
      });
    }
    setShowAddPhoto(false);
    setNewPhoto({ name: '', relation: '', photoUrl: '', location: '', voiceHint: '' });
    soundFx.playCelebration();
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!behaviorNote.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setSavedNotes([
      { id: Date.now(), time: now, text: behaviorNote.trim(), mood: 'calm' },
      ...savedNotes
    ]);
    setBehaviorNote('');
    soundFx.playCardFlip();
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-6xl mx-auto">
      
      {/* Caregiver Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-1">
            <HeartHandshake size={15} />
            <span>Primary Family Caregiver Command Center • Ananya Hazarika</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">
            Caregiver Oversight Portal (অভিভাৱক পৰ্টেল)
          </h2>
          <p className="text-xs sm:text-sm text-teal-100 max-w-xl">
            Monitoring daily routine, medication compliance, reminiscence therapy, and behavioral well-being for {patient?.name || 'Bipin Chandra Hazarika'}.
          </p>
        </div>

        {/* Quick Launch Patient Experience */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <button
            onClick={onLaunchPatientMode}
            className="px-5 py-3 rounded-2xl bg-white text-teal-900 font-black text-xs sm:text-sm shadow-md hover:bg-teal-50 flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
          >
            <Gamepad2 size={18} className="text-teal-700" />
            <span>Switch to Patient Game Mode (খেল মুকলি কৰক)</span>
          </button>
        </div>
      </div>

      {/* Patient Health Vitals Summary Card */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border-2 border-teal-200 rounded-3xl p-5 shadow-xs flex items-center gap-4">
          <span className="text-4xl p-2.5 bg-teal-50 rounded-2xl border border-teal-100">👴</span>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Monitored Senior</span>
            <h4 className="font-black text-slate-900 text-base leading-tight">{patient?.name || 'Bipin Chandra Hazarika'}</h4>
            <p className="text-xs text-teal-700 font-bold">{patient?.condition || 'MCI Stage 2'}</p>
          </div>
        </div>

        <div className="bg-white border-2 border-sky-200 rounded-3xl p-5 shadow-xs flex items-center gap-4">
          <span className="text-4xl p-2.5 bg-sky-50 rounded-2xl border border-sky-100">💊</span>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Medication Status</span>
            <h4 className="font-black text-slate-900 text-base leading-tight">
              {takenMeds.length} / {medications.length} Doses
            </h4>
            <p className={`text-xs font-bold ${pendingMeds.length > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {pendingMeds.length > 0 ? `${pendingMeds.length} Pending Today` : 'All Doses Taken ✓'}
            </p>
          </div>
        </div>

        <div className="bg-white border-2 border-cyan-200 rounded-3xl p-5 shadow-xs flex items-center gap-4">
          <span className="text-4xl p-2.5 bg-cyan-50 rounded-2xl border border-cyan-100">💧</span>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Hydration Log</span>
            <h4 className="font-black text-slate-900 text-base leading-tight">{waterCount} / 8 Glasses</h4>
            <p className="text-xs text-cyan-700 font-bold">{Math.round((waterCount / 8) * 100)}% Daily Target</p>
          </div>
        </div>

        <div className="bg-white border-2 border-purple-200 rounded-3xl p-5 shadow-xs flex items-center gap-4">
          <span className="text-4xl p-2.5 bg-purple-50 rounded-2xl border border-purple-100">🧠</span>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Cognitive Baseline</span>
            <h4 className="font-black text-slate-900 text-base leading-tight">MMSE {patient?.baselineMmse || 23} / 30</h4>
            <p className="text-xs text-purple-700 font-bold">{(gameSessions || []).length} Game Sessions</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Meds Management + Behavior Journal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Medication Oversight & Schedule */}
        <div className="bg-white border-3 border-teal-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-teal-100 pb-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl p-2 bg-teal-50 rounded-2xl border border-teal-200">💊</span>
              <div>
                <h3 className="font-black text-slate-900 text-lg">Daily Medication Management</h3>
                <p className="text-xs text-slate-500">Add or verify father's prescription doses</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddMed(!showAddMed)}
              className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus size={15} />
              <span>Add Medicine</span>
            </button>
          </div>

          {/* Add Med Form Modal / Expandable */}
          {showAddMed && (
            <form onSubmit={handleSaveMed} className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200 space-y-3 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Medicine Name (e.g. Donepezil 5mg)"
                  value={newMed.name}
                  onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                  className="p-2.5 rounded-xl border border-slate-300 text-xs bg-white font-bold"
                  required
                />
                <input
                  type="text"
                  placeholder="Dosage (e.g. 1 Tablet after breakfast)"
                  value={newMed.dosage}
                  onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                  className="p-2.5 rounded-xl border border-slate-300 text-xs bg-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={newMed.timing}
                  onChange={(e) => setNewMed({ ...newMed, timing: e.target.value })}
                  className="p-2.5 rounded-xl border border-slate-300 text-xs bg-white font-bold"
                >
                  <option value="morning">Morning (ৰাতিপুৱা)</option>
                  <option value="afternoon">Afternoon (দুপৰীয়া)</option>
                  <option value="night">Night (ৰাতি)</option>
                </select>
                <input
                  type="text"
                  placeholder="Time (e.g. 09:00 AM)"
                  value={newMed.timeString}
                  onChange={(e) => setNewMed({ ...newMed, timeString: e.target.value })}
                  className="p-2.5 rounded-xl border border-slate-300 text-xs bg-white"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-black text-xs cursor-pointer shadow-xs"
              >
                Save Medication Schedule
              </button>
            </form>
          )}

          {/* Meds List */}
          <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
            {(medications || []).map(med => (
              <div
                key={med.id}
                className={`p-3.5 rounded-2xl border-2 flex items-center justify-between transition-all ${
                  med.taken ? 'bg-emerald-50/70 border-emerald-300' : 'bg-slate-50/70 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{med.pillIcon || '💊'}</span>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm leading-tight">{med.name}</h4>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {med.timeString} • {med.instructions}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => toggleMedicationTaken && toggleMedicationTaken(med.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all ${
                    med.taken
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-teal-50'
                  }`}
                >
                  <CheckCircle2 size={15} />
                  <span>{med.taken ? 'Taken' : 'Mark Taken'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Behavioral Journal & Mood Tracker */}
        <div className="bg-white border-3 border-emerald-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl p-2 bg-emerald-50 rounded-2xl border border-emerald-200">📝</span>
              <div>
                <h3 className="font-black text-slate-900 text-lg">Daily Caregiver Behavioral Journal</h3>
                <p className="text-xs text-slate-500">Record agitation, sundowning, or pleasant moments</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleAddNote} className="space-y-2">
            <textarea
              rows={3}
              value={behaviorNote}
              onChange={(e) => setBehaviorNote(e.target.value)}
              placeholder="Log note: e.g. Father listened to Namghar bell and smiled. Slept well for 7 hours."
              className="w-full p-3 rounded-2xl border border-slate-300 text-xs bg-slate-50 focus:ring-2 focus:ring-emerald-400"
            />
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Edit3 size={15} />
              <span>Save Caregiver Observation</span>
            </button>
          </form>

          {/* Notes Log */}
          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {savedNotes.map(n => (
              <div key={n.id} className="p-3 rounded-2xl bg-emerald-50/50 border border-emerald-200 text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-emerald-900">
                  <span>{n.time}</span>
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-200">Observed</span>
                </div>
                <p className="text-slate-700 leading-relaxed">{n.text}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Family Memory Album & Reminiscence Manager */}
      <div className="bg-white border-3 border-purple-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-purple-100 pb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2 bg-purple-50 rounded-2xl border border-purple-200">🖼️</span>
            <div>
              <h3 className="font-black text-slate-900 text-lg sm:text-xl">Family Reminiscence Photo Album</h3>
              <p className="text-xs text-slate-500">Personal photos used in father's cognitive memory games</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddPhoto(!showAddPhoto)}
            className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={15} />
            <span>Add Family Member</span>
          </button>
        </div>

        {/* Add Photo Form */}
        {showAddPhoto && (
          <form onSubmit={handleSavePhoto} className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-3 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Relative Name (e.g. Manas Hazarika)"
                value={newPhoto.name}
                onChange={(e) => setNewPhoto({ ...newPhoto, name: e.target.value })}
                className="p-2.5 rounded-xl border border-slate-300 text-xs bg-white font-bold"
                required
              />
              <input
                type="text"
                placeholder="Relation (e.g. Grandson / নাতি)"
                value={newPhoto.relation}
                onChange={(e) => setNewPhoto({ ...newPhoto, relation: e.target.value })}
                className="p-2.5 rounded-xl border border-slate-300 text-xs bg-white font-bold"
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Photo URL or leave blank for default avatar"
                value={newPhoto.photoUrl}
                onChange={(e) => setNewPhoto({ ...newPhoto, photoUrl: e.target.value })}
                className="p-2.5 rounded-xl border border-slate-300 text-xs bg-white"
              />
              <input
                type="text"
                placeholder="Voice Hint (e.g. Your grandson studying in Jorhat)"
                value={newPhoto.voiceHint}
                onChange={(e) => setNewPhoto({ ...newPhoto, voiceHint: e.target.value })}
                className="p-2.5 rounded-xl border border-slate-300 text-xs bg-white"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs cursor-pointer shadow-xs"
            >
              Save to Father's Memory Deck
            </button>
          </form>
        )}

        {/* Photos Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {(familyAlbum || []).map(photo => (
            <div key={photo.id} className="p-3 rounded-2xl bg-purple-50/40 border border-purple-200 flex flex-col items-center text-center space-y-2">
              <img
                src={photo.photoUrl}
                alt={photo.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-purple-300 shadow-xs"
              />
              <div>
                <h4 className="font-bold text-slate-900 text-xs leading-tight">{photo.name}</h4>
                <p className="text-[10px] text-purple-700 font-semibold">{photo.relation}</p>
                <p className="text-[9px] text-slate-400">{photo.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Escalation & Health Team Connect */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border-2 border-amber-200 rounded-3xl p-5 shadow-xs flex flex-col justify-between gap-3">
          <div>
            <span className="text-3xl">🩺</span>
            <span className="text-[10px] font-bold text-amber-800 uppercase block mt-1">Consulting Neurologist</span>
            <h4 className="font-black text-slate-900 text-base">{patient?.doctorName || 'Dr. Bhupen Sarmah, MD'}</h4>
            <p className="text-xs text-slate-500">GMCH Neurology OPD, Guwahati</p>
          </div>
          <button
            onClick={() => speechService.speakBilingual('ডাঃ ভূপেন শৰ্মাৰ সৈতে সংযোগ কৰা হৈছে', 'Connecting with Dr. Bhupen Sarmah')}
            className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <PhoneCall size={14} />
            <span>Consult Neurologist</span>
          </button>
        </div>

        <div className="bg-white border-2 border-teal-200 rounded-3xl p-5 shadow-xs flex flex-col justify-between gap-3">
          <div>
            <span className="text-3xl">👩‍⚕️</span>
            <span className="text-[10px] font-bold text-teal-800 uppercase block mt-1">Assigned ASHA Worker</span>
            <h4 className="font-black text-slate-900 text-base">{patient?.ashaWorkerName || 'Pratima Das'}</h4>
            <p className="text-xs text-slate-500">{patient?.ashaCentre || 'Tezpur UPHC'}</p>
          </div>
          <a
            href={`tel:${patient?.ashaPhone || '9864067890'}`}
            className="w-full py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <PhoneCall size={14} />
            <span>Call ASHA Pratima</span>
          </a>
        </div>

        <div className="bg-white border-2 border-rose-200 rounded-3xl p-5 shadow-xs flex flex-col justify-between gap-3">
          <div>
            <span className="text-3xl">🚑</span>
            <span className="text-[10px] font-bold text-rose-800 uppercase block mt-1">Emergency Service</span>
            <h4 className="font-black text-rose-950 text-base">108 Emergency Ambulance</h4>
            <p className="text-xs text-rose-700">Govt 24/7 Helpline</p>
          </div>
          <a
            href="tel:108"
            className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <PhoneCall size={14} />
            <span>Dial 108 SOS</span>
          </a>
        </div>
      </div>

    </div>
  );
};
