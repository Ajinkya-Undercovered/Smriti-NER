import React, { createContext, useContext, useState, useEffect } from 'react';
import { localDB } from '../storage/db.js';
import { TRANSLATIONS } from '../i18n/languages.js';
import { speechService } from '../i18n/speechService.js';
import { cognitiveAnalyzer } from '../ai/cognitiveAnalyzer.js';
import { adaptiveEngine } from '../ai/adaptiveEngine.js';
import { supabaseService } from '../storage/supabaseService.js';
import { isSupabaseConfigured } from '../storage/supabaseClient.js';
import { DEFAULT_AUTH_USERS } from '../storage/initialData.js';

const PatientContext = createContext();

export const PatientProvider = ({ children }) => {
  // Auth state - Auto login if session remembered
  const [currentUser, setCurrentUser] = useState(() => localDB.getAuthSession() || DEFAULT_AUTH_USERS[0]);
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(localDB.getAuthSession()));

  const [patient, setPatient] = useState(() => localDB.getPatient());
  const [language, setLanguageState] = useState(() => localDB.getLanguage());
  const [highContrast, setHighContrastState] = useState(() => localDB.getHighContrast());
  const [medications, setMedications] = useState(() => localDB.getMedications());
  const [routines, setRoutines] = useState(() => localDB.getRoutines());
  const [familyAlbum, setFamilyAlbum] = useState(() => localDB.getFamilyAlbum());
  const [gameSessions, setGameSessions] = useState(() => localDB.getSessions());
  const [waterCount, setWaterCount] = useState(() => localDB.getWaterIntake());
  const [currentDifficulty, setCurrentDifficulty] = useState(1);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  
  // Modals state
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isSosOpen, setIsSosOpen] = useState(false);

  // Network state listeners
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Background Cloud Sync with Supabase on mount (if configured)
  useEffect(() => {
    async function initSupabaseSync() {
      if (!isSupabaseConfigured) return;

      try {
        const [cloudPatient, cloudSessions, cloudMeds, cloudFamily] = await Promise.all([
          supabaseService.getPatient(patient.id),
          supabaseService.getGameSessions(patient.id),
          supabaseService.getMedications(patient.id),
          supabaseService.getFamilyAlbum(patient.id)
        ]);

        if (cloudPatient) {
          const merged = { ...patient, ...cloudPatient, regionalName: cloudPatient.regional_name || patient.regionalName };
          setPatient(merged);
          localDB.savePatient(merged);
        }
        if (cloudSessions && cloudSessions.length > 0) {
          setGameSessions(cloudSessions);
        }
        if (cloudMeds && cloudMeds.length > 0) {
          setMedications(cloudMeds);
          localDB.saveMedications(cloudMeds);
        }
        if (cloudFamily && cloudFamily.length > 0) {
          setFamilyAlbum(cloudFamily);
          localDB.saveFamilyAlbum(cloudFamily);
        }
      } catch (err) {
        console.warn('Initial Supabase sync fallback to local store', err);
      }
    }

    initSupabaseSync();
  }, []);

  const login = (user, rememberMe = true) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    if (rememberMe) {
      localDB.saveAuthSession(user);
    }
    localDB.saveRememberedUser(user);
  };

  const logout = () => {
    localDB.clearAuthSession();
    setIsLoggedIn(false);
  };

  const setLanguage = (langCode) => {
    setLanguageState(langCode);
    localDB.saveLanguage(langCode);
    speechService.setLanguage(langCode);
  };

  const setHighContrast = (val) => {
    setHighContrastState(val);
    localDB.saveHighContrast(val);
  };

  const t = TRANSLATIONS[language] || TRANSLATIONS['as'];

  const toggleMedicationTaken = (medId) => {
    const updated = medications.map(med => {
      if (med.id === medId) {
        const nextState = !med.taken;
        return {
          ...med,
          taken: nextState,
          takenAt: nextState ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null
        };
      }
      return med;
    });
    setMedications(updated);
    localDB.saveMedications(updated);
    // Sync to Supabase
    supabaseService.saveMedications(updated, patient.id);
  };

  const addMedication = (newMed) => {
    const updated = [...medications, { ...newMed, id: 'med-' + Date.now(), taken: false }];
    setMedications(updated);
    localDB.saveMedications(updated);
    // Sync to Supabase
    supabaseService.saveMedications(updated, patient.id);
  };

  const incrementWater = () => {
    const nextCount = Math.min(12, waterCount + 1);
    setWaterCount(nextCount);
    localDB.saveWaterIntake(nextCount);
  };

  const addFamilyMember = (member) => {
    const newRecord = { ...member, id: 'fam-' + Date.now() };
    const updated = [...familyAlbum, newRecord];
    setFamilyAlbum(updated);
    localDB.saveFamilyAlbum(updated);
    // Sync to Supabase
    supabaseService.saveFamilyMember(newRecord, patient.id);
  };

  const deleteFamilyMember = (id) => {
    const updated = familyAlbum.filter(f => f.id !== id);
    setFamilyAlbum(updated);
    localDB.saveFamilyAlbum(updated);
    // Sync to Supabase
    supabaseService.deleteFamilyMember(id);
  };

  const logGameSession = (sessionData) => {
    const fluencyScore = adaptiveEngine.calculateFluencyScore(
      sessionData.accuracy,
      sessionData.averageLatencyMs,
      sessionData.moves,
      sessionData.optimalMoves
    );

    const fullSession = {
      ...sessionData,
      fluencyScore,
      currentLevel: currentDifficulty
    };

    const updated = localDB.addSession(fullSession);
    setGameSessions(updated);

    // Sync session to Supabase
    supabaseService.saveGameSession(fullSession, patient.id);

    // AI Adaptive Difficulty check for next session
    const evaluation = adaptiveEngine.evaluateDifficulty({
      accuracy: sessionData.accuracy,
      averageLatencyMs: sessionData.averageLatencyMs,
      errorStreak: sessionData.errorStreak || 0,
      consecutiveMatches: sessionData.consecutiveMatches || 3,
      currentLevel: currentDifficulty,
      sessionDurationSec: sessionData.durationSec || 60
    });

    setCurrentDifficulty(evaluation.nextLevel);
    return { fullSession, evaluation };
  };

  const updatePatientProfile = (updatedProfile) => {
    setPatient(updatedProfile);
    localDB.savePatient(updatedProfile);
    // Sync to Supabase
    supabaseService.savePatient(updatedProfile);
  };

  // Compute live clinical cognitive profile
  const cognitiveProfile = cognitiveAnalyzer.computeCognitiveProfile(gameSessions, patient);

  return (
    <PatientContext.Provider value={{
      currentUser,
      isLoggedIn,
      login,
      logout,
      patient,
      updatePatientProfile,
      language,
      setLanguage,
      highContrast,
      setHighContrast,
      isOffline,
      t,
      medications,
      toggleMedicationTaken,
      addMedication,
      routines,
      familyAlbum,
      addFamilyMember,
      deleteFamilyMember,
      waterCount,
      incrementWater,
      gameSessions,
      logGameSession,
      currentDifficulty,
      setCurrentDifficulty,
      cognitiveProfile,
      isVoiceOpen,
      setIsVoiceOpen,
      isSosOpen,
      setIsSosOpen,
      isSupabaseConfigured
    }}>
      {children}
    </PatientContext.Provider>
  );
};

export const usePatient = () => useContext(PatientContext);
