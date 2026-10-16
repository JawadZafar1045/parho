import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const courseSchema = new Schema(
  {
    courseId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: /^[a-z0-9-]+$/,
    },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    feePaisa: { type: Number, required: true, min: 1, validate: Number.isSafeInteger },
    published: { type: Boolean, required: true, default: false },
  },
  { timestamps: true },
);

export type CourseDocument = InferSchemaType<typeof courseSchema>;

export const CourseModel: Model<CourseDocument> =
  (mongoose.models.Course as Model<CourseDocument> | undefined) ??
  mongoose.model<CourseDocument>("Course", courseSchema);
