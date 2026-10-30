import mongoose, { Schema, Document, Model } from "mongoose";

export interface IQuizAttemptAnswer {
  questionId: string;
  questionNumber: number;
  questionText: string;
  selectedOptionKey: string;
  correctOptionKey: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface IQuizAttempt extends Document {
  userId: string;
  userEmail: string;
  quizId: string;
  courseId: string;
  subjectId: string;
  quizTitle: string;
  score: number;
  totalMarks: number;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  unansweredCount: number;
  percentage: number;
  isPassed: boolean;
  timeSpentSeconds: number;
  answers: IQuizAttemptAnswer[];
  createdAt: Date;
  updatedAt: Date;
}

const QuizAttemptAnswerSchema = new Schema<IQuizAttemptAnswer>(
  {
    questionId: { type: String, required: true },
    questionNumber: { type: Number, required: true },
    questionText: { type: String, required: true },
    selectedOptionKey: { type: String, required: true },
    correctOptionKey: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
    explanation: { type: String },
  },
  { _id: false }
);

const QuizAttemptSchema = new Schema<IQuizAttempt>(
  {
    userId: { type: String, required: true, index: true },
    userEmail: { type: String, required: true, index: true },
    quizId: { type: String, required: true, index: true },
    courseId: { type: String, required: true },
    subjectId: { type: String, required: true },
    quizTitle: { type: String, required: true },
    score: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    correctCount: { type: Number, required: true },
    wrongCount: { type: Number, required: true },
    unansweredCount: { type: Number, default: 0 },
    percentage: { type: Number, required: true },
    isPassed: { type: Boolean, required: true },
    timeSpentSeconds: { type: Number, required: true },
    answers: { type: [QuizAttemptAnswerSchema], default: [] },
  },
  {
    timestamps: true,
  }
);

QuizAttemptSchema.index({ userId: 1, quizId: 1, createdAt: -1 });

export const QuizAttempt: Model<IQuizAttempt> =
  mongoose.models.QuizAttempt ||
  mongoose.model<IQuizAttempt>("QuizAttempt", QuizAttemptSchema);

export default QuizAttempt;
