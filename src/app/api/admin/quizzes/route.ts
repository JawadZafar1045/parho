import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSessionUser, SESSION_COOKIE_NAME } from "@/lib/auth/store";
import { getAllQuizzes } from "@/services/quizStore";
import { apiSuccess } from "@/lib/api/response";
import { UnauthorizedError, ForbiddenError } from "@/lib/api/errors";
import { handleApiError } from "@/lib/api/handler";

export async function GET(request: NextRequest) {
  try {
    const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
    const user = getSessionUser(token);

    if (!user) {
      throw new UnauthorizedError("Authentication required.");
    }
    if (user.role !== "admin") {
      throw new ForbiddenError("Admin privilege required.");
    }

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId") || undefined;

    const quizzes = await getAllQuizzes(courseId);
    return NextResponse.json(
      apiSuccess({
        message: "Quizzes fetched successfully.",
        data: { quizzes },
      })
    );
  } catch (error) {
    return handleApiError(error);
  }
}
