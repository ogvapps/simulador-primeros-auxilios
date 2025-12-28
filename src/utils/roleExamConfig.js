// Role-based exam configuration utility

/**
 * Maps educational roles to exam question counts
 */
export const ROLE_EXAM_CONFIG = {
    '5º Primaria': 20,
    '6º Primaria': 30,
    '1º ESO': 40,
    '2º ESO': 40,
    '3º ESO': 50,
    '4º ESO': 60,
    'Profesorado': 60,
    'Profesor': 60,
    'Teacher': 60,
    'default': 40 // Fallback for unknown roles
};

/**
 * Gets the appropriate number of exam questions for a given role
 * @param {string} role - Student's educational role
 * @returns {number} - Number of questions
 */
export const getExamSizeForRole = (role) => {
    if (!role) return ROLE_EXAM_CONFIG.default;

    // Normalize role string (trim, lowercase for comparison)
    const normalizedRole = role.trim();

    // Direct match
    if (ROLE_EXAM_CONFIG[normalizedRole] !== undefined) {
        return ROLE_EXAM_CONFIG[normalizedRole];
    }

    // Fuzzy matching for common variations
    const lowerRole = normalizedRole.toLowerCase();

    if (lowerRole.includes('5') && lowerRole.includes('primaria')) return 20;
    if (lowerRole.includes('6') && lowerRole.includes('primaria')) return 30;
    if (lowerRole.includes('1') && lowerRole.includes('eso')) return 40;
    if (lowerRole.includes('2') && lowerRole.includes('eso')) return 40;
    if (lowerRole.includes('3') && lowerRole.includes('eso')) return 50;
    if (lowerRole.includes('4') && lowerRole.includes('eso')) return 60;
    if (lowerRole.includes('profesor') || lowerRole.includes('teacher')) return 60;

    return ROLE_EXAM_CONFIG.default;
};

/**
 * Gets all available roles with their question counts
 * @returns {Array} - Array of {role, questions} objects
 */
export const getAllRoleConfigs = () => {
    return Object.entries(ROLE_EXAM_CONFIG)
        .filter(([role]) => role !== 'default')
        .map(([role, questions]) => ({ role, questions }));
};

export default { ROLE_EXAM_CONFIG, getExamSizeForRole, getAllRoleConfigs };
