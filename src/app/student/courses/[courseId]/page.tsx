import { notFound } from "next/navigation";
import { enrolledCourses } from "@/features/courses/constants";
import { ManageCoursePage } from "@/features/courses/components/ManageCoursePage";

type CourseRouteProps = { params: Promise<{ courseId: string }> };

export default async function CourseRoute({ params }: CourseRouteProps) {
  const { courseId } = await params;
  const course = enrolledCourses.find((item) => item.id === courseId);

  if (!course) notFound();

  return <ManageCoursePage course={course} />;
}