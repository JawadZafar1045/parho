export interface QuizQuestionOption {
  key: string; // "A", "B", "C", "D"
  text: string;
}

export interface QuizQuestion {
  id: string;
  questionNumber: number;
  questionText: string;
  options: QuizQuestionOption[];
  correctOptionKey?: string; // Hidden during active quiz
  explanation?: string;
  points: number;
}

export interface QuizItem {
  id: string;
  courseId: string;
  courseName: string;
  subjectId: string;
  subjectName: string;
  title: string;
  description: string;
  timeLimitMinutes: number;
  totalMarks: number;
  passingPercentage: number;
  questionCount: number;
  questions?: QuizQuestion[];
}

export interface QuizAnswerSubmission {
  questionId: string;
  selectedOptionKey: string;
}

export interface EvaluatedAnswer {
  questionId: string;
  questionNumber: number;
  questionText: string;
  selectedOptionKey: string;
  correctOptionKey: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface QuizAttemptResult {
  attemptId: string;
  quizId: string;
  quizTitle: string;
  courseId: string;
  subjectId: string;
  score: number;
  totalMarks: number;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  unansweredCount: number;
  percentage: number;
  isPassed: boolean;
  timeSpentSeconds: number;
  completedAt: string;
  answers: EvaluatedAnswer[];
}
