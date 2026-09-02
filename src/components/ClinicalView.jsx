import React, { useState } from 'react';
import { usePatient } from '../context/PatientContext.jsx';
import { 
  HeartHandshake, 
  Brain, 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Printer, 
  Download 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar 
} from 'recharts';

export const ClinicalView = () => {
  const { patient, cognitiveProfile, medications, gameSessions, waterCount } = usePatient();
  const [activeTab, setActiveTab] = useState('metrics'); // 'metrics', 'report'

  const radarData = [
    { domain: 'Memory', score: cognitiveProfile.memoryScore },
    { domain: 'Attention', score: cognitiveProfile.attentionScore },
    { domain: 'Orientation', score: cognitiveProfile.orientationScore },
    { domain: 'Visual-Spatial', score: cognitiveProfile.visuospatialScore },
    { domain: 'Auditory-Motor', score: cognitiveProfile.motorRhythmScore },
    { domain: 'Executive', score: cognitiveProfile.executiveScore }
  ];

  const trendData = [
    { day: 'Mon', score: 76 },
    { day: 'Tue', score: 79 },
    { day: 'Wed', score: 81 },
    { day: 'Thu', score: 78 },
    { day: 'Fri', score: 83 },
    { day: 'Sat', score: 85 },
    { day: 'Today', score: cognitiveProfile.overallScore }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Clinical Header */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold mb-2 border border-rose-500/30">
              <HeartHandshake size={14} />
              <span>Neurologist & ASHA Monitoring Portal</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black">{patient.name} ({patient.age} Yrs)</h2>
            <p className="text-slate-300 text-xs mt-0.5">
              {patient.condition} • {patient.location}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center min-w-[180px]">
            <span className="text-[11px] font-bold text-rose-300 uppercase">Cognitive Wellness</span>
            <div className="text-3xl md:text-4xl font-black text-white my-0.5">
              {cognitiveProfile.overallScore} <span className="text-sm text-slate-400 font-normal">/ 100</span>
            </div>
            <span className="text-[11px] text-emerald-400 font-semibold">{cognitiveProfile.trend7Days} (7-Day Trend)</span>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('metrics')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'metrics'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-rose-200 hover:bg-rose-50'
          }`}
        >
          Cognitive Analytics & Alerts
        </button>
        <button
          onClick={() => setActiveTab('report')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'report'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-rose-200 hover:bg-rose-50'
          }`}
        >
          Print Doctor Report
        </button>
      </div>

      {activeTab === 'metrics' && (
        <div className="space-y-6">
          
          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Radar */}
            <div className="bg-white border-2 border-rose-200 rounded-3xl p-6 shadow-xs">
              <h3 className="font-bold text-slate-900 text-base mb-1">MMSE Cognitive Domain Radar</h3>
              <p className="text-xs text-slate-500 mb-4">Normalized Clinical Subscore Distribution</p>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#f1f5f9" />
                    <PolarAngleAxis dataKey="domain" tick={{ fill: '#475569', fontSize: 11, fontWeight: 'bold' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar dataKey="score" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.35} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Line Trend */}
            <div className="bg-white border-2 border-rose-200 rounded-3xl p-6 shadow-xs">
              <h3 className="font-bold text-slate-900 text-base mb-1">7-Day Trajectory Tracking</h3>
              <p className="text-xs text-slate-500 mb-4">Response Speed & Accuracy Fluency Score</p>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} />
                    <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="score" stroke="#e11d48" strokeWidth={3} dot={{ r: 5, fill: '#e11d48' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* AI Clinical Insights */}
          <div className="bg-white border-2 border-rose-200 rounded-3xl p-6 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-500" />
              <span>AI Clinical Insights & Recommendations</span>
            </h3>

            <div className="space-y-2">
              {cognitiveProfile.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3 rounded-2xl bg-rose-50/60 border border-rose-100 text-xs font-medium text-slate-800">
                  <CheckCircle2 size={16} className="text-rose-600 mt-0.5 shrink-0" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {activeTab === 'report' && (
        <div className="bg-white border-2 border-slate-300 rounded-3xl p-6 md:p-10 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
            <div>
              <h2 className="text-xl font-black text-slate-900">SMRITI-NER CLINICAL ASSESSMENT SUMMARY</h2>
              <p className="text-xs text-slate-600">North Eastern Region Digital Therapeutics & Dementia Monitoring</p>
            </div>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs flex items-center gap-2 cursor-pointer"
            >
              <Printer size={16} />
              <span>Print PDF</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 text-xs">
            <div>
              <span className="font-bold text-slate-400 uppercase text-[10px]">Patient</span>
              <p className="font-bold text-slate-900">{patient.name}</p>
            </div>
            <div>
              <span className="font-bold text-slate-400 uppercase text-[10px]">Age / Gender</span>
              <p className="font-bold text-slate-900">{patient.age} Yrs • {patient.gender}</p>
            </div>
            <div>
              <span className="font-bold text-slate-400 uppercase text-[10px]">Condition</span>
              <p className="font-bold text-slate-900">{patient.condition}</p>
            </div>
            <div>
              <span className="font-bold text-slate-400 uppercase text-[10px]">Location</span>
              <p className="font-bold text-slate-900">{patient.location}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 font-bold">Memory</span>
              <p className="text-lg font-black text-slate-900">{cognitiveProfile.memoryScore}%</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 font-bold">Attention</span>
              <p className="text-lg font-black text-slate-900">{cognitiveProfile.attentionScore}%</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 font-bold">Orientation</span>
              <p className="text-lg font-black text-slate-900">{cognitiveProfile.orientationScore}%</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 font-bold">Visual-Spatial</span>
              <p className="text-lg font-black text-slate-900">{cognitiveProfile.visuospatialScore}%</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 font-bold">Motor-Rhythm</span>
              <p className="text-lg font-black text-slate-900">{cognitiveProfile.motorRhythmScore}%</p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 text-xs text-slate-500">
            <p>Signed Off by ASHA Centre: {patient.ashaCentre} • Attending: {patient.doctorName}</p>
          </div>
        </div>
      )}

    </div>
  );
};
