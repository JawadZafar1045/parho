"use client";

import Link from "next/link";
import { useState } from "react";
import { enrolledCourses } from "@/features/courses/constants";
import { StudentHeader } from "@/features/courses/components/StudentHeader";
import { StudentSidebar } from "@/features/courses/components/StudentSidebar";
import { ArrowRightIcon, FolderIcon } from "./NotesIcons";
import { getCourseMaterial } from "../data";

type NotesPageProps = { initialCourseId?: string };

export function NotesPage({ initialCourseId }: NotesPageProps) {
  const startingCourse = enrolledCourses.some((c) => c.id === initialCourseId)
    ? initialCourseId
    : enrolledCourses[0]?.id;

  const [selectedCourseId, setSelectedCourseId] = useState(startingCourse ?? "ppsc");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const selectedCourse =
    enrolledCourses.find((course) => course.id === selectedCourseId) ?? enrolledCourses[0];

  const material = selectedCourse ? getCourseMaterial(selectedCourse.id) : undefined;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      <StudentSidebar open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      
      <div className="md:pl-[268px]">
        <StudentHeader onMenuOpen={() => setIsMenuOpen(true)} />

        <main className="px-4 py-6 sm:px-6 md:px-8 lg:px-10 xl:px-12">
          <div className="mx-auto max-w-[1220px]">
            {/* Header / Breadcrumbs */}
            <div className="mb-6">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                <Link href="/student/dashboard" className="hover:text-blue-600">
                  Dashboard
                </Link>
                <span aria-hidden="true">›</span>
                <span className="text-slate-800">Study Notes &amp; PDFs</span>
              </div>
              <h1 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                Course Study Notes &amp; Revision Material
              </h1>
              <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500">
                Select your examination package to read verified high-yield notes and revision summaries.
              </p>
            </div>

            {/* Course Selector Tabs */}
            <section className="mb-8" aria-label="Course selection">
              <div className="flex flex-wrap gap-2.5">
                {enrolledCourses.map((course) => {
                  const isSelected = course.id === selectedCourse?.id;
                  return (
                    <button
                      key={course.id}
                      type="button"
                      onClick={() => setSelectedCourseId(course.id)}
                      className={`flex items-center gap-2.5 rounded-2xl border px-4 py-2.5 text-xs sm:text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                        isSelected
                          ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-200"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-lg text-[10px] font-black ${
                          isSelected ? "bg-white/20 text-white" : "bg-blue-50 text-blue-600"
                        }`}
                      >
                        {course.imageLabel}
                      </span>
                      <span>{course.name}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Subjects and Notes Grid */}
            {selectedCourse && material && (
              <section aria-labelledby="subjects-heading" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 id="subjects-heading" className="text-lg font-black text-slate-900">
                    Subjects in {selectedCourse.name}
                  </h2>
                  <span className="text-xs font-semibold text-slate-500">
                    {material.subjects.length} Subjects available
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {material.subjects.map((subject) => (
                    <Link
                      key={subject.id}
                      href={`/student/notes/${selectedCourse.id}/${subject.id}`}
                      className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-3">
                          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
                            <FolderIcon className="h-5 w-5" />
                          </span>
                          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-600">
                            {subject.pdfs.length} PDFs
                          </span>
                        </div>

                        <h3 className="mt-4 text-base font-bold text-slate-900 group-hover:text-blue-600 transition">
                          {subject.name}
                        </h3>
                        <p className="mt-1 text-xs text-slate-500">
                          Complete revision notes &amp; key concepts.
                        </p>
                      </div>

                      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-bold text-blue-600">
                        <span>Open Subject Notes</span>
                        <ArrowRightIcon className="h-4 w-4 transform transition group-hover:translate-x-1" />
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
