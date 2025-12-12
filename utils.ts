
let audioCtx: AudioContext | null = null;

const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

export const playSound = (type: 'success' | 'error' | 'click' | 'fanfare' | 'levelup' | 'alarm' | 'radar_ping' | 'radar_found') => {
  // 1. HAPTIC FEEDBACK (Vibration)
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try {
        switch (type) {
            case 'click': navigator.vibrate(10); break;
            case 'success': navigator.vibrate([50, 50, 50]); break;
            case 'error': navigator.vibrate(300); break;
            case 'alarm': navigator.vibrate([500, 200, 500]); break;
            case 'levelup': navigator.vibrate([100, 50, 100, 50, 200]); break;
            case 'fanfare': navigator.vibrate([100, 50, 100, 50, 100, 50, 200]); break;
            case 'radar_ping': navigator.vibrate(20); break;
            case 'radar_found': navigator.vibrate([100, 100, 100, 100]); break;
        }
    } catch (e) { /* Ignore */ }
  }

  // 2. AUDIO FEEDBACK
  if (typeof window === 'undefined') return;
  if (localStorage.getItem('app_muted') === 'true') return;

  const ctx = initAudio();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  const now = ctx.currentTime;

  if (type === 'success') {
    osc.type = 'sine'; osc.frequency.setValueAtTime(523.25, now); osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.1);
    gain.gain.setValueAtTime(0.1, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3); osc.start(now); osc.stop(now + 0.3);
  } else if (type === 'error') {
    osc.type = 'sawtooth'; osc.frequency.setValueAtTime(150, now); osc.frequency.linearRampToValueAtTime(100, now + 0.2);
    gain.gain.setValueAtTime(0.1, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3); osc.start(now); osc.stop(now + 0.3);
  } else if (type === 'click') {
    osc.type = 'triangle'; osc.frequency.setValueAtTime(800, now);
    gain.gain.setValueAtTime(0.05, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05); osc.start(now); osc.stop(now + 0.05);
  } else if (type === 'fanfare') {
    [0, 0.1, 0.2, 0.4].forEach((delay, i) => {
      const o = ctx.createOscillator(); const g = ctx.createGain(); o.connect(g); g.connect(ctx.destination);
      o.frequency.value = [440, 554, 659, 880][i]; g.gain.setValueAtTime(0.1, now + delay); g.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.5);
      o.start(now + delay); o.stop(now + delay + 0.5);
    });
  } else if (type === 'levelup') {
    const o = ctx.createOscillator(); const g = ctx.createGain(); o.connect(g); g.connect(ctx.destination);
    o.type = 'square'; o.frequency.setValueAtTime(440, now); o.frequency.linearRampToValueAtTime(880, now + 0.5);
    g.gain.setValueAtTime(0.1, now); g.gain.linearRampToValueAtTime(0, now + 0.5);
    o.start(now); o.stop(now + 0.5);
  } else if (type === 'alarm') {
    const o = ctx.createOscillator(); const g = ctx.createGain(); o.connect(g); g.connect(ctx.destination);
    o.type = 'sawtooth'; o.frequency.setValueAtTime(800, now); o.frequency.linearRampToValueAtTime(600, now + 0.3);
    g.gain.setValueAtTime(0.05, now); g.gain.linearRampToValueAtTime(0, now + 0.3);
    o.start(now); o.stop(now + 0.3);
  } else if (type === 'radar_ping') {
    osc.type = 'sine'; osc.frequency.setValueAtTime(880, now); osc.frequency.exponentialRampToValueAtTime(440, now + 0.1);
    gain.gain.setValueAtTime(0.05, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1); 
    osc.start(now); osc.stop(now + 0.1);
  } else if (type === 'radar_found') {
    osc.type = 'triangle'; osc.frequency.setValueAtTime(600, now);
    gain.gain.setValueAtTime(0.1, now); 
    // Pulse effect
    osc.start(now); osc.stop(now + 0.5);
  }
};

/**
 * Calculates distance between two coordinates in meters using Haversine formula
 */
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371e3; // Earth radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
};