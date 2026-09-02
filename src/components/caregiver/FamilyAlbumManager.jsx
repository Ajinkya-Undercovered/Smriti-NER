import React, { useState } from 'react';
import { usePatient } from '../../context/PatientContext.jsx';
import { 
  Users, 
  Plus, 
  Trash2, 
  Heart, 
  Volume2, 
  Image 
} from 'lucide-react';

export const FamilyAlbumManager = () => {
  const { familyAlbum, addFamilyMember, deleteFamilyMember } = usePatient();

  const [name, setName] = useState('');
  const [relation, setRelation] = useState('Grandchild');
  const [photoEmoji, setPhotoEmoji] = useState('👧');
  const [location, setLocation] = useState('Shillong');
  const [voiceHint, setVoiceHint] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    addFamilyMember({
      name,
      relation,
      photoUrl: photoEmoji,
      location,
      voiceHint: voiceHint || `This is your beloved ${relation} ${name}.`,
      voiceHintAs: `আপোনাৰ মৰমৰ ${name}।`
    });

    setName('');
    setVoiceHint('');
  };

  const EMOJI_OPTIONS = ['👧', '👦', '👨‍💼', '👩‍💼', '👵', '👴', '🏡', '🐕', '🐱', '🌸'];

  return (
    <div className="space-y-6">
      
      {/* Add New Family Member Form */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
            <Users size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Add Personalized Family Member / Memory Photo</h3>
            <p className="text-xs text-slate-500">Upload family faces to automatically populate the Cognitive Memory Game</p>
          </div>
        </div>

        <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Name & Title</label>
            <input
              type="text"
              placeholder="e.g. Priya / Riya"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-400 focus:outline-hidden font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Relationship</label>
            <select
              value={relation}
              onChange={(e) => setRelation(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 bg-white font-medium"
            >
              <option value="Granddaughter">Granddaughter (নাতিনী)</option>
              <option value="Grandson">Grandson (নাতি)</option>
              <option value="Daughter">Daughter (কন্যা)</option>
              <option value="Son">Son (পুত্ৰ)</option>
              <option value="Spouse">Spouse (পত্নী/স্বামী)</option>
              <option value="Hometown">Ancestral Home / Village</option>
              <option value="Pet">Pet Companion</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Icon / Avatar</label>
            <div className="flex gap-1.5 overflow-x-auto py-1">
              {EMOJI_OPTIONS.map(em => (
                <button
                  type="button"
                  key={em}
                  onClick={() => setPhotoEmoji(em)}
                  className={`p-2 rounded-xl text-xl border transition-all ${
                    photoEmoji === em ? 'bg-purple-100 border-purple-500 scale-110' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-slate-700 mb-1">Voice Memory Clue (Spoken during game)</label>
            <input
              type="text"
              placeholder="e.g. This is your granddaughter Priya who visits you every Sunday."
              value={voiceHint}
              onChange={(e) => setVoiceHint(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-400 focus:outline-hidden font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Current Town / Location</label>
            <input
              type="text"
              placeholder="e.g. Guwahati / Jorhat"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-400 focus:outline-hidden font-medium"
            />
          </div>

          <div className="sm:col-span-3 pt-1">
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-bold flex items-center gap-2 transition-colors cursor-pointer text-xs sm:text-sm"
            >
              <Plus size={16} />
              <span>Add to Personalized Memory Pack</span>
            </button>
          </div>
        </form>
      </div>

      {/* Current Family Album Cards List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {familyAlbum.map(item => (
          <div
            key={item.id}
            className="bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-xs flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <span className="text-4xl p-2 bg-purple-50 rounded-2xl border border-purple-200">
                {item.photoUrl}
              </span>
              <div>
                <h4 className="font-bold text-slate-900 text-sm sm:text-base">{item.name}</h4>
                <p className="text-xs text-purple-700 font-semibold">{item.relation} • {item.location}</p>
              </div>
            </div>

            <button
              onClick={() => deleteFamilyMember(item.id)}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              title="Delete photo"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};
