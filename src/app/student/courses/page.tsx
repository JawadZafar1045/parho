import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { StudentCoursePage } from "@/features/courses/components/StudentCoursePage";
import { getStudentCourseOverview } from "@/features/courses/server-data";
import { getSessionUser, SESSION_COOKIE_NAME } from "@/lib/auth/store";

export default async function CoursesPage() {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  const user = getSessionUser(token);

  if (!user) redirect("/login");

  const overview = await getStudentCourseOverview(user.id);
  return <StudentCoursePage {...overview} />;
}
