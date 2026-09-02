import React, { useState, useEffect } from 'react';
import { usePatient } from '../context/PatientContext.jsx';
import { speechService } from '../i18n/speechService.js';
import { soundFx } from '../utils/audio.js';
import { Mic, MicOff, X, Sparkles, Volume2 } from 'lucide-react';

export const VoiceAssistantModal = ({ isOpen, onClose }) => {
  const { t, language } = usePatient();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [statusMsg, setStatusMsg] = useState(t.listenPrompt || 'Speak to me, how can I help you?');

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
    setStatusMsg(t.listenPrompt || 'Listening in your regional language...');
    setIsListening(true);

    speechService.startListening(
      (text) => {
        setTranscript(text);
        setIsListening(false);
        processVoiceCommand(text);
      },
      () => {
        setIsListening(false);
        setStatusMsg('Tap microphone to speak again.');
      },
      () => {
        setIsListening(false);
      }
    );
  };

  const processVoiceCommand = (rawText) => {
    const text = rawText.toLowerCase();
    soundFx.playMatchSound();

    if (text.includes('game') || text.includes('memory') || text.includes('play') || text.includes('খেল')) {
      setStatusMsg('Starting Memory Game...');
      speechService.speak('Starting Memory Matching Game for you', language, () => {
        onClose();
      });
    } else if (text.includes('med') || text.includes('pill') || text.includes('ঔষধ')) {
      setStatusMsg('Checking Medication Schedule...');
      speechService.speak('Checking your medication schedule', language, () => {
        onClose();
      });
    } else if (text.includes('water') || text.includes('drink') || text.includes('পানী') || text.includes('জল')) {
      setStatusMsg('Checking Hydration...');
      speechService.speak('Remember to have a glass of fresh water.', language, () => {
        onClose();
      });
    } else if (text.includes('music') || text.includes('calm') || text.includes('story') || text.includes('গান')) {
      setStatusMsg('Opening Calm Soundscapes...');
      speechService.speak('Playing calming sounds and stories', language, () => {
        onClose();
      });
    } else {
      setStatusMsg(`Heard: "${rawText}"`);
      speechService.speak(`You said ${rawText}. How can I assist you?`, language);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border-4 border-rose-300 relative text-center animate-fade-in">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
        >
          <X size={22} />
        </button>

        <div className="flex items-center justify-center gap-2 mb-1">
          <Sparkles className="text-rose-500" size={22} />
          <h3 className="text-xl font-black text-slate-900">{t.voiceAssistant || 'Voice Companion'}</h3>
        </div>
        <p className="text-xs text-slate-500 mb-6">Regional Voice-Assisted Interaction (NER)</p>

        {/* Animated Mic Target */}
        <div className="my-6 flex flex-col items-center justify-center">
          <button
            onClick={isListening ? () => speechService.stopListening() : handleStartListening}
            className={`w-28 h-28 rounded-full flex items-center justify-center text-white shadow-xl transition-all cursor-pointer ${
              isListening 
                ? 'bg-rose-600 scale-110 ring-8 ring-rose-200 animate-pulse' 
                : 'bg-gradient-to-tr from-rose-500 to-amber-500 hover:scale-105 ring-4 ring-rose-100'
            }`}
          >
            {isListening ? <Mic size={48} /> : <MicOff size={44} />}
          </button>
          
          {isListening && (
            <div className="flex items-center gap-1.5 mt-4 h-7">
              <span className="w-1.5 bg-rose-500 rounded-full animate-wave-1"></span>
              <span className="w-1.5 bg-rose-600 rounded-full animate-wave-2"></span>
              <span className="w-1.5 bg-amber-500 rounded-full animate-wave-3"></span>
              <span className="w-1.5 bg-rose-400 rounded-full animate-wave-4"></span>
              <span className="w-1.5 bg-rose-500 rounded-full animate-wave-1"></span>
            </div>
          )}

          <p className="mt-3 font-bold text-slate-800 text-sm">
            {isListening ? 'Listening in your regional language...' : 'Tap to speak'}
          </p>
          <p className="text-xs text-slate-500 mt-1 max-w-xs">{statusMsg}</p>
        </div>

        {transcript && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 mb-4 text-xs font-semibold text-rose-950">
            "{transcript}"
          </div>
        )}

        {/* Quick Voice Shortcuts */}
        <div className="grid grid-cols-2 gap-2 text-xs font-bold pt-2">
          <button
            onClick={() => processVoiceCommand('play memory game')}
            className="p-2.5 rounded-xl bg-slate-50 hover:bg-rose-50 border border-slate-200 transition-colors text-left flex items-center gap-1.5 cursor-pointer"
          >
            🎮 <span>Play Game</span>
          </button>
          <button
            onClick={() => processVoiceCommand('check medicine')}
            className="p-2.5 rounded-xl bg-slate-50 hover:bg-rose-50 border border-slate-200 transition-colors text-left flex items-center gap-1.5 cursor-pointer"
          >
            💊 <span>Check Meds</span>
          </button>
          <button
            onClick={() => processVoiceCommand('drink water')}
            className="p-2.5 rounded-xl bg-slate-50 hover:bg-rose-50 border border-slate-200 transition-colors text-left flex items-center gap-1.5 cursor-pointer"
          >
            💧 <span>Drink Water</span>
          </button>
          <button
            onClick={() => processVoiceCommand('calm music')}
            className="p-2.5 rounded-xl bg-slate-50 hover:bg-rose-50 border border-slate-200 transition-colors text-left flex items-center gap-1.5 cursor-pointer"
          >
            🎵 <span>Calm Audio</span>
          </button>
        </div>

      </div>
    </div>
  );
};
