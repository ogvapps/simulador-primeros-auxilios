
import { ReactNode } from 'react';

export interface ModuleStep {
  title: string;
  text: string;
  icon: ReactNode;
  interactiveComponent?: string;
}

export interface ModuleContent {
  videoUrls?: string[];
  steps: ModuleStep[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'module' | 'roleplay' | 'exam' | 'desa' | 'glossary' | 'certificate' | 'flashcards' | 'pair_game';
  content?: ModuleContent;
}

export interface UserProfile {
  name: string;
  role: string;
  classCode?: string; // New: Class management
    email?: string; // Email del usuario
  lastUpdate?: string;
}

export interface UserProgress {
  xp?: number;
  level?: number;
  streak?: number;
  lastLoginDate?: string;
  flashcardData?: Record<number, { box: number, nextReview: number }>; // New: Spaced Repetition data
  [key: string]: any;
}

export interface Badge {
  id: string;
  title: string;
  icon: ReactNode;
  color: string;
}

export interface RoleplayNode {
  text: string;
  isFailure?: boolean;
  isSuccess?: boolean;
  options?: { text: string; next: string }[];
}

export interface RoleplayScenario {
  title: string;
  startNode: string;
  nodes: Record<string, RoleplayNode>;
}

export interface ExamQuestion {
  q: string;
  opts: string[];
  a: string;
  expl: string;
  isCritical?: boolean;
}

export interface GeoTarget {
    id: string; // matches Module ID
    lat: number;
    lng: number;
    active: boolean;
}

// PAIR GAME TYPES
export interface PairScenarioStep {
    phase: number;
    victimInstruction: string; // What the victim sees (e.g. "Clutch throat")
    rescuerQuestion: string; // What the rescuer sees (e.g. "What is happening?")
    rescuerOptions: { text: string; isCorrect: boolean; feedback: string }[];
}

export interface PairScenario {
    id: string;
    title: string;
    icon: ReactNode;
    steps: PairScenarioStep[];
}
