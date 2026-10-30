import mongoose, { Schema, Document, Model } from "mongoose";

export interface INote extends Document {
  courseId: string;
  subjectId: string;
  title: string;
  description?: string;
  fileName: string;
  fileUrl: string;
  fileSize: string;
  order: number;
  isFreePreview: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema = new Schema<INote>(
  {
    courseId: { type: String, required: true, index: true },
    subjectId: { type: String, required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileSize: { type: String, default: "1.0 MB" },
    order: { type: Number, default: 0 },
    isFreePreview: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

NoteSchema.index({ courseId: 1, subjectId: 1, order: 1 });

export const Note: Model<INote> =
  mongoose.models.Note || mongoose.model<INote>("Note", NoteSchema);

export default Note;
