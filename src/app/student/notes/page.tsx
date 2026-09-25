import { NotesPage } from "@/features/notes/components/NotesPage";

type NotesRouteProps = { searchParams: Promise<{ course?: string }> };

export default async function NotesRoute({ searchParams }: NotesRouteProps) {
  const { course } = await searchParams;
  return <NotesPage initialCourseId={course} />;
}
