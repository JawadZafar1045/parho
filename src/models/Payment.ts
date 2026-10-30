import mongoose, { Schema, Document, Model } from "mongoose";

export type PaymentMethod = "jazzcash" | "easypaisa" | "bank_transfer" | "other";
export type PaymentStatus = "pending" | "approved" | "rejected";

export interface IPayment extends Document {
  userId: string;
  userEmail: string;
  courseId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  transactionId: string;
  receiptUrl?: string;
  status: PaymentStatus;
  adminNotes?: string;
  verifiedAt?: Date;
  verifiedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    userId: { type: String, required: true, index: true },
    userEmail: { type: String, required: true, index: true },
    courseId: { type: String, required: true },
    amount: { type: Number, default: 1500 },
    paymentMethod: {
      type: String,
      enum: ["jazzcash", "easypaisa", "bank_transfer", "other"],
      default: "jazzcash",
    },
    transactionId: { type: String, required: true, trim: true, index: true },
    receiptUrl: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
    adminNotes: { type: String, trim: true },
    verifiedAt: { type: Date },
    verifiedBy: { type: String },
  },
  {
    timestamps: true,
  }
);

export const Payment: Model<IPayment> =
  mongoose.models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema);

export default Payment;
