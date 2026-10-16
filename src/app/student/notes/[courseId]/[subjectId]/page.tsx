import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { hasVerifiedCourseEnrollment } from "@/features/courses/server-data";
import { getSubject } from "@/features/notes/data";
import { SubjectNotesPage } from "@/features/notes/components/SubjectNotesPage";
import { getSessionUser, SESSION_COOKIE_NAME } from "@/lib/auth/store";

type SubjectRouteProps = { params: Promise<{ courseId: string; subjectId: string }> };

export default async function SubjectRoute({ params }: SubjectRouteProps) {
  const { courseId, subjectId } = await params;
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  const user = getSessionUser(token);
  if (!user || !(await hasVerifiedCourseEnrollment(user.id, courseId))) notFound();

  if (!getSubject(courseId, subjectId)) notFound();
  return <SubjectNotesPage courseId={courseId} subjectId={subjectId} />;
}
