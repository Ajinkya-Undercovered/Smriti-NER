import React from 'react';
import { usePatient } from '../context/PatientContext.jsx';
import { 
  X, 
  Stethoscope, 
  PhoneCall, 
  UserCheck, 
  HeartHandshake, 
  Ambulance, 
  MapPin 
} from 'lucide-react';

export const DoctorProfileModal = ({ isOpen, onClose }) => {
  const { patient, t } = usePatient();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-4 border-rose-300 relative animate-fade-in">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
        >
          <X size={22} />
        </button>

        <div className="flex items-center gap-3 mb-5 border-b border-rose-100 pb-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center">
            <Stethoscope size={26} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">Doctor & Healthcare Team</h3>
            <p className="text-xs text-slate-500">North Eastern Care Network Support</p>
          </div>
        </div>

        <div className="space-y-3">
          
          {/* Primary Doctor */}
          <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800">Consulting Neurologist</span>
              <h4 className="font-bold text-slate-900 text-sm md:text-base">{patient.doctorName}</h4>
              <p className="text-xs text-slate-500">Gauhati Medical College & Hospital (GMCH)</p>
            </div>
            <a
              href="tel:+919435012345"
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer"
            >
              <PhoneCall size={14} />
              <span>Call</span>
            </a>
          </div>

          {/* ASHA Health Worker */}
          <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800">Assigned ASHA Health Worker</span>
              <h4 className="font-bold text-slate-900 text-sm md:text-base">{patient.ashaWorkerName}</h4>
              <p className="text-xs text-slate-500">{patient.ashaCentre}</p>
            </div>
            <a
              href={`tel:${patient.ashaPhone}`}
              className="px-3 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer"
            >
              <PhoneCall size={14} />
              <span>Call</span>
            </a>
          </div>

          {/* Primary Caregiver */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Primary Family Caregiver</span>
              <h4 className="font-bold text-slate-900 text-sm md:text-base">{patient.caregiverName} ({patient.caregiverRelation})</h4>
              <p className="text-xs text-slate-500">{patient.caregiverPhone}</p>
            </div>
            <a
              href={`tel:${patient.caregiverPhone}`}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer"
            >
              <PhoneCall size={14} />
              <span>Call</span>
            </a>
          </div>

          {/* Emergency 108 */}
          <div className="p-4 rounded-2xl bg-rose-100 border border-rose-300 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-900">National Emergency Health</span>
              <h4 className="font-bold text-rose-950 text-sm md:text-base">108 Emergency Ambulance</h4>
              <p className="text-xs text-rose-800">24/7 Government Medical Response</p>
            </div>
            <a
              href="tel:108"
              className="px-3.5 py-1.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-black text-xs flex items-center gap-1 shadow-xs cursor-pointer"
            >
              <PhoneCall size={14} />
              <span>Dial 108</span>
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};
