import { useEffect, useState } from 'react';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

const DISMISS_KEY = 'lucy-install-banner-dismissed-v1';

const isStandalone = () => {
  const hasMatchMedia = typeof window.matchMedia === 'function';
  const displayModeStandalone = hasMatchMedia ? window.matchMedia('(display-mode: standalone)').matches : false;

  return (
    displayModeStandalone ||
    ('standalone' in navigator && (navigator as Navigator & { standalone?: boolean }).standalone === true)
  );
};

export const InstallPromptBanner = () => {
  const [visible, setVisible] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (isStandalone()) {
      return;
    }

    const dismissed = localStorage.getItem(DISMISS_KEY) === 'true';
    if (!dismissed) {
      setVisible(true);
    }

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    const handleInstalled = () => {
      setVisible(false);
      localStorage.setItem(DISMISS_KEY, 'true');
      setInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(DISMISS_KEY, 'true');
  };

  const install = async () => {
    if (!installPrompt) {
      dismiss();
      return;
    }

    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;

    if (choice.outcome === 'accepted') {
      localStorage.setItem(DISMISS_KEY, 'true');
      setVisible(false);
    }

    setInstallPrompt(null);
  };

  if (!visible) {
    return null;
  }

  return (
    <aside className="fixed bottom-4 left-1/2 z-50 w-[min(92vw,32rem)] -translate-x-1/2 rounded-2xl bg-white/95 p-4 shadow-xl backdrop-blur">
      <p className="text-sm font-bold text-teal-900 sm:text-base">Install Lucy Phonics for offline use! 📱</p>
      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={() => void install()}
          className="rounded-full bg-teal-600 px-4 py-2 text-sm font-black text-white"
        >
          Add to Home Screen
        </button>
        <button
          type="button"
          onClick={dismiss}
          className="rounded-full bg-teal-100 px-4 py-2 text-sm font-bold text-teal-800"
        >
          Maybe later
        </button>
      </div>
    </aside>
  );
};
