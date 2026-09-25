export type PdfNote = {
  id: string;
  title: string;
  size: string;
};

export type Subject = {
  id: string;
  name: string;
  pdfs: PdfNote[];
};

export type CourseMaterial = {
  courseId: string;
  subjects: Subject[];
};
