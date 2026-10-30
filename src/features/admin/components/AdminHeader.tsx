"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface AdminHeaderProps {
  onMenuOpen: () => void;
}

export function AdminHeader({ onMenuOpen }: AdminHeaderProps) {
  const pathname = usePathname();

  function getSectionTitle() {
    if (pathname.startsWith("/admin/courses/")) return "Course Management & Curriculum";
    if (pathname.startsWith("/admin/courses")) return "Courses & Discount Rules";
    if (pathname.startsWith("/admin/material")) return "Teaching Materials & Notes";
    if (pathname.startsWith("/admin/quizzes")) return "Quiz Engine & CSV Ingestion";
    if (pathname.startsWith("/admin/payments")) return "Student Fee Verifications";
    return "Admin Console";
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuOpen}
          className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 md:hidden"
          aria-label="Open navigation menu"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Admin</span>
            <span className="text-xs text-slate-300">/</span>
            <span className="text-xs font-bold text-blue-600">{getSectionTitle()}</span>
          </div>
          <h1 className="text-base font-extrabold text-slate-900 hidden sm:block">
            {getSectionTitle()}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          href="/student/dashboard"
          target="_blank"
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
        >
          <span>👁 Student View</span>
        </Link>
      </div>
    </header>
  );
}
