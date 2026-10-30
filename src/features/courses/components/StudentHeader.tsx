"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDownIcon, MenuIcon } from "./Icons";

type StudentHeaderProps = { onMenuOpen: () => void };

type CurrentUser = {
  fullName: string;
  email: string;
  role: string;
  status: string;
};

export function StudentHeader({ onMenuOpen }: StudentHeaderProps) {
  const router = useRouter();
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.data?.user) {
          setCurrentUser(data.data.user);
        }
      })
      .catch(() => {});
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  const displayName = currentUser?.fullName || "Student";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const roleLabel = currentUser?.role === "admin" ? "Administrator" : "Student";

  return (
    <header className="flex h-[82px] items-center justify-between border-b border-[#E2EAF4] bg-white px-5 sm:px-8 md:px-10 lg:px-12">
      <button
        type="button"
        onClick={onMenuOpen}
        className="rounded-lg p-2 text-[#405576] hover:bg-[#F1F6FD] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 md:hidden"
        aria-label="Open menu"
      >
        <MenuIcon />
      </button>

      <div className="flex items-center gap-4 sm:gap-6 ml-auto">
        <div className="relative flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1677E8] text-sm font-bold text-white shadow-sm">
            {initials}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-bold leading-5 text-[#18264A]">{displayName}</p>
            <p className="text-xs font-semibold capitalize text-[#70809B]">{roleLabel}</p>
          </div>
          <button
            type="button"
            onClick={() => setIsAccountOpen((open) => !open)}
            className="rounded-lg p-1 text-[#536684] hover:bg-[#F1F6FD] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Open account menu"
            aria-expanded={isAccountOpen}
          >
            <ChevronDownIcon />
          </button>

          {isAccountOpen && (
            <div className="absolute right-0 top-12 z-20 w-52 rounded-xl border border-[#DCE6F2] bg-white p-2 shadow-[0_12px_30px_rgba(46,93,145,0.14)]">
              <div className="px-3 py-2 border-b border-slate-100 sm:hidden">
                <p className="text-xs font-bold text-slate-900">{displayName}</p>
                <p className="text-[11px] text-slate-500">{currentUser?.email}</p>
              </div>

              {currentUser?.role === "admin" && (
                <Link
                  href="/admin/payments"
                  onClick={() => setIsAccountOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-xs font-bold text-blue-600 hover:bg-blue-50"
                >
                  ⚡ Admin Portal
                </Link>
              )}

              <Link
                href="/student/profile"
                prefetch={false}
                onClick={() => setIsAccountOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-[#51627F] hover:bg-[#F1F6FD]"
              >
                Profile Settings
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-[#D04B59] hover:bg-[#FFF1F2]"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
