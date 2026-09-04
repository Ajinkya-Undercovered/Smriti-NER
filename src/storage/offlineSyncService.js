// Offline Mutation Queue & Background Cloud Synchronization Service
import { isSupabaseConfigured } from './supabaseClient.js';
import { supabaseService } from './supabaseService.js';

const QUEUE_KEY = 'smriti_ner_offline_sync_queue';

class OfflineSyncService {
  constructor() {
    this.isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    this.syncStatus = 'synced'; // 'synced' | 'pending' | 'syncing'
    this.listeners = new Set();

    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.handleNetworkChange(true));
      window.addEventListener('offline', () => this.handleNetworkChange(false));
    }
  }

  subscribe(callback) {
    this.listeners.add(callback);
    // Initial notification
    callback({
      isOnline: this.isOnline,
      syncStatus: this.syncStatus,
      pendingCount: this.getQueue().length
    });
    return () => this.listeners.delete(callback);
  }

  notify() {
    const state = {
      isOnline: this.isOnline,
      syncStatus: this.syncStatus,
      pendingCount: this.getQueue().length
    };
    this.listeners.forEach((cb) => cb(state));
  }

  getQueue() {
    try {
      const data = localStorage.getItem(QUEUE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  saveQueue(queue) {
    try {
      localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
      this.notify();
    } catch (e) {
      console.error('Failed to save offline queue', e);
    }
  }

  enqueue(actionType, payload) {
    const queue = this.getQueue();
    const item = {
      id: `queue-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      actionType,
      payload,
      timestamp: Date.now()
    };
    queue.push(item);
    this.syncStatus = 'pending';
    this.saveQueue(queue);

    // If online right now, attempt immediate background flush
    if (this.isOnline) {
      this.flushQueue();
    }
  }

  async handleNetworkChange(online) {
    this.isOnline = online;
    if (online) {
      this.flushQueue();
    } else {
      this.syncStatus = this.getQueue().length > 0 ? 'pending' : 'synced';
      this.notify();
    }
  }

  async flushQueue() {
    const queue = this.getQueue();
    if (queue.length === 0) {
      this.syncStatus = 'synced';
      this.notify();
      return;
    }

    if (!isSupabaseConfigured()) {
      // Local storage is primary storage
      this.syncStatus = 'synced';
      this.notify();
      return;
    }

    this.syncStatus = 'syncing';
    this.notify();

    const remaining = [];

    for (const item of queue) {
      try {
        if (item.actionType === 'LOG_GAME_SESSION') {
          await supabaseService.logGameSession(item.payload);
        } else if (item.actionType === 'UPDATE_PATIENT_VITALS') {
          await supabaseService.updatePatientVitals(item.payload.patientId, item.payload.updates);
        }
        // Successfully synced item is omitted from remaining
      } catch (err) {
        console.warn('Sync attempt failed for item, keeping in queue', item, err);
        remaining.push(item);
      }
    }

    this.saveQueue(remaining);
    this.syncStatus = remaining.length === 0 ? 'synced' : 'pending';
    this.notify();
  }
}

export const offlineSyncService = new OfflineSyncService();
