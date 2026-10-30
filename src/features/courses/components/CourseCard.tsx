import Link from "next/link";
import type { Course } from "../types";
import { FileIcon, PencilIcon } from "./Icons";

export function CourseCard({ course }: { course: Course }) {
  const notesHref = `/student/notes?course=${course.id}`;
  const quizHref = `/student/quizzes?course=${course.id}`;
  const manageHref = `/student/courses/${course.id}`;

  const currentPrice = course.price || 1500;
  const originalPrice = course.originalPrice || 3000;
  const discount =
    originalPrice > currentPrice
      ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
      : 0;

  return (
    <article className="group flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5">
      <div>
        {/* Card Header Top */}
        <div className="flex items-start justify-between gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-sm font-black text-white shadow-md shadow-blue-500/20">
            {course.imageLabel}
          </span>
          <div className="flex flex-col items-end gap-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              {course.status}
            </span>
            {course.discountLabel && (
              <span className="rounded-md bg-amber-400 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-950">
                🔥 {course.discountLabel}
              </span>
            )}
          </div>
        </div>

        {/* Title & Desc */}
        <div className="mt-4">
          <h2 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition">
            {course.name}
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
            {course.description || "Comprehensive exam package with syllabus notes, model papers, and topic quizzes."}
          </p>
        </div>

        {/* Pricing & Discount Display Box */}
        <div className="mt-4 flex items-baseline justify-between rounded-2xl bg-slate-100 p-3.5 border border-slate-200">
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Complete Package Fee
            </span>
            <div className="mt-0.5 flex items-baseline gap-2">
              <span className="text-xl font-black text-slate-900">
                Rs. {currentPrice.toLocaleString()}
              </span>
              {originalPrice > currentPrice && (
                <span className="text-xs font-bold text-slate-400 line-through">
                  Rs. {originalPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {discount > 0 && (
            <span className="rounded-md bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white">
              Save {discount}%
            </span>
          )}
        </div>

        {/* Course Features / Badges */}
        <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-semibold text-slate-600">
          <span className="rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1">
            📖 Verified Notes
          </span>
          <span className="rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1">
            ⏱ Timed Tests
          </span>
          <span className="rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1">
            💡 Explanations
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 space-y-2 border-t border-slate-100 pt-4">
        <div className="grid grid-cols-2 gap-2">
          <Link
            href={notesHref}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50/60 py-2.5 text-xs font-bold text-blue-700 transition hover:bg-blue-100"
          >
            <FileIcon className="h-4 w-4" />
            Study Notes
          </Link>

          <Link
            href={quizHref}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-[#2563EB] py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#1D4ED8]"
          >
            <PencilIcon className="h-4 w-4" />
            Take Quiz
          </Link>
        </div>

        <Link
          href={manageHref}
          className="block text-center text-[11px] font-bold text-slate-400 hover:text-slate-600 pt-1"
        >
          View Course Syllabus Details →
        </Link>
      </div>
    </article>
  );
}
