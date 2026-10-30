"use client";

import Link from "next/link";
import { useState } from "react";
import { enrolledCourses } from "@/features/courses/constants";
import { StudentHeader } from "@/features/courses/components/StudentHeader";
import { StudentSidebar } from "@/features/courses/components/StudentSidebar";
import { initialQuizzes } from "../data";

type QuizzesListPageProps = {
  initialCourseId?: string;
};

export function QuizzesListPage({ initialCourseId }: QuizzesListPageProps) {
  const startingCourse = enrolledCourses.some((c) => c.id === initialCourseId)
    ? initialCourseId
    : enrolledCourses[0]?.id;

  const [selectedCourseId, setSelectedCourseId] = useState<string>(startingCourse || "ppsc");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const selectedCourse =
    enrolledCourses.find((c) => c.id === selectedCourseId) || enrolledCourses[0];

  const courseQuizzes = initialQuizzes.filter(
    (q) => q.courseId === selectedCourse?.id
  );

  return (
    <div className="min-h-screen bg-[#F7FAFE] text-[#0F172A]">
      <StudentSidebar open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <div className="md:pl-[268px]">
        <StudentHeader onMenuOpen={() => setIsMenuOpen(true)} />

        <main className="px-5 py-7 sm:px-8 sm:py-9 md:px-10 md:py-10 lg:px-12">
          <div className="mx-auto max-w-[1120px]">
            {/* Breadcrumb & Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#71829F]">
                <Link href="/student/dashboard" className="hover:text-[#2563EB]">
                  Dashboard
                </Link>
                <span aria-hidden="true">›</span>
                <span className="text-[#18264A]">Practice Quizzes</span>
              </div>
              <h1 className="mt-3 text-[30px] font-extrabold tracking-[-0.035em] text-[#101B45] sm:text-[34px]">
                Exam Quizzes &amp; Mock Tests
              </h1>
              <p className="mt-1 text-[15px] font-medium text-[#64748B] sm:text-base">
                Timed exam-style tests with instant grading, question-by-question review, and explanations.
              </p>
            </div>

            {/* Course Selector Tabs */}
            <section className="mb-8" aria-label="Course selection">
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-[#64748B]">
                Select Examination Category
              </h2>
              <div className="flex flex-wrap gap-2.5">
                {enrolledCourses.map((course) => {
                  const isActive = course.id === selectedCourse?.id;
                  return (
                    <button
                      key={course.id}
                      type="button"
                      onClick={() => setSelectedCourseId(course.id)}
                      className={`flex items-center gap-2.5 rounded-xl border px-4 py-2.5 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                        isActive
                          ? "border-[#2563EB] bg-[#2563EB] text-white shadow-md shadow-blue-200"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-extrabold ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-blue-50 text-blue-600"
                        }`}
                      >
                        {course.imageLabel}
                      </span>
                      {course.name}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Quizzes List */}
            <section aria-labelledby="quizzes-heading">
              <div className="mb-4 flex items-center justify-between">
                <h2 id="quizzes-heading" className="text-xl font-bold tracking-tight text-[#121E46]">
                  Available Tests for {selectedCourse?.name}
                </h2>
                <span className="text-xs font-semibold text-slate-500">
                  {courseQuizzes.length} tests ready
                </span>
              </div>

              {courseQuizzes.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
                  <span className="text-3xl" aria-hidden="true">📝</span>
                  <p className="mt-3 text-base font-bold text-slate-800">
                    No tests found for this course yet
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    New tests are being uploaded regularly. Check back soon!
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {courseQuizzes.map((quiz) => (
                    <article
                      key={quiz.id}
                      className="flex flex-col justify-between rounded-2xl border border-[#DCE6F2] bg-white p-5 shadow-[0_4px_20px_rgba(30,74,140,0.04)] transition hover:border-[#2563EB] hover:shadow-[0_8px_28px_rgba(37,99,235,0.09)]"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700">
                            {quiz.subjectName}
                          </span>
                          <span className="text-xs font-semibold text-slate-500">
                            ⏱ {quiz.timeLimitMinutes} mins
                          </span>
                        </div>

                        <h3 className="mt-3 text-base font-bold leading-snug text-[#101B45]">
                          {quiz.title}
                        </h3>

                        <p className="mt-1.5 text-xs leading-relaxed text-slate-500 line-clamp-2">
                          {quiz.description}
                        </p>

                        <div className="mt-4 flex items-center gap-4 border-t border-slate-100 pt-3 text-xs text-slate-600">
                          <div>
                            <span className="font-bold text-slate-900">{quiz.questionCount}</span> MCQs
                          </div>
                          <div>
                            <span className="font-bold text-slate-900">{quiz.totalMarks}</span> Marks
                          </div>
                          <div>
                            Pass: <span className="font-bold text-emerald-600">{quiz.passingPercentage}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5">
                        <Link
                          href={`/student/quizzes/${quiz.id}`}
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2.5 text-center text-sm font-bold text-white shadow-sm transition hover:bg-[#1D4ED8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        >
                          Start Test
                          <span aria-hidden="true">→</span>
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
