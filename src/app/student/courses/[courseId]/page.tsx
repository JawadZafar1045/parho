import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getPublishedCourse, hasVerifiedCourseEnrollment } from "@/features/courses/server-data";
import { ManageCoursePage } from "@/features/courses/components/ManageCoursePage";
import { getSessionUser, SESSION_COOKIE_NAME } from "@/lib/auth/store";

type CourseRouteProps = { params: Promise<{ courseId: string }> };

export default async function CourseRoute({ params }: CourseRouteProps) {
  const { courseId } = await params;
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  const user = getSessionUser(token);
  if (!user || !(await hasVerifiedCourseEnrollment(user.id, courseId))) notFound();

  const record = await getPublishedCourse(courseId);

  if (!record) notFound();

  const course = {
    ...record,
    id: record.id,
    status: "Active" as const,
    imageLabel: record.id.toUpperCase(),
  };

  return <ManageCoursePage course={course} />;
}
