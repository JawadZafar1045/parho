"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BellIcon, ChevronDownIcon, MenuIcon } from "./Icons";

type StudentHeaderProps = { onMenuOpen: () => void };

export function StudentHeader({ onMenuOpen }: StudentHeaderProps) {
  const router = useRouter();
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return <header className="flex h-[82px] items-center justify-between border-b border-[#E2EAF4] bg-white px-5 sm:px-8 md:px-10 lg:px-12">
    <button type="button" onClick={onMenuOpen} className="rounded-lg p-2 text-[#405576] hover:bg-[#F1F6FD] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 md:hidden" aria-label="Open menu"><MenuIcon /></button>
    <div className="flex items-center gap-4 sm:gap-6">
      <button type="button" className="relative rounded-lg p-2 text-[#60718F] hover:bg-[#F1F6FD] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" aria-label="Notifications"><BellIcon /><span className="absolute right-2 top-1.5 h-1.5 w-1.5 rounded-full bg-[#2563EB]" /></button>
      <div className="relative flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1677E8] text-sm font-bold text-white">AS</div>
        <div className="hidden sm:block"><p className="text-sm font-bold leading-5 text-[#18264A]">Abdul Saboor</p><p className="text-xs font-medium text-[#70809B]">Student</p></div>
        <button type="button" onClick={() => setIsAccountOpen((open) => !open)} className="rounded-lg p-1 text-[#536684] hover:bg-[#F1F6FD] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" aria-label="Open account menu" aria-expanded={isAccountOpen}><ChevronDownIcon /></button>
        {isAccountOpen && <div className="absolute right-0 top-12 z-20 w-44 rounded-xl border border-[#DCE6F2] bg-white p-2 shadow-[0_12px_30px_rgba(46,93,145,0.14)]"><Link href="/student/profile" className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-[#51627F] hover:bg-[#F1F6FD]">Profile</Link><Link href="/student/settings" className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-[#51627F] hover:bg-[#F1F6FD]">Settings</Link><button type="button" onClick={handleLogout} className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-[#D04B59] hover:bg-[#FFF1F2]">Logout</button></div>}
      </div>
    </div>
  </header>;
}
