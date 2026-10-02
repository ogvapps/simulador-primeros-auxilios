import { useCallback } from 'react';
import { doc, updateDoc, deleteDoc, increment, collection, query, where, getDocs } from 'firebase/firestore';
import { deleteUser } from 'firebase/auth';

export function useSchoolActions(db, appId, user, setProfile, setProgress, addToast, playSound, confetti, setIsSaving) {

  const handleSelectAvatar = useCallback(async (avatarId) => {
    setIsSaving(true);
    try {
      setProfile(prev => ({ ...prev, avatarId }));
      await updateDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'main'), { avatarId });
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'user_summaries', user.uid), { avatarId });
    } finally {
      setIsSaving(false);
    }
  }, [db, appId, user, setProfile, setIsSaving]);

  const handleJoinClass = useCallback(async (code) => {
    try {
      setIsSaving(true);
      const classQuery = query(collection(db, 'artifacts', appId, 'public', 'data', 'classes'), where('code', '==', code));
      const snap = await getDocs(classQuery);

      if (snap.empty) {
        addToast("Código de clase inválido", "error");
        return false;
      }

      const classDoc = snap.docs[0];
      const classData = classDoc.data();
      const newRole = classData.name;

      setProfile(prev => ({ ...prev, role: newRole, classId: classDoc.id }));
      setProgress(prev => ({ ...prev, role: newRole, classId: classDoc.id, className: classData.name }));

      await updateDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'main'), {
        role: newRole, classId: classDoc.id
      });
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'user_summaries', user.uid), {
        role: newRole, classId: classDoc.id
      });
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'classes', classDoc.id), {
        studentCount: increment(1)
      });

      addToast(`¡Te has unido a: ${classData.name}!`, "success");
      playSound('success');
      confetti();
      return true;
    } catch (e) {
      console.error(e);
      addToast("Error al unirse a la clase", "error");
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [db, appId, user, setProfile, setProgress, addToast, playSound, confetti, setIsSaving]);

  const handleAccountDeletion = useCallback(async () => {
    if (!user) return;
    try {
      setIsSaving(true);
      const uid = user.uid;
      // 1. Delete auth user first. If it requires recent login, it throws here BEFORE deleting data.
      await deleteUser(user);

      // 2. Clean up Firestore data after auth deletion succeeded
      try {
        await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'user_summaries', uid));
        await deleteDoc(doc(db, 'artifacts', appId, 'users', uid, 'profile', 'main'));
        await deleteDoc(doc(db, 'artifacts', appId, 'users', uid, 'progress', 'main'));
      } catch (cleanErr) {
        console.warn('Cleanup error after user deletion:', cleanErr);
      }

      addToast('Cuenta eliminada correctamente', 'success');
    } catch (e) {
      console.error('Error deleting account:', e);
      if (e.code === 'auth/requires-recent-login') {
        addToast('Por seguridad, cierra sesión e inicia de nuevo antes de borrar la cuenta.', 'error');
      } else {
        addToast('Error al eliminar la cuenta', 'error');
      }
    } finally {
      setIsSaving(false);
    }
  }, [db, appId, user, setIsSaving, addToast]);

  return { handleSelectAvatar, handleJoinClass, handleAccountDeletion };
}
