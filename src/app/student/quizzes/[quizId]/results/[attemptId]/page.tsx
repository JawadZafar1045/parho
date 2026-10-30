import { notFound } from "next/navigation";
import { getStoredAttempt } from "@/features/quizzes/attemptsStore";
import { getQuizById } from "@/features/quizzes/data";
import { QuizResultView } from "@/features/quizzes/components/QuizResultView";
import type { QuizAttemptResult } from "@/features/quizzes/types";

type QuizResultPageProps = {
  params: Promise<{
    quizId: string;
    attemptId: string;
  }>;
};

export default async function QuizResultPage({ params }: QuizResultPageProps) {
  const { quizId, attemptId } = await params;

  let result = getStoredAttempt(attemptId);

  if (!result) {
    const quiz = getQuizById(quizId);
    if (!quiz || !quiz.questions) {
      notFound();
    }

    // Fallback demonstration score if accessed directly
    result = {
      attemptId,
      quizId: quiz.id,
      quizTitle: quiz.title,
      courseId: quiz.courseId,
      subjectId: quiz.subjectId,
      score: quiz.totalMarks,
      totalMarks: quiz.totalMarks,
      totalQuestions: quiz.questions.length,
      correctCount: quiz.questions.length,
      wrongCount: 0,
      unansweredCount: 0,
      percentage: 100,
      isPassed: true,
      timeSpentSeconds: 180,
      completedAt: new Date().toISOString(),
      answers: quiz.questions.map((q) => ({
        questionId: q.id,
        questionNumber: q.questionNumber,
        questionText: q.questionText,
        selectedOptionKey: q.correctOptionKey || "A",
        correctOptionKey: q.correctOptionKey || "A",
        isCorrect: true,
        explanation: q.explanation,
      })),
    } satisfies QuizAttemptResult;
  }

  return <QuizResultView result={result} />;
}
