"use client";

import Link from "next/link";
import { useState } from "react";
import { StudentHeader } from "./StudentHeader";
import { StudentSidebar } from "./StudentSidebar";
import { getCourseMaterial } from "@/features/notes/data";

const material = getCourseMaterial("ppsc");

export function CourseNotesPreviewPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const subjects = material?.subjects ?? [];
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id ?? "");
  const selectedSubject = subjects.find((subject) => subject.id === selectedSubjectId);

  return (
    <div className="min-h-screen bg-[#F2F7FD] text-[#0F172A]">
      <StudentSidebar open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <div className="md:pl-[268px]">
        <StudentHeader onMenuOpen={() => setIsMenuOpen(true)} />
        <main className="px-4 py-7 sm:px-7 sm:py-8 md:px-9 lg:px-10">
          <div className="mx-auto max-w-[1100px]">
            <Link
              href="/student/courses/preview"
              className="inline-flex min-h-9 items-center gap-2 rounded-lg px-2 text-sm font-semibold text-[#445675] transition hover:bg-white hover:text-[#1478F2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <span aria-hidden="true">←</span>
              Course Preview
            </Link>
            <header className="mt-5">
              <p className="text-sm font-semibold text-[#64748B]">PPSC Preparation</p>
              <h1 className="mt-1 text-[29px] font-extrabold tracking-[-0.035em] text-[#12234A] sm:text-[34px]">
                Notes &amp; PDFs Preview
              </h1>
              <p className="mt-2 text-sm leading-6 text-[#71809A]">
                Explore demo subjects and sample notes. Downloads and course access are not enabled
                in this preview.
              </p>
            </header>

            <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(240px,0.8fr)_minmax(0,1.5fr)]">
              <section
                aria-labelledby="preview-subjects-heading"
                className="overflow-hidden rounded-xl border border-[#DCE6F2] bg-white"
              >
                <h2
                  id="preview-subjects-heading"
                  className="border-b border-[#E5EDF7] px-4 py-3 text-sm font-bold text-[#17284B]"
                >
                  Subjects
                </h2>
                <ul className="divide-y divide-[#E5EDF7]">
                  {subjects.map((subject) => (
                    <li key={subject.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedSubjectId(subject.id)}
                        aria-current={selectedSubjectId === subject.id ? "true" : undefined}
                        className={`flex min-h-12 w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 ${
                          selectedSubjectId === subject.id
                            ? "bg-[#F0F6FF] font-bold text-[#155FC4]"
                            : "text-[#445675] hover:bg-[#F8FBFF]"
                        }`}
                      >
                        <span>{subject.name}</span>
                        <span className="shrink-0 text-xs text-[#71809A]">
                          {subject.pdfs.length} notes
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>

              <section
                aria-labelledby="preview-notes-heading"
                className="overflow-hidden rounded-xl border border-[#DCE6F2] bg-white"
              >
                <div className="border-b border-[#E5EDF7] px-4 py-3">
                  <h2 id="preview-notes-heading" className="text-sm font-bold text-[#17284B]">
                    {selectedSubject?.name ?? "Demo Notes"}
                  </h2>
                  <p className="mt-1 text-xs text-[#71809A]">Sample notes for preview only</p>
                </div>
                {selectedSubject ? (
                  <ul className="divide-y divide-[#E5EDF7]">
                    {selectedSubject.pdfs.map((note, index) => (
                      <li key={note.id} className="flex items-center gap-3 px-4 py-3 sm:px-5">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E8F1FF] text-[10px] font-extrabold text-[#2563EB]">
                          PDF
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block break-words text-sm font-semibold text-[#1A2A50]">
                            {note.title}
                          </span>
                          <span className="mt-1 block text-xs leading-5 text-[#71809A]">
                            Demo note {index + 1} · Sample study material · {note.size}
                          </span>
                        </span>
                        <span className="shrink-0 rounded-full bg-[#EEF1F5] px-2.5 py-1 text-[10px] font-bold text-[#65738A]">
                          Preview
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="px-4 py-5 text-sm text-[#71809A]">
                    Demo notes are not available yet.
                  </p>
                )}
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
