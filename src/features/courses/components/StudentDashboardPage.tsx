"use client";

import Link from "next/link";
import { useState } from "react";
import { dashboardCourses, quizResults } from "../dashboardData";
import { StudentHeader } from "./StudentHeader";
import { StudentSidebar } from "./StudentSidebar";

function MetricIcon({ kind }: { kind: "courses" | "attempts" | "score" }) {
  if (kind === "courses") {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
        <path
          d="M3.5 5.5c3.2-.9 6.1-.4 8.5 1.3v13c-2.4-1.7-5.3-2.2-8.5-1.3v-13Zm17 0c-3.2-.9-6.1-.4-8.5 1.3v13c2.4-1.7 5.3-2.2 8.5-1.3v-13Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (kind === "attempts") {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
        <path
          d="M6 3.75h8l4 4v12.5H6V3.75Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M14 3.75v4h4M9 12h6m-6 3h4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <circle cx="17.5" cy="17.5" r="3" fill="white" stroke="currentColor" strokeWidth="1.5" />
        <path d="m16.2 17.5.9.9 1.7-1.9" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
      <rect x="3" y="11" width="4.5" height="10" rx="1.5" />
      <rect x="9.75" y="6.5" width="4.5" height="14.5" rx="1.5" />
      <rect x="16.5" y="3" width="4.5" height="18" rx="1.5" />
    </svg>
  );
}

export function StudentDashboardPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const enrolledCourseCount = dashboardCourses.filter(
    (course) => course.status === "Active",
  ).length;
  const averageScore = quizResults.length
    ? Math.round(
        quizResults.reduce((total, result) => total + result.score, 0) / quizResults.length,
      )
    : null;
  const metrics: Array<{
    label: string;
    value: string;
    icon: "courses" | "attempts" | "score";
  }> = [
    { label: "Enrolled Courses", value: String(enrolledCourseCount), icon: "courses" },
    { label: "Quiz Attempts", value: String(quizResults.length), icon: "attempts" },
    {
      label: "Average Score",
      value: averageScore === null ? "—" : `${averageScore}%`,
      icon: "score",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7FAFE] text-[#0F172A]">
      <StudentSidebar open={isMenuOpen} onClose={() => setIsMenuOpen(false)} dashboardStyle />
      <div className="md:pl-[208px]">
        <StudentHeader onMenuOpen={() => setIsMenuOpen(true)} compact />

        <main className="px-4 py-5 sm:px-6 md:px-7 lg:px-8 xl:px-8">
          <div className="mx-auto max-w-[1180px]">
            <section className="mb-4">
              <p className="text-[15px] font-medium text-[#61728D]">Welcome back,</p>
              <h1 className="mt-1 text-[30px] font-extrabold tracking-[-0.04em] text-[#1671E8] sm:text-[34px]">
                Abdul Saboor
              </h1>
              <p className="mt-1 text-[14px] font-medium text-[#64748B]">
                Keep preparing. Small steps make big results!
              </p>
            </section>

            <section
              aria-label="Student learning summary"
              className="mb-4 grid gap-3 sm:grid-cols-3"
            >
              {metrics.map((metric) => (
                <article
                  key={metric.label}
                  className="flex min-h-[82px] items-center gap-4 rounded-lg border border-[#DCE6F2] bg-white px-4 py-3"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EAF3FF] text-[#1671E8]">
                    <MetricIcon kind={metric.icon} />
                  </span>
                  <div>
                    <p className="text-xs font-medium text-[#637692]">{metric.label}</p>
                    <p className="mt-0.5 text-[24px] font-extrabold leading-7 text-[#15284C]">
                      {metric.value}
                    </p>
                  </div>
                </article>
              ))}
            </section>

            <section className="mb-5">
              <div className="mb-3 flex items-center justify-between gap-4">
                <h2 className="text-[21px] font-bold tracking-[-0.03em] text-[#10264D] sm:text-[23px]">
                  My Courses
                </h2>
                <Link
                  href="/student/courses"
                  prefetch={false}
                  className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#1671E8] transition-colors hover:text-[#1F51C9]"
                >
                  View all courses
                  <span aria-hidden="true">→</span>
                </Link>
              </div>

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {dashboardCourses.map((course) => (
                  <article
                    key={course.id}
                    className="flex flex-col rounded-lg border border-[#DCE6F2] bg-white p-3.5 sm:p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#1671E8] bg-white px-1 text-[12px] font-extrabold text-[#1454B8]"
                        aria-label={`${course.name} course mark`}
                      >
                        {course.imageLabel}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-[15px] font-extrabold tracking-[-0.02em] text-[#13284D]">
                          {course.name}
                        </h3>
                        <div className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-[#EAF1FC] px-2 py-0.5 text-[11px] font-semibold text-[#173C78]">
                          <span
                            className="h-1.5 w-1.5 rounded-full bg-[#1671E8]"
                            aria-hidden="true"
                          />
                          {course.status}
                        </div>
                      </div>
                    </div>

                    <p className="mt-3 min-h-[36px] text-[12px] leading-5 text-[#64748B]">
                      {course.description}
                    </p>
                    <div
                      className="mt-2 flex items-center gap-2"
                      role="group"
                      aria-label="Course progress tracking is not available"
                    >
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#E4EBF4]">
                        <div className="h-full w-0 rounded-full bg-[#1671E8]" />
                      </div>
                      <span className="shrink-0 text-[11px] font-semibold text-[#536684]">
                        Not tracked
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section>
              <div className="mb-3 flex items-center justify-between gap-4">
                <h2 className="text-[21px] font-bold tracking-[-0.03em] text-[#10264D] sm:text-[23px]">
                  Recent Quiz Results
                </h2>
                <Link
                  href="/student/results"
                  prefetch={false}
                  className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#1671E8] transition-colors hover:text-[#1F51C9]"
                >
                  View all results
                  <span aria-hidden="true">→</span>
                </Link>
              </div>

              <div className="overflow-hidden rounded-xl border border-[#DCE6F2] bg-white">
                <div className="overflow-x-auto">
                  <table className="min-w-full border-separate border-spacing-0 text-left">
                    <thead>
                      <tr>
                        {["Course", "Quiz Name", "Score", "Date", "Status"].map((header) => (
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
                            <span className="inline-flex rounded-full bg-[#EAF1FC] px-2.5 py-1 text-[14px] font-semibold text-[#173C78]">
                              {result.score}%
                            </span>
                          </td>
                          <td className="border-b border-[#E2EAF4] px-4 py-4 text-[15px] font-medium text-[#475569] sm:px-5">
                            {result.date}
                          </td>
                          <td className="border-b border-[#E2EAF4] px-4 py-4 sm:px-5">
                            <span className="inline-flex rounded-full bg-[#EAF1FC] px-2.5 py-1 text-[14px] font-semibold text-[#173C78]">
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
