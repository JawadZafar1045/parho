import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CourseCatalogPage } from "@/features/courses/components/CourseCatalogPage";
import { getEligibleCourses } from "@/features/courses/server-data";
import { getSessionUser, SESSION_COOKIE_NAME } from "@/lib/auth/store";

export default async function StudentCourseCatalogRoute() {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  const user = getSessionUser(token);
  if (!user) redirect("/login");

  const courses = await getEligibleCourses(user.id);
  return <CourseCatalogPage courses={courses} />;
}
