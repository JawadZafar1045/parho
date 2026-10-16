import type { CourseMaterial, PdfNote, Subject } from "./types";

const pdfs = (subjectId: string, title: string, sizes: string[]): PdfNote[] =>
  sizes.map((size, index) => ({
    id: `${subjectId}-${index + 1}`,
    title: `${title} - Part ${index + 1}.pdf`,
    size,
  }));

const subject = (id: string, name: string, sizes: string[]): Subject => ({
  id,
  name,
  pdfs: pdfs(id, name, sizes),
});

export const courseMaterials: CourseMaterial[] = [
  {
    courseId: "ppsc",
    subjects: [
      subject("general-knowledge", "General Knowledge", ["2.4 MB", "3.1 MB", "1.8 MB"]),
      subject("pakistan-affairs", "Pakistan Affairs", ["2.8 MB", "3.4 MB"]),
      subject("english", "English", ["1.9 MB", "2.2 MB"]),
      subject("current-affairs", "Current Affairs", ["2.1 MB", "2.6 MB"]),
      subject("islamic-studies", "Islamic Studies", ["2.5 MB", "1.7 MB"]),
      subject("everyday-science", "Everyday Science", ["1.6 MB", "2.3 MB"]),
      subject("basic-mathematics", "Basic Mathematics", ["2.7 MB", "3.2 MB"]),
    ],
  },
  {
    courseId: "pms",
    subjects: [
      subject("general-knowledge", "General Knowledge", ["2.4 MB", "3.1 MB"]),
      subject("pakistan-affairs", "Pakistan Affairs", ["2.8 MB", "3.4 MB"]),
      subject("essay-writing", "Essay Writing", ["1.9 MB", "2.2 MB"]),
    ],
  },
  {
    courseId: "fpsc",
    subjects: [
      subject("general-knowledge", "General Knowledge", ["2.4 MB", "3.1 MB"]),
      subject("current-affairs", "Current Affairs", ["2.1 MB", "2.6 MB"]),
      subject("computer-science", "Computer Science", ["2.5 MB", "1.7 MB"]),
    ],
  },
  {
    courseId: "css",
    subjects: [
      subject("english", "English", ["1.9 MB", "2.2 MB"]),
      subject("current-affairs", "Current Affairs", ["2.1 MB", "2.6 MB"]),
      subject("islamic-studies", "Islamic Studies", ["2.5 MB", "1.7 MB"]),
    ],
  },
];

export function getCourseMaterial(courseId: string) {
  return courseMaterials.find((material) => material.courseId === courseId);
}

export function getSubject(courseId: string, subjectId: string) {
  return getCourseMaterial(courseId)?.subjects.find((item) => item.id === subjectId);
}
