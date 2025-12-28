// Error Heatmap Data Aggregator

/**
 * Analyzes exam attempts from all students to find error patterns
 * @param {Array} students - Array of student objects with exam data
 * @param {Array} questionBank - Full question bank for reference
 * @returns {Array} - Error statistics per question
 */
export const generateErrorHeatmap = (students, questionBank) => {
    if (!students || !questionBank) return [];

    // Initialize counters for each question
    const questionStats = questionBank.map((q, idx) => ({
        questionIndex: idx,
        question: q.question,
        totalAttempts: 0,
        wrongAnswers: 0,
        errorRate: 0,
        commonWrongAnswers: {}
    }));

    // Aggregate data from all students
    students.forEach(student => {
        const rawAttempts = student.progress?.examAttempts;
        // If it's a number (legacy counter), we can't get heatmap data from it
        if (!rawAttempts || !Array.isArray(rawAttempts)) return;

        rawAttempts.forEach(attempt => {
            if (!attempt || !attempt.answers) return;

            // Normalize answers to entries [qIdx, answerData]
            // Handles both legacy Array and new Object formats
            const answerEntries = Array.isArray(attempt.answers)
                ? attempt.answers.map((a, i) => [i, a])
                : Object.entries(attempt.answers);

            answerEntries.forEach(([qIdxStr, answerData]) => {
                const qIdx = parseInt(qIdxStr);
                if (isNaN(qIdx) || qIdx >= questionStats.length) return;

                const questionDef = questionBank[qIdx];
                if (!questionDef) return;

                questionStats[qIdx].totalAttempts++;

                let isCorrect = false;
                let selectedOptionValue = null;

                // Handle string answers (simple format) vs object answers (detailed format)
                if (typeof answerData === 'object' && answerData !== null) {
                    isCorrect = !!answerData.correct;
                    selectedOptionValue = answerData.selected;
                } else {
                    // Simple string answer, check against questionBank
                    isCorrect = answerData === questionDef.a;
                    selectedOptionValue = answerData;
                }

                if (!isCorrect) {
                    questionStats[qIdx].wrongAnswers++;

                    if (selectedOptionValue !== undefined && selectedOptionValue !== null) {
                        const optionKey = String(selectedOptionValue);
                        questionStats[qIdx].commonWrongAnswers[optionKey] =
                            (questionStats[qIdx].commonWrongAnswers[optionKey] || 0) + 1;
                    }
                }
            });
        });
    });

    // Calculate error rates
    questionStats.forEach(stat => {
        if (stat.totalAttempts > 0) {
            stat.errorRate = Math.round((stat.wrongAnswers / stat.totalAttempts) * 100);
        }

        // Find most common wrong answer
        const wrongAnswerEntries = Object.entries(stat.commonWrongAnswers);
        if (wrongAnswerEntries.length > 0) {
            wrongAnswerEntries.sort((a, b) => b[1] - a[1]);
            stat.mostCommonWrongAnswer = parseInt(wrongAnswerEntries[0][0]);
            stat.mostCommonWrongAnswerCount = wrongAnswerEntries[0][1];
        }
    });

    // Filter out questions with no attempts
    return questionStats.filter(stat => stat.totalAttempts > 0);
};

/**
 * Gets color based on error rate
 */
export const getErrorColor = (errorRate) => {
    if (errorRate < 30) return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' };
    if (errorRate < 60) return { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300' };
    return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' };
};

export default { generateErrorHeatmap, getErrorColor };
