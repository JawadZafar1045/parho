import { notFound } from "next/navigation";
import { getSubject } from "@/features/notes/data";
import { SubjectNotesPage } from "@/features/notes/components/SubjectNotesPage";

type SubjectRouteProps = { params: Promise<{ courseId: string; subjectId: string }> };

export default async function SubjectRoute({ params }: SubjectRouteProps) {
  const { courseId, subjectId } = await params;
  if (!getSubject(courseId, subjectId)) notFound();
  return <SubjectNotesPage courseId={courseId} subjectId={subjectId} />;
}
