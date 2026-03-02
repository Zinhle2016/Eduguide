export interface Lesson {
  id: string;
  title: string;
  content: string;
  duration: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  lessons: Lesson[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: Date;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  COURSE_GEN = 'COURSE_GEN',
  AI_TUTOR = 'AI_TUTOR',
  LAB = 'LAB'
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Quiz {
  lessonId: string;
  questions: QuizQuestion[];
}

export interface UserStats {
  totalQuizzesTaken: number;
  totalCorrectAnswers: number;
  totalQuestionsAttempted: number;
}
