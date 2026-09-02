import React from 'react';
import { usePatient } from '../../context/PatientContext.jsx';
import { 
  Printer, 
  FileCheck, 
  Download, 
  HeartHandshake, 
  Calendar, 
  User, 
  MapPin, 
  ShieldCheck 
} from 'lucide-react';

export const ClinicalReportExporter = () => {
  const { patient, cognitiveProfile, medications, waterCount, gameSessions } = usePatient();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Clinical Cognitive & Adherence Summary</h3>
          <p className="text-xs text-slate-500">Structured Medical Assessment Report for Neurologist & ASHA Health Records</p>
        </div>

        <button
          onClick={handlePrint}
          className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <Printer size={18} />
          <span>Print / Export Medical PDF</span>
        </button>
      </div>

      {/* Official Clinical Report Paper Container */}
      <div className="bg-white border-2 border-slate-300 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 print:border-none print:shadow-none print:p-0">
        
        {/* Report Header */}
        <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              SMRITI-NER COGNITIVE HEALTH ASSESSMENT REPORT
            </h2>
            <p className="text-xs text-slate-600 font-semibold mt-0.5">
              North Eastern Region Digital Therapeutics & Dementia Monitoring Network (NER-DTx)
            </p>
          </div>

          <div className="text-right text-xs text-slate-500 font-medium">
            <p>Date Generated: {new Date().toLocaleDateString('en-GB')}</p>
            <p>Report ID: NER-DTX-{Date.now().toString().slice(-6)}</p>
          </div>
        </div>

        {/* Patient Demographics & Clinical Baseline */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
          <div>
            <span className="font-bold text-slate-500 uppercase text-[10px]">Patient Name</span>
            <p className="font-bold text-slate-900 text-sm">{patient.name}</p>
            <p className="text-slate-500">{patient.regionalName}</p>
          </div>

          <div>
            <span className="font-bold text-slate-500 uppercase text-[10px]">Age / Gender</span>
            <p className="font-bold text-slate-900 text-sm">{patient.age} Yrs / {patient.gender}</p>
            <p className="text-slate-500">Native Lang: Assamese</p>
          </div>

          <div>
            <span className="font-bold text-slate-500 uppercase text-[10px]">Clinical Stage</span>
            <p className="font-bold text-slate-900 text-sm">{patient.condition}</p>
            <p className="text-slate-500">Baseline MMSE: {patient.baselineMMSE} / 30</p>
          </div>

          <div>
            <span className="font-bold text-slate-500 uppercase text-[10px]">Health Center (NER)</span>
            <p className="font-bold text-slate-900 text-sm">{patient.ashaCentre}</p>
            <p className="text-slate-500">{patient.location}</p>
          </div>
        </div>

        {/* Cognitive Sub-Scores Table */}
        <div className="space-y-3">
          <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider border-b border-slate-200 pb-1">
            1. Cognitive Domain Evaluation (MMSE / MoCA Normalized)
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500">Delayed Memory</span>
              <div className="text-xl font-black text-slate-900 mt-1">{cognitiveProfile.memoryScore}%</div>
              <span className="text-[10px] font-semibold text-emerald-700">Stable</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500">Sustained Attention</span>
              <div className="text-xl font-black text-slate-900 mt-1">{cognitiveProfile.attentionScore}%</div>
              <span className="text-[10px] font-semibold text-emerald-700">Good</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500">Time Orientation</span>
              <div className="text-xl font-black text-slate-900 mt-1">{cognitiveProfile.orientationScore}%</div>
              <span className="text-[10px] font-semibold text-emerald-700">Optimal</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500">Visual-Spatial</span>
              <div className="text-xl font-black text-slate-900 mt-1">{cognitiveProfile.visuospatialScore}%</div>
              <span className="text-[10px] font-semibold text-emerald-700">Normal</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500">Auditory-Motor</span>
              <div className="text-xl font-black text-slate-900 mt-1">{cognitiveProfile.motorRhythmScore}%</div>
              <span className="text-[10px] font-semibold text-emerald-700">Harmonic</span>
            </div>
          </div>
        </div>

        {/* Medication Compliance & Daily Living */}
        <div className="space-y-3">
          <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider border-b border-slate-200 pb-1">
            2. Pharmacotherapy & ADL Hydration Adherence
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-600">Prescription Schedule</span>
              {medications.map(med => (
                <div key={med.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex justify-between">
                  <span className="font-bold text-slate-800">{med.name}</span>
                  <span className="text-slate-500">{med.timeString} • {med.taken ? '✓ Taken' : 'Pending'}</span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <span className="font-bold text-slate-700">Hydration & Activity Log</span>
              <p>• Daily Water Intake: {waterCount} of 8 standard glasses logged.</p>
              <p>• Circadian Routine: Morning prayers, courtyard walk, and regular meals maintained.</p>
              <p>• Reminiscence Therapy: Active engagement with family photos & regional folk ambient sounds.</p>
            </div>
          </div>
        </div>

        {/* Doctor & ASHA Sign-off */}
        <div className="pt-6 border-t-2 border-slate-200 grid grid-cols-2 gap-8 text-xs">
          <div>
            <p className="font-bold text-slate-800">ASHA Health Worker Sign-Off</p>
            <p className="text-slate-500 mt-1">{patient.ashaWorkerName} ({patient.ashaCentre})</p>
            <div className="h-10 border-b border-dashed border-slate-400 mt-4"></div>
          </div>

          <div className="text-right">
            <p className="font-bold text-slate-800">Consulting Neurologist / Medical Officer</p>
            <p className="text-slate-500 mt-1">{patient.doctorName}</p>
            <div className="h-10 border-b border-dashed border-slate-400 mt-4"></div>
          </div>
        </div>

      </div>

    </div>
  );
};
