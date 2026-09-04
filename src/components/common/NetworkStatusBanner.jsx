import React, { useState, useEffect } from 'react';
import { offlineSyncService } from '../../storage/offlineSyncService.js';
import { Wifi, WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';

export const NetworkStatusBanner = () => {
  const [networkState, setNetworkState] = useState({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    syncStatus: 'synced',
    pendingCount: 0
  });

  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const unsubscribe = offlineSyncService.subscribe((state) => {
      setNetworkState(state);
    });
    return unsubscribe;
  }, []);

  const { isOnline, syncStatus, pendingCount } = networkState;

  return (
    <div className="relative inline-flex items-center">
      <button
        onClick={() => setShowTooltip(!showTooltip)}
        className={`px-3 py-1 rounded-2xl text-xs font-black flex items-center gap-1.5 transition-all shadow-2xs border cursor-pointer ${
          !isOnline
            ? 'bg-amber-100 text-amber-950 border-amber-300 animate-pulse'
            : syncStatus === 'syncing'
            ? 'bg-blue-100 text-blue-900 border-blue-300'
            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
        }`}
        title="Click to view network & offline status"
      >
        {!isOnline ? (
          <>
            <WifiOff size={13} className="text-amber-700" />
            <span>Offline Mode (অফলাইন)</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-600 text-white rounded-full text-[10px]">
                {pendingCount}
              </span>
            )}
          </>
        ) : syncStatus === 'syncing' ? (
          <>
            <RefreshCw size={13} className="text-blue-600 animate-spin" />
            <span>Syncing {pendingCount}...</span>
          </>
        ) : (
          <>
            <CheckCircle2 size={13} className="text-emerald-600" />
            <span className="hidden sm:inline">Cloud Synced ✓</span>
            <span className="sm:hidden">Online ✓</span>
          </>
        )}
      </button>

      {/* Interactive Tooltip on Click */}
      {showTooltip && (
        <div className="absolute right-0 top-full mt-2 w-72 p-4 bg-white rounded-2xl shadow-xl border-2 border-slate-200 z-50 text-left animate-fade-in text-xs space-y-2">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
            <span className="font-black text-slate-900 flex items-center gap-1.5">
              {!isOnline ? <WifiOff size={14} className="text-amber-600" /> : <Wifi size={14} className="text-emerald-600" />}
              {!isOnline ? 'Offline Mode Active' : 'Online & Connected'}
            </span>
            <button
              onClick={() => setShowTooltip(false)}
              className="text-slate-400 hover:text-slate-700 font-bold"
            >
              ✕
            </button>
          </div>
          <p className="text-slate-600 leading-relaxed text-[11px]">
            {!isOnline
              ? 'Smriti-NER is operating 100% offline. All 8 cognitive games, medicine reminders, and ASHA field tools work locally without internet. Changes will auto-sync once reconnected.'
              : 'Connected to Supabase cloud. All clinical assessments and game latencies are synchronized in real-time.'}
          </p>
          {!isOnline && pendingCount > 0 && (
            <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 font-bold text-[10px]">
              📌 {pendingCount} offline records stored locally waiting to sync.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
