import mongoose, { Schema, Document, Model } from "mongoose";

export interface IQuestionOption {
  key: string; // "A", "B", "C", "D"
  text: string;
}

export interface IQuestion extends Document {
  quizId: string;
  courseId: string;
  subjectId: string;
  questionNumber: number;
  questionText: string;
  options: IQuestionOption[];
  correctOptionKey: string;
  explanation?: string;
  points: number;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionOptionSchema = new Schema<IQuestionOption>(
  {
    key: { type: String, required: true },
    text: { type: String, required: true },
  },
  { _id: false }
);

const QuestionSchema = new Schema<IQuestion>(
  {
    quizId: { type: String, required: true, index: true },
    courseId: { type: String, required: true, index: true },
    subjectId: { type: String, required: true, index: true },
    questionNumber: { type: Number, default: 1 },
    questionText: { type: String, required: true, trim: true },
    options: { type: [QuestionOptionSchema], required: true },
    correctOptionKey: { type: String, required: true },
    explanation: { type: String, trim: true },
    points: { type: Number, default: 1 },
  },
  {
    timestamps: true,
  }
);

QuestionSchema.index({ quizId: 1, questionNumber: 1 });

export const Question: Model<IQuestion> =
  mongoose.models.Question || mongoose.model<IQuestion>("Question", QuestionSchema);

export default Question;
