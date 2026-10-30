import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSessionUser, SESSION_COOKIE_NAME } from "@/lib/auth/store";
import { deleteQuiz } from "@/services/quizStore";
import { apiSuccess } from "@/lib/api/response";
import { UnauthorizedError, ForbiddenError } from "@/lib/api/errors";
import { handleApiError } from "@/lib/api/handler";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
    const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
    const user = getSessionUser(token);

    if (!user) {
      throw new UnauthorizedError("Authentication required.");
    }
    if (user.role !== "admin") {
      throw new ForbiddenError("Admin privilege required.");
    }

    const { quizId } = await params;
    await deleteQuiz(quizId);

    return NextResponse.json(
      apiSuccess({
        message: "Quiz deleted successfully.",
      })
    );
  } catch (error) {
    return handleApiError(error);
  }
}
