import { QuizzesListPage } from "@/features/quizzes/components/QuizzesListPage";

type QuizzesRouteProps = {
  searchParams: Promise<{ course?: string }>;
};

export default async function QuizzesPage({ searchParams }: QuizzesRouteProps) {
  const { course } = await searchParams;
  return <QuizzesListPage initialCourseId={course} />;
}
