import React from 'react';
import { usePatient } from '../../context/PatientContext.jsx';
import { speechService } from '../../i18n/speechService.js';
import { 
  Users, 
  Volume2, 
  MapPin, 
  Heart, 
  Sparkles 
} from 'lucide-react';

export const FamilyMemoryBook = () => {
  const { familyAlbum, language, t } = usePatient();

  const handleSpeakMember = (member) => {
    const hint = language === 'as' ? (member.voiceHintAs || member.voiceHint) : member.voiceHint;
    speechService.speak(`${member.name}. ${hint}`, language);
  };

  return (
    <div className="space-y-6">
      
      <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center text-xl shrink-0">
            <Heart size={20} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-base">{t.viewFamily}</h4>
            <p className="text-xs text-slate-600">
              Personalized family faces and hometown landmarks to reinforce autobiographical memory.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {familyAlbum.map(member => (
          <div
            key={member.id}
            className="bg-white border-2 border-purple-200 rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-purple-400 transition-all text-center"
          >
            <div>
              <div className="w-24 h-24 mx-auto rounded-3xl bg-purple-50 border-4 border-purple-200 flex items-center justify-center text-5xl mb-3 shadow-inner">
                {member.photoUrl}
              </div>

              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-900 border border-purple-300 inline-block mb-1">
                {member.relation}
              </span>

              <h4 className="font-bold text-slate-900 text-base sm:text-lg">
                {member.name}
              </h4>

              <p className="text-xs text-slate-500 flex items-center justify-center gap-1 mt-1">
                <MapPin size={12} className="text-purple-600" />
                <span>{member.location}</span>
              </p>
            </div>

            <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl text-left italic">
              \"{language === 'as' ? (member.voiceHintAs || member.voiceHint) : member.voiceHint}\"
            </p>

            <button
              onClick={() => handleSpeakMember(member)}
              className="w-full py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <Volume2 size={16} />
              <span>Listen Memory Hint</span>
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};
