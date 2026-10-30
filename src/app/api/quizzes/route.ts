import { NextRequest, NextResponse } from "next/server";
import { getAllQuizzes } from "@/services/quizStore";
import { apiSuccess } from "@/lib/api/response";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const courseId = searchParams.get("course") || undefined;

  const allQuizzes = await getAllQuizzes(courseId);
  const quizzes = allQuizzes.map((q) => ({
    id: q.id,
    courseId: q.courseId,
    courseName: q.courseName,
    subjectId: q.subjectId,
    subjectName: q.subjectName,
    title: q.title,
    description: q.description,
    timeLimitMinutes: q.timeLimitMinutes,
    totalMarks: q.totalMarks,
    passingPercentage: q.passingPercentage,
    questionCount: q.questionCount,
  }));

  return NextResponse.json(
    apiSuccess({
      message: "Quizzes retrieved successfully.",
      data: { quizzes },
    })
  );
}
