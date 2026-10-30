"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
}

const navItems = [
  {
    label: "Courses & Discounts",
    href: "/admin/courses",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    badge: "Core",
  },
  {
    label: "Teaching Materials",
    href: "/admin/material",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    badge: "PDFs",
  },
  {
    label: "Quizzes & CSV Importer",
    href: "/admin/quizzes",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    badge: "CSV",
  },
  {
    label: "Fee Verifications",
    href: "/admin/payments",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    badge: "Billing",
  },
];

export function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((res) => {
        if (res.data?.user) {
          setAdminUser(res.data.user);
        }
      })
      .catch(() => {});
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  const content = (
    <div className="flex h-full flex-col justify-between bg-slate-900 text-white">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">
          <Link href="/admin/courses" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-black text-white shadow-lg shadow-blue-500/30">
              P
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-white">PARHO</span>
                <span className="rounded-md bg-amber-400 px-1.5 py-0.5 text-[10px] font-black uppercase text-slate-950">
                  Admin
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-400">Control Console</p>
            </div>
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white md:hidden"
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        {/* Navigation Section */}
        <div className="px-4 py-6">
          <p className="px-3 text-[11px] font-black uppercase tracking-wider text-slate-400">
            Platform Management
          </p>
          <nav className="mt-3 space-y-1.5">
            {navItems.map((item) => {
              const active =
                pathname === item.href ||
                (item.href === "/admin/courses" && pathname.startsWith("/admin/courses/")) ||
                (item.href === "/admin/material" && pathname.startsWith("/admin/material")) ||
                (item.href === "/admin/quizzes" && pathname.startsWith("/admin/quizzes"));

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all ${
                    active
                      ? "bg-blue-600 text-white shadow-md font-bold"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={active ? "text-white" : "text-slate-400"}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase ${
                        active
                          ? "bg-blue-800 text-white"
                          : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <p className="mt-8 px-3 text-[11px] font-black uppercase tracking-wider text-slate-400">
            Portals &amp; Views
          </p>
          <div className="mt-3 space-y-1.5">
            <Link
              href="/student/dashboard"
              target="_blank"
              className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-300 transition-all hover:bg-slate-800 hover:text-white"
            >
              <div className="flex items-center gap-3">
                <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <span>Student View</span>
              </div>
              <span className="rounded-md bg-emerald-500 px-1.5 py-0.5 text-[10px] font-black text-slate-950">
                Live
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Admin User Card Footer */}
      <div className="border-t border-slate-800 p-4">
        <div className="rounded-2xl bg-slate-800 p-3.5 border border-slate-700">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400 font-black text-slate-950 text-sm shadow-sm">
              AD
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-white">
                {adminUser?.name || "Admin"}
              </p>
              <p className="truncate text-[11px] text-slate-400">
                {adminUser?.email || "jawad@gmail.com"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-700 py-2 text-xs font-bold text-slate-200 transition hover:bg-red-600 hover:text-white"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-[268px] z-30 md:block shadow-2xl">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-slate-950/80 transition-opacity"
            onClick={onClose}
          />
          <div className="fixed inset-y-0 left-0 w-[280px] shadow-2xl">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
