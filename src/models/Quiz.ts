import mongoose, { Schema, Document, Model } from "mongoose";

export interface IQuiz extends Document {
  quizId: string;
  courseId: string;
  subjectId: string;
  title: string;
  description: string;
  timeLimitMinutes: number;
  totalMarks: number;
  passingPercentage: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const QuizSchema = new Schema<IQuiz>(
  {
    quizId: { type: String, required: true, unique: true, index: true },
    courseId: { type: String, required: true, index: true },
    subjectId: { type: String, required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    timeLimitMinutes: { type: Number, default: 30 },
    totalMarks: { type: Number, default: 50 },
    passingPercentage: { type: Number, default: 50 },
    isPublished: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

QuizSchema.index({ courseId: 1, subjectId: 1 });

export const Quiz: Model<IQuiz> =
  mongoose.models.Quiz || mongoose.model<IQuiz>("Quiz", QuizSchema);

export default Quiz;
