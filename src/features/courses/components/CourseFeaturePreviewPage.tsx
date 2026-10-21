"use client";

import Link from "next/link";
import { useState } from "react";
import { ChartIcon, FileIcon, PencilIcon } from "./Icons";
import { StudentHeader } from "./StudentHeader";
import { StudentSidebar } from "./StudentSidebar";

const features = [
  {
    title: "Notes & PDFs",
    description: "Browse organized subject notes and course materials.",
    icon: FileIcon,
    href: "/student/courses/preview/notes",
    available: true,
  },
  {
    title: "Quizzes",
    description: "Practice with course quizzes and check your understanding.",
    icon: PencilIcon,
    href: undefined,
    available: false,
  },
  {
    title: "Results",
    description: "Review quiz scores and track your learning progress.",
    icon: ChartIcon,
    href: undefined,
    available: false,
  },
];

export function CourseFeaturePreviewPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F2F7FD] text-[#0F172A]">
      <StudentSidebar open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <div className="md:pl-[268px]">
        <StudentHeader onMenuOpen={() => setIsMenuOpen(true)} />
        <main className="px-4 py-7 sm:px-7 sm:py-8 md:px-9 lg:px-10">
          <div className="mx-auto max-w-[1100px]">
            <Link
              href="/student/courses"
              className="inline-flex min-h-9 items-center gap-2 rounded-lg px-2 text-sm font-semibold text-[#445675] transition hover:bg-white hover:text-[#1478F2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <span aria-hidden="true">←</span>
              My Courses
            </Link>
            <header className="mt-5">
              <p className="text-sm font-semibold text-[#64748B]">PPSC Preparation</p>
              <h1 className="mt-1 text-[29px] font-extrabold tracking-[-0.035em] text-[#12234A] sm:text-[34px]">
                Course Preview
              </h1>
              <p className="mt-2 text-sm leading-6 text-[#71809A]">
                Preview the planned course features. These sections are not available yet.
              </p>
            </header>

            <div className="mt-6 divide-y divide-[#E5EDF7] overflow-hidden rounded-xl border border-[#DCE6F2] bg-white">
              {features.map(({ title, description, icon: Icon, href, available }) => {
                const content = (
                  <>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E8F1FF] text-[#2563EB]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold text-[#121E46] sm:text-base">
                        {title}
                      </span>
                      <span className="mt-0.5 block text-xs leading-5 text-[#64748B] sm:text-sm">
                        {description}
                      </span>
                    </span>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold sm:text-xs ${
                        available ? "bg-[#E8F9EF] text-[#159447]" : "bg-[#EEF1F5] text-[#65738A]"
                      }`}
                    >
                      {available ? "Demo available" : "Coming soon"}
                    </span>
                    {available && (
                      <span
                        className="shrink-0 text-sm font-bold text-[#1478F2]"
                        aria-hidden="true"
                      >
                        →
                      </span>
                    )}
                  </>
                );

                return href ? (
                  <Link
                    key={title}
                    href={href}
                    className="flex min-h-[72px] items-center gap-3 px-3 py-3 transition hover:bg-[#F8FBFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 sm:gap-4 sm:px-5"
                  >
                    {content}
                  </Link>
                ) : (
                  <div
                    key={title}
                    className="flex min-h-[72px] items-center gap-3 px-3 py-3 sm:gap-4 sm:px-5"
                  >
                    {content}
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
