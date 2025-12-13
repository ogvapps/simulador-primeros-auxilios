/**
 * Servicio para gestionar la persistencia de estudiantes y su progreso
 * Permite guardar, cargar, reiniciar y eliminar alumnos en Firestore
 */

import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db, appId, isMock } from '../firebaseConfig';

// Tipos para el progreso del estudiante
export interface StudentProgress {
  studentId: string;
  nombre: string;
  clase: string;
  rol: string; // 'alumno' | 'profesor'
  fechaInicio: string;
  ultimaActividad: string;
  
  // Progreso del simulador
  actividadActual: string;
  moduloActual: number;
  puntuacion: number;
  xp: number;
  nivel: number;
  
  // Estado de completitud
  pasCompleted: boolean;
  evaluacionCompleted: boolean;
  svbCompleted: boolean;
  traumasCompleted: boolean;
  examenCompleted: boolean;
  
  // Métricas
  tiempoTotal: number; // en minutos
  intentosExamen: number;
  racha: number;
  
  // Datos adicionales
  progreso: any; // Para compatibilidad con el sistema actual
}

/**
 * Obtiene el progreso de un estudiante desde Firestore o localStorage
 */
export async function loadStudentProgress(studentId: string): Promise<StudentProgress | null> {
  try {
    if (isMock) {
      // Modo mock: usar localStorage
      const stored = localStorage.getItem(`pas_student_${studentId}`);
      return stored ? JSON.parse(stored) : null;
    }
    
    // Modo real: usar Firestore
    const docRef = doc(db, 'artifacts', appId, 'students', studentId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as StudentProgress;
    }
    return null;
  } catch (error) {
    console.error('Error cargando progreso del estudiante:', error);
    return null;
  }
}

/**
 * Guarda o actualiza el progreso de un estudiante
 */
export async function saveStudentProgress(progress: StudentProgress): Promise<boolean> {
  try {
    const timestamp = new Date().toISOString();
    const dataToSave = {
      ...progress,
      ultimaActividad: timestamp
    };
    
    if (isMock) {
      // Modo mock: guardar en localStorage
      localStorage.setItem(`pas_student_${progress.studentId}`, JSON.stringify(dataToSave));
      return true;
    }
    
    // Modo real: guardar en Firestore
    const docRef = doc(db, 'artifacts', appId, 'students', progress.studentId);
    await setDoc(docRef, dataToSave, { merge: true });
    
    // También actualizar en el resumen público para el panel de profesor
    const summaryRef = doc(db, 'artifacts', appId, 'public', 'data', 'student_summaries', progress.studentId);
    await setDoc(summaryRef, {
      studentId: progress.studentId,
      nombre: progress.nombre,
      clase: progress.clase,
      nivel: progress.nivel,
      puntuacion: progress.puntuacion,
      ultimaActividad: timestamp,
      actividadActual: progress.actividadActual
    }, { merge: true });
    
    return true;
  } catch (error) {
    console.error('Error guardando progreso del estudiante:', error);
    return false;
  }
}

/**
 * Reinicia el progreso de un estudiante manteniendo sus datos básicos
 */
export async function resetStudentProgress(studentId: string): Promise<boolean> {
  try {
    const current = await loadStudentProgress(studentId);
    if (!current) {
      console.error('No se encontró el estudiante para reiniciar');
      return false;
    }
    
    // Mantener solo datos básicos, resetear progreso
    const resetData: StudentProgress = {
      ...current,
      fechaInicio: new Date().toISOString(),
      ultimaActividad: new Date().toISOString(),
      actividadActual: 'inicio',
      moduloActual: 0,
      puntuacion: 0,
      xp: 0,
      nivel: 1,
      pasCompleted: false,
      evaluacionCompleted: false,
      svbCompleted: false,
      traumasCompleted: false,
      examenCompleted: false,
      tiempoTotal: 0,
      intentosExamen: 0,
      racha: 0,
      progreso: {
      actividadActual: 'inicio',
      moduloActual: 0,
      puntuacion: 0,
      xp: 0,
      nivel: 1,
      pasCompleted: false,
      evaluacionCompleted: false,
      svbCompleted: false,
      traumasCompleted: false,
      examenCompleted: false,
      tiempoTotal: 0,
      intentosExamen: 0,
      racha: 0
    }        
    // CRÍTICO: También actualizar el progreso real del usuario
    if (!isMock) {
      const userProgressRef = doc(db, 'artifacts', appId, 'users', studentId, 'progress', 'main');
      await setDoc(userProgressRef, resetData.progreso, { merge: true });;
      
      const userSummaryRef = doc(db, 'artifacts', appId, 'public', 'data', 'user_summaries', studentId);
      await setDoc(userSummaryRef, { progress: resetData.progreso }, { merge: true });
    }
    return await saveStudentProgress(resetData);
  } catch (error) {
    console.error('Error reiniciando progreso del estudiante:', error);
    return false;
  }
}

/**
 * Elimina completamente un estudiante y su progreso
 */
export async function deleteStudent(studentId: string): Promise<boolean> {
  try {
    if (isMock) {
      // Modo mock: eliminar de localStorage
      localStorage.removeItem(`pas_student_${studentId}`);
      return true;
    }
    
    // Modo real: eliminar de Firestore
    const docRef = doc(db, 'artifacts', appId, 'students', studentId);
    await deleteDoc(docRef);
    
    // También eliminar del resumen público
    const summaryRef = doc(db, 'artifacts', appId, 'public', 'data', 'student_summaries', studentId);
    await deleteDoc(summaryRef);
    
    return true;
  } catch (error) {
    console.error('Error eliminando estudiante:', error);
    return false;
  }
}

/**
 * Crea un nuevo estudiante con progreso inicial
 */
export async function createStudent(
  nombre: string,
  clase: string,
  rol: string = 'alumno'
): Promise<StudentProgress | null> {
  try {
    const studentId = `${clase}_${nombre}_${Date.now()}`.replace(/\s+/g, '_').toLowerCase();
    const timestamp = new Date().toISOString();
    
    const newStudent: StudentProgress = {
      studentId,
      nombre,
      clase,
      rol,
      fechaInicio: timestamp,
      ultimaActividad: timestamp,
      actividadActual: 'inicio',
      moduloActual: 0,
      puntuacion: 0,
      xp: 0,
      nivel: 1,
      pasCompleted: false,
      evaluacionCompleted: false,
      svbCompleted: false,
      traumasCompleted: false,
      examenCompleted: false,
      tiempoTotal: 0,
      intentosExamen: 0,
      racha: 0,
      progreso: {}
    };
    
    const success = await saveStudentProgress(newStudent);
    return success ? newStudent : null;
  } catch (error) {
    console.error('Error creando estudiante:', error);
    return null;
  }
}

/**
 * Obtiene todos los estudiantes de una clase (solo para profesores)
 */
export async function getStudentsByClass(clase: string): Promise<StudentProgress[]> {
  try {
    if (isMock) {
      // En modo mock, buscar en localStorage
      const students: StudentProgress[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('pas_student_')) {
          const data = localStorage.getItem(key);
          if (data) {
            const student = JSON.parse(data);
            if (student.clase === clase) {
              students.push(student);
            }
          }
        }
      }
      return students;
    }
    
    // Modo real: consultar Firestore
    const studentsRef = collection(db, 'artifacts', appId, 'students');
    const q = query(studentsRef, where('clase', '==', clase));
    const querySnapshot = await getDocs(q);
    
    const students: StudentProgress[] = [];
    querySnapshot.forEach((doc) => {
      students.push(doc.data() as StudentProgress);
    });
    
    return students;
  } catch (error) {
    console.error('Error obteniendo estudiantes de la clase:', error);
    return [];
  }
}
