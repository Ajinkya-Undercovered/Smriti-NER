import React, { useState } from 'react';
import { usePatient } from '../../context/PatientContext.jsx';
import { 
  HeartHandshake, 
  Activity, 
  UserCheck, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Users, 
  Settings, 
  Brain,
  Download,
  Calendar,
  Sparkles
} from 'lucide-react';
import { CognitiveAnalyticsView } from './CognitiveAnalyticsView.jsx';
import { PatientProfileManager } from './PatientProfileManager.jsx';
import { FamilyAlbumManager } from './FamilyAlbumManager.jsx';
import { ClinicalReportExporter } from './ClinicalReportExporter.jsx';

export const CaregiverDashboard = () => {
  const { patient, cognitiveProfile, medications, waterCount, isOffline, t } = usePatient();
  const [activeSubTab, setActiveSubTab] = useState('overview'); // 'overview', 'analytics', 'profile', 'family', 'report'

  const completedMeds = medications.filter(m => m.taken).length;
  const adherencePct = Math.round((completedMeds / Math.max(1, medications.length)) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Caregiver Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold mb-3 border border-rose-500/30">
              <HeartHandshake size={14} />
              <span>ASHA & Family Caregiver Clinical Portal</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black mb-2 tracking-tight">
              {patient.name} ({patient.age} Yrs)
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm font-medium">
              {patient.condition} • {patient.location}
            </p>
            <p className="text-slate-400 text-xs mt-1">
              Primary Caregiver: {patient.caregiverName} ({patient.caregiverRelation}) • ASHA Worker: {patient.ashaWorkerName} ({patient.ashaCentre})
            </p>
          </div>

          {/* Clinical Quick Score Badge */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/20 text-center min-w-[200px]">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-300">
              Cognitive Wellness Index
            </span>
            <div className="text-3xl sm:text-5xl font-black text-white my-1">
              {cognitiveProfile.overallScore} <span className="text-lg text-slate-400 font-normal">/ 100</span>
            </div>
            <span className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1">
              <Sparkles size={12} /> {cognitiveProfile.trend7Days} (7-Day Stability)
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSubTab === 'overview' 
              ? 'bg-rose-600 text-white shadow-xs' 
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-rose-50'
          }`}
        >
          <Activity size={18} />
          <span>Care Overview</span>
        </button>

        <button
          onClick={() => setActiveSubTab('analytics')}
          className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSubTab === 'analytics' 
              ? 'bg-rose-600 text-white shadow-xs' 
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-rose-50'
          }`}
        >
          <Brain size={18} />
          <span>Cognitive Trajectory</span>
        </button>

        <button
          onClick={() => setActiveSubTab('family')}
          className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSubTab === 'family' 
              ? 'bg-rose-600 text-white shadow-xs' 
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-rose-50'
          }`}
        >
          <Users size={18} />
          <span>Family Album Config</span>
        </button>

        <button
          onClick={() => setActiveSubTab('profile')}
          className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSubTab === 'profile' 
              ? 'bg-rose-600 text-white shadow-xs' 
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-rose-50'
          }`}
        >
          <Settings size={18} />
          <span>Profile & Medication</span>
        </button>

        <button
          onClick={() => setActiveSubTab('report')}
          className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSubTab === 'report' 
              ? 'bg-rose-600 text-white shadow-xs' 
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-rose-50'
          }`}
        >
          <FileText size={18} />
          <span>Medical Report Export</span>
        </button>
      </div>

      {/* 1. Care Overview Tab */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Key Vitals & Adherence Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Memory Domain
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {cognitiveProfile.memoryScore} <span className="text-sm font-normal text-slate-500">/ 100</span>
              </div>
              <p className="text-xs text-emerald-700 font-semibold mt-1">Strong Morning Recall</p>
            </div>

            <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Attention & Focus
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {cognitiveProfile.attentionScore} <span className="text-sm font-normal text-slate-500">/ 100</span>
              </div>
              <p className="text-xs text-emerald-700 font-semibold mt-1">Steady Sorting Precision</p>
            </div>

            <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Medication Adherence
              </span>
              <div className="text-2xl font-black text-emerald-700 mt-1">
                {adherencePct}%
              </div>
              <p className="text-xs text-slate-500 font-semibold mt-1">{completedMeds} of {medications.length} taken today</p>
            </div>

            <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Hydration Compliance
              </span>
              <div className="text-2xl font-black text-cyan-700 mt-1">
                {waterCount} <span className="text-sm font-normal text-slate-500">/ 8 Glasses</span>
              </div>
              <p className="text-xs text-cyan-800 font-semibold mt-1">Good water intake</p>
            </div>

          </div>

          {/* AI Clinical Recommendations & Alert Center */}
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle size={20} className="text-amber-500" />
              <h3 className="text-lg font-bold text-slate-900">AI Clinical Insights & Early Alerts</h3>
            </div>

            <div className="space-y-2.5">
              {cognitiveProfile.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs sm:text-sm font-medium text-amber-950">
                  <CheckCircle2 size={16} className="text-amber-700 mt-0.5 shrink-0" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Frontline ASHA Health Worker Quick Sync Card */}
          <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border-2 border-teal-200 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-300">
                ASHA Health Worker Integration
              </span>
              <h4 className="text-lg font-bold text-slate-900 mt-1">
                Assigned: {patient.ashaWorkerName} • {patient.ashaCentre}
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Last Home Visit: Yesterday (Vitals Normal). Automatic offline sync active for Sonitpur district cluster.
              </p>
            </div>

            <button
              onClick={() => setActiveSubTab('report')}
              className="px-5 py-3 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Download size={16} />
              <span>Generate Visit Summary</span>
            </button>
          </div>

        </div>
      )}

      {/* 2. Detailed Cognitive Analytics */}
      {activeSubTab === 'analytics' && <CognitiveAnalyticsView />}

      {/* 3. Family Album Configuration */}
      {activeSubTab === 'family' && <FamilyAlbumManager />}

      {/* 4. Patient Profile & Medication Manager */}
      {activeSubTab === 'profile' && <PatientProfileManager />}

      {/* 5. Doctor Report Exporter */}
      {activeSubTab === 'report' && <ClinicalReportExporter />}

    </div>
  );
};
