import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { hasVerifiedCourseEnrollment } from "@/features/courses/server-data";
import { NotesPage } from "@/features/notes/components/NotesPage";
import { getSessionUser, SESSION_COOKIE_NAME } from "@/lib/auth/store";

type NotesRouteProps = { searchParams: Promise<{ course?: string }> };

export default async function NotesRoute({ searchParams }: NotesRouteProps) {
  const { course } = await searchParams;
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  const user = getSessionUser(token);

  const requestedCourse = course ?? user?.test;
  if (!user || !requestedCourse || !(await hasVerifiedCourseEnrollment(user.id, requestedCourse))) {
    redirect("/student/courses");
  }

  return <NotesPage initialCourseId={course} />;
}
