"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { dashboardCourses, quizResults } from "../dashboardData";
import { StudentHeader } from "./StudentHeader";
import { StudentSidebar } from "./StudentSidebar";
import { FileIcon, PencilIcon } from "./Icons";

export function StudentDashboardPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<{ fullName: string; email: string; status: string; role: string; test?: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.data?.user) {
          setUser(data.data.user);
        }
      })
      .catch(() => {});
  }, []);

  const studentName = user?.fullName || "Student";
  const firstName = studentName.split(" ")[0] || "Student";

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      <StudentSidebar open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      
      <div className="md:pl-[268px]">
        <StudentHeader onMenuOpen={() => setIsMenuOpen(true)} />

        <main className="px-4 py-6 sm:px-6 md:px-8 lg:px-10 xl:px-12">
          <div className="mx-auto max-w-[1220px] space-y-8">
            
            {/* Status Gate: If pending verification */}
            {user?.status === "pending_verification" && (
              <div className="relative overflow-hidden rounded-2xl border border-amber-300 bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-white p-5 shadow-sm">
                <div className="flex items-start gap-3.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-xl text-white shadow-md shadow-amber-200">
                    ⏳
                  </span>
                  <div>
                    <h2 className="text-base font-extrabold text-amber-950">
                      Payment Verification In Progress
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-amber-900 leading-relaxed font-medium">
                      Your JazzCash transaction is currently being verified by our administration team. 
                      You can already read preview notes and practice model papers while full access is unlocked.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Premium Hero Welcome Banner */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F2864] via-[#1A44A5] to-[#2563EB] p-6 text-white shadow-xl shadow-blue-900/10 sm:p-8 md:p-10">
              {/* Background ambient pattern */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-white/10 blur-3xl"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-16 left-1/3 h-64 w-64 rounded-full bg-blue-400/20 blur-2xl"
              />

              <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 rounded-md bg-blue-900 border border-blue-700 px-3 py-1 text-xs font-bold text-white">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Target: Punjab &amp; Federal Exams 2026</span>
                  </div>

                  <h1 className="mt-4 text-2xl font-black tracking-tight sm:text-3xl md:text-4xl text-white">
                    Welcome back, {firstName}! 👋
                  </h1>
                  <p className="mt-2 text-sm sm:text-base font-medium text-blue-100 leading-relaxed">
                    Consistency is the secret to competitive exam success. Today is a great day to master a topic and practice 10 MCQs.
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <Link
                      href="/student/notes"
                      className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-xs sm:text-sm font-extrabold text-[#0F2864] shadow-md transition hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                      <FileIcon className="h-4 w-4 text-[#2563EB]" />
                      Continue Reading Notes
                    </Link>

                    <Link
                      href="/student/quizzes"
                      className="inline-flex items-center gap-2 rounded-xl border border-blue-400 bg-blue-800 px-5 py-3 text-xs sm:text-sm font-bold text-white transition hover:bg-blue-700"
                    >
                      <PencilIcon className="h-4 w-4" />
                      Take Daily Mock Test
                    </Link>
                  </div>
                </div>

                {/* Right Hero Badge: Daily Motivation */}
                <div className="flex shrink-0 flex-col items-center justify-center rounded-2xl border border-blue-700 bg-blue-900 p-5 text-center md:w-56">
                  <span className="text-3xl">🔥</span>
                  <span className="mt-2 text-xs font-bold uppercase tracking-widest text-blue-200">
                    Study Streak
                  </span>
                  <span className="text-2xl font-black text-white">3 Days Active</span>
                  <span className="mt-1 text-[11px] text-blue-200">Keep it up to rank higher!</span>
                </div>
              </div>
            </section>

            {/* Key Metrics Row */}
            <section aria-label="Student progress metrics" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Enrolled Courses
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 font-bold text-sm">
                    📚
                  </span>
                </div>
                <p className="mt-3 text-2xl font-black text-slate-900">3 Courses</p>
                <p className="mt-1 text-xs font-medium text-emerald-600 flex items-center gap-1">
                  <span>✓</span> Full Package Access
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Study Material
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 font-bold text-sm">
                    📖
                  </span>
                </div>
                <p className="mt-3 text-2xl font-black text-slate-900">31+ PDF Notes</p>
                <p className="mt-1 text-xs font-medium text-slate-500">
                  Comprehensive topic coverage
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Practice Tests
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 font-bold text-sm">
                    🎯
                  </span>
                </div>
                <p className="mt-3 text-2xl font-black text-slate-900">19 Tests Ready</p>
                <p className="mt-1 text-xs font-medium text-blue-600">
                  Timed exam simulations
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Average Score
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 font-bold text-sm">
                    ⭐
                  </span>
                </div>
                <p className="mt-3 text-2xl font-black text-slate-900">76% Accuracy</p>
                <p className="mt-1 text-xs font-medium text-emerald-600 flex items-center gap-1">
                  <span>↑</span> Above qualifying threshold
                </p>
              </div>
            </section>

            {/* Enrolled Courses Section */}
            <section aria-labelledby="courses-heading">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 id="courses-heading" className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                    Your Preparation Packages
                  </h2>
                  <p className="text-xs sm:text-sm font-medium text-slate-500">
                    Access high-yield study notes, topic summaries, and practice quizzes.
                  </p>
                </div>
                <Link
                  href="/student/courses"
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"
                >
                  View All Packages →
                </Link>
              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {dashboardCourses.map((course) => (
                  <article
                    key={course.id}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5"
                  >
                    <div>
                      {/* Course Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span
                            className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xs font-black shadow-inner ${course.logoTone}`}
                          >
                            {course.imageLabel}
                          </span>
                          <div>
                            <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition">
                              {course.name}
                            </h3>
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              Active Enrollment
                            </span>
                          </div>
                        </div>

                        {course.badge && (
                          <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-blue-700">
                            {course.badge}
                          </span>
                        )}
                      </div>

                      {/* Course Description */}
                      <p className="mt-4 text-xs sm:text-sm leading-relaxed text-slate-600">
                        {course.description}
                      </p>

                      {/* Specs Tags */}
                      <div className="mt-5 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 text-center">
                        <div className="rounded-xl bg-slate-50 p-2">
                          <span className="block text-xs font-black text-slate-900">{course.subjectCount}</span>
                          <span className="text-[10px] font-semibold text-slate-400">Subjects</span>
                        </div>
                        <div className="rounded-xl bg-slate-50 p-2">
                          <span className="block text-xs font-black text-slate-900">{course.pdfCount}</span>
                          <span className="text-[10px] font-semibold text-slate-400">PDFs</span>
                        </div>
                        <div className="rounded-xl bg-slate-50 p-2">
                          <span className="block text-xs font-black text-slate-900">{course.quizCount}</span>
                          <span className="text-[10px] font-semibold text-slate-400">Quizzes</span>
                        </div>
                      </div>

                      {/* Pricing and Discount */}
                      <div className="mt-3 flex items-baseline justify-between rounded-xl bg-slate-50 px-3 py-2 border border-slate-100">
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm font-black text-slate-900">
                            Rs. {(course.price || 1500).toLocaleString()}
                          </span>
                          {course.originalPrice && course.originalPrice > (course.price || 1500) && (
                            <span className="text-[11px] font-bold text-slate-400 line-through">
                              Rs. {course.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        {course.discountLabel && (
                          <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-black text-amber-800">
                            🔥 {course.discountLabel}
                          </span>
                        )}
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                          <span>Syllabus Coverage</span>
                          <span className="text-blue-600">{course.progressPercent}%</span>
                        </div>
                        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500"
                            style={{ width: `${course.progressPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action CTAs */}
                    <div className="mt-6 grid grid-cols-2 gap-2.5 pt-2">
                      <Link
                        href={course.notesRoute ?? "/student/notes"}
                        className="flex items-center justify-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50/50 py-2.5 text-xs font-bold text-blue-700 transition hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                      >
                        <FileIcon className="h-4 w-4" />
                        Notes &amp; PDFs
                      </Link>

                      <Link
                        href={course.quizRoute ?? "/student/quizzes"}
                        className="flex items-center justify-center gap-1.5 rounded-xl bg-[#2563EB] py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#1D4ED8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                      >
                        <PencilIcon className="h-4 w-4" />
                        Start Test
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Performance Center & High-Yield Tip Grid */}
            <div className="grid gap-6 lg:grid-cols-12">
              {/* Recent Quiz Performance Cards (8 cols) */}
              <section aria-labelledby="results-heading" className="lg:col-span-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 id="results-heading" className="text-lg font-black text-slate-900">
                      Recent Quiz Activity &amp; Review
                    </h2>
                    <p className="text-xs font-medium text-slate-500">
                      Review question explanations to strengthen your exam performance.
                    </p>
                  </div>
                  <Link
                    href="/student/quizzes"
                    className="text-xs font-bold text-blue-600 hover:text-blue-700"
                  >
                    View All Quizzes →
                  </Link>
                </div>

                <div className="space-y-3">
                  {quizResults.map((result) => (
                    <div
                      key={result.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 transition hover:bg-slate-50 hover:border-slate-200"
                    >
                      <div className="flex items-center gap-3.5">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-200 text-sm font-black text-blue-600 shadow-sm">
                          {result.course}
                        </span>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">
                            {result.quizName}
                          </h3>
                          <span className="text-[11px] font-medium text-slate-400">
                            Attempted: {result.date}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <div className="text-right">
                          <span
                            className={`inline-block rounded-lg px-2.5 py-1 text-xs font-black ${
                              (result.percentage || 0) >= 70
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            Score: {result.score} / {result.totalMarks || 10} ({result.percentage || 0}%)
                          </span>
                        </div>

                        <Link
                          href={`/student/quizzes/${result.quizId || "ppsc-gk-mock-1"}`}
                          className="rounded-xl bg-white border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
                        >
                          Retake ↻
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* High Yield Exam Strategy Card (4 cols) */}
              <aside className="lg:col-span-4 flex flex-col justify-between rounded-3xl border border-indigo-100 bg-gradient-to-b from-indigo-50/50 via-white to-blue-50/30 p-6 shadow-sm">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-xl bg-indigo-100/70 px-3 py-1 text-xs font-extrabold text-indigo-800">
                    <span aria-hidden="true">💡</span>
                    <span>High-Yield Strategy Tip</span>
                  </div>

                  <h3 className="mt-4 text-base font-black text-slate-900">
                    PPSC &amp; FPSC Past Paper Formula
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600">
                    Analysis shows that roughly <strong>20% to 25% of MCQs</strong> in competitive tests are direct repetitions or variations from previous papers.
                  </p>

                  <div className="mt-4 rounded-2xl border border-indigo-200/60 bg-white p-3.5 shadow-sm text-xs text-slate-700">
                    <span className="font-bold text-indigo-900">Recommended Routine:</span>
                    <ul className="mt-1.5 space-y-1 list-disc list-inside text-slate-600">
                      <li>Read 1 subject PDF every morning</li>
                      <li>Solve 1 timed mock quiz in the evening</li>
                      <li>Read the explanation box for every mistake</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 border-t border-indigo-100 pt-4">
                  <Link
                    href="/student/notes"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-center text-xs font-bold text-white shadow-sm transition hover:bg-indigo-700"
                  >
                    <span>Browse All Study Notes</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </aside>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
