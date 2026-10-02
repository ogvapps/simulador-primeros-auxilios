import { useState, useEffect, useRef } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';

export function useClassAssignments(db, appId, profile, progress, addToast, playSound) {
  const [classAssignments, setClassAssignments] = useState(null);
  const prevRef = useRef(null);

  useEffect(() => {
    const clsId = profile?.classId || progress?.classId;
    if (!clsId) return;

    try {
      const unsubClass = onSnapshot(
        doc(db, 'artifacts', appId, 'public', 'data', 'classes', clsId),
        (snap) => {
          if (snap.exists()) {
            const clsData = snap.data();
            const newAssignment = clsData.activeAssignment || null;
            setClassAssignments(newAssignment);
            if (newAssignment && prevRef.current === null) {
              addToast("¡Tienes una nueva tarea asignada!", "info");
              try { playSound('notification'); } catch (e) { }
            }
            prevRef.current = newAssignment;
          }
        },
        (err) => console.log("Class sync error", err)
      );
      return () => unsubClass();
    } catch (e) {
      console.log("Setup class sync error", e);
    }
  }, [profile?.classId, progress?.classId]);

  return { classAssignments, setClassAssignments };
}
