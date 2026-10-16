import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const enrollmentSchema = new Schema(
  {
    studentId: { type: String, required: true, index: true },
    courseId: { type: String, required: true, trim: true, lowercase: true },
    status: { type: String, enum: ["active", "inactive"], required: true },
    paymentStatus: { type: String, enum: ["pending", "verified", "rejected"], required: true },
  },
  { timestamps: true },
);

enrollmentSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

export type EnrollmentDocument = InferSchemaType<typeof enrollmentSchema>;

export const EnrollmentModel: Model<EnrollmentDocument> =
  (mongoose.models.Enrollment as Model<EnrollmentDocument> | undefined) ??
  mongoose.model<EnrollmentDocument>("Enrollment", enrollmentSchema);
