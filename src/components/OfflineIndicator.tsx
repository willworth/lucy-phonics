import { useEffect, useState } from 'react';

export const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(() => (typeof navigator === 'undefined' ? true : navigator.onLine));

  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);

    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed left-3 top-3 z-40 flex items-center gap-2 rounded-full bg-white/85 px-3 py-2 text-xs font-bold text-teal-900 shadow">
      <span aria-hidden className="text-base">
        ☁️
      </span>
      <span
        aria-hidden
        className={`inline-block h-2.5 w-2.5 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-amber-400'}`}
      />
      <span>{isOnline ? 'Ready' : 'Offline mode'}</span>
    </div>
  );
};
