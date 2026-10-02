import { useState, useEffect } from 'react';
import { doc, onSnapshot, getDoc } from 'firebase/firestore';
import { selectRandomQuestions } from '../utils/examRandomizer';
import { getExamSizeForRole } from '../utils/roleExamConfig';

export function useExamSetup(db, appId, user, profile, progress, view, EXAM_QUESTIONS) {
  const [examConfig, setExamConfig] = useState({ examSize: 40 });
  const [randomizedExamQuestions, setRandomizedExamQuestions] = useState(null);
  const [surpriseExam, setSurpriseExam] = useState(null);

  useEffect(() => {
    const loadExamConfig = async () => {
      try {
        const configDoc = await getDoc(doc(db, 'artifacts', appId, 'public', 'config'));
        if (configDoc.exists()) {
          const config = configDoc.data();
          setExamConfig({
            examSize: config.examSize || 40,
            passingScore: config.passingScore || 7
          });
        }
      } catch (e) {
        console.error('Error loading exam config:', e);
      }
    };
    loadExamConfig();
  }, []);

  useEffect(() => {
    if (view === 'exam') {
      if (!randomizedExamQuestions && EXAM_QUESTIONS && profile) {
        const roleBasedSize = getExamSizeForRole(profile.role);
        const finalExamSize = examConfig.examSize || roleBasedSize;
        const randomQuestions = selectRandomQuestions(EXAM_QUESTIONS, finalExamSize);
        setRandomizedExamQuestions(randomQuestions);
      }
    } else {
      if (randomizedExamQuestions) setRandomizedExamQuestions(null);
    }
  }, [view, examConfig.examSize, profile, randomizedExamQuestions, EXAM_QUESTIONS]);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(
      doc(db, 'artifacts', appId, 'public', 'active_surprise_exam'),
      (snap) => {
        if (snap.exists() && snap.data().active) {
          setSurpriseExam(snap.data());
        } else {
          setSurpriseExam(null);
        }
      }
    );
    return () => unsubscribe();
  }, [user]);

  // Auto-dismiss Surprise Exam if already completed
  useEffect(() => {
    if (surpriseExam && progress?.examAttempts) {
      const alreadyDone = Array.isArray(progress.examAttempts) &&
        progress.examAttempts.some(att => att.type === 'surprise' && new Date(att.date) >= new Date(surpriseExam.startedAt));
      if (alreadyDone) setSurpriseExam(null);
    }
  }, [surpriseExam, progress?.examAttempts]);

  return { examConfig, setExamConfig, randomizedExamQuestions, setRandomizedExamQuestions, surpriseExam, setSurpriseExam };
}
