// AI Mentor - Heuristic Analysis for Student Performance

export const generateMentorInsight = (student, badgeModules, t) => {
    const progress = student.progress || {};
    const level = progress.level || 1;
    const xp = progress.xp || 0;
    const examPassed = progress.examenPassed;
    const examScore = progress.examenScore || 0;

    // Calculate module completion
    const completedModules = badgeModules.filter(m => progress[`${m.id}Completed`]).length;
    const completionRate = badgeModules.length > 0 ? (completedModules / badgeModules.length) * 100 : 0;

    // Calculate activity
    const lastUpdate = new Date(student.lastUpdate);
    const daysSinceActive = (new Date() - lastUpdate) / (1000 * 60 * 60 * 24);

    let strength = "";
    let weakness = "";
    let advice = "";

    // STRENGTH ANALYSIS
    if (examPassed && examScore >= 9) {
        strength = "🌟 Excelencia académica demostrada. Dominio total del contenido.";
    } else if (completionRate === 100) {
        strength = "✅ Ha completado todos los módulos. Gran compromiso con el aprendizaje.";
    } else if (xp > 500) {
        strength = "⚡ Alto nivel de experiencia acumulada. Estudiante muy activo.";
    } else if (daysSinceActive < 1) {
        strength = "🔥 Muy activo recientemente. Mantiene el ritmo de estudio.";
    } else if (completionRate > 50) {
        strength = "📚 Progreso sólido en más de la mitad del curso.";
    } else {
        strength = "🌱 En fase inicial de aprendizaje.";
    }

    // WEAKNESS ANALYSIS
    if (daysSinceActive > 7) {
        weakness = "⚠️ Inactivo por más de 7 días. Riesgo de abandono.";
    } else if (!examPassed && completionRate === 100) {
        weakness = "📝 Todos los módulos completados pero examen pendiente. Posible miedo al examen.";
    } else if (examPassed && examScore < 6) {
        weakness = "📊 Aprobado por los pelos. Conocimientos frágiles.";
    } else if (completionRate < 30 && daysSinceActive > 3) {
        weakness = "🐌 Ritmo de avance muy lento. Necesita motivación.";
    } else if (level < 3 && xp < 100) {
        weakness = "🆕 Estudiante muy nuevo. Aún familiarizándose con la plataforma.";
    } else {
        weakness = "🔍 Sin debilidades críticas detectadas.";
    }

    // ADVICE GENERATION
    if (daysSinceActive > 7) {
        advice = "💡 Contactar personalmente. Ofrecer sesión de recuperación o tutoría individual.";
    } else if (!examPassed && completionRate === 100) {
        advice = "🎯 Animar a realizar el examen. Recordar que ya tiene todo el conocimiento necesario.";
    } else if (examPassed && examScore < 6) {
        advice = "📖 Sugerir repaso de módulos clave. Considerar examen de recuperación para mejorar nota.";
    } else if (completionRate < 50) {
        advice = "🚀 Establecer metas semanales. Gamificar el progreso con pequeños retos.";
    } else if (examPassed && examScore >= 9) {
        advice = "🏆 Estudiante modelo. Considerar como tutor par o líder de grupo.";
    } else {
        advice = "✨ Mantener el seguimiento regular. Estudiante en buen camino.";
    }

    return {
        strength,
        weakness,
        advice,
        score: examScore,
        completionRate: Math.round(completionRate),
        daysSinceActive: Math.round(daysSinceActive),
        riskLevel: daysSinceActive > 7 ? 'high' : daysSinceActive > 3 ? 'medium' : 'low'
    };
};

export default generateMentorInsight;
