import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISubject {
  id: string;
  name: string;
  description?: string;
  iconName?: string;
}

export interface ICourse extends Document {
  courseId: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  discountLabel?: string;
  imageLabel: string;
  badge?: string;
  features?: string[];
  isPublished: boolean;
  subjects: ISubject[];
  createdAt: Date;
  updatedAt: Date;
}

const SubjectSchema = new Schema<ISubject>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    iconName: { type: String },
  },
  { _id: false }
);

const CourseSchema = new Schema<ICourse>(
  {
    courseId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, default: 1500 },
    originalPrice: { type: Number, default: 3000 },
    discountPercent: { type: Number, default: 50 },
    discountLabel: { type: String, default: "50% OFF" },
    imageLabel: { type: String, default: "PREP" },
    badge: { type: String },
    features: { type: [String], default: ["Verified PDF Study Notes", "Timed Mock Tests", "Detailed Answer Explanations", "Anti-Piracy Protected Reader"] },
    isPublished: { type: Boolean, default: true },
    subjects: { type: [SubjectSchema], default: [] },
  },
  {
    timestamps: true,
  }
);

export const Course: Model<ICourse> =
  mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema);

export default Course;
