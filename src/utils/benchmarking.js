// Performance Benchmarking Utility

/**
 * Calculates student's percentile rank
 * @param {number} studentValue - Student's metric value
 * @param {Array} allValues - All students' values for this metric
 * @returns {number} - Percentile (0-100)
 */
export const calculatePercentile = (studentValue, allValues) => {
    if (!allValues || allValues.length === 0) return 50;

    const sorted = [...allValues].sort((a, b) => a - b);
    const rank = sorted.filter(v => v < studentValue).length;
    return Math.round((rank / sorted.length) * 100);
};

/**
 * Calculates average of an array
 */
const average = (arr) => arr.reduce((sum, val) => sum + val, 0) / arr.length;

/**
 * Generates comprehensive benchmark data for a student
 * @param {object} student - Current student object
 * @param {Array} allStudents - All students in the class
 * @returns {object} - Benchmark metrics
 */
export const generateBenchmark = (student, allStudents) => {
    if (!student || !allStudents || allStudents.length < 2) {
        return null; // Need at least 2 students for comparison
    }

    const myXP = student.progress?.xp || 0;
    const myLevel = student.progress?.level || 1;
    const myExamScore = student.progress?.examScore || 0;
    const myStreak = student.progress?.streak || 0;

    const allXP = allStudents.map(s => s.progress?.xp || 0);
    const allLevels = allStudents.map(s => s.progress?.level || 1);
    const allExamScores = allStudents.filter(s => s.progress?.examScore).map(s => s.progress.examScore);
    const allStreaks = allStudents.map(s => s.progress?.streak || 0);

    const avgXP = average(allXP);
    const avgLevel = average(allLevels);
    const avgExamScore = allExamScores.length > 0 ? average(allExamScores) : 0;
    const avgStreak = average(allStreaks);

    return {
        xp: {
            value: myXP,
            average: Math.round(avgXP),
            percentile: calculatePercentile(myXP, allXP),
            vsAverage: avgXP > 0 ? Math.round(((myXP - avgXP) / avgXP) * 100) : 0
        },
        level: {
            value: myLevel,
            average: avgLevel.toFixed(1),
            percentile: calculatePercentile(myLevel, allLevels),
            vsAverage: avgLevel > 0 ? Math.round(((myLevel - avgLevel) / avgLevel) * 100) : 0
        },
        examScore: allExamScores.length > 0 ? {
            value: myExamScore,
            average: avgExamScore.toFixed(1),
            percentile: calculatePercentile(myExamScore, allExamScores),
            vsAverage: avgExamScore > 0 ? Math.round(((myExamScore - avgExamScore) / avgExamScore) * 100) : 0
        } : null,
        streak: {
            value: myStreak,
            average: Math.round(avgStreak),
            percentile: calculatePercentile(myStreak, allStreaks),
            vsAverage: avgStreak > 0 ? Math.round(((myStreak - avgStreak) / avgStreak) * 100) : 0
        },
        classSize: allStudents.length
    };
};

/**
 * Gets performance tier based on percentile
 */
export const getPerformanceTier = (percentile) => {
    if (percentile >= 90) return { name: 'Elite', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' };
    if (percentile >= 75) return { name: 'Excellent', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' };
    if (percentile >= 50) return { name: 'Good', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' };
    if (percentile >= 25) return { name: 'Average', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' };
    return { name: 'Needs Improvement', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' };
};

export default { generateBenchmark, calculatePercentile, getPerformanceTier };
