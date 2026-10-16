import mongoose from "mongoose";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

const courses = [
  {
    courseId: "ppsc",
    name: "PPSC Preparation",
    description: "Complete preparation for PPSC competitive exams.",
  },
  {
    courseId: "pms",
    name: "PMS Preparation",
    description: "Complete preparation for PMS competitive exams.",
  },
  {
    courseId: "fpsc",
    name: "FPSC Preparation",
    description: "Complete preparation for FPSC competitive exams.",
  },
  {
    courseId: "css",
    name: "CSS Preparation",
    description: "Complete preparation for CSS competitive exams.",
  },
  {
    courseId: "nts",
    name: "NTS Preparation",
    description: "Complete preparation for NTS competitive exams.",
  },
  {
    courseId: "police",
    name: "Police Tests",
    description: "Preparation material and practice for police recruitment tests.",
  },
  {
    courseId: "teaching",
    name: "Teaching / Lecturer Tests",
    description: "Preparation material and practice for teaching and lecturer tests.",
  },
  {
    courseId: "banking",
    name: "Banking Tests",
    description: "Preparation material and practice for banking recruitment tests.",
  },
];

function courseFeePaisa(courseId) {
  const key = `COURSE_${courseId.toUpperCase()}_FEE_PAISA`;
  const configuredValue = process.env[key] ?? "20000";
  const amount = Number(configuredValue);
  if (!Number.isSafeInteger(amount) || amount < 1) {
    throw new Error(`${key} must be a positive integer amount in paisa.`);
  }
  return amount;
}

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI must be configured before seeding courses.");

const courseSchema = new mongoose.Schema(
  {
    courseId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    feePaisa: { type: Number, required: true, min: 1 },
    published: { type: Boolean, required: true, default: false },
  },
  { timestamps: true },
);
const enrollmentSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true },
    courseId: { type: String, required: true },
    status: { type: String, enum: ["active", "inactive"], required: true },
    paymentStatus: { type: String, enum: ["pending", "verified", "rejected"], required: true },
  },
  { timestamps: true },
);
enrollmentSchema.index({ studentId: 1, courseId: 1 }, { unique: true });
const paymentRequestSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true },
    courseId: { type: String, required: true },
    transactionId: { type: String, required: true },
    amountPaisa: { type: Number, required: true, min: 1 },
    status: { type: String, enum: ["pending", "approved", "rejected"], required: true },
  },
  { timestamps: true },
);
paymentRequestSchema.index({ transactionId: 1 }, { unique: true });

const Course = mongoose.models.Course ?? mongoose.model("Course", courseSchema);
const Enrollment = mongoose.models.Enrollment ?? mongoose.model("Enrollment", enrollmentSchema);
const PaymentRequest =
  mongoose.models.PaymentRequest ?? mongoose.model("PaymentRequest", paymentRequestSchema);

try {
  await mongoose.connect(uri);

  for (const course of courses) {
    await Course.updateOne(
      { courseId: course.courseId },
      {
        $set: {
          ...course,
          feePaisa: courseFeePaisa(course.courseId),
          published: true,
        },
      },
      { upsert: true, runValidators: true },
    );
    console.log(`Seeded published course: ${course.courseId}`);
  }

  if (process.argv.includes("--with-dev-enrollment")) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Refusing to create a development enrollment in production.");
    }
    if (
      !process.env.DEV_TEST_STUDENT_PASSWORD ||
      process.env.DEV_TEST_STUDENT_PASSWORD.length < 6
    ) {
      throw new Error(
        "Set a DEV_TEST_STUDENT_PASSWORD with at least 6 characters before seeding development enrollment.",
      );
    }
    const verifiedTransactionId = process.env.DEV_TEST_PPSC_VERIFIED_TRANSACTION_ID?.trim();
    if (
      process.env.DEV_TEST_PPSC_PAYMENT_VERIFIED !== "true" ||
      !verifiedTransactionId ||
      verifiedTransactionId.length < 4
    ) {
      throw new Error(
        "Only run the test enrollment seed after manual payment verification. Set DEV_TEST_PPSC_PAYMENT_VERIFIED=true and DEV_TEST_PPSC_VERIFIED_TRANSACTION_ID to the verified transaction ID.",
      );
    }

    const ppscCourse = await Course.findOne({ courseId: "ppsc", published: true }).lean();
    if (!ppscCourse) throw new Error("PPSC must be published before creating the test enrollment.");

    const existingEnrollment = await Enrollment.findOne({
      studentId: "dev-course-test-student",
      courseId: "ppsc",
    }).lean();
    if (
      existingEnrollment &&
      (existingEnrollment.status !== "active" || existingEnrollment.paymentStatus !== "verified")
    ) {
      throw new Error(
        "The development student already has a non-active PPSC enrollment; review it rather than overwriting existing data.",
      );
    }

    const existingPayment = await PaymentRequest.findOne({
      transactionId: verifiedTransactionId,
    }).lean();
    if (!existingPayment) {
      throw new Error(
        "Submit a PPSC payment request from the development test student before approving it.",
      );
    }
    if (
      existingPayment.studentId !== "dev-course-test-student" ||
      existingPayment.courseId !== "ppsc" ||
      !["pending", "approved"].includes(existingPayment.status) ||
      existingPayment.amountPaisa !== ppscCourse.feePaisa
    ) {
      throw new Error(
        "The verified transaction ID is already associated with a different payment request.",
      );
    }
    if (existingPayment.status === "pending") {
      await PaymentRequest.updateOne(
        { _id: existingPayment._id, status: "pending" },
        { $set: { status: "approved" } },
        { runValidators: true },
      );
    }

    await Enrollment.updateOne(
      { studentId: "dev-course-test-student", courseId: "ppsc" },
      {
        $setOnInsert: {
          studentId: "dev-course-test-student",
          courseId: "ppsc",
          status: "active",
          paymentStatus: "verified",
        },
      },
      { upsert: true, runValidators: true },
    );
    console.log("Ensured the manually verified development-only PPSC enrollment exists.");
  }
} finally {
  await mongoose.disconnect();
}
