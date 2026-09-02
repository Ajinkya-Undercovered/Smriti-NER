import React, { useState, useEffect } from 'react';
import { usePatient } from '../../context/PatientContext.jsx';
import { speechService } from '../../i18n/speechService.js';
import { useSound } from '../../context/SoundContext.jsx';
import { Mic, MicOff, X, Sparkles } from 'lucide-react';

export const VoiceAssistantModal = ({ isOpen, onClose, onNavigate }) => {
  const { t, language } = usePatient();
  const { playMatchSound } = useSound();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [statusMsg, setStatusMsg] = useState(t.listenPrompt);

  useEffect(() => {
    if (isOpen) {
      handleStartListening();
    } else {
      speechService.stopListening();
      setIsListening(false);
    }
  }, [isOpen]);

  const handleStartListening = () => {
    setTranscript('');
    setStatusMsg(t.listenPrompt);
    setIsListening(true);

    speechService.startListening(
      (text) => {
        setTranscript(text);
        setIsListening(false);
        processVoiceCommand(text);
      },
      () => {
        setIsListening(false);
        setStatusMsg('Voice recognition quiet. Tap microphone to speak again.');
      },
      () => {
        setIsListening(false);
      }
    );
  };

  const processVoiceCommand = (rawText) => {
    const text = rawText.toLowerCase();
    playMatchSound();

    if (text.includes('game') || text.includes('memory') || text.includes('play') || text.includes('খেল') || text.includes('khel')) {
      setStatusMsg('Opening Cognitive Games...');
      speechService.speak('Opening Cognitive Games for you', language, () => {
        onNavigate('games');
        onClose();
      });
    } else if (text.includes('med') || text.includes('pill') || text.includes('routine') || text.includes('ঔষধ') || text.includes('dawai')) {
      setStatusMsg('Opening Medication Schedule...');
      speechService.speak('Here is your medication reminder schedule', language, () => {
        onNavigate('reminders');
        onClose();
      });
    } else if (text.includes('water') || text.includes('drink') || text.includes('পানী') || text.includes('জল')) {
      setStatusMsg('Opening Hydration Assistant...');
      speechService.speak('Checking hydration. Have a glass of water.', language, () => {
        onNavigate('reminders');
        onClose();
      });
    } else if (text.includes('calm') || text.includes('music') || text.includes('story') || text.includes('song') || text.includes('গান')) {
      setStatusMsg('Opening Peaceful Reminiscence Corner...');
      speechService.speak('Opening calming music and folklore stories', language, () => {
        onNavigate('reminiscence');
        onClose();
      });
    } else if (text.includes('caregiver') || text.includes('asha') || text.includes('doctor') || text.includes('ডাক্তাৰ')) {
      setStatusMsg('Opening Caregiver Health Portal...');
      speechService.speak('Opening Caregiver and ASHA Portal', language, () => {
        onNavigate('caregiver');
        onClose();
      });
    } else {
      setStatusMsg(`Heard: "${rawText}". Tap a quick action below.`);
      speechService.speak(`You said ${rawText}. How would you like me to help?`, language);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-4 border-amber-300 relative text-center">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
        >
          <X size={24} />
        </button>

        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="text-amber-500" size={24} />
          <h3 className="text-2xl font-black text-slate-900">{t.voiceAssistant}</h3>
        </div>
        <p className="text-sm text-slate-600 mb-6">Voice-Assisted Navigation for North East India</p>

        <div className="my-6 flex flex-col items-center justify-center">
          <button
            onClick={isListening ? () => speechService.stopListening() : handleStartListening}
            className={`w-28 h-28 rounded-full flex items-center justify-center text-white shadow-xl transition-all cursor-pointer ${
              isListening 
                ? 'bg-rose-600 scale-110 ring-8 ring-rose-200 animate-pulse' 
                : 'bg-gradient-to-tr from-emerald-600 to-teal-500 hover:scale-105 ring-4 ring-emerald-100'
            }`}
          >
            {isListening ? <Mic size={48} /> : <MicOff size={44} />}
          </button>
          
          {isListening && (
            <div className="flex items-center gap-1.5 mt-4 h-8">
              <span className="w-1.5 bg-emerald-500 rounded-full animate-wave-1"></span>
              <span className="w-1.5 bg-emerald-600 rounded-full animate-wave-2"></span>
              <span className="w-1.5 bg-amber-500 rounded-full animate-wave-3"></span>
              <span className="w-1.5 bg-teal-500 rounded-full animate-wave-4"></span>
              <span className="w-1.5 bg-emerald-500 rounded-full animate-wave-1"></span>
            </div>
          )}

          <p className="mt-3 font-semibold text-slate-800 text-base">
            {isListening ? 'Listening in your regional language...' : 'Tap to speak'}
          </p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">{statusMsg}</p>
        </div>

        {transcript && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 mb-4 text-sm font-medium text-amber-900">
            "{transcript}"
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-bold">
          <button
            onClick={() => processVoiceCommand('play memory games')}
            className="p-3 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 transition-colors text-left flex items-center gap-2 cursor-pointer"
          >
            🎮 <span>Play Games</span>
          </button>
          <button
            onClick={() => processVoiceCommand('take medicine')}
            className="p-3 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-800 border border-slate-200 transition-colors text-left flex items-center gap-2 cursor-pointer"
          >
            💊 <span>Check Medicine</span>
          </button>
          <button
            onClick={() => processVoiceCommand('drink water')}
            className="p-3 rounded-xl bg-slate-100 hover:bg-cyan-50 hover:text-cyan-800 border border-slate-200 transition-colors text-left flex items-center gap-2 cursor-pointer"
          >
            💧 <span>Drink Water</span>
          </button>
          <button
            onClick={() => processVoiceCommand('calm music and stories')}
            className="p-3 rounded-xl bg-slate-100 hover:bg-purple-50 hover:text-purple-800 border border-slate-200 transition-colors text-left flex items-center gap-2 cursor-pointer"
          >
            🎵 <span>Calm Audio</span>
          </button>
        </div>

      </div>
    </div>
  );
};
