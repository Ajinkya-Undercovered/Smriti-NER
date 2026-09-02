import React, { useState, useEffect } from 'react';
import { usePatient } from '../../context/PatientContext.jsx';
import { useSound } from '../../context/SoundContext.jsx';
import { speechService } from '../../i18n/speechService.js';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  BookOpen, 
  Wind, 
  Heart, 
  Play, 
  Square,
  Users
} from 'lucide-react';
import { FamilyMemoryBook } from './FamilyMemoryBook.jsx';

export const ReminiscenceCorner = () => {
  const { t, language } = usePatient();
  const { isPlayingAmbient, ambientType, playAmbientSound, stopAmbient } = useSound();

  const [activeTab, setActiveTab] = useState('audio'); // 'audio', 'stories', 'breathing', 'family'
  const [breathingPhase, setBreathingPhase] = useState('inhale'); // 'inhale', 'hold', 'exhale'
  const [activeStory, setActiveStory] = useState(null);

  // Breathing cadence timer
  useEffect(() => {
    if (activeTab !== 'breathing') return;

    const interval = setInterval(() => {
      setBreathingPhase(prev => {
        if (prev === 'inhale') return 'hold';
        if (prev === 'hold') return 'exhale';
        return 'inhale';
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [activeTab]);

  const STORIES = [
    {
      id: 'bihu-story',
      title: 'Spring Bihu Memories (ৰঙালী বিহুৰ সোণালী স্মৃতি)',
      state: 'Assam',
      icon: '🌾',
      content: 'The sweet fragrance of Nahor flowers, the joyful rhythm of the Dhol and Pepa across the village fields, and weaving delicate red Kopou Phool into Mekhela Chador.',
      contentAs: 'বসন্তৰ আগমনত কুলিৰ মাত, নাহৰ ফুলৰ সুবাস আৰু ঢোল-পেপাঁৰ সুমধুৰ ধ্বনিৰে উজলি উঠা বিহুৰ আনন্দময় দিন।'
    },
    {
      id: 'wangala-story',
      title: 'The 100-Drums Wangala Festival (Wangala)',
      state: 'Meghalaya (Garo Hills)',
      icon: '🥁',
      content: 'Giving gratitude to Misi Saljong, the Great Giver, with traditional colorful turbans, rhythmic dance, and sharing freshly harvested sticky rice cakes with the community.',
      contentAs: 'মিচি চালজং দেৱতালৈ কৃতজ্ঞতা জনাই এশটা ঢোলৰ তালত গাৰো পাহাৰত আনন্দৰ নৃত্য আৰু নতুন ধানৰ উৎসৱ।'
    },
    {
      id: 'chapchar-story',
      title: 'Mizoram Chapchar Kut & Bamboo Songs',
      state: 'Mizoram',
      icon: '🎋',
      content: 'Clear blue mountain skies, dancing between rhythmic bamboo poles with laughter, and singing folk ballads around the warm village fire in Aizawl.',
      contentAs: 'পাহাৰৰ শীতল বতাহ, চেৰাও বাঁহ নৃত্যৰ লয় আৰু সমাজৰ প্ৰতিজনৰ সৈতে হাঁহি-আনন্দৰ ভাগ-বতৰা।'
    },
    {
      id: 'sangai-story',
      title: 'Loktak Lake & The Dancing Deer of Manipur',
      state: 'Manipur',
      icon: '🛶',
      content: 'Gliding on wooden canoes through mist on Loktak Lake, watching the sacred brow-antlered Sangai deer graze peacefully on floating green phumdi islands.',
      contentAs: 'মণিপুৰৰ লোকতাক হ্ৰদৰ শান্ত পানী আৰু পবিত্ৰ চাংগাই হৰিণাৰ সুন্দৰ দৃশ্য।'
    }
  ];

  const handleReadStory = (story) => {
    setActiveStory(story);
    const textToRead = language === 'as' ? story.contentAs : story.content;
    speechService.speak(`${story.title}. ${textToRead}`, language);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Title Header */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-purple-100 text-xs font-bold mb-3">
            <Sparkles size={14} className="text-amber-300" />
            <span>Reminiscence Therapy & Calm Mind</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black mb-2 tracking-tight">
            {t.reminiscenceTitle}
          </h2>
          <p className="text-purple-100/90 text-sm sm:text-base leading-relaxed">
            Nostalgic folk stories, soothing North Eastern natural ambient sounds, and calming breathing to promote emotional well-being and alleviate anxiety.
          </p>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveTab('audio')}
          className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'audio' 
              ? 'bg-purple-700 text-white shadow-sm' 
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-purple-50'
          }`}
        >
          <Volume2 size={18} />
          <span>Regional Ambient Sounds</span>
        </button>

        <button
          onClick={() => setActiveTab('stories')}
          className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'stories' 
              ? 'bg-purple-700 text-white shadow-sm' 
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-purple-50'
          }`}
        >
          <BookOpen size={18} />
          <span>Folklore & Heritage Stories</span>
        </button>

        <button
          onClick={() => setActiveTab('breathing')}
          className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'breathing' 
              ? 'bg-purple-700 text-white shadow-sm' 
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-purple-50'
          }`}
        >
          <Wind size={18} />
          <span>Guided Calm Breathing</span>
        </button>

        <button
          onClick={() => setActiveTab('family')}
          className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'family' 
              ? 'bg-purple-700 text-white shadow-sm' 
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-purple-50'
          }`}
        >
          <Users size={18} />
          <span>Family Memory Album</span>
        </button>
      </div>

      {/* 1. Regional Ambient Audio Tab */}
      {activeTab === 'audio' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          
          {/* Brahmaputra River Waves */}
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-100 text-cyan-800 flex items-center justify-center text-3xl">
              🌊
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">{t.ambientSound}</h3>
              <p className="text-xs text-slate-500 mt-1">Gentle flowing river water ripples to induce tranquility</p>
            </div>
            <button
              onClick={() => isPlayingAmbient && ambientType === 'river' ? stopAmbient() : playAmbientSound('river')}
              className={`w-full py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isPlayingAmbient && ambientType === 'river'
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-cyan-700 hover:bg-cyan-800 text-white shadow-xs'
              }`}
            >
              {isPlayingAmbient && ambientType === 'river' ? <Square size={16} /> : <Play size={16} />}
              <span>{isPlayingAmbient && ambientType === 'river' ? 'Stop Sound' : 'Play Gentle River'}</span>
            </button>
          </div>

          {/* Cherrapunji Soothing Rain */}
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center text-3xl">
              🌧️
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">{t.rainSound}</h3>
              <p className="text-xs text-slate-500 mt-1">Calming rainfall sound from Meghalaya's misty valleys</p>
            </div>
            <button
              onClick={() => isPlayingAmbient && ambientType === 'rain' ? stopAmbient() : playAmbientSound('rain')}
              className={`w-full py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isPlayingAmbient && ambientType === 'rain'
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-teal-700 hover:bg-teal-800 text-white shadow-xs'
              }`}
            >
              {isPlayingAmbient && ambientType === 'rain' ? <Square size={16} /> : <Play size={16} />}
              <span>{isPlayingAmbient && ambientType === 'rain' ? 'Stop Sound' : 'Play Valley Rain'}</span>
            </button>
          </div>

          {/* Himalayan Mountain Bamboo Flute */}
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-3xl">
              🪈
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">{t.fluteSound}</h3>
              <p className="text-xs text-slate-500 mt-1">Meditative acoustic bamboo flute to ease restlessness</p>
            </div>
            <button
              onClick={() => isPlayingAmbient && ambientType === 'flute' ? stopAmbient() : playAmbientSound('flute')}
              className={`w-full py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isPlayingAmbient && ambientType === 'flute'
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
              }`}
            >
              {isPlayingAmbient && ambientType === 'flute' ? <Square size={16} /> : <Play size={16} />}
              <span>{isPlayingAmbient && ambientType === 'flute' ? 'Stop Sound' : 'Play Bamboo Flute'}</span>
            </button>
          </div>

        </div>
      )}

      {/* 2. Folklore & Heritage Stories */}
      {activeTab === 'stories' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {STORIES.map(story => (
              <div
                key={story.id}
                className="bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl p-2.5 bg-amber-50 rounded-2xl">{story.icon}</span>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{story.title}</h4>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      {story.state}
                    </span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {language === 'as' ? story.contentAs : story.content}
                </p>
                <button
                  onClick={() => handleReadStory(story)}
                  className="w-full py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer border border-purple-200"
                >
                  <Volume2 size={16} />
                  <span>Listen to Story Narration</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Guided Calm Breathing */}
      {activeTab === 'breathing' && (
        <div className="bg-white border-2 border-purple-200 rounded-3xl p-8 sm:p-12 text-center shadow-sm max-w-lg mx-auto space-y-6">
          <h3 className="text-2xl font-black text-slate-900">{t.breatheWithMe}</h3>
          
          {/* Animated Orchid Breathing Visualizer */}
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto flex items-center justify-center">
            <div className={`absolute inset-0 rounded-full bg-gradient-to-tr from-purple-300 to-pink-300 opacity-30 transition-all duration-3000 ease-in-out ${
              breathingPhase === 'inhale' ? 'scale-125' : breathingPhase === 'hold' ? 'scale-115' : 'scale-90'
            }`}></div>

            <div className={`w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex flex-col items-center justify-center shadow-xl transition-all duration-3000 ease-in-out ${
              breathingPhase === 'inhale' ? 'scale-110' : breathingPhase === 'hold' ? 'scale-100' : 'scale-90'
            }`}>
              <span className="text-4xl mb-1">🌸</span>
              <span className="text-base sm:text-lg font-black uppercase tracking-wider">
                {breathingPhase === 'inhale' ? t.inhale : breathingPhase === 'hold' ? t.hold : t.exhale}
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-sm mx-auto">
            Focus gently on the expanding flower. Feel the soothing freshness of North Eastern morning breeze.
          </p>
        </div>
      )}

      {/* 4. Family Memory Book */}
      {activeTab === 'family' && (
        <FamilyMemoryBook />
      )}

    </div>
  );
};
