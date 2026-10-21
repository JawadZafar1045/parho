import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const paymentRequestSchema = new Schema(
  {
    studentId: { type: String, required: true, index: true },
    courseId: { type: String, required: true, trim: true, lowercase: true },
    transactionId: { type: String, required: true, trim: true },
    amountPaisa: { type: Number, required: true, min: 1, validate: Number.isSafeInteger },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      required: true,
      default: "pending",
    },
  },
  { timestamps: true },
);

paymentRequestSchema.index(
  { studentId: 1, courseId: 1 },
  { unique: true, partialFilterExpression: { status: "pending" } },
);
paymentRequestSchema.index({ transactionId: 1 }, { unique: true });

export type PaymentRequestDocument = InferSchemaType<typeof paymentRequestSchema>;

export const PaymentRequestModel: Model<PaymentRequestDocument> =
  (mongoose.models.PaymentRequest as Model<PaymentRequestDocument> | undefined) ??
  mongoose.model<PaymentRequestDocument>("PaymentRequest", paymentRequestSchema);
