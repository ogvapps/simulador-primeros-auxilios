import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db, appId } from '../firebaseConfig';
import { StudentProgress } from './studentService';

/**
 * Suscribe un listener a cambios en todos los estudiantes desde Firestore
 * Devuelve función de cleanup para desuscribirse
 */
export function subscribeToStudents(
  clase: string,
  callback: (students: StudentProgress[]) => void
): () => void {
  // Path a user_summaries en Firestore
  const summariesPath = `artifacts/${appId}/public/data/user_summaries`;
  
  // Query con o sin filtro de clase
  let q;
  if (clase && clase.trim() !== '') {
    q = query(
      collection(db, summariesPath),
      where('classCode', '==', clase)
    );
  } else {
    q = query(collection(db, summariesPath));
  }
  
  // Listener en tiempo real
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const students: StudentProgress[] = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      students.push({
        studentId: doc.id,
        nombre: data.name || '',
        clase: data.classCode || '',
        rol: data.role || '',
        email: data.email || '',
        fechaInicio: data.progress?.lastLoginDate || '',
        ultimaActividad: data.lastUpdate || '',
        actividadActual: '',
        moduloActual: data.progress?.level || 1,
        puntuacion: data.progress?.xp || 0,
        xp: data.progress?.xp || 0,
        nivel: data.progress?.level || 1,
        pasCompleted: data.progress?.pasCompleted || false,
        evaluacionCompleted: data.progress?.evaluacionCompleted || false,
        svbCompleted: data.progress?.svbCompleted || false,
        traumasCompleted: data.progress?.traumasCompleted || false,
        examenCompleted: data.progress?.examenCompleted || false,
        tiempoTotal: 0,
        intentosExamen: 0,
        racha: data.progress?.streak || 0,
        progreso: data.progress || {}
      });
    });
    
    callback(students);
  }, (error) => {
    console.error('Error subscribing to students:', error);
    callback([]);
  });
  
  return unsubscribe;
}

/**
 * Suscribe un listener a cambios en un estudiante específico
 */
export function subscribeToStudent(
  studentId: string,
  callback: (student: StudentProgress | null) => void
): () => void {
  const summariesPath = `artifacts/${appId}/public/data/user_summaries`;
  const docRef = collection(db, summariesPath);
  
  const unsubscribe = onSnapshot(docRef, (snapshot) => {
    const doc = snapshot.docs.find(d => d.id === studentId);
    if (doc && doc.exists()) {
      const data = doc.data();
      callback({
        studentId: doc.id,
        nombre: data.name || '',
        clase: data.classCode || '',
        rol: data.role || '',
        email: data.email || '',
        fechaInicio: data.progress?.lastLoginDate || '',
        ultimaActividad: data.lastUpdate || '',
        actividadActual: '',
        moduloActual: data.progress?.level || 1,
        puntuacion: data.progress?.xp || 0,
        xp: data.progress?.xp || 0,
        nivel: data.progress?.level || 1,
        pasCompleted: data.progress?.pasCompleted || false,
        evaluacionCompleted: data.progress?.evaluacionCompleted || false,
        svbCompleted: data.progress?.svbCompleted || false,
        traumasCompleted: data.progress?.traumasCompleted || false,
        examenCompleted: data.progress?.examenCompleted || false,
        tiempoTotal: 0,
        intentosExamen: 0,
        racha: data.progress?.streak || 0,
        progreso: data.progress || {}
      });
    } else {
      callback(null);
    }
  });
  
  return unsubscribe;
}
