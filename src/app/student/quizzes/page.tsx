import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { StudentCourseActivityPage } from "@/features/courses/components/StudentCourseActivityPage";
import { getPublishedCourse, hasVerifiedCourseEnrollment } from "@/features/courses/server-data";
import { getSessionUser, SESSION_COOKIE_NAME } from "@/lib/auth/store";

type QuizzesRouteProps = { searchParams: Promise<{ course?: string }> };

export default async function QuizzesRoute({ searchParams }: QuizzesRouteProps) {
  const { course: courseId } = await searchParams;
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  const user = getSessionUser(token);
  if (!user) redirect("/login");
  if (!courseId || !(await hasVerifiedCourseEnrollment(user.id, courseId))) notFound();

  const course = await getPublishedCourse(courseId);
  if (!course) notFound();

  return (
    <StudentCourseActivityPage courseName={course.name} courseId={course.id} activity="quiz" />
  );
}
