"use client";

import Link from "next/link";
import { useState } from "react";
import { StudentHeader } from "./StudentHeader";
import { StudentSidebar } from "./StudentSidebar";
import { formatPkr } from "../currency";
import type { PublishedCourse } from "../server-data";

export function CourseCatalogPage({ courses }: { courses: PublishedCourse[] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F2F7FD] text-[#0F172A]">
      <StudentSidebar open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <div className="md:pl-[268px]">
        <StudentHeader onMenuOpen={() => setIsMenuOpen(true)} />
        <main className="px-4 py-7 sm:px-7 sm:py-8 md:px-9 lg:px-10">
          <div className="mx-auto max-w-[1180px]">
            <Link
              href="/student/courses"
              className="inline-flex min-h-9 items-center gap-2 rounded-lg px-2 text-sm font-semibold text-[#445675] hover:bg-white hover:text-[#1478F2]"
            >
              <span aria-hidden="true">←</span>
              My Courses
            </Link>
            <h1 className="mt-4 text-[29px] font-extrabold tracking-[-0.035em] text-[#12234A] sm:text-[34px]">
              Available Courses
            </h1>
            <p className="mt-1 text-sm text-[#74839D] sm:text-[15px]">
              Published courses available for your enrollment.
            </p>

            <div className="mt-6 divide-y divide-[#E5EDF7] overflow-hidden rounded-xl border border-[#DDE8F5] bg-white shadow-[0_5px_16px_rgba(46,93,145,0.035)]">
              {courses.length ? (
                courses.map((course) => (
                  <article
                    key={course.id}
                    className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:px-6"
                  >
                    <span
                      className="flex h-[62px] w-[62px] shrink-0 flex-col items-center justify-center rounded-xl bg-[#E9F8F0] text-[#159A51]"
                      aria-hidden="true"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#18A85D] px-1 text-[11px] font-extrabold">
                        {course.id.toUpperCase()}
                      </span>
                      <span className="mt-0.5 text-[6px] font-extrabold tracking-[0.16em]">
                        PREPARATION
                      </span>
                    </span>
                    <div className="min-w-0 flex-1">
                      <h2 className="font-bold text-[#17284B]">{course.name}</h2>
                      <p className="mt-1 text-sm leading-5 text-[#71809A]">{course.description}</p>
                    </div>
                    <p className="shrink-0 text-sm font-semibold text-[#526480]">
                      Course fee: {formatPkr(course.feePaisa)}
                    </p>
                    <Link
                      href={`/student/course-catalog/${course.id}`}
                      prefetch={false}
                      className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#1478F2] px-5 text-sm font-bold text-white hover:bg-[#0868DD] sm:w-40"
                    >
                      View Course
                    </Link>
                  </article>
                ))
              ) : (
                <p className="px-5 py-6 text-sm text-[#71809A]">
                  There are no published courses available for your account.
                </p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
