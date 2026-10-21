import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { CourseEnrollmentPage } from "@/features/courses/components/CourseEnrollmentPage";
import { getStudentCourseOverview } from "@/features/courses/server-data";
import { getSessionUser, SESSION_COOKIE_NAME } from "@/lib/auth/store";

type CourseEnrollmentRouteProps = { params: Promise<{ courseId: string }> };

export default async function CourseEnrollmentRoute({ params }: CourseEnrollmentRouteProps) {
  const { courseId } = await params;
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  const user = getSessionUser(token);
  if (!user) redirect("/login");

  const overview = await getStudentCourseOverview(user.id);
  const listedCourse = [
    ...overview.activeCourses,
    ...overview.pendingRequests,
    ...overview.inactiveCourses,
  ].find((item) => item.id === courseId);
  const course = listedCourse
    ? {
        id: listedCourse.id,
        name: listedCourse.name,
        description: listedCourse.description,
        feePaisa: listedCourse.feePaisa,
      }
    : null;
  if (!course) notFound();
  if (overview.activeCourses.some((item) => item.id === courseId))
    redirect(`/student/courses/${courseId}`);
  if (
    !overview.inactiveCourses.some((item) => item.id === courseId) &&
    !overview.pendingRequests.some((item) => item.id === courseId)
  )
    notFound();

  return (
    <CourseEnrollmentPage
      course={course}
      hasPendingRequest={overview.pendingRequests.some((item) => item.id === courseId)}
    />
  );
}
