import React, { useState, useEffect } from 'react';
import { Download, Laptop } from 'lucide-react';

export const InstallPwaButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode (already installed)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Fallback instructions if browser already cached install state
      alert('To install Smriti-NER on your laptop:\n\n1. Look at your browser address bar (top right).\n2. Click the small "Install" computer icon.\n3. Click "Install".\n\nOnce installed, Smriti-NER works like a native app with zero Wi-Fi!');
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  if (isInstalled) {
    return null; // Already running as native installed app
  }

  return (
    <button
      onClick={handleInstallClick}
      className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs shadow-xs cursor-pointer transition-transform active:scale-95 border border-emerald-500"
      title="Install as Desktop App for 100% Offline Launch"
    >
      <Laptop size={14} />
      <span>Install App (অফলাইন এপ)</span>
    </button>
  );
};
