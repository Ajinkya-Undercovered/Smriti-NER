import React, { createContext, useContext, useState, useEffect } from 'react';
import { localDB } from '../storage/db.js';
import { offlineSyncService } from '../storage/offlineSyncService.js';
import { TRANSLATIONS } from '../i18n/languages.js';
import { speechService } from '../i18n/speechService.js';
import { cognitiveAnalyzer } from '../ai/cognitiveAnalyzer.js';
import { adaptiveEngine } from '../ai/adaptiveEngine.js';
import {
  DEFAULT_AUTH_USERS,
  INITIAL_PATIENT_PROFILE,
  INITIAL_FAMILY_ALBUM,
  INITIAL_MEDICATIONS,
  INITIAL_DAILY_ROUTINES,
  INITIAL_GAME_SESSIONS
} from '../storage/initialData.js';

const PatientContext = createContext();
const DEMO_TODOS = [
  { id: 'demo-todo-1', title: 'Take morning medicine', time: '08:30 AM', completed: false },
  { id: 'demo-todo-2', title: 'Drink water', time: '10:00 AM', completed: false },
  { id: 'demo-todo-3', title: 'Complete cognitive game', time: '11:00 AM', completed: false },
  { id: 'demo-todo-4', title: 'Talk to family', time: '06:00 PM', completed: false }
];

export const PatientProvider = ({ children }) => {
  // Auth state - Auto login if session remembered
  const [currentUser, setCurrentUser] = useState(() => localDB.getAuthSession() || DEFAULT_AUTH_USERS[0]);
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(localDB.getAuthSession()));
  const [isDemoMode, setIsDemoMode] = useState(false);

  const [patient, setPatient] = useState(() => localDB.getPatient());
  const [language, setLanguageState] = useState(() => localDB.getLanguage());
  const [highContrast, setHighContrastState] = useState(() => localDB.getHighContrast());
  const [medications, setMedications] = useState(() => localDB.getMedications());
  const [routines, setRoutines] = useState(() => localDB.getRoutines());
  const [familyAlbum, setFamilyAlbum] = useState(() => localDB.getFamilyAlbum());
  const [gameSessions, setGameSessions] = useState(() => localDB.getSessions());
  const [waterCount, setWaterCount] = useState(() => localDB.getWaterIntake());
  const [todos, setTodos] = useState(() => localDB.getTodos());
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

  const login = (user, rememberMe = true) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    setIsDemoMode(false);

    // Sync patient profile with logged-in user so the name displays everywhere!
    const updatedPatient = {
      ...patient,
      id: user.patientId || user.id || patient.id,
      name: user.role === 'patient' ? (user.name || patient.name) : (user.linkedName || patient.name),
      regionalName: user.role === 'patient' ? (user.regionalName || user.name || patient.regionalName) : patient.regionalName,
      location: user.location || patient.location,
      condition: user.condition || user.cognitiveStatus || patient.condition,
      caregiverName: user.role === 'caregiver' ? user.name : (user.linkedName || patient.caregiverName),
      ashaWorkerName: user.role === 'asha_worker' ? user.name : patient.ashaWorkerName
    };
    setPatient(updatedPatient);
    localDB.savePatient(updatedPatient);

    if (rememberMe) {
      localDB.saveAuthSession(user);
    }
    localDB.saveRememberedUser(user);
  };

  const enterDemo = (role = 'patient', customName = '') => {
    const trimmedName = customName && typeof customName === 'string' && customName.trim() ? customName.trim() : null;
    const defaultName = role === 'caregiver' ? 'Ananya Hazarika' : role === 'asha_worker' ? 'Pratima Das' : 'Bipin Chandra Hazarika';
    const effectiveName = trimmedName || defaultName;

    const demoPatient = {
      ...INITIAL_PATIENT_PROFILE,
      id: 'demo-patient',
      name: role === 'patient' ? effectiveName : 'Bipin Chandra Hazarika',
      regionalName: role === 'patient' ? effectiveName : 'বিপিন চন্দ্ৰ হাজৰিকা',
      location: 'Tezpur, Assam',
      condition: 'Mild Cognitive Impairment (MCI)',
      caregiverName: role === 'caregiver' ? effectiveName : 'Ananya Hazarika',
      caregiverPhone: '+91 90000 00000',
      ashaWorkerName: role === 'asha_worker' ? effectiveName : 'Pratima Das',
      ashaPhone: '+91 90000 00001'
    };
    const demoUser = {
      id: 'demo-patient',
      name: effectiveName,
      regionalName: effectiveName,
      role,
      patientId: 'demo-patient',
      avatar: role === 'caregiver' ? '👩‍⚕️' : role === 'asha_worker' ? '🩺' : '👴',
      location: 'Tezpur, Assam',
      condition: 'Active Account'
    };
    setCurrentUser(demoUser);
    setPatient(demoPatient);
    setMedications(INITIAL_MEDICATIONS);
    setRoutines(INITIAL_DAILY_ROUTINES);
    setFamilyAlbum(INITIAL_FAMILY_ALBUM);
    setGameSessions(INITIAL_GAME_SESSIONS);
    setWaterCount(4);
    setTodos(DEMO_TODOS);
    setIsDemoMode(true);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localDB.clearAuthSession();
    setIsLoggedIn(false);
    setIsDemoMode(false);
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
    if (!isDemoMode) {
      localDB.saveMedications(updated);
    }
  };

  const addMedication = (newMed) => {
    const updated = [...medications, { ...newMed, id: 'med-' + Date.now(), taken: false }];
    setMedications(updated);
    if (!isDemoMode) {
      localDB.saveMedications(updated);
    }
  };

  const incrementWater = () => {
    const nextCount = Math.min(12, waterCount + 1);
    setWaterCount(nextCount);
    if (!isDemoMode) localDB.saveWaterIntake(nextCount);
  };

  const saveTodoList = (updatedTodos) => {
    setTodos(updatedTodos);
    if (!isDemoMode) localDB.saveTodos(updatedTodos);
  };

  const addTodo = (todo) => saveTodoList([...todos, { ...todo, id: `todo-${Date.now()}`, completed: false }]);
  const updateTodo = (id, changes) => saveTodoList(todos.map(todo => todo.id === id ? { ...todo, ...changes } : todo));
  const deleteTodo = (id) => saveTodoList(todos.filter(todo => todo.id !== id));

  const addFamilyMember = (member) => {
    const newRecord = { ...member, id: 'fam-' + Date.now() };
    const updated = [...familyAlbum, newRecord];
    setFamilyAlbum(updated);
    if (!isDemoMode) {
      localDB.saveFamilyAlbum(updated);
    }
  };

  const deleteFamilyMember = (id) => {
    const updated = familyAlbum.filter(f => f.id !== id);
    setFamilyAlbum(updated);
    if (!isDemoMode) {
      localDB.saveFamilyAlbum(updated);
    }
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

    const updated = isDemoMode ? [...gameSessions, { ...fullSession, id: `demo-${Date.now()}`, timestamp: Date.now() }] : localDB.addSession(fullSession);
    setGameSessions(updated);

    if (!isDemoMode) {
      offlineSyncService.enqueue('LOG_GAME_SESSION', {
        patientId: patient?.id || 'bipin-72',
        gameId: sessionData.gameId || 'memory-match',
        score: sessionData.score || 0,
        accuracy: sessionData.accuracy || 100,
        latencyMs: sessionData.averageLatencyMs || 1200,
        fluencyScore
      });
    }


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
    if (!isDemoMode) {
      localDB.savePatient(updatedProfile);
    }
  };

  // Compute live clinical cognitive profile
  const cognitiveProfile = cognitiveAnalyzer.computeCognitiveProfile(gameSessions, patient);

  return (
    <PatientContext.Provider value={{
      currentUser,
      isLoggedIn,
      isDemoMode,
      login,
      enterDemo,
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
      todos,
      addTodo,
      updateTodo,
      deleteTodo,
      gameSessions,
      logGameSession,
      currentDifficulty,
      setCurrentDifficulty,
      cognitiveProfile,
      isVoiceOpen,
      setIsVoiceOpen,
      isSosOpen,
      setIsSosOpen,
    }}>
      {children}
    </PatientContext.Provider>
  );
};

export const usePatient = () => useContext(PatientContext);
