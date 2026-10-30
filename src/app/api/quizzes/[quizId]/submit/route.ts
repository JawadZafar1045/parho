import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getQuizDetails } from "@/services/quizStore";
import { getSessionUser, SESSION_COOKIE_NAME } from "@/lib/auth/store";
import { connectToDatabase } from "@/lib/db/mongodb";
import { QuizAttempt } from "@/models/QuizAttempt";
import { apiSuccess } from "@/lib/api/response";
import { NotFoundError, UnauthorizedError } from "@/lib/api/errors";
import { handleApiError } from "@/lib/api/handler";
import type { QuizAnswerSubmission, EvaluatedAnswer, QuizAttemptResult } from "@/features/quizzes/types";
import { storeAttempt } from "@/features/quizzes/attemptsStore";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
    const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
    const user = getSessionUser(token);

    if (!user) {
      throw new UnauthorizedError("Authentication required to submit quiz.");
    }

    const { quizId } = await params;
    const quiz = await getQuizDetails(quizId, true);

    if (!quiz || !quiz.questions) {
      throw new NotFoundError("Quiz not found.");
    }

    const body = await request.json();
    const submissions: QuizAnswerSubmission[] = body.answers || [];
    const timeSpentSeconds = Number(body.timeSpentSeconds) || 0;

    const submissionMap = new Map(
      submissions.map((s) => [s.questionId, s.selectedOptionKey])
    );

    let score = 0;
    let correctCount = 0;
    let wrongCount = 0;
    let unansweredCount = 0;

    const evaluatedAnswers: EvaluatedAnswer[] = quiz.questions.map((q) => {
      const selectedKey = submissionMap.get(q.id) || "";
      const isUnanswered = !selectedKey;
      const isCorrect = !isUnanswered && selectedKey.toUpperCase() === q.correctOptionKey?.toUpperCase();

      if (isUnanswered) {
        unansweredCount++;
      } else if (isCorrect) {
        correctCount++;
        score += q.points;
      } else {
        wrongCount++;
      }

      return {
        questionId: q.id,
        questionNumber: q.questionNumber,
        questionText: q.questionText,
        selectedOptionKey: selectedKey,
        correctOptionKey: q.correctOptionKey || "A",
        isCorrect,
        explanation: q.explanation,
      };
    });

    const totalQuestions = quiz.questions.length;
    const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const isPassed = percentage >= quiz.passingPercentage;
    const attemptId = `attempt-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;

    const result: QuizAttemptResult = {
      attemptId,
      quizId: quiz.id,
      quizTitle: quiz.title,
      courseId: quiz.courseId,
      subjectId: quiz.subjectId,
      score,
      totalMarks: quiz.totalMarks,
      totalQuestions,
      correctCount,
      wrongCount,
      unansweredCount,
      percentage,
      isPassed,
      timeSpentSeconds,
      completedAt: new Date().toISOString(),
      answers: evaluatedAnswers,
    };

    storeAttempt(result);

    // Asynchronously save to MongoDB
    (async () => {
      try {
        await connectToDatabase();
        await QuizAttempt.create({
          userId: user.id,
          userEmail: user.email,
          quizId: quiz.id,
          courseId: quiz.courseId,
          subjectId: quiz.subjectId,
          quizTitle: quiz.title,
          score,
          totalMarks: quiz.totalMarks,
          totalQuestions,
          correctCount,
          wrongCount,
          unansweredCount,
          percentage,
          isPassed,
          timeSpentSeconds,
          answers: evaluatedAnswers,
        });
      } catch (err) {
        console.warn("MongoDB attempt save skipped:", err);
      }
    })();

    return NextResponse.json(
      apiSuccess({
        message: "Quiz submitted and evaluated successfully.",
        data: { result },
      })
    );
  } catch (error) {
    return handleApiError(error);
  }
}
