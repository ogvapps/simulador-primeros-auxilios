import { ref, set, onValue, off, remove } from 'firebase/database';
import { rtdb } from '../firebaseConfig';
import { StudentProgress } from './studentService';

/**
 * Guarda el progreso de un estudiante en Realtime Database
 */
export async function saveStudentRealtime(progress: StudentProgress): Promise<boolean> {
  try {
    const studentRef = ref(rtdb, `students/${progress.studentId}`);
    await set(studentRef, {
      ...progress,
      ultimaActividad: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error guardando en Realtime DB:', error);
    return false;
  }
}

/**
 * Elimina un estudiante de Realtime Database
 */
export async function deleteStudentRealtime(studentId: string): Promise<boolean> {
  try {
    const studentRef = ref(rtdb, `students/${studentId}`);
    await remove(studentRef);
    return true;
  } catch (error) {
    console.error('Error eliminando de Realtime DB:', error);
    return false;
  }
}

/**
 * Suscribe un listener a cambios en todos los estudiantes
 * Devuelve función de cleanup para desuscribirse
 */
export function subscribeToStudents(
  clase: string,
  callback: (students: StudentProgress[]) => void
): () => void {
  const studentsRef = ref(rtdb, 'students');
  
  const listener = onValue(studentsRef, (snapshot) => {
    const data = snapshot.val();
    if (!data) {
      callback([]);
      return;
    }
    
    // Filtrar por clase y convertir a array
    const students: StudentProgress[] = Object.values(data).filter(
      (student: any) => !clase || student.clase === clase    );
    
    callback(students);
  });
  
  // Función de cleanup
  return () => off(studentsRef, 'value', listener);
}

/**
 * Suscribe un listener a cambios en un estudiante específico
 */
export function subscribeToStudent(
  studentId: string,
  callback: (student: StudentProgress | null) => void
): () => void {
  const studentRef = ref(rtdb, `students/${studentId}`);
  
  const listener = onValue(studentRef, (snapshot) => {
    const data = snapshot.val();
    callback(data || null);
  });
  
  return () => off(studentRef, 'value', listener);
}
