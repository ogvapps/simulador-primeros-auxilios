// Lightweight Audit Logger - Privacy-Friendly Version
// Only tracks major milestones, not granular actions

import { collection, addDoc, query, orderBy, limit, getDocs } from 'firebase/firestore';

export const AUDIT_EVENTS = {
    MODULE_COMPLETE: 'module_complete',
    EXAM_START: 'exam_start',
    EXAM_COMPLETE: 'exam_complete',
    LEVEL_UP: 'level_up',
    LOGIN: 'login'
};

export const logAuditEvent = async (db, firebaseConfigId, userId, eventType, details = {}) => {
    try {
        const auditRef = collection(db, 'artifacts', firebaseConfigId, 'users', userId, 'audit_log');
        await addDoc(auditRef, {
            timestamp: new Date().toISOString(),
            type: eventType,
            details,
            version: 'light' // Indicates privacy-friendly version
        });
    } catch (e) {
        console.error('Audit log error:', e);
        // Fail silently - don't break user experience
    }
};

export const getAuditLog = async (db, firebaseConfigId, userId, maxEvents = 50) => {
    try {
        const auditRef = collection(db, 'artifacts', firebaseConfigId, 'users', userId, 'audit_log');
        const q = query(auditRef, orderBy('timestamp', 'desc'), limit(maxEvents));
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (e) {
        console.error('Error fetching audit log:', e);
        return [];
    }
};

export const formatAuditEvent = (event, t) => {
    const time = new Date(event.timestamp).toLocaleString();
    let icon = '📋';
    let text = '';
    let color = 'text-slate-600';

    switch (event.type) {
        case AUDIT_EVENTS.MODULE_COMPLETE:
            icon = '✅';
            text = `Completó: ${event.details.moduleName || 'Módulo'}`;
            color = 'text-green-600';
            break;
        case AUDIT_EVENTS.EXAM_START:
            icon = '📝';
            text = 'Comenzó el examen final';
            color = 'text-blue-600';
            break;
        case AUDIT_EVENTS.EXAM_COMPLETE:
            icon = event.details.passed ? '🎉' : '📊';
            text = `Examen: ${event.details.passed ? 'APROBADO' : 'Completado'} (${event.details.score}/10)`;
            color = event.details.passed ? 'text-green-600' : 'text-orange-600';
            break;
        case AUDIT_EVENTS.LEVEL_UP:
            icon = '⬆️';
            text = `Subió a Nivel ${event.details.newLevel}`;
            color = 'text-purple-600';
            break;
        case AUDIT_EVENTS.LOGIN:
            icon = '🔓';
            text = 'Inició sesión';
            color = 'text-slate-500';
            break;
        default:
            text = event.type;
    }

    return { time, icon, text, color };
};

export default { logAuditEvent, getAuditLog, formatAuditEvent, AUDIT_EVENTS };
