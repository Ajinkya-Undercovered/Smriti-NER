import React from 'react';
import { usePatient } from '../../context/PatientContext.jsx';
import { 
  Brain, 
  Eye, 
  Calendar, 
  Palette, 
  Music, 
  Clock, 
  TrendingUp, 
  CheckCircle2 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
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

export const CognitiveAnalyticsView = () => {
  const { cognitiveProfile, gameSessions } = usePatient();

  // Radar Domain Data
  const radarData = [
    { domain: 'Memory', score: cognitiveProfile.memoryScore, fullMark: 100 },
    { domain: 'Attention', score: cognitiveProfile.attentionScore, fullMark: 100 },
    { domain: 'Orientation', score: cognitiveProfile.orientationScore, fullMark: 100 },
    { domain: 'Visual-Spatial', score: cognitiveProfile.visuospatialScore, fullMark: 100 },
    { domain: 'Auditory-Motor', score: cognitiveProfile.motorRhythmScore, fullMark: 100 },
    { domain: 'Executive', score: cognitiveProfile.executiveScore, fullMark: 100 }
  ];

  // 7-day Longitudinal Trajectory Sample Data
  const trendData = [
    { day: 'Mon', score: 76, latency: 4200 },
    { day: 'Tue', score: 79, latency: 3800 },
    { day: 'Wed', score: 81, latency: 3500 },
    { day: 'Thu', score: 78, latency: 3900 },
    { day: 'Fri', score: 83, latency: 3300 },
    { day: 'Sat', score: 85, latency: 3100 },
    { day: 'Sun (Today)', score: cognitiveProfile.overallScore, latency: 3000 }
  ];

  return (
    <div className="space-y-6">
      
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Cognitive Domain Radar Chart */}
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Clinical Cognitive Domain Radar</h3>
              <p className="text-xs text-slate-500">MMSE & MoCA Aligned Sub-Domain Mapping</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              Score: {cognitiveProfile.overallScore}/100
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="domain" tick={{ fill: '#475569', fontSize: 12, fontWeight: 'bold' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="Patient" dataKey="score" stroke="#e11d48" fill="#f43f5e" fillOpacity={0.4} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 7-Day Longitudinal Trajectory Line Chart */}
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">7-Day Cognitive Fluency Trend</h3>
              <p className="text-xs text-slate-500">Tracking Progression & Response Speed</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              {cognitiveProfile.trend7Days}
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#059669" strokeWidth={3} dot={{ r: 5, fill: '#059669' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Session Logs History Table */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-lg">Recent Gaming & Memory Sessions</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px]">
                <th className="pb-3">Activity</th>
                <th className="pb-3">Fluency Score</th>
                <th className="pb-3">Response Latency</th>
                <th className="pb-3">Accuracy</th>
                <th className="pb-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {gameSessions.slice(-6).reverse().map((sess, idx) => (
                <tr key={sess.id || idx} className="hover:bg-slate-50">
                  <td className="py-3 capitalize font-bold text-slate-900">
                    {sess.gameId.replace('-', ' ')}
                  </td>
                  <td className="py-3 text-emerald-700 font-black">
                    {sess.fluencyScore} / 100
                  </td>
                  <td className="py-3 text-slate-600">
                    {(sess.averageLatencyMs / 1000).toFixed(1)}s
                  </td>
                  <td className="py-3">
                    {Math.round(sess.accuracy * 100)}%
                  </td>
                  <td className="py-3 text-slate-400 text-xs">
                    {new Date(sess.timestamp).toLocaleDateString()} {new Date(sess.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
