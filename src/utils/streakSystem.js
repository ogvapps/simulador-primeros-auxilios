// Perfect Streak System Utility

/**
 * Streak milestones and their rewards
 */
export const STREAK_MILESTONES = [
    { count: 10, badge: 'streak_10', xp: 100, name: 'Hot Streak' },
    { count: 25, badge: 'streak_25', xp: 300, name: 'On Fire' },
    { count: 50, badge: 'streak_50', xp: 500, name: 'Unstoppable' },
    { count: 100, badge: 'streak_100', xp: 1000, name: 'Perfect Master' }
];

/**
 * Checks if a streak milestone was reached
 * @param {number} currentStreak - Current streak count
 * @returns {object|null} - Milestone object if reached, null otherwise
 */
export const checkStreakMilestone = (currentStreak) => {
    return STREAK_MILESTONES.find(m => m.count === currentStreak) || null;
};

/**
 * Updates streak based on answer correctness
 * @param {number} currentStreak - Current streak count
 * @param {boolean} isCorrect - Whether the answer was correct
 * @returns {object} - { newStreak, milestone, reset }
 */
export const updateStreak = (currentStreak, isCorrect) => {
    if (isCorrect) {
        const newStreak = currentStreak + 1;
        const milestone = checkStreakMilestone(newStreak);
        return { newStreak, milestone, reset: false };
    } else {
        return { newStreak: 0, milestone: null, reset: true };
    }
};

/**
 * Gets the next milestone info
 * @param {number} currentStreak - Current streak count
 * @returns {object|null} - Next milestone or null if max reached
 */
export const getNextMilestone = (currentStreak) => {
    return STREAK_MILESTONES.find(m => m.count > currentStreak) || null;
};

/**
 * Calculates progress to next milestone
 * @param {number} currentStreak - Current streak count
 * @returns {number} - Progress percentage (0-100)
 */
export const getStreakProgress = (currentStreak) => {
    const next = getNextMilestone(currentStreak);
    if (!next) return 100; // Max reached

    const prev = STREAK_MILESTONES.filter(m => m.count < next.count).pop();
    const prevCount = prev ? prev.count : 0;

    return ((currentStreak - prevCount) / (next.count - prevCount)) * 100;
};

export default { STREAK_MILESTONES, checkStreakMilestone, updateStreak, getNextMilestone, getStreakProgress };
