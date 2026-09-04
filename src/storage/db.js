// Offline-First Local Storage & IndexedDB Synchronization Database
import { 
  INITIAL_PATIENT_PROFILE, 
  INITIAL_FAMILY_ALBUM, 
  INITIAL_MEDICATIONS, 
  INITIAL_DAILY_ROUTINES,
  INITIAL_GAME_SESSIONS,
  DEFAULT_AUTH_USERS
} from './initialData.js';

const STORAGE_KEYS = {
  PATIENT: 'smriti_ner_patient',
  FAMILY: 'smriti_ner_family',
  MEDS: 'smriti_ner_meds',
  ROUTINES: 'smriti_ner_routines',
  SESSIONS: 'smriti_ner_sessions',
  WATER: 'smriti_ner_water',
  LANGUAGE: 'smriti_ner_lang',
  HIGH_CONTRAST: 'smriti_ner_high_contrast',
  AUTH_SESSION: 'smriti_ner_auth_session',
  REMEMBERED_USER: 'smriti_ner_remembered_user'
  ,TODOS: 'smriti_ner_todos'
};

class LocalDB {
  getAuthSession() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  saveAuthSession(session) {
    try {
      localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(session));
    } catch (e) {
      console.error('Auth session save error', e);
    }
  }

  clearAuthSession() {
    try {
      localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
    } catch (e) {
      console.error('Auth session clear error', e);
    }
  }

  getRememberedUser() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REMEMBERED_USER);
      return data ? JSON.parse(data) : DEFAULT_AUTH_USERS[0];
    } catch {
      return DEFAULT_AUTH_USERS[0];
    }
  }

  saveRememberedUser(user) {
    try {
      localStorage.setItem(STORAGE_KEYS.REMEMBERED_USER, JSON.stringify(user));
    } catch (e) {
      console.error('Remembered user save error', e);
    }
  }

  getPatient() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PATIENT);
      return data ? { ...INITIAL_PATIENT_PROFILE, ...JSON.parse(data) } : INITIAL_PATIENT_PROFILE;
    } catch {
      return INITIAL_PATIENT_PROFILE;
    }
  }

  savePatient(patient) {
    try {
      localStorage.setItem(STORAGE_KEYS.PATIENT, JSON.stringify(patient));
    } catch (e) {
      console.error('Storage save error', e);
    }
  }

  getFamilyAlbum() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FAMILY);
      if (!data) return INITIAL_FAMILY_ALBUM;
      const parsed = JSON.parse(data);
      // Auto-migrate if stored photos contain emojis or missing http URLs
      if (Array.isArray(parsed) && parsed.some(p => !p.photoUrl || !p.photoUrl.startsWith('http'))) {
        localStorage.setItem(STORAGE_KEYS.FAMILY, JSON.stringify(INITIAL_FAMILY_ALBUM));
        return INITIAL_FAMILY_ALBUM;
      }
      return parsed;
    } catch {
      return INITIAL_FAMILY_ALBUM;
    }
  }

  saveFamilyAlbum(album) {
    try {
      localStorage.setItem(STORAGE_KEYS.FAMILY, JSON.stringify(album));
    } catch (e) {
      console.error('Storage save error', e);
    }
  }

  getMedications() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MEDS);
      return data ? JSON.parse(data) : INITIAL_MEDICATIONS;
    } catch {
      return INITIAL_MEDICATIONS;
    }
  }

  saveMedications(meds) {
    try {
      localStorage.setItem(STORAGE_KEYS.MEDS, JSON.stringify(meds));
    } catch (e) {
      console.error('Storage save error', e);
    }
  }

  getRoutines() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ROUTINES);
      return data ? JSON.parse(data) : INITIAL_DAILY_ROUTINES;
    } catch {
      return INITIAL_DAILY_ROUTINES;
    }
  }

  getSessions() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      return data ? JSON.parse(data) : INITIAL_GAME_SESSIONS;
    } catch {
      return INITIAL_GAME_SESSIONS;
    }
  }

  addSession(session) {
    try {
      const sessions = this.getSessions();
      sessions.push({ ...session, id: 'sess-' + Date.now(), timestamp: Date.now() });
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
      return sessions;
    } catch (e) {
      console.error('Storage session save error', e);
      return [];
    }
  }

  getWaterIntake() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WATER);
      if (data) {
        const parsed = JSON.parse(data);
        const today = new Date().toDateString();
        if (parsed.date === today) return parsed.count || 4;
      }
      return 4;
    } catch {
      return 4;
    }
  }

  saveWaterIntake(count) {
    try {
      const record = { date: new Date().toDateString(), count };
      localStorage.setItem(STORAGE_KEYS.WATER, JSON.stringify(record));
    } catch (e) {
      console.error('Water save error', e);
    }
  }

  getTodos() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TODOS);
      return data ? JSON.parse(data) : [
        { id: 'todo-1', title: 'Take morning medicine', time: '08:30 AM', completed: false },
        { id: 'todo-2', title: 'Drink water', time: '10:00 AM', completed: false },
        { id: 'todo-3', title: 'Complete cognitive game', time: '11:00 AM', completed: false },
        { id: 'todo-4', title: 'Talk to family', time: '06:00 PM', completed: false }
      ];
    } catch {
      return [];
    }
  }

  saveTodos(todos) {
    try {
      localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(todos));
    } catch (e) {
      console.error('Todo save error', e);
    }
  }

  getLanguage() {
    try {
      return localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'en';
    } catch {
      return 'en';
    }
  }

  saveLanguage(lang) {
    try {
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
    } catch (e) {
      console.error('Lang save error', e);
    }
  }

  getHighContrast() {
    try {
      return localStorage.getItem(STORAGE_KEYS.HIGH_CONTRAST) === 'true';
    } catch {
      return false;
    }
  }

  saveHighContrast(val) {
    try {
      localStorage.setItem(STORAGE_KEYS.HIGH_CONTRAST, val ? 'true' : 'false');
    } catch (e) {
      console.error('Contrast save error', e);
    }
  }
}

export const localDB = new LocalDB();

