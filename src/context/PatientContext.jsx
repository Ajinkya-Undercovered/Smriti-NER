import React, { createContext, useContext, useState, useEffect } from 'react';
import { localDB } from '../storage/db.js';
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
    if (rememberMe) {
      localDB.saveAuthSession(user);
    }
    localDB.saveRememberedUser(user);
  };

  const enterDemo = (role = 'patient') => {
    const demoPatient = {
      ...INITIAL_PATIENT_PROFILE,
      id: 'demo-patient',
      name: 'Demo Patient',
      regionalName: 'ডেমো ৰোগী',
      location: 'Tezpur, Assam',
      condition: 'Demo data only',
      caregiverName: 'Demo Caregiver',
      caregiverPhone: '+91 90000 00000',
      ashaWorkerName: 'Demo ASHA Officer',
      ashaPhone: '+91 90000 00001'
    };
    setCurrentUser({
      id: 'demo-patient',
      name: role === 'caregiver' ? 'Demo Caregiver' : role === 'asha_worker' ? 'Demo Officer' : 'Demo Patient',
      regionalName: role === 'caregiver' ? 'ডেমো পৰিচৰ্যাকাৰী' : role === 'asha_worker' ? 'ডেমো আশা কৰ্মী' : 'ডেমো ৰোগী',
      role,
      patientId: 'demo-patient',
      avatar: '👴',
      location: 'Tezpur, Assam',
      condition: 'Demo data only'
    });
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
