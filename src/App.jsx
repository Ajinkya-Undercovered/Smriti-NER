import React, { useState } from 'react';
import { Mic, Home } from 'lucide-react';
import { PatientProvider, usePatient } from './context/PatientContext.jsx';
import { Header } from './components/Header.jsx';
import { BottomNav } from './components/BottomNav.jsx';
import { SimplifiedSeniorHome } from './components/home/SimplifiedSeniorHome.jsx';
import { CaregiverDashboard } from './components/dashboard/CaregiverDashboard.jsx';
import { AshaWorkerPortal } from './components/dashboard/AshaWorkerPortal.jsx';
import { GameCenter } from './components/games/GameCenter.jsx';
import { SmartVoiceReminders } from './components/reminders/SmartVoiceReminders.jsx';
import { CalmView } from './components/CalmView.jsx';
import { DoctorAppointmentsView } from './components/doctor/DoctorAppointmentsView.jsx';
import { ClinicalView } from './components/ClinicalView.jsx';
import { DrawerMenu } from './components/DrawerMenu.jsx';
import { VoiceAssistantModal } from './components/VoiceAssistantModal.jsx';
import { DoctorProfileModal } from './components/DoctorProfileModal.jsx';
import { LoginPage } from './components/LoginPage.jsx';
import { soundFx } from './utils/audio.js';

function MainApp() {
  const { isLoggedIn, login, currentUser } = usePatient();
  const [activeTab, setActiveTab] = useState('home');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);

  const [settings, setSettings] = useState({
    textSize: 'normal',
    voiceSpeed: 0.85,
    soundEffects: true,
    voiceGuidance: true,
    highContrast: false,
    language: 'as',
  });

  const handleVoiceFabClick = () => {
    soundFx.playSingingBowl();
    setIsVoiceOpen(true);
  };

  const getTextClass = () => {
    if (settings.textSize === 'large') return 'text-large';
    if (settings.textSize === 'xlarge') return 'text-xlarge';
    return '';
  };

  if (!isLoggedIn) {
    return (
      <LoginPage 
        onLoginSuccess={(user, rememberMe) => {
          login(user, rememberMe);
        }} 
      />
    );
  }

  const userRole = currentUser?.role || 'patient';

  return (
    <div
      className={`min-h-screen bg-[#fef2f2] text-[#111827] pb-[110px] md:pb-12 ${getTextClass()} ${
        settings.highContrast ? 'contrast-125' : ''
      }`}
    >
      {/* Sticky Top App Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onDoctorClick={() => setIsDoctorModalOpen(true)}
      />

      {/* Main Screen Content */}
      <main className="max-w-[1200px] mx-auto px-4 md:px-12 py-6 md:py-8">
        
        {/* 1. Dynamic Role-Based Home Hub */}
        {activeTab === 'home' && (
          <>
            {userRole === 'caregiver' ? (
              <CaregiverDashboard
                onLaunchPatientMode={() => setActiveTab('games')}
                onNavigateTab={(t) => setActiveTab(t)}
              />
            ) : userRole === 'asha_worker' ? (
              <AshaWorkerPortal
                onLaunchPatientMode={() => setActiveTab('games')}
                onNavigateClinical={() => setActiveTab('clinical')}
              />
            ) : (
              <SimplifiedSeniorHome
                onNavigate={(tabId) => setActiveTab(tabId)}
                onOpenVoice={() => setIsVoiceOpen(true)}
              />
            )}
          </>
        )}

        {/* 2. All 8 Dementia Therapeutic Games Suite */}
        {activeTab === 'games' && (
          <GameCenter onBackHome={() => setActiveTab('home')} />
        )}

        {/* 3. Medicines, Water & Smart Voice Reminders */}
        {activeTab === 'reminders' && (
          <SmartVoiceReminders onBackHome={() => setActiveTab('home')} />
        )}

        {/* 4. Reminiscence Audio & Guided Breathing */}
        {activeTab === 'calm' && (
          <div className="space-y-4 animate-fade-in max-w-4xl mx-auto">
            <button
              onClick={() => setActiveTab('home')}
              className="px-4 py-2.5 rounded-2xl bg-white border-2 border-rose-200 hover:bg-rose-50 text-rose-900 font-black text-xs flex items-center gap-2 cursor-pointer shadow-xs mb-2"
            >
              <Home size={16} />
              <span>Back to Home (ঘৰলৈ উভতি যাওক)</span>
            </button>
            <CalmView />
          </div>
        )}

        {/* 5. Doctor & ASHA Appointments */}
        {activeTab === 'doctor' && (
          <DoctorAppointmentsView onBackHome={() => setActiveTab('home')} />
        )}

        {/* 6. Clinical Radar & Longitudinal Monitoring */}
        {activeTab === 'clinical' && (
          <div className="space-y-4 animate-fade-in max-w-5xl mx-auto">
            <button
              onClick={() => setActiveTab('home')}
              className="px-4 py-2.5 rounded-2xl bg-white border-2 border-rose-200 hover:bg-rose-50 text-rose-900 font-black text-xs flex items-center gap-2 cursor-pointer shadow-xs mb-2"
            >
              <Home size={16} />
              <span>Back to Home (ঘৰলৈ উভতি যাওক)</span>
            </button>
            <ClinicalView />
          </div>
        )}

      </main>

      {/* Floating Voice Microphone Action Button */}
      <button
        id="floating-voice-button"
        onClick={handleVoiceFabClick}
        aria-label="Activate AI voice assistant companion"
        className="fixed bottom-[96px] md:bottom-12 right-4 md:right-12 w-[80px] h-[80px] bg-[#f43f5e] text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-[#e11d48] transition-all active:scale-90 duration-200 z-40 cursor-pointer ring-4 ring-[#fda4af]/60 animate-breathe"
        title="Tap to talk with your Voice Companion"
      >
        <Mic className="w-10 h-10" />
      </button>

      {/* Bottom Navigation Bar */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Modals & Drawers */}
      <DrawerMenu
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        settings={settings}
        setSettings={setSettings}
        onOpenVoice={() => {
          setIsDrawerOpen(false);
          setIsVoiceOpen(true);
        }}
      />

      <VoiceAssistantModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
      />

      <DoctorProfileModal
        isOpen={isDoctorModalOpen}
        onClose={() => setIsDoctorModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <PatientProvider>
      <MainApp />
    </PatientProvider>
  );
}
