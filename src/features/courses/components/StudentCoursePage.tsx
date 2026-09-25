"use client";

import { useState } from "react";
import { enrolledCourses } from "../constants";
import { CourseCard } from "./CourseCard";
import { StudentHeader } from "./StudentHeader";
import { StudentSidebar } from "./StudentSidebar";

export function StudentCoursePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return <div className="min-h-screen bg-[#F7FAFE] text-[#0F172A]">
    <StudentSidebar open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    <div className="md:pl-[268px]"><StudentHeader onMenuOpen={() => setIsMenuOpen(true)} /><main className="px-5 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12 lg:px-12"><div className="mx-auto max-w-[1100px]"><div className="mb-7 sm:mb-8"><h1 className="text-[30px] font-extrabold tracking-[-0.035em] text-[#101B45] sm:text-[34px]">My Course</h1><p className="mt-1 text-[15px] font-medium text-[#64748B] sm:text-base">Here are the courses you have enrolled in.</p></div><div className="grid gap-5 md:grid-cols-2">{enrolledCourses.map((course) => <CourseCard key={course.id} course={course} />)}</div></div></main></div>
  </div>;
}
