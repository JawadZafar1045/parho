export type CourseSubject = {
  id: string;
  name: string;
  description?: string;
  iconName?: string;
};

export type Course = {
  id: string;
  name: string;
  status: "Active" | "Inactive";
  imageLabel: string;
  description?: string;
  price?: number;
  originalPrice?: number;
  discountPercent?: number;
  discountLabel?: string;
  features?: string[];
  notesRoute?: string;
  quizRoute?: string;
  logoTone?: string;
  subjectCount?: number;
  pdfCount?: number;
  quizCount?: number;
  progressPercent?: number;
  badge?: string;
  accentColor?: string;
  subjects?: CourseSubject[];
};

export type QuizResult = {
  id: string;
  quizId?: string;
  course: string;
  quizName: string;
  score: number;
  totalMarks?: number;
  percentage?: number;
  date: string;
  status: "Completed" | "In Progress" | "Pending";
};
