import { Wifi, WifiOff, CheckCircle2 } from 'lucide-react';

const OfflineBanner = ({ isOnline, wasOffline }) => {
  if (!isOnline) {
    return (
      <div className="fixed top-0 left-0 right-0 z-[10000] bg-amber-500 text-white px-4 py-2 flex items-center justify-center gap-2 text-sm font-bold shadow-lg animate-in slide-in-from-top-2">
        <WifiOff size={16} />
        Sin conexión — los cambios se guardarán cuando vuelvas a estar online
      </div>
    );
  }
  if (wasOffline) {
    return (
      <div className="fixed top-0 left-0 right-0 z-[10000] bg-green-500 text-white px-4 py-2 flex items-center justify-center gap-2 text-sm font-bold shadow-lg animate-in slide-in-from-top-2">
        <CheckCircle2 size={16} />
        Conexión restaurada
      </div>
    );
  }
  return null;
};

export default OfflineBanner;
