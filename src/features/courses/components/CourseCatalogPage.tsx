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
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 px-3 py-3 sm:flex sm:gap-4 sm:px-6 sm:py-4"
                  >
                    <div className="min-w-0 sm:flex-1">
                      <h2 className="text-sm font-bold text-[#17284B] sm:text-base">
                        {course.name}
                      </h2>
                      <p className="mt-0.5 line-clamp-2 text-xs leading-4 text-[#71809A] sm:mt-1 sm:text-sm sm:leading-5">
                        {course.description}
                      </p>
                    </div>
                    <p className="col-start-1 row-start-2 text-[10px] font-semibold text-[#526480] sm:col-auto sm:row-auto sm:text-sm">
                      Fee: {formatPkr(course.feePaisa)}
                    </p>
                    <Link
                      href={`/student/course-catalog/${course.id}`}
                      prefetch={false}
                      className="row-span-2 inline-flex min-h-9 items-center justify-center whitespace-nowrap rounded-lg bg-[#1478F2] px-3 text-xs font-bold text-white hover:bg-[#0868DD] sm:min-h-11 sm:px-5 sm:text-sm sm:w-40"
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
