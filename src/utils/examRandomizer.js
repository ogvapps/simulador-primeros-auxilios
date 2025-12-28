// Random Exam Generator Utility

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
export const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

/**
 * Selects N random questions from a question bank
 * @param {Array} questionBank - Full array of questions
 * @param {number} count - Number of questions to select
 * @returns {Array} - Randomly selected questions
 */
export const selectRandomQuestions = (questionBank, count) => {
    if (!questionBank || questionBank.length === 0) {
        console.warn('Question bank is empty');
        return [];
    }

    if (count >= questionBank.length) {
        // If requesting more than available, return all shuffled
        return shuffleArray(questionBank);
    }

    const shuffled = shuffleArray(questionBank);
    return shuffled.slice(0, count);
};

/**
 * Generates a unique exam session for a student
 * Stores which questions they got for consistency
 */
export const generateExamSession = (questionBank, examSize, userId) => {
    const selectedQuestions = selectRandomQuestions(questionBank, examSize);

    return {
        userId,
        questions: selectedQuestions,
        questionIds: selectedQuestions.map((q, idx) => idx), // Track original indices
        generatedAt: new Date().toISOString(),
        examSize
    };
};

export default { shuffleArray, selectRandomQuestions, generateExamSession };
