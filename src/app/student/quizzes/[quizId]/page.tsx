import { notFound } from "next/navigation";
import { getQuizById } from "@/features/quizzes/data";
import { QuizPlayer } from "@/features/quizzes/components/QuizPlayer";

type QuizRunnerProps = {
  params: Promise<{ quizId: string }>;
};

export default async function QuizRunnerPage({ params }: QuizRunnerProps) {
  const { quizId } = await params;
  const quiz = getQuizById(quizId);

  if (!quiz) {
    notFound();
  }

  return <QuizPlayer quiz={quiz} />;
}
