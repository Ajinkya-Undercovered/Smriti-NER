import React from 'react';
import { Activity, BarChart3, CheckCircle2, Clock3, Gamepad2, TrendingUp } from 'lucide-react';
import { usePatient } from '../../context/PatientContext.jsx';

const domains = [
  ['Memory', 'memoryScore'],
  ['Attention', 'attentionScore'],
  ['Orientation', 'orientationScore'],
  ['Visual-spatial', 'visuospatialScore'],
  ['Executive', 'executiveScore']
];

export const PatientProgress = ({ onBackHome }) => {
  const { cognitiveProfile, gameSessions, todos } = usePatient();
  const completedTodos = (todos || []).filter(todo => todo.completed).length;
  const recentSessions = (gameSessions || []).slice(-5).reverse();

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><div className="flex items-center gap-2 text-teal-700 text-xs font-black uppercase tracking-wider"><BarChart3 size={16} /> Progress</div><h2 className="text-2xl font-black text-slate-900 mt-2">Your Activity Progress</h2><p className="text-sm text-slate-500 mt-1">A summary of cognitive performance and daily activity.</p></div>
        {onBackHome && <button type="button" onClick={onBackHome} className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 cursor-pointer">Back to Home</button>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Summary icon={<Activity size={20} />} label="Assessment Score" value={`${cognitiveProfile.overallScore}/100`} note={`${cognitiveProfile.trend7Days} recent trend`} />
        <Summary icon={<Gamepad2 size={20} />} label="Games Completed" value={gameSessions.length} note="Recorded activities" />
        <Summary icon={<CheckCircle2 size={20} />} label="Today's Tasks" value={`${completedTodos}/${todos.length}`} note="Completed tasks" />
      </div>

      <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"><div className="flex items-center gap-2 mb-5"><TrendingUp size={20} className="text-teal-700" /><h3 className="text-lg font-black text-slate-900">Cognitive Performance</h3></div><div className="space-y-4">{domains.map(([label, key]) => <div key={key}><div className="flex justify-between text-sm font-bold text-slate-700 mb-1"><span>{label}</span><span>{cognitiveProfile[key]}/100</span></div><div className="h-2.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-teal-600 rounded-full" style={{ width: `${Math.max(0, Math.min(100, cognitiveProfile[key]))}%` }} /></div></div>)}</div><p className="text-xs text-slate-500 mt-5">These activity indicators are for tracking progress and are not a medical diagnosis.</p></section>

      <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"><div className="flex items-center gap-2 mb-5"><Clock3 size={20} className="text-teal-700" /><h3 className="text-lg font-black text-slate-900">Recent Game Activity</h3></div>{recentSessions.length ? <div className="space-y-3">{recentSessions.map(session => <div key={session.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100"><div><p className="font-bold text-slate-800">{session.gameId}</p><p className="text-xs text-slate-500">{new Date(session.timestamp).toLocaleDateString()}</p></div><span className="font-black text-teal-700">{session.fluencyScore}/100</span></div>)}</div> : <p className="text-sm text-slate-500">No game activity recorded yet.</p>}</section>
    </div>
  );
};

const Summary = ({ icon, label, value, note }) => <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"><div className="text-teal-700 mb-3">{icon}</div><p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p><p className="text-2xl font-black text-slate-900 mt-1">{value}</p><p className="text-xs text-slate-500 mt-1">{note}</p></div>;
