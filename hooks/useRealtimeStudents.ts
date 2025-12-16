import { useState, useEffect } from 'react';
import { subscribeToStudents } from '../services/realtimeSync';
import { StudentProgress } from '../services/studentService';

/**
 * Hook para obtener estudiantes en tiempo real desde Firebase
 */
export function useRealtimeStudents(clase: string) {
  const [students, setStudents] = useState<StudentProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    
    try {
      // Suscribirse a cambios
      const unsubscribe = subscribeToStudents(clase, (updatedStudents) => {
        setStudents(updatedStudents);
        setLoading(false);
      });

      // Cleanup al desmontar
      return () => {
        unsubscribe();
      };
    } catch (err) {
      setError(err as Error);
      setLoading(false);
    }
  }, [clase]);

  return { students, loading, error };
}
