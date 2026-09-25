import Link from "next/link";
import type { Course } from "../types";
import { SettingsIcon } from "./Icons";

export function CourseCard({ course }: { course: Course }) {
  const manageHref = `/student/courses/${course.id}`;

  return <article className="flex min-w-0 flex-col gap-6 rounded-xl border border-[#DCE6F2] bg-white p-5 shadow-[0_8px_24px_rgba(46,93,145,0.04)] sm:p-6">
    <div className="flex h-[120px] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#EBFAF3] sm:h-[132px]" aria-label={`${course.name} logo placeholder`}>
      <div className="text-center text-[#159447]"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#22A45B] text-[17px] font-extrabold tracking-tight">{course.imageLabel}</div><p className="mt-2 text-[9px] font-bold uppercase tracking-[0.16em]">Preparation</p></div>
    </div>
    <div className="min-w-0 flex-1"><h2 className="text-xl font-bold tracking-[-0.02em] text-[#121E46] sm:text-[23px]">{course.name}</h2><div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#E8F9EF] px-3 py-1.5 text-sm font-semibold text-[#159447]"><span className="h-2 w-2 rounded-full bg-[#13A34A]" />{course.status}</div></div>
    <div className="flex w-full min-w-0"><Link href={manageHref} className="inline-flex min-h-[60px] w-full min-w-0 items-center justify-center gap-3 rounded-xl bg-[#287BF0] px-5 text-sm font-bold text-white shadow-[0_7px_14px_rgba(37,99,235,0.18)] transition hover:bg-[#1769D9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"><SettingsIcon className="h-6 w-6 shrink-0" />Manage</Link></div>
  </article>;
}
