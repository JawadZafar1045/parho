"use client";

import Link from "next/link";
import { useState } from "react";
import type { Course } from "../types";
import { ChartIcon, FileIcon, PencilIcon } from "./Icons";
import { StudentHeader } from "./StudentHeader";
import { StudentSidebar } from "./StudentSidebar";

type ManagementItem = {
  title: string;
  description: string;
  label: string;
  icon: typeof FileIcon;
  href: (courseId: string) => string;
};

const managementItems: ManagementItem[] = [
  {
    title: "Quiz",
    description: "Practice questions and test your preparation.",
    label: "Open Quizzes",
    icon: PencilIcon,
    href: (courseId: string) => `/student/quizzes?course=${courseId}`,
  },
  {
    title: "Notes & PDFs",
    description: "Review structured notes and downloadable PDFs for this course.",
    label: "Open Notes & PDFs",
    icon: FileIcon,
    href: (courseId: string) => `/student/notes?course=${courseId}`,
  },
  {
    title: "Results",
    description: "Review your quiz scores and course performance.",
    label: "View Results",
    icon: ChartIcon,
    href: () => "/student/results",
  },
];

export function ManageCoursePage({ course }: { course: Course }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return <div className="min-h-screen bg-[#F7FAFE] text-[#0F172A]">
    <StudentSidebar open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    <div className="md:pl-[268px]"><StudentHeader onMenuOpen={() => setIsMenuOpen(true)} /><main className="px-5 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12 lg:px-12"><div className="mx-auto max-w-[1100px]">
      <div className="mb-8"><Link href="/student/courses" className="text-sm font-semibold text-[#2563EB] hover:text-[#1D59D8]">← My Courses</Link><div className="mt-5 flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-semibold text-[#64748B]">Course Management</p><h1 className="mt-1 text-[30px] font-extrabold tracking-[-0.035em] text-[#101B45] sm:text-[36px]">{course.name}</h1></div><div className="inline-flex items-center gap-2 rounded-full bg-[#E8F9EF] px-3 py-1.5 text-sm font-semibold text-[#159447]"><span className="h-2 w-2 rounded-full bg-[#13A34A]" />{course.status}</div></div></div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{managementItems.map(({ title, description, label, icon: Icon, href }) => {
        return <Link key={title} href={href(course.id)} className="group flex min-h-[230px] flex-col rounded-xl border border-[#DCE6F2] bg-white p-6 shadow-[0_8px_24px_rgba(46,93,145,0.04)] transition hover:-translate-y-1 hover:border-[#B9D6FF] hover:shadow-[0_12px_28px_rgba(46,93,145,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"><span className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#E8F1FF] text-[#2563EB]"><Icon className="h-7 w-7" /></span><h2 className="mt-6 text-xl font-bold text-[#121E46]">{title}</h2><p className="mt-2 flex-1 text-sm leading-6 text-[#64748B]">{description}</p><span className="mt-5 text-sm font-bold text-[#2563EB] group-hover:text-[#1D59D8]">{label} <span aria-hidden="true">→</span></span></Link>;
      })}</div>
    </div></main></div>
  </div>;
}