import React from 'react';
import { usePatient } from '../../context/PatientContext.jsx';
import { speechService } from '../../i18n/speechService.js';
import { soundFx } from '../../utils/audio.js';
import { 
  Stethoscope, 
  Calendar, 
  PhoneCall, 
  ArrowLeft, 
  UserCheck, 
  Clock, 
  MapPin, 
  AlertCircle, 
  Volume2, 
  HeartHandshake 
} from 'lucide-react';

export const DoctorAppointmentsView = ({ onBackHome }) => {
  const { patient } = usePatient();

  const APPOINTMENTS = [
    {
      id: 'app-1',
      doctor: patient.doctorName || 'Dr. Bhupen Sarmah, MD (Neurology)',
      specialty: 'Clinical Dementia & Cognitive Review',
      date: 'Thursday, Next Week',
      time: '11:30 AM',
      location: 'GMCH Neurology OPD, Guwahati',
      notesAs: 'স্মৃতিশক্তি আৰু ঔষধৰ নিয়মীয়া স্বাস্থ্য পৰীক্ষা',
      notesEn: 'Routine 3-month cognitive review and dosage adjustment'
    }
  ];

  const handleSpeakAppointment = (app) => {
    soundFx.playSingingBowl();
    speechService.speakBilingual(
      `আপোনাৰ চিকিৎসা পৰীক্ষা ${app.date} তাৰিখে ${app.time} বজাত ${app.doctor}ৰ ওচৰত আছে। স্থান: ${app.location}।`,
      `You have a doctor appointment on ${app.date} at ${app.time} with ${app.doctor} at ${app.location}.`
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-4xl mx-auto">
      
      {/* Top Header */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600 text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-1">
            <Stethoscope size={15} />
            <span>North Eastern Neurology & ASHA Healthcare Network</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">
            চিকিৎসক আৰু দিহা (Doctor & Caregiver Appointments)
          </h2>
          <p className="text-xs sm:text-sm text-amber-100 max-w-xl">
            View your upcoming medical consultations, doctor reminders, and direct emergency contacts.
          </p>
        </div>

        {onBackHome && (
          <button
            onClick={onBackHome}
            className="px-4 py-2.5 rounded-2xl bg-white text-amber-900 font-black text-xs sm:text-sm shadow-md hover:bg-amber-50 flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Home (ঘৰলৈ)</span>
          </button>
        )}
      </div>

      {/* Upcoming Appointments List */}
      <div className="bg-white border-3 border-amber-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-amber-100 pb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2 bg-amber-50 rounded-2xl border border-amber-200">📅</span>
            <div>
              <h3 className="font-black text-slate-900 text-lg sm:text-xl">Upcoming Consultations</h3>
              <p className="text-xs text-slate-500">Neurological evaluations and health checkups</p>
            </div>
          </div>
        </div>

        {APPOINTMENTS.map((app) => (
          <div key={app.id} className="p-6 rounded-3xl bg-amber-50/60 border-2 border-amber-300 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-200 px-2.5 py-0.5 rounded-md">
                  Confirmed Neurologist Consultation
                </span>
                <h4 className="font-black text-slate-900 text-lg sm:text-xl mt-1.5">{app.doctor}</h4>
                <p className="text-xs font-bold text-amber-800">{app.specialty}</p>
              </div>

              <button
                onClick={() => handleSpeakAppointment(app)}
                className="self-start sm:self-auto px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Volume2 size={16} />
                <span>Listen Details (শুনক)</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-amber-200">
                <Calendar size={18} className="text-amber-600" />
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Date & Time</span>
                  <p className="font-black text-slate-800">{app.date} • {app.time}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-amber-200">
                <MapPin size={18} className="text-amber-600" />
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Hospital / Clinic</span>
                  <p className="font-black text-slate-800">{app.location}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Emergency & ASHA Contacts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* ASHA Health Worker */}
        <div className="bg-white border-3 border-teal-200 rounded-3xl p-5 shadow-xs flex flex-col justify-between gap-3">
          <div>
            <span className="text-3xl">🩺</span>
            <span className="text-[10px] font-bold uppercase text-teal-800 block mt-1">Assigned ASHA Worker</span>
            <h4 className="font-black text-slate-900 text-base">{patient.ashaWorkerName}</h4>
            <p className="text-xs text-slate-500">{patient.ashaCentre}</p>
          </div>
          <a
            href={`tel:${patient.ashaPhone}`}
            className="w-full py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
          >
            <PhoneCall size={14} />
            <span>Call ASHA Officer</span>
          </a>
        </div>

        {/* Primary Caregiver */}
        <div className="bg-white border-3 border-emerald-200 rounded-3xl p-5 shadow-xs flex flex-col justify-between gap-3">
          <div>
            <span className="text-3xl">👩‍⚕️</span>
            <span className="text-[10px] font-bold uppercase text-emerald-800 block mt-1">Primary Family Caregiver</span>
            <h4 className="font-black text-slate-900 text-base">{patient.caregiverName}</h4>
            <p className="text-xs text-slate-500">{patient.caregiverRelation}</p>
          </div>
          <a
            href={`tel:${patient.caregiverPhone}`}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
          >
            <PhoneCall size={14} />
            <span>Call Caregiver</span>
          </a>
        </div>

        {/* 108 Emergency Ambulance */}
        <div className="bg-white border-3 border-rose-200 rounded-3xl p-5 shadow-xs flex flex-col justify-between gap-3">
          <div>
            <span className="text-3xl">🚑</span>
            <span className="text-[10px] font-bold uppercase text-rose-800 block mt-1">National 24/7 Helpline</span>
            <h4 className="font-black text-rose-950 text-base">108 Emergency Medical</h4>
            <p className="text-xs text-rose-700">Govt Ambulance Service</p>
          </div>
          <a
            href="tel:108"
            className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
          >
            <PhoneCall size={14} />
            <span>Dial 108 SOS</span>
          </a>
        </div>

      </div>

    </div>
  );
};
