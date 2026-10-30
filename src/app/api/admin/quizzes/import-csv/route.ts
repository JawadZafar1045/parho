import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSessionUser, SESSION_COOKIE_NAME } from "@/lib/auth/store";
import { createQuizFromCsv, type ParsedCsvQuestion } from "@/services/quizStore";
import { apiSuccess } from "@/lib/api/response";
import { UnauthorizedError, ForbiddenError, ValidationError } from "@/lib/api/errors";
import { handleApiError } from "@/lib/api/handler";

export async function POST(request: NextRequest) {
  try {
    const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
    const user = getSessionUser(token);

    if (!user) {
      throw new UnauthorizedError("Authentication required.");
    }
    if (user.role !== "admin") {
      throw new ForbiddenError("Admin privilege required.");
    }

    const body = await request.json();
    const {
      courseId,
      courseName,
      subjectId,
      subjectName,
      title,
      description,
      timeLimitMinutes,
      passingPercentage,
      questions,
    } = body;

    if (!courseId || !subjectId || !title) {
      throw new ValidationError("Course, Subject, and Quiz Title are required.");
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      throw new ValidationError("At least one valid MCQ question is required from CSV import.");
    }

    // Validate parsed CSV questions
    const validatedQuestions: ParsedCsvQuestion[] = [];
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText || !q.optionA || !q.optionB || !q.optionC || !q.optionD || !q.correctOption) {
        throw new ValidationError(
          `Row ${i + 1} has incomplete data. Question text, options A-D, and correct option (A, B, C, or D) are mandatory.`
        );
      }

      const validKeys = ["A", "B", "C", "D"];
      const correctUpper = String(q.correctOption).trim().toUpperCase();
      if (!validKeys.includes(correctUpper)) {
        throw new ValidationError(
          `Row ${i + 1} has invalid correctOption '${q.correctOption}'. Must be A, B, C, or D.`
        );
      }

      validatedQuestions.push({
        questionNumber: i + 1,
        questionText: String(q.questionText).trim(),
        optionA: String(q.optionA).trim(),
        optionB: String(q.optionB).trim(),
        optionC: String(q.optionC).trim(),
        optionD: String(q.optionD).trim(),
        correctOption: correctUpper,
        explanation: q.explanation ? String(q.explanation).trim() : undefined,
        points: Number(q.points) || 1,
      });
    }

    const createdQuiz = await createQuizFromCsv({
      courseId,
      courseName,
      subjectId,
      subjectName,
      title,
      description,
      timeLimitMinutes: Number(timeLimitMinutes) || 15,
      passingPercentage: Number(passingPercentage) || 50,
      questions: validatedQuestions,
    });

    return NextResponse.json(
      apiSuccess({
        message: `Quiz '${createdQuiz.title}' created successfully with ${validatedQuestions.length} MCQs.`,
        data: { quiz: createdQuiz },
      }),
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
