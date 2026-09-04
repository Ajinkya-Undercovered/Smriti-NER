import React, { useState } from 'react';
import { Check, CheckSquare, Clock3, Pencil, Plus, Square, Trash2 } from 'lucide-react';
import { usePatient } from '../../context/PatientContext.jsx';

export const PatientTodo = ({ onBackHome }) => {
  const { todos, addTodo, updateTodo, deleteTodo } = usePatient();
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [editingId, setEditingId] = useState(null);
  const pending = todos.filter(todo => !todo.completed);
  const completed = todos.filter(todo => todo.completed);

  const submitTodo = (event) => {
    event.preventDefault();
    if (!title.trim()) return;
    if (editingId) updateTodo(editingId, { title: title.trim(), time: time.trim() });
    else addTodo({ title: title.trim(), time: time.trim() });
    setTitle('');
    setTime('');
    setEditingId(null);
  };

  const editTodo = (todo) => {
    setEditingId(todo.id);
    setTitle(todo.title);
    setTime(todo.time || '');
  };

  const group = (label, items, isComplete) => <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"><h3 className="font-black text-slate-900 mb-3">{label} ({items.length})</h3>{items.length ? <div className="space-y-2">{items.map(todo => <div key={todo.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100"><button type="button" onClick={() => updateTodo(todo.id, { completed: !todo.completed })} className="text-teal-700 cursor-pointer" aria-label={isComplete ? 'Mark task as pending' : 'Mark task as completed'}>{isComplete ? <CheckSquare size={21} /> : <Square size={21} />}</button><div className="flex-1 min-w-0"><p className={`font-bold text-slate-800 ${isComplete ? 'line-through text-slate-400' : ''}`}>{todo.title}</p>{todo.time && <p className="text-xs text-slate-500 flex items-center gap-1 mt-1"><Clock3 size={12} />{todo.time}</p>}</div><button type="button" onClick={() => editTodo(todo)} className="p-2 text-slate-500 hover:text-teal-700 cursor-pointer" aria-label="Edit task"><Pencil size={16} /></button><button type="button" onClick={() => deleteTodo(todo.id)} className="p-2 text-slate-500 hover:text-rose-700 cursor-pointer" aria-label="Delete task"><Trash2 size={16} /></button></div>)}</div> : <p className="text-sm text-slate-500">No {isComplete ? 'completed' : 'pending'} tasks.</p>}</section>;

  return <div className="space-y-6 animate-fade-in max-w-4xl mx-auto"><div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center justify-between gap-4"><div><div className="flex items-center gap-2 text-teal-700 text-xs font-black uppercase tracking-wider"><Check size={16} /> To-Do</div><h2 className="text-2xl font-black text-slate-900 mt-2">Today's Tasks</h2><p className="text-sm text-slate-500 mt-1">Keep track of small, useful steps for today.</p></div>{onBackHome && <button type="button" onClick={onBackHome} className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 cursor-pointer">Back to Home</button>}</div><form onSubmit={submitTodo} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"><div className="grid sm:grid-cols-[1fr_180px_auto] gap-3 items-end"><label className="block"><span className="text-sm font-bold text-slate-700">Task</span><input value={title} onChange={event => setTitle(event.target.value)} placeholder="Add today's task" className="mt-1 w-full p-3 border border-slate-300 rounded-xl outline-none focus:border-teal-600" /></label><label className="block"><span className="text-sm font-bold text-slate-700">Time (optional)</span><input value={time} onChange={event => setTime(event.target.value)} placeholder="10:00 AM" className="mt-1 w-full p-3 border border-slate-300 rounded-xl outline-none focus:border-teal-600" /></label><button type="submit" className="p-3 rounded-xl bg-teal-700 text-white font-bold flex items-center justify-center gap-2 cursor-pointer"><Plus size={18} />{editingId ? 'Update' : 'Add Task'}</button></div></form>{group('Pending', pending, false)}{group('Completed', completed, true)}</div>;
};
