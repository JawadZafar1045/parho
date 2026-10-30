import { NextRequest, NextResponse } from "next/server";
import { getQuizDetails } from "@/services/quizStore";
import { apiSuccess } from "@/lib/api/response";
import { NotFoundError } from "@/lib/api/errors";
import { handleApiError } from "@/lib/api/handler";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
    const { quizId } = await params;
    const quiz = await getQuizDetails(quizId, false);

    if (!quiz) {
      throw new NotFoundError("Quiz not found.");
    }

    return NextResponse.json(
      apiSuccess({
        message: "Quiz retrieved successfully.",
        data: {
          quiz,
        },
      })
    );
  } catch (error) {
    return handleApiError(error);
  }
}
