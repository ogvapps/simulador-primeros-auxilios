// Daily Quests System
export const QUEST_TYPES = {
    COMPLETE_MODULES: 'complete_modules',
    EARN_XP: 'earn_xp',
    PLAY_GUARDIA: 'play_guardia',
    ANSWER_CORRECT: 'answer_correct',
    REVIEW_GLOSSARY: 'review_glossary',
    TAKE_EXAM: 'take_exam',
    MAINTAIN_STREAK: 'maintain_streak'
};

export const QUEST_TEMPLATES = [
    {
        id: 'modules_2',
        type: QUEST_TYPES.COMPLETE_MODULES,
        target: 2,
        reward: 100,
        title: { es: 'Completa 2 Módulos', en: 'Complete 2 Modules' },
        description: { es: 'Finaliza 2 módulos de aprendizaje', en: 'Finish 2 learning modules' },
        icon: '📚'
    },
    {
        id: 'xp_150',
        type: QUEST_TYPES.EARN_XP,
        target: 150,
        reward: 75,
        title: { es: 'Gana 150 XP', en: 'Earn 150 XP' },
        description: { es: 'Acumula 150 puntos de experiencia', en: 'Accumulate 150 experience points' },
        icon: '⭐'
    },
    {
        id: 'guardia_1',
        type: QUEST_TYPES.PLAY_GUARDIA,
        target: 1,
        reward: 80,
        title: { es: 'Juega Modo Guardia', en: 'Play Guard Mode' },
        description: { es: 'Completa 1 partida en Modo Guardia', en: 'Complete 1 Guard Mode game' },
        icon: '🚨'
    },
    {
        id: 'correct_10',
        type: QUEST_TYPES.ANSWER_CORRECT,
        target: 10,
        reward: 60,
        title: { es: '10 Respuestas Correctas', en: '10 Correct Answers' },
        description: { es: 'Responde correctamente 10 preguntas', en: 'Answer 10 questions correctly' },
        icon: '✅'
    },
    {
        id: 'glossary_5',
        type: QUEST_TYPES.REVIEW_GLOSSARY,
        target: 5,
        reward: 50,
        title: { es: 'Revisa el Glosario', en: 'Review Glossary' },
        description: { es: 'Consulta 5 términos del glosario', en: 'Look up 5 glossary terms' },
        icon: '📖'
    },
    {
        id: 'streak_maintain',
        type: QUEST_TYPES.MAINTAIN_STREAK,
        target: 1,
        reward: 100,
        title: { es: 'Mantén tu Racha', en: 'Maintain Streak' },
        description: { es: 'Inicia sesión hoy para mantener tu racha', en: 'Log in today to maintain your streak' },
        icon: '🔥'
    }
];

// Simple seeded random number generator
const seededRandom = (seed) => {
    let x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
};

// Generate 3 random quests for the day
export const generateDailyQuests = (dateString = new Date().toDateString()) => {
    // Convert date string to a numeric seed
    let seed = dateString.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

    const shuffled = [...QUEST_TEMPLATES];

    // Fisher-Yates shuffle with seeded random
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(seededRandom(seed++) * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled.slice(0, 3).map((quest, idx) => ({
        ...quest,
        id: `daily_${quest.id}_${idx}`,
        progress: 0,
        completed: false
    }));
};

export const WEEKLY_QUEST_TEMPLATES = [
    {
        id: 'modules_weekly',
        type: QUEST_TYPES.COMPLETE_MODULES,
        target: 5,
        reward: 500,
        title: { es: 'Maestro Semanal', en: 'Weekly Master' },
        description: { es: 'Completa 5 módulos esta semana', en: 'Complete 5 modules this week' },
        icon: '📚'
    },
    {
        id: 'xp_weekly',
        type: QUEST_TYPES.EARN_XP,
        target: 1000,
        reward: 400,
        title: { es: 'Cazador de XP', en: 'XP Hunter' },
        description: { es: 'Gana 1000 XP esta semana', en: 'Earn 1000 XP this week' },
        icon: '⚔️'
    },
    {
        id: 'correct_weekly',
        type: QUEST_TYPES.ANSWER_CORRECT,
        target: 50,
        reward: 300,
        title: { es: 'Precisión Semanal', en: 'Weekly Precision' },
        description: { es: '50 Respuestas correctas', en: '50 correct answers' },
        icon: '🎯'
    }
];

// Generate weekly quests
export const generateWeeklyQuests = (date = new Date()) => {
    // Simple week number
    const onejan = new Date(date.getFullYear(), 0, 1);
    const week = Math.ceil((((date - onejan) / 86400000) + onejan.getDay() + 1) / 7);
    const seedStr = `Week${week}-${date.getFullYear()}`;

    let seed = seedStr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

    // For weekly, we just give all 3 distinct ones for now, or randomize 2
    // Let's give all 3 to make it challenging
    return WEEKLY_QUEST_TEMPLATES.map((quest, idx) => ({
        ...quest,
        id: `weekly_${quest.id}_${idx}`,
        progress: 0,
        completed: false
    }));
};

// Check if quest is completed
export const checkQuestProgress = (quest, progress, stats) => {
    switch (quest.type) {
        case QUEST_TYPES.COMPLETE_MODULES:
            return (stats?.modulesCompleted || 0) >= quest.target;
        case QUEST_TYPES.EARN_XP:
            return (stats?.xpEarned || 0) >= quest.target;
        case QUEST_TYPES.PLAY_GUARDIA:
            return (stats?.guardiaPlayed || 0) >= quest.target;
        case QUEST_TYPES.ANSWER_CORRECT:
            return (stats?.correctAnswers || 0) >= quest.target;
        case QUEST_TYPES.REVIEW_GLOSSARY:
            return (stats?.glossaryViews || 0) >= quest.target;
        case QUEST_TYPES.MAINTAIN_STREAK:
            return (progress?.streak || 0) > 0;
        default:
            return false;
    }
};
