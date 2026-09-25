"use client";

import Link from "next/link";
import { useState } from "react";
import { enrolledCourses } from "@/features/courses/constants";
import { StudentHeader } from "@/features/courses/components/StudentHeader";
import { StudentSidebar } from "@/features/courses/components/StudentSidebar";
import { DownloadIcon } from "./NotesIcons";
import { getSubject } from "../data";

type SubjectNotesPageProps = { courseId: string; subjectId: string };

export function SubjectNotesPage({ courseId, subjectId }: SubjectNotesPageProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const course = enrolledCourses.find((item) => item.id === courseId);
  const subject = getSubject(courseId, subjectId);
  if (!course || !subject)
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7FAFE] p-6">
        <div className="rounded-xl border border-[#DCE6F2] bg-white p-8 text-center">
          <h1 className="text-xl font-bold text-[#121E46]">Notes not found</h1>
          <Link href="/student/notes" className="mt-4 inline-block font-semibold text-[#2563EB]">
            Back to Notes &amp; PDFs
          </Link>
        </div>
      </main>
    );

  return (
    <div className="min-h-screen bg-[#F7FAFE] text-[#0F172A]">
      <StudentSidebar open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <div className="md:pl-[268px]">
        <StudentHeader onMenuOpen={() => setIsMenuOpen(true)} />
        <main className="px-5 py-7 sm:px-8 sm:py-9 md:px-10 md:py-10 lg:px-12">
          <div className="mx-auto max-w-[900px]">
            <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-[#71829F]">
              <Link href="/student/notes" className="hover:text-[#2563EB]">
                Notes &amp; PDFs
              </Link>
              <span aria-hidden="true">›</span>
              <span className="text-[#18264A]">{course.name}</span>
              <span aria-hidden="true">›</span>
              <span className="text-[#18264A]">{subject.name}</span>
            </div>
            <div className="mt-5">
              <h1 className="text-[30px] font-extrabold tracking-[-0.035em] text-[#101B45]">
                {subject.name}
              </h1>
              <p className="mt-1 text-[15px] font-medium text-[#64748B]">
                {course.name} · {subject.pdfs.length} study PDFs
              </p>
            </div>
            <section className="mt-7 rounded-xl border border-[#DCE6F2] bg-white p-4 shadow-[0_8px_24px_rgba(46,93,145,0.04)] sm:p-6">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#121E46]">Notes &amp; PDFs</h2>
                <Link
                  href="/student/notes"
                  className="text-sm font-bold text-[#2563EB] hover:underline"
                >
                  Change course
                </Link>
              </div>
              <div>
                {subject.pdfs.map((pdf) => {
                  const url = `/api/notes/${courseId}/${subjectId}/${pdf.id}`;
                  return (
                    <div
                      key={pdf.id}
                      className="flex flex-col gap-3 border-b border-[#E8EEF6] py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E8F1FF] text-xs font-extrabold text-[#147BE7]">
                          PDF
                        </span>
                        <div className="min-w-0">
                          <p className="break-words text-sm font-bold text-[#1A2A50]">
                            {pdf.title}
                          </p>
                          <p className="mt-1 text-xs font-medium text-[#7A8AA4]">
                            PDF · {pdf.size}
                          </p>
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-2 pl-[52px] sm:pl-0">
                        <a
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[#BED7F7] px-4 text-sm font-bold text-[#1678E6] hover:bg-[#F0F6FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        >
                          Read
                        </a>
                        <a
                          href={url}
                          download={pdf.title}
                          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#287BF0] px-4 text-sm font-bold text-white hover:bg-[#1769D9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        >
                          <DownloadIcon className="h-4 w-4" />
                          Download
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
