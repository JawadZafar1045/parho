import mongoose, { Schema, Document, Model } from "mongoose";

export type UserRole = "student" | "admin";
export type UserStatus = "pending_verification" | "active" | "suspended";

export interface IUser extends Document {
  fullName: string;
  email: string;
  whatsapp: string;
  education?: string;
  test: string;
  passwordHash: string;
  passwordSalt: string;
  role: UserRole;
  status: UserStatus;
  enrolledCourses: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    whatsapp: { type: String, required: true, trim: true },
    education: { type: String, trim: true },
    test: { type: String, required: true, default: "ppsc" },
    passwordHash: { type: String, required: true },
    passwordSalt: { type: String, required: true },
    role: { type: String, enum: ["student", "admin"], default: "student" },
    status: {
      type: String,
      enum: ["pending_verification", "active", "suspended"],
      default: "pending_verification",
    },
    enrolledCourses: { type: [String], default: ["ppsc"] },
  },
  {
    timestamps: true,
  }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
