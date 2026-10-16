"use client";

import Link from "next/link";
import { useState } from "react";
import { StudentHeader } from "./StudentHeader";
import { StudentSidebar } from "./StudentSidebar";

export function StudentCourseActivityPage({
  courseName,
  courseId,
  activity,
}: {
  courseName: string;
  courseId: string;
  activity: "quiz" | "results";
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isQuiz = activity === "quiz";

  return (
    <div className="min-h-screen bg-[#F2F7FD] text-[#0F172A]">
      <StudentSidebar open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <div className="md:pl-[268px]">
        <StudentHeader onMenuOpen={() => setIsMenuOpen(true)} />
        <main className="px-4 py-7 sm:px-7 sm:py-8 md:px-9 lg:px-10">
          <div className="mx-auto max-w-[900px]">
            <Link
              href={`/student/courses/${courseId}`}
              className="inline-flex min-h-9 items-center gap-2 rounded-lg px-2 text-sm font-semibold text-[#445675] hover:bg-white hover:text-[#1478F2]"
            >
              <span aria-hidden="true">←</span>
              {courseName}
            </Link>
            <section className="mt-5 rounded-xl border border-[#DDE8F5] bg-white p-6 shadow-[0_5px_16px_rgba(46,93,145,0.035)]">
              <h1 className="text-2xl font-extrabold text-[#12234A]">
                {isQuiz ? "Quizzes" : "Results"} · {courseName}
              </h1>
              <p className="mt-3 text-sm leading-6 text-[#71809A]">
                {isQuiz
                  ? "Quiz content has not been configured for this course yet."
                  : "No saved quiz results are available for this course yet."}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/student/notes?course=${courseId}`}
                  className="inline-flex min-h-10 items-center rounded-lg border border-[#D6E1EE] px-4 text-sm font-semibold text-[#445675] hover:bg-[#F6F9FD]"
                >
                  Notes &amp; PDFs
                </Link>
                <Link
                  href={`/student/${isQuiz ? "results" : "quizzes"}?course=${courseId}`}
                  className="inline-flex min-h-10 items-center rounded-lg border border-[#D6E1EE] px-4 text-sm font-semibold text-[#445675] hover:bg-[#F6F9FD]"
                >
                  {isQuiz ? "Results" : "Quizzes"}
                </Link>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
