import React from 'react';
import { usePatient } from '../../context/PatientContext.jsx';
import { 
  PhoneCall, 
  X, 
  MapPin, 
  UserCheck, 
  HeartHandshake, 
  Ambulance, 
  ShieldAlert 
} from 'lucide-react';

export const EmergencySosModal = ({ isOpen, onClose }) => {
  const { patient, t } = usePatient();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-4 border-rose-500 relative">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
        >
          <X size={24} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
            <ShieldAlert size={28} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900">{t.emergency}</h3>
            <p className="text-xs text-slate-500">One-Tap Assistance for Senior Support</p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 mb-5 flex items-start gap-2.5">
          <MapPin size={20} className="text-amber-700 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-bold text-amber-900">Patient Live Location:</p>
            <p className="text-xs text-amber-800 font-medium">{patient.location}</p>
          </div>
        </div>

        <div className="space-y-3">
          <a
            href={`tel:${patient.caregiverPhone}`}
            className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-400 transition-all text-emerald-950 shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                <UserCheck size={20} />
              </div>
              <div>
                <p className="font-bold text-sm sm:text-base">{patient.caregiverName}</p>
                <p className="text-xs text-emerald-700 font-medium">Caregiver ({patient.caregiverRelation})</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs">
              <PhoneCall size={14} />
              <span>Call</span>
            </div>
          </a>

          <a
            href={`tel:${patient.ashaPhone}`}
            className="flex items-center justify-between p-4 rounded-2xl bg-teal-50 hover:bg-teal-100 border-2 border-teal-400 transition-all text-teal-950 shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold">
                <HeartHandshake size={20} />
              </div>
              <div>
                <p className="font-bold text-sm sm:text-base">{patient.ashaWorkerName}</p>
                <p className="text-xs text-teal-700 font-medium">ASHA Health Worker ({patient.ashaCentre})</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-600 text-white font-bold text-xs">
              <PhoneCall size={14} />
              <span>Call</span>
            </div>
          </a>

          <a
            href="tel:108"
            className="flex items-center justify-between p-4 rounded-2xl bg-rose-50 hover:bg-rose-100 border-2 border-rose-400 transition-all text-rose-950 shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold">
                <Ambulance size={20} />
              </div>
              <div>
                <p className="font-bold text-sm sm:text-base">108 Emergency Ambulance</p>
                <p className="text-xs text-rose-700 font-medium">Govt. Emergency Health Response (NER)</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs">
              <PhoneCall size={14} />
              <span>Dial 108</span>
            </div>
          </a>
        </div>

      </div>
    </div>
  );
};
