import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { getSessionUser, SESSION_COOKIE_NAME } from "@/lib/auth/store";
import { getSubject } from "@/features/notes/data";
import { enrolledCourses } from "@/features/courses/constants";
import { SecurePdfReader } from "@/features/notes/components/SecurePdfReader";

type ViewPdfPageProps = {
  params: Promise<{
    courseId: string;
    subjectId: string;
    pdfId: string;
  }>;
};

export default async function ViewPdfPage({ params }: ViewPdfPageProps) {
  const { courseId, subjectId, pdfId } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const user = getSessionUser(token);

  if (!user) {
    redirect("/login");
  }

  const course = enrolledCourses.find((c) => c.id === courseId);
  const subject = getSubject(courseId, subjectId);

  if (!course || !subject) {
    notFound();
  }

  const pdf = subject.pdfs.find((p) => p.id === pdfId);
  const pdfTitle = pdf ? pdf.title : pdfId.replace(/-\d+$/, "").replace(/-/g, " ");

  return (
    <SecurePdfReader
      courseId={courseId}
      courseName={course.name}
      subject={subject}
      pdfId={pdfId}
      pdfTitle={pdfTitle}
      userEmail={user.email}
      userPhone={user.whatsapp}
      userName={user.fullName}
    />
  );
}
