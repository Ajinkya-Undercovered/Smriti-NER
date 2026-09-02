import React, { useState } from 'react';
import { usePatient } from '../../context/PatientContext.jsx';
import { 
  User, 
  Save, 
  Plus, 
  Trash2, 
  Pill, 
  Phone, 
  MapPin, 
  CheckCircle2 
} from 'lucide-react';

export const PatientProfileManager = () => {
  const { patient, updatePatientProfile, medications, addMedication } = usePatient();
  const [formData, setFormData] = useState({ ...patient });
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New Medication Form State
  const [newMedName, setNewMedName] = useState('');
  const [newMedTiming, setNewMedTiming] = useState('morning');
  const [newMedTimeStr, setNewMedTimeStr] = useState('08:30 AM');
  const [newMedInstructions, setNewMedInstructions] = useState('');

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updatePatientProfile(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleAddMed = (e) => {
    e.preventDefault();
    if (!newMedName.trim()) return;

    addMedication({
      name: newMedName,
      dosage: '1 Dose',
      timing: newMedTiming,
      timeString: newMedTimeStr,
      instructions: newMedInstructions || 'Take with water after food',
      pillIcon: '💊'
    });

    setNewMedName('');
    setNewMedInstructions('');
  };

  return (
    <div className="space-y-6">
      
      {/* Patient Profile Form */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold">
              <User size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Patient & Emergency Contacts Setup</h3>
              <p className="text-xs text-slate-500">Configure Clinical Details, Location, and Caregiver Access</p>
            </div>
          </div>

          {saveSuccess && (
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <CheckCircle2 size={14} /> Profile Saved!
            </span>
          )}
        </div>

        <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Patient Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-400 focus:outline-hidden font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Regional Language Name (অসমীয়া / ꯃꯩꯇꯩꯂꯣꯟ)</label>
            <input
              type="text"
              value={formData.regionalName || ''}
              onChange={(e) => setFormData({ ...formData, regionalName: e.target.value })}
              className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-400 focus:outline-hidden font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Patient Age & Gender</label>
            <input
              type="text"
              value={`${formData.age} Yrs • ${formData.gender}`}
              onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 70 })}
              className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-400 focus:outline-hidden font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Location / District (NER)</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-400 focus:outline-hidden font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Primary Caregiver Contact</label>
            <input
              type="text"
              value={`${formData.caregiverName} (${formData.caregiverPhone})`}
              onChange={(e) => setFormData({ ...formData, caregiverPhone: e.target.value })}
              className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-400 focus:outline-hidden font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">ASHA Health Worker Contact</label>
            <input
              type="text"
              value={`${formData.ashaWorkerName} (${formData.ashaPhone})`}
              onChange={(e) => setFormData({ ...formData, ashaPhone: e.target.value })}
              className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-400 focus:outline-hidden font-medium"
            />
          </div>

          <div className="md:col-span-2 pt-2">
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Save size={16} />
              <span>Save Patient Profile</span>
            </button>
          </div>
        </form>
      </div>

      {/* Add Medication Schedule */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Pill size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Add New Medication / Dose</h3>
            <p className="text-xs text-slate-500">Configure Pill Box Times & Voice Prompts</p>
          </div>
        </div>

        <form onSubmit={handleAddMed} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
          <div className="sm:col-span-2">
            <label className="block font-bold text-slate-700 mb-1">Medicine Name & Strength</label>
            <input
              type="text"
              placeholder="e.g. Donepezil 5mg / Memantine"
              value={newMedName}
              onChange={(e) => setNewMedName(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-400 focus:outline-hidden font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Dose Timing</label>
            <select
              value={newMedTiming}
              onChange={(e) => setNewMedTiming(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 bg-white font-medium"
            >
              <option value="morning">Morning (08:30 AM)</option>
              <option value="afternoon">Afternoon (01:30 PM)</option>
              <option value="night">Night (09:00 PM)</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <label className="block font-bold text-slate-700 mb-1">Dosage Instructions (Regional Voice Hint)</label>
            <input
              type="text"
              placeholder="e.g. After breakfast with warm water"
              value={newMedInstructions}
              onChange={(e) => setNewMedInstructions(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-400 focus:outline-hidden font-medium"
            />
          </div>

          <div className="sm:col-span-3 pt-1">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-2 transition-colors cursor-pointer text-xs sm:text-sm"
            >
              <Plus size={16} />
              <span>Add Medication to Daily Schedule</span>
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};
