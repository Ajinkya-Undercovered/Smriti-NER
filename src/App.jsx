import React, { useState } from 'react';
import { Home } from 'lucide-react';
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
import { PatientProgress } from './components/patient/PatientProgress.jsx';
import { PatientTodo } from './components/patient/PatientTodo.jsx';

function MainApp() {
  const { isLoggedIn, isDemoMode, login, enterDemo, logout, currentUser } = usePatient();
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
        onTryDemo={enterDemo}
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
      {isDemoMode && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-full bg-amber-100 border-2 border-amber-300 px-4 py-2 text-xs font-black text-amber-950 shadow-lg">
          <span>Demo Mode</span>
          <button type="button" onClick={logout} className="underline cursor-pointer">Exit Demo</button>
        </div>
      )}
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

        {activeTab === 'progress' && (
          <PatientProgress onBackHome={() => setActiveTab('home')} />
        )}

        {activeTab === 'todo' && (
          <PatientTodo onBackHome={() => setActiveTab('home')} />
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
