import { connectToDatabase } from "@/lib/db/mongodb";
import { CourseModel } from "@/models/Course";
import { EnrollmentModel } from "@/models/Enrollment";
import { PaymentRequestModel } from "@/models/PaymentRequest";
import { AppError } from "@/lib/api/errors";

export type PublishedCourse = {
  id: string;
  name: string;
  description: string;
  feePaisa: number;
};

export type StudentPaymentRequestData = PublishedCourse & {
  transactionId: string;
  amountPaisa: number;
  submittedAt: string;
};

export type StudentCourseOverview = {
  activeCourses: PublishedCourse[];
  pendingRequests: StudentPaymentRequestData[];
  inactiveCourses: PublishedCourse[];
};

export function isVerifiedEnrollmentForStudent(
  enrollment: {
    studentId: string;
    courseId: string;
    status: string;
    paymentStatus: string;
  } | null,
  studentId: string,
  courseId: string,
): boolean {
  return Boolean(
    enrollment &&
    enrollment.studentId === studentId &&
    enrollment.courseId === courseId &&
    enrollment.status === "active" &&
    enrollment.paymentStatus === "verified",
  );
}

function toPublishedCourse(course: {
  courseId: string;
  name: string;
  description: string;
  feePaisa: number;
}): PublishedCourse {
  return {
    id: course.courseId,
    name: course.name,
    description: course.description,
    feePaisa: course.feePaisa,
  };
}

export function categorizeStudentCourses(
  courses: Array<{
    courseId: string;
    name: string;
    description: string;
    feePaisa: number;
    published: boolean;
  }>,
  enrollments: Array<{
    studentId: string;
    courseId: string;
    status: string;
    paymentStatus: string;
  }>,
  requests: Array<{
    studentId: string;
    courseId: string;
    transactionId: string;
    amountPaisa: number;
    createdAt: Date;
    status: string;
  }>,
  studentId: string,
): StudentCourseOverview {
  const publishedCourses = courses.filter((course) => course.published);
  const courseById = new Map(publishedCourses.map((course) => [course.courseId, course]));
  const activeIds = new Set(
    enrollments
      .filter(
        (enrollment) =>
          isVerifiedEnrollmentForStudent(enrollment, studentId, enrollment.courseId) &&
          courseById.has(enrollment.courseId),
      )
      .map((enrollment) => enrollment.courseId),
  );
  const pendingRequests = requests.flatMap((request) => {
    const course = courseById.get(request.courseId);
    if (
      request.studentId !== studentId ||
      !course ||
      activeIds.has(request.courseId) ||
      request.status !== "pending"
    ) {
      return [];
    }
    return [
      {
        ...toPublishedCourse(course),
        transactionId: request.transactionId,
        amountPaisa: request.amountPaisa,
        submittedAt: request.createdAt.toISOString(),
      },
    ];
  });
  const pendingIds = new Set(pendingRequests.map((request) => request.id));
  const activeCourses = [...activeIds].flatMap((id) => {
    const course = courseById.get(id);
    return course ? [toPublishedCourse(course)] : [];
  });
  const inactiveCourses = publishedCourses
    .filter((course) => !activeIds.has(course.courseId) && !pendingIds.has(course.courseId))
    .map(toPublishedCourse);

  return { activeCourses, pendingRequests, inactiveCourses };
}

export async function getPublishedCourse(courseId: string): Promise<PublishedCourse | null> {
  await connectToDatabase();
  const course = await CourseModel.findOne({ courseId, published: true }).lean();
  return course ? toPublishedCourse(course) : null;
}

export async function getStudentCourseOverview(studentId: string): Promise<StudentCourseOverview> {
  await connectToDatabase();
  const [courses, enrollments, requests] = await Promise.all([
    CourseModel.find({ published: true }).sort({ name: 1 }).lean(),
    EnrollmentModel.find({ studentId, status: "active", paymentStatus: "verified" }).lean(),
    PaymentRequestModel.find({ studentId, status: "pending" }).sort({ createdAt: -1 }).lean(),
  ]);

  return categorizeStudentCourses(courses, enrollments, requests, studentId);
}

export async function getEligibleCourses(studentId: string): Promise<PublishedCourse[]> {
  const overview = await getStudentCourseOverview(studentId);
  return overview.inactiveCourses;
}

export async function hasVerifiedCourseEnrollment(
  studentId: string,
  courseId: string,
): Promise<boolean> {
  await connectToDatabase();
  const enrollment = await EnrollmentModel.findOne({ studentId, courseId }).lean();
  return isVerifiedEnrollmentForStudent(enrollment, studentId, courseId);
}

export async function hasPendingPaymentRequest(
  studentId: string,
  courseId: string,
): Promise<boolean> {
  await connectToDatabase();
  return Boolean(await PaymentRequestModel.exists({ studentId, courseId, status: "pending" }));
}

export async function submitCoursePaymentRequest({
  studentId,
  courseId,
  transactionId,
}: {
  studentId: string;
  courseId: string;
  transactionId: string;
}): Promise<void> {
  await connectToDatabase();
  const course = await CourseModel.findOne({ courseId, published: true }).lean();
  if (!course) {
    throw new AppError("This course is not available for enrollment.", 404, "COURSE_NOT_FOUND");
  }

  const [enrollment, pendingRequest] = await Promise.all([
    EnrollmentModel.exists({
      studentId,
      courseId,
      status: "active",
      paymentStatus: "verified",
    }),
    PaymentRequestModel.exists({ studentId, courseId, status: "pending" }),
  ]);
  if (enrollment) {
    throw new AppError("You already have verified access to this course.", 409, "ALREADY_ENROLLED");
  }
  if (pendingRequest) {
    throw new AppError(
      "A payment request for this course is already being reviewed.",
      409,
      "PAYMENT_ALREADY_PENDING",
    );
  }

  try {
    await PaymentRequestModel.create({
      studentId,
      courseId,
      transactionId,
      amountPaisa: course.feePaisa,
      status: "pending",
    });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === 11000) {
      throw new AppError(
        "This JazzCash transaction ID has already been submitted.",
        409,
        "DUPLICATE_TRANSACTION",
      );
    }
    throw error;
  }
}
