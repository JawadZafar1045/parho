import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/api/handler";
import { apiSuccess } from "@/lib/api/response";
import { UnauthorizedError } from "@/lib/api/errors";
import { getSessionUser, SESSION_COOKIE_NAME } from "@/lib/auth/store";
import { submitCoursePaymentRequest } from "@/features/courses/server-data";
import { coursePaymentRequestSchema } from "@/features/courses/validations/payment-request";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const user = getSessionUser(token);
    if (!user) throw new UnauthorizedError("Authentication required.");

    const input = coursePaymentRequestSchema.parse(await request.json());
    await submitCoursePaymentRequest({
      studentId: user.id,
      courseId: input.courseId,
      transactionId: input.transactionId,
    });

    return NextResponse.json(
      apiSuccess({ message: "Payment request submitted for manual verification." }),
      { status: 201 },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
