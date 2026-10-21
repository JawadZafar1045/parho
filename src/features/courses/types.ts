export type Course = {
  id: string;
  name: string;
  status: "Active" | "Inactive";
  imageLabel: string;
  description?: string;
  notesRoute?: string;
  quizRoute?: string;
  logoTone?: string;
};

export type QuizResult = {
  id: string;
  course: string;
  quizName: string;
  score: number;
  date: string;
  status: "Completed" | "In Progress" | "Pending";
};
