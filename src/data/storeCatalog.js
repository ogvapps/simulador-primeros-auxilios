// Store Catalog - Expanded with bilingual support

export const STORE_ITEMS = {
    avatars: [
        {
            id: 'default',
            name: { es: 'Por Defecto', en: 'Default' },
            icon: '👤',
            price: 0,
            description: { es: 'Avatar estándar', en: 'Standard avatar' }
        },
        {
            id: 'medical_pro',
            name: { es: 'Profesional Médico', en: 'Medical Professional' },
            icon: '👨‍⚕️',
            price: 100,
            description: { es: 'Avatar de médico profesional', en: 'Professional medic avatar' }
        },
        {
            id: 'nurse',
            name: { es: 'Enfermera', en: 'Nurse' },
            icon: '👩‍⚕️',
            price: 100,
            description: { es: 'Avatar de enfermera', en: 'Nurse avatar' }
        },
        {
            id: 'superhero',
            name: { es: 'Superhéroe Médico', en: 'Superhero Medic' },
            icon: '🦸',
            price: 200,
            description: { es: 'Héroe de primeros auxilios', en: 'Hero of first aid' }
        },
        {
            id: 'star',
            name: { es: 'Estrella Dorada', en: 'Golden Star' },
            icon: '⭐',
            price: 300,
            description: { es: 'Rendimiento élite', en: 'Elite performer' }
        },
        {
            id: 'fire',
            name: { es: 'Bombero', en: 'Fire Fighter' },
            icon: '🚒',
            price: 250,
            description: { es: 'Respondedor de emergencias', en: 'Emergency responder' }
        },
        {
            id: 'ambulance',
            name: { es: 'Paramédico', en: 'Paramedic' },
            icon: '🚑',
            price: 250,
            description: { es: 'Especialista en ambulancias', en: 'Ambulance specialist' }
        },
        {
            id: 'scientist',
            name: { es: 'Científico', en: 'Scientist' },
            icon: '🧑‍🔬',
            price: 300,
            description: { es: 'Investigador médico', en: 'Medical researcher' }
        },
        {
            id: 'robot',
            name: { es: 'Robot Médico', en: 'Medical Robot' },
            icon: '🤖',
            price: 400,
            description: { es: 'Tecnología del futuro', en: 'Future technology' }
        },
        {
            id: 'crown',
            name: { es: 'Corona Real', en: 'Royal Crown' },
            icon: '👑',
            price: 500,
            description: { es: 'El mejor de todos', en: 'The best of all' }
        },
        {
            id: 'wizard',
            name: { es: 'Mago Sanador', en: 'Healing Wizard' },
            icon: '🧙',
            price: 350,
            description: { es: 'Magia de curación', en: 'Healing magic' }
        },
        {
            id: 'ninja',
            name: { es: 'Ninja Médico', en: 'Medical Ninja' },
            icon: '🥷',
            price: 400,
            description: { es: 'Rápido y preciso', en: 'Fast and precise' }
        }
    ],
    powerups: [
        {
            id: 'extra_time',
            name: { es: 'Tiempo Extra', en: 'Extra Time' },
            icon: '⏰',
            price: 50,
            description: { es: '+5 minutos en el próximo examen', en: '+5 minutes on next exam' },
            effect: 'time',
            value: 300
        },
        {
            id: 'skip_question',
            name: { es: 'Saltar Pregunta', en: 'Skip Question' },
            icon: '⏭️',
            price: 100,
            description: { es: 'Salta una pregunta difícil', en: 'Skip one difficult question' },
            effect: 'skip',
            value: 1
        },
        {
            id: 'streak_freeze',
            name: { es: 'Congelar Racha', en: 'Streak Freeze' },
            icon: '🧊',
            price: 300,
            description: { es: 'Mantén tu racha si olvidas un día', en: 'Keep your streak if you miss a day' },
            effect: 'freeze_streak',
            value: 1
        },
        {
            id: 'double_xp',
            name: { es: 'XP Doble', en: 'Double XP' },
            icon: '✨',
            price: 150,
            description: { es: '2x XP en el próximo examen', en: '2x XP on next exam' },
            effect: 'xp_multiplier',
            value: 2
        },
        {
            id: 'hint',
            name: { es: 'Revelar Pista', en: 'Hint Reveal' },
            icon: '💡',
            price: 75,
            description: { es: 'Revela una pista para una pregunta', en: 'Reveal hint for one question' },
            effect: 'hint',
            value: 1
        },
        {
            id: 'shield',
            name: { es: 'Escudo Protector', en: 'Protection Shield' },
            icon: '🛡️',
            price: 120,
            description: { es: 'Protege de una respuesta incorrecta', en: 'Protect from one wrong answer' },
            effect: 'shield',
            value: 1
        },
        {
            id: 'freeze',
            name: { es: 'Congelar Tiempo', en: 'Freeze Time' },
            icon: '❄️',
            price: 200,
            description: { es: 'Pausa el cronómetro por 2 minutos', en: 'Pause timer for 2 minutes' },
            effect: 'freeze',
            value: 120
        },
        {
            id: 'lucky',
            name: { es: 'Trébol de la Suerte', en: 'Lucky Clover' },
            icon: '🍀',
            price: 80,
            description: { es: 'Elimina 2 respuestas incorrectas', en: 'Remove 2 wrong answers' },
            effect: 'eliminate',
            value: 2
        },
        {
            id: 'brain',
            name: { es: 'Potenciador Cerebral', en: 'Brain Booster' },
            icon: '🧠',
            price: 90,
            description: { es: 'Muestra la explicación antes de responder', en: 'Show explanation before answering' },
            effect: 'preview',
            value: 1
        },
        {
            id: 'rocket',
            name: { es: 'Cohete Turbo', en: 'Turbo Rocket' },
            icon: '🚀',
            price: 180,
            description: { es: 'Completa automáticamente 3 preguntas fáciles', en: 'Auto-complete 3 easy questions' },
            effect: 'autocomplete',
            value: 3
        },
        {
            id: 'crystal',
            name: { es: 'Bola de Cristal', en: 'Crystal Ball' },
            icon: '🔮',
            price: 250,
            description: { es: 'Ve las respuestas correctas de 5 preguntas', en: 'See correct answers for 5 questions' },
            effect: 'reveal',
            value: 5
        }
    ],
    themes: [
        {
            id: 'ocean',
            name: { es: 'Océano Azul', en: 'Ocean Blue' },
            icon: '🌊',
            price: 150,
            description: { es: 'Tema azul relajante', en: 'Relaxing blue theme' },
            colors: { primary: '#0ea5e9', secondary: '#0284c7' }
        },
        {
            id: 'forest',
            name: { es: 'Bosque Verde', en: 'Forest Green' },
            icon: '🌲',
            price: 200,
            description: { es: 'Tema verde natural', en: 'Natural green theme' },
            colors: { primary: '#10b981', secondary: '#059669' }
        },
        {
            id: 'sunset',
            name: { es: 'Atardecer Naranja', en: 'Sunset Orange' },
            icon: '🌅',
            price: 250,
            description: { es: 'Tema naranja cálido', en: 'Warm orange theme' },
            colors: { primary: '#f97316', secondary: '#ea580c' }
        },
        {
            id: 'galaxy',
            name: { es: 'Galaxia Púrpura', en: 'Purple Galaxy' },
            icon: '🌌',
            price: 300,
            description: { es: 'Tema púrpura espacial', en: 'Space purple theme' },
            colors: { primary: '#a855f7', secondary: '#9333ea' }
        },
        {
            id: 'fire',
            name: { es: 'Fuego Rojo', en: 'Fire Red' },
            icon: '🔥',
            price: 350,
            description: { es: 'Tema rojo intenso', en: 'Intense red theme' },
            colors: { primary: '#ef4444', secondary: '#dc2626' }
        },
        {
            id: 'gold',
            name: { es: 'Oro Premium', en: 'Premium Gold' },
            icon: '✨',
            price: 500,
            description: { es: 'Tema dorado exclusivo', en: 'Exclusive gold theme' },
            colors: { primary: '#fbbf24', secondary: '#f59e0b' }
        }
    ],
    titles: [
        {
            id: 'novice',
            name: { es: 'Novato', en: 'Novice' },
            icon: '🌱',
            price: 0,
            description: { es: 'Título inicial', en: 'Starting title' },
            color: 'text-slate-600'
        },
        {
            id: 'quick_learner',
            name: { es: 'Aprendiz Rápido', en: 'Quick Learner' },
            icon: '⚡',
            price: 100,
            description: { es: 'Para los que aprenden velozmente', en: 'For those who learn fast' },
            color: 'text-yellow-600'
        },
        {
            id: 'lifesaver',
            name: { es: 'Salvavidas', en: 'Lifesaver' },
            icon: '🆘',
            price: 200,
            description: { es: 'Héroe de emergencias', en: 'Emergency hero' },
            color: 'text-red-600'
        },
        {
            id: 'medic',
            name: { es: 'Sanitario', en: 'Medic' },
            icon: '⚕️',
            price: 250,
            description: { es: 'Profesional de la salud', en: 'Health professional' },
            color: 'text-blue-600'
        },
        {
            id: 'guardian',
            name: { es: 'Guardián', en: 'Guardian' },
            icon: '🛡️',
            price: 300,
            description: { es: 'Protector de vidas', en: 'Protector of lives' },
            color: 'text-indigo-600'
        },
        {
            id: 'expert',
            name: { es: 'Experto', en: 'Expert' },
            icon: '🎓',
            price: 400,
            description: { es: 'Maestro del conocimiento', en: 'Master of knowledge' },
            color: 'text-purple-600'
        },
        {
            id: 'legend',
            name: { es: 'Leyenda', en: 'Legend' },
            icon: '🏆',
            price: 500,
            description: { es: 'Los mejores de los mejores', en: 'The best of the best' },
            color: 'text-amber-600'
        },
        {
            id: 'speedster',
            name: { es: 'El Veloz', en: 'The Swift' },
            icon: '💨',
            price: 350,
            description: { es: 'Respuestas a la velocidad de la luz', en: 'Lightning-fast responses' },
            color: 'text-cyan-600'
        },
        {
            id: 'perfectionist',
            name: { es: 'Perfeccionista', en: 'Perfectionist' },
            icon: '💯',
            price: 600,
            description: { es: 'Solo acepta la excelencia', en: 'Only accepts excellence' },
            color: 'text-green-600'
        },
        {
            id: 'unstoppable',
            name: { es: 'Imparable', en: 'Unstoppable' },
            icon: '🔥',
            price: 450,
            description: { es: 'Nada te detiene', en: 'Nothing stops you' },
            color: 'text-orange-600'
        },
        {
            id: 'master',
            name: { es: 'Maestro PAS', en: 'PAS Master' },
            icon: '👑',
            price: 800,
            description: { es: 'El título más prestigioso', en: 'The most prestigious title' },
            color: 'text-yellow-500'
        },
        {
            id: 'champion',
            name: { es: 'Campeón', en: 'Champion' },
            icon: '🥇',
            price: 700,
            description: { es: 'Ganador absoluto', en: 'Absolute winner' },
            color: 'text-yellow-600'
        }
    ]
};

export const getItemById = (category, id) => {
    return STORE_ITEMS[category]?.find(item => item.id === id);
};

export const getItemPrice = (category, id) => {
    const item = getItemById(category, id);
    return item ? item.price : 0;
};

export const getLocalizedName = (item, lang = 'es') => {
    return typeof item.name === 'object' ? item.name[lang] : item.name;
};

export const getLocalizedDescription = (item, lang = 'es') => {
    return typeof item.description === 'object' ? item.description[lang] : item.description;
};

export default STORE_ITEMS;
