import type { Course, QuizResult } from "./types";

export const dashboardCourses: Course[] = [
  {
    id: "ppsc",
    name: "PPSC Preparation",
    status: "Active",
    imageLabel: "PPSC",
    description: "Complete notes and practice quizzes for PPSC.",
    notesRoute: "/student/notes?course=ppsc",
    quizRoute: "/student/quizzes?course=ppsc",
    logoTone: "bg-[#EAF7EA] text-[#0F9E46] border-[#8FD59D]",
  },
  {
    id: "fpsc",
    name: "FPSC Preparation",
    status: "Active",
    imageLabel: "FPSC",
    description: "Study material and MCQs for FPSC exams.",
    notesRoute: "/student/notes?course=fpsc",
    quizRoute: "/student/quizzes?course=fpsc",
    logoTone: "bg-[#F6EAE1] text-[#D77F44] border-[#E3B18B]",
  },
  {
    id: "nts",
    name: "NTS Preparation",
    status: "Active",
    imageLabel: "NTS",
    description: "Notes and practice quizzes for NTS tests.",
    notesRoute: "/student/notes?course=nts",
    quizRoute: "/student/quizzes?course=nts",
    logoTone: "bg-[#F5F1ED] text-[#EB6C2A] border-[#E7B090]",
  },
];

export const quizResults: QuizResult[] = [
  {
    id: "1",
    course: "PPSC",
    quizName: "General Knowledge",
    score: 82,
    date: "20 Sep 2026",
    status: "Completed",
  },
  {
    id: "2",
    course: "PPSC",
    quizName: "Pakistan Affairs",
    score: 75,
    date: "18 Sep 2026",
    status: "Completed",
  },
  {
    id: "3",
    course: "PPSC",
    quizName: "English",
    score: 63,
    date: "16 Sep 2026",
    status: "Completed",
  },
];
