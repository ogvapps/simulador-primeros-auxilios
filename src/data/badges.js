export const HIDDEN_BADGES_ES = [
  { id: 'streak_3', name: 'Encendido', desc: 'Racha de 3 días', icon: '🔥', secret: false },
  { id: 'streak_7', name: 'Imparable', desc: 'Racha de 7 días', icon: '🚀', secret: true },
  { id: 'night_owl', name: 'Búho Nocturno', desc: 'Estudia pasadas las 22:00', icon: '🦉', secret: true },
  { id: 'speedster', name: 'Velocista', desc: 'Completa un módulo en tiempo récord', icon: '⚡', secret: true },
];

export const HIDDEN_BADGES_EN = [
  { id: 'streak_3', name: 'Ignited', desc: '3-day streak', icon: '🔥', secret: false },
  { id: 'streak_7', name: 'Unstoppable', desc: '7-day streak', icon: '🚀', secret: true },
  { id: 'night_owl', name: 'Night Owl', desc: 'Study after 10 PM', icon: '🦉', secret: true },
  { id: 'speedster', name: 'Speedster', desc: 'Complete a module in record time', icon: '⚡', secret: true },
];

export const HIDDEN_BADGES = HIDDEN_BADGES_ES;

export const ADMIN_PIN = import.meta.env.VITE_ADMIN_PIN || '1120';
