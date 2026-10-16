import { describe, expect, it } from "vitest";
import { createUser, getSessionUser, verifyLogin, createSession } from "@/lib/auth/store";
import {
  categorizeStudentCourses,
  isVerifiedEnrollmentForStudent,
} from "@/features/courses/server-data";
import { coursePaymentRequestSchema } from "@/features/courses/validations/payment-request";

describe("auth store", () => {
  it("creates a user and verifies credentials", () => {
    const user = createUser({
      test: "ppsc",
      fullName: "Ali Khan",
      education: "BSCS",
      whatsapp: "03001234567",
      email: "ali@example.com",
      password: "secret123",
      transactionId: "TXN-1001",
      confirmPassword: "secret123",
    });

    expect(user.email).toBe("ali@example.com");
    expect(verifyLogin("ali@example.com", "secret123")).toBeTruthy();
    expect(user.paymentStatus).toBe("pending");
    expect(
      isVerifiedEnrollmentForStudent(
        { studentId: user.id, courseId: "ppsc", status: "active", paymentStatus: "verified" },
        user.id,
        "ppsc",
      ),
    ).toBe(true);
    expect(
      isVerifiedEnrollmentForStudent(
        { studentId: user.id, courseId: "ppsc", status: "active", paymentStatus: "pending" },
        user.id,
        "ppsc",
      ),
    ).toBe(false);
    expect(
      isVerifiedEnrollmentForStudent(
        {
          studentId: "another-student",
          courseId: "ppsc",
          status: "active",
          paymentStatus: "verified",
        },
        user.id,
        "ppsc",
      ),
    ).toBe(false);
  });

  it("verifies the seeded Jawad account", () => {
    expect(verifyLogin("jawad@gmail.com", "12345678")?.email).toBe("jawad@gmail.com");
  });

  it("creates a session for an authenticated user", () => {
    const session = createSession("ali@example.com");

    expect(session).toBeTypeOf("string");
    expect(getSessionUser(session)?.email).toBe("ali@example.com");
  });

  it("categorizes only published courses and excludes active or pending courses from inactive", () => {
    const courses = [
      {
        courseId: "ppsc",
        name: "PPSC Preparation",
        description: "PPSC.",
        feePaisa: 20000,
        published: true,
      },
      {
        courseId: "css",
        name: "CSS Preparation",
        description: "CSS.",
        feePaisa: 20000,
        published: true,
      },
      {
        courseId: "nts",
        name: "NTS Preparation",
        description: "NTS.",
        feePaisa: 20000,
        published: true,
      },
      {
        courseId: "hidden",
        name: "Hidden",
        description: "Hidden.",
        feePaisa: 20000,
        published: false,
      },
    ];
    const overview = categorizeStudentCourses(
      courses,
      [
        { studentId: "student-1", courseId: "ppsc", status: "active", paymentStatus: "verified" },
        {
          studentId: "another-student",
          courseId: "nts",
          status: "active",
          paymentStatus: "verified",
        },
      ],
      [
        {
          studentId: "student-1",
          courseId: "css",
          transactionId: "TX-1234",
          amountPaisa: 20000,
          createdAt: new Date("2026-01-01T00:00:00Z"),
          status: "pending",
        },
        {
          studentId: "another-student",
          courseId: "nts",
          transactionId: "OTHER-123",
          amountPaisa: 20000,
          createdAt: new Date("2026-01-01T00:00:00Z"),
          status: "pending",
        },
      ],
      "student-1",
    );

    expect(overview.activeCourses.map((course) => course.id)).toEqual(["ppsc"]);
    expect(overview.pendingRequests.map((request) => request.id)).toEqual(["css"]);
    expect(overview.pendingRequests[0]?.amountPaisa).toBe(20000);
    expect(overview.inactiveCourses.map((course) => course.id)).toEqual(["nts"]);
  });

  it("rejects frontend-supplied payment amounts", () => {
    expect(
      coursePaymentRequestSchema.safeParse({
        courseId: "css",
        transactionId: "TX-1234",
      }).success,
    ).toBe(true);
    expect(
      coursePaymentRequestSchema.safeParse({
        courseId: "css",
        transactionId: "TX-1234",
        amountPaisa: 1,
      }).success,
    ).toBe(false);
  });
});
