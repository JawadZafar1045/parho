"use client";

import Link from "next/link";
import { useState } from "react";
import { dashboardCourses, quizResults } from "../dashboardData";
import { StudentHeader } from "./StudentHeader";
import { StudentSidebar } from "./StudentSidebar";
import { FileIcon, PencilIcon } from "./Icons";

function getScoreTone(score: number) {
  if (score >= 75) {
    return "bg-[#EAF9EE] text-[#1F9D59]";
  }

  return "bg-[#FFF3E7] text-[#DD7E1F]";
}

export function StudentDashboardPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7FAFE] text-[#0F172A]">
      <StudentSidebar open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <div className="md:pl-[268px]">
        <StudentHeader onMenuOpen={() => setIsMenuOpen(true)} />

        <main className="px-4 py-6 sm:px-6 md:px-8 lg:px-10 xl:px-12">
          <div className="mx-auto max-w-[1180px]">
            <section className="mb-7 sm:mb-8">
              <p className="text-[17px] font-medium text-[#0F172A] sm:text-[20px]">
                Welcome back,
              </p>
              <h1 className="mt-1 text-[32px] font-extrabold tracking-[-0.04em] text-[#1A64D8] sm:text-[42px]">
                Abdul Saboor
              </h1>
              <p className="mt-2 text-[16px] font-medium text-[#64748B] sm:text-[19px]">
                Keep preparing. Small steps make big results!
              </p>
            </section>

            <section className="mb-7 sm:mb-8">
              <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="text-[26px] font-bold tracking-[-0.03em] text-[#0F172A] sm:text-[30px]">
                  Your Enrolled Courses
                </h2>
                <Link
                  href="/student/courses"
                  className="inline-flex items-center gap-2 text-[15px] font-semibold text-[#2563EB] transition-colors hover:text-[#1F51C9]"
                >
                  View All Courses
                  <span aria-hidden="true">→</span>
                </Link>
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {dashboardCourses.map((course) => (
                  <article
                    key={course.id}
                    className="rounded-2xl border border-[#DCE6F2] bg-white p-4 shadow-[0_8px_24px_rgba(46,93,145,0.04)] sm:p-5"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-16 w-16 items-center justify-center rounded-full border-2 bg-white text-[18px] font-black tracking-tight ${course.logoTone}`}
                        aria-label={`${course.name} course logo`}
                      >
                        {course.imageLabel}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-[20px] font-extrabold tracking-[-0.03em] text-[#101B45] sm:text-[22px]">
                          {course.name}
                        </h3>
                        <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#EAF9EE] px-2.5 py-1 text-[13px] font-semibold text-[#1B9C57]">
                          <span className="h-2 w-2 rounded-full bg-[#1ABF67]" aria-hidden="true" />
                          {course.status}
                        </div>
                      </div>
                    </div>

                    <p className="mt-4 min-h-[48px] text-[15px] leading-6 text-[#64748B]">
                      {course.description}
                    </p>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <Link
                        href={course.notesRoute ?? "/student/notes"}
                        className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-[#B9D6FF] bg-[#F1F6FF] px-4 text-[15px] font-semibold text-[#2563EB] transition-colors hover:bg-[#E1ECFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                      >
                        <FileIcon className="h-5 w-5" />
                        Notes &amp; PDFs
                      </Link>

                      <Link
                        href={course.quizRoute ?? "/student/quizzes"}
                        className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-4 text-[15px] font-semibold text-white shadow-[0_10px_18px_rgba(37,99,235,0.16)] transition-colors hover:bg-[#1D59D8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                      >
                        <PencilIcon className="h-5 w-5" />
                        Start Quiz
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section>
              <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="text-[26px] font-bold tracking-[-0.03em] text-[#0F172A] sm:text-[30px]">
                  Recent Quiz Results
                </h2>
                <Link
                  href="/student/results"
                  className="inline-flex items-center gap-2 text-[15px] font-semibold text-[#2563EB] transition-colors hover:text-[#1F51C9]"
                >
                  View All Results
                  <span aria-hidden="true">→</span>
                </Link>
              </div>

              <div className="overflow-hidden rounded-2xl border border-[#DCE6F2] bg-white shadow-[0_8px_24px_rgba(46,93,145,0.04)]">
                <div className="overflow-x-auto">
                  <table className="min-w-full border-separate border-spacing-0 text-left">
                    <thead>
                      <tr>
                        {[
                          "Course",
                          "Quiz Name",
                          "Score",
                          "Date",
                          "Status",
                        ].map((header) => (
                          <th
                            key={header}
                            className="border-b border-[#E2EAF4] bg-[#F4F8FF] px-4 py-3 text-[14px] font-semibold text-[#536684] sm:px-5"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {quizResults.map((result) => (
                        <tr key={result.id} className="odd:bg-white even:bg-[#FBFDFF]">
                          <td className="border-b border-[#E2EAF4] px-4 py-4 text-[15px] font-medium text-[#1F2937] sm:px-5">
                            {result.course}
                          </td>
                          <td className="border-b border-[#E2EAF4] px-4 py-4 text-[15px] font-medium text-[#1F2937] sm:px-5">
                            {result.quizName}
                          </td>
                          <td className="border-b border-[#E2EAF4] px-4 py-4 sm:px-5">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-[14px] font-semibold ${getScoreTone(result.score)}`}
                            >
                              {result.score}%
                            </span>
                          </td>
                          <td className="border-b border-[#E2EAF4] px-4 py-4 text-[15px] font-medium text-[#475569] sm:px-5">
                            {result.date}
                          </td>
                          <td className="border-b border-[#E2EAF4] px-4 py-4 sm:px-5">
                            <span className="inline-flex rounded-full bg-[#EAF9EE] px-2.5 py-1 text-[14px] font-semibold text-[#1B9C57]">
                              {result.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
