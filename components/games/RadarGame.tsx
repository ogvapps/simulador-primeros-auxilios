import React, { useEffect, useState, useRef } from 'react';
import { Navigation, Loader2, MapPin, CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react';
import { calculateDistance, playSound } from '../../utils';
import { GeoTarget } from '../../types';
import { Button } from '../DesignSystem';
import { MODULES } from '../../constants';

interface RadarGameProps {
  targets: GeoTarget[];
  onUnlock: (moduleId: string) => void;
  onExit: () => void;
}

export const RadarGame = ({ targets, onUnlock, onExit }: RadarGameProps) => {
  const [currentPos, setCurrentPos] = useState<{lat: number, lng: number} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [closestTarget, setClosestTarget] = useState<{id: string, distance: number, moduleName: string} | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const watchIdRef = useRef<number | null>(null);
  const lastPingRef = useRef<number>(0);

  // Filter only active targets that are modules
  const activeTargets = targets.filter(t => t.active);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Tu dispositivo no soporta geolocalización.");
      setIsScanning(false);
      return;
    }

    const handleSuccess = (pos: GeolocationPosition) => {
      const { latitude, longitude } = pos.coords;
      setCurrentPos({ lat: latitude, lng: longitude });
      
      // Calculate distances to all targets
      let nearest: {id: string, distance: number, moduleName: string} | null = null;
      let minDst = Infinity;

      activeTargets.forEach(target => {
        const d = calculateDistance(latitude, longitude, target.lat, target.lng);
        if (d < minDst) {
          minDst = d;
          const mod = MODULES.find(m => m.id === target.id);
          nearest = { id: target.id, distance: d, moduleName: mod?.title || 'Misión Desconocida' };
        }
      });

      setClosestTarget(nearest);
      setError(null);

      // Radar Sound Logic based on proximity
      const now = Date.now();
      if (nearest) {
          let pingInterval = 2000;
          if (nearest.distance < 20) pingInterval = 300; // Super fast (Hot)
          else if (nearest.distance < 50) pingInterval = 800; // Fast (Warm)
          else if (nearest.distance < 100) pingInterval = 1500; // Medium

          if (now - lastPingRef.current > pingInterval) {
              playSound(nearest.distance < 20 ? 'radar_found' : 'radar_ping');
              lastPingRef.current = now;
          }
      }
    };

    const handleError = (err: GeolocationPositionError) => {
      console.error(err);
      if (err.code === 1) setError("Permiso de ubicación denegado.");
      else if (err.code === 2) setError("Ubicación no disponible.");
      else setError("Error al obtener ubicación.");
    };

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    watchIdRef.current = navigator.geolocation.watchPosition(handleSuccess, handleError, options);

    return () => {
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, [activeTargets]);

  const getSignalStrength = (dist: number) => {
      if (dist > 100) return { text: "Señal Débil", color: "text-blue-400", bg: "bg-blue-400/20" };
      if (dist > 40) return { text: "Señal Media", color: "text-yellow-400", bg: "bg-yellow-400/20" };
      return { text: "SEÑAL FUERTE", color: "text-red-500", bg: "bg-red-500/20" };
  };

  const handleUnlock = () => {
      if (closestTarget) {
          playSound('success');
          onUnlock(closestTarget.id);
      }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 text-green-500 font-mono flex flex-col items-center justify-between p-4 overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
             style={{ 
                 backgroundImage: 'linear-gradient(rgba(0, 255, 0, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 0, 0.2) 1px, transparent 1px)', 
                 backgroundSize: '40px 40px' 
             }}>
        </div>

        {/* Header */}
        <div className="w-full flex justify-between items-center z-10 border-b border-green-500/50 pb-4 bg-slate-900/80 backdrop-blur">
            <button onClick={onExit} className="text-green-500 hover:text-white flex items-center"><ArrowLeft className="mr-2"/> SALIR</button>
            <div className="text-center">
                <h2 className="font-bold text-xl tracking-widest">RADAR OPS</h2>
                <div className="text-xs flex items-center justify-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    ONLINE
                </div>
            </div>
            <Navigation className="animate-spin-slow" />
        </div>

        {/* Radar Visual */}
        <div className="relative w-80 h-80 my-8 flex items-center justify-center z-10">
            {/* Circles */}
            <div className="absolute inset-0 border border-green-500/30 rounded-full"></div>
            <div className="absolute inset-8 border border-green-500/30 rounded-full"></div>
            <div className="absolute inset-20 border border-green-500/30 rounded-full"></div>
            <div className="absolute inset-32 border border-green-500/50 rounded-full bg-green-500/5"></div>
            
            {/* Scanner Line */}
            {isScanning && !error && (
                <div className="absolute top-1/2 left-1/2 w-[45%] h-1 bg-gradient-to-r from-transparent to-green-500 origin-left animate-[spin_3s_linear_infinite] shadow-[0_0_15px_rgba(34,197,94,0.8)]"></div>
            )}

            {/* Target Dot - Only visualize roughly */}
            {closestTarget && closestTarget.distance < 150 && (
                <div className="absolute top-10 left-1/2 w-4 h-4 bg-red-500 rounded-full animate-ping shadow-lg"></div>
            )}
            
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                 {error ? (
                     <div className="text-red-500 text-center px-4">
                         <AlertTriangle className="mx-auto mb-2" />
                         <span className="text-xs">{error}</span>
                     </div>
                 ) : !closestTarget ? (
                     <div className="text-center">
                         <Loader2 className="mx-auto mb-2 animate-spin" />
                         <span className="text-xs">ESCANEANDO...</span>
                     </div>
                 ) : (
                     <div className="text-center bg-slate-900/80 p-2 rounded border border-green-500/50 backdrop-blur-sm">
                         <div className="text-4xl font-bold text-white mb-1">{closestTarget.distance}m</div>
                         <div className={`text-xs font-bold px-2 py-1 rounded ${getSignalStrength(closestTarget.distance).color}`}>
                             {getSignalStrength(closestTarget.distance).text}
                         </div>
                     </div>
                 )}
            </div>
        </div>

        {/* Footer / Controls */}
        <div className="w-full max-w-md z-10 space-y-4">
            {closestTarget ? (
                <div className={`p-4 rounded-xl border border-green-500/30 bg-slate-800/80 backdrop-blur transition-all duration-300 ${closestTarget.distance < 20 ? 'border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)]' : ''}`}>
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-xs uppercase text-slate-400">Objetivo Detectado</span>
                        <span className="text-xs font-mono">{closestTarget.id.toUpperCase()}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4">{closestTarget.moduleName}</h3>
                    
                    {closestTarget.distance < 20 ? (
                        <Button 
                            fullWidth 
                            variant="primary" 
                            size="xl" 
                            onClick={handleUnlock}
                            className="animate-pulse"
                            leftIcon={<MapPin />}
                        >
                            ACCEDER A LA ZONA
                        </Button>
                    ) : (
                        <div className="text-center text-sm text-slate-400 animate-pulse">
                            Acércate más para desbloquear la misión...
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center text-slate-500 text-sm">
                    {activeTargets.length === 0 ? "No hay misiones activas en esta zona." : "Muévete para detectar señales de emergencia."}
                </div>
            )}
            
            {/* Debug/Skip for testing if needed (hidden in prod) */}
            {/* <button onClick={() => onUnlock(activeTargets[0]?.id || 'sim_patio')} className="text-xs text-slate-700 w-full">Forzar Desbloqueo (Debug)</button> */}
        </div>
    </div>
  );
};