"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GridIcon, HeadphonesIcon, UserIcon, XIcon } from "./Icons";
import { CourseIcon } from "./CourseIcon";

type StudentSidebarProps = { open: boolean; onClose: () => void };

const primaryItems = [
  { label: "Dashboard", href: "/student/dashboard", icon: GridIcon },
  { label: "My Course", href: "/student/courses", icon: CourseIcon, active: true },
];

const secondaryItems = [
  { label: "Profile", href: "/student/profile", icon: UserIcon },
  { label: "Help & Support", href: "/student/support", icon: HeadphonesIcon },
];

function NavItems({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col" aria-label="Student navigation">
      <div className="space-y-1.5">
        {primaryItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return <Link key={item.label} href={item.href} onClick={onNavigate} className={`flex min-h-11 items-center gap-3 rounded-xl px-4 text-[15px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${active ? "bg-[#E1EEFF] text-[#2563EB]" : "text-[#51627F] hover:bg-[#F1F6FD] hover:text-[#2563EB]"}`} aria-current={active ? "page" : undefined}><Icon className="h-5 w-5 shrink-0" /><span>{item.label}</span></Link>;
        })}
      </div>
      <div className="my-6 border-t border-[#E6EDF6]" />
      <div className="space-y-1.5">
        {secondaryItems.map((item) => { const Icon = item.icon; const active = pathname === item.href; return <Link key={item.label} href={item.href} onClick={onNavigate} className={`flex min-h-11 items-center gap-3 rounded-xl px-4 text-[15px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${active ? "bg-[#E1EEFF] text-[#2563EB]" : "text-[#51627F] hover:bg-[#F1F6FD] hover:text-[#2563EB]"}`} aria-current={active ? "page" : undefined}><Icon className="h-5 w-5 shrink-0" /><span>{item.label}</span></Link>; })}
      </div>
    </nav>
  );
}

export function StudentSidebar({ open, onClose }: StudentSidebarProps) {
  return <>
    <div className={`fixed inset-0 z-40 bg-slate-950/25 transition-opacity md:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`} onClick={onClose} aria-hidden="true" />
    <aside className={`fixed inset-y-0 left-0 z-50 flex w-[268px] flex-col border-r border-[#E2EAF4] bg-white px-4 py-7 transition-transform duration-300 md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`} aria-label="Student sidebar">
      <div className="mb-10 flex items-start justify-between px-3">
        <Link href="/student/courses" className="flex items-center gap-3" onClick={onClose} aria-label="Parho My Course">
          <span className="flex h-[68px] w-[68px] items-center justify-center rounded-xl bg-[#1269D8] p-2 shadow-sm"><Image src="/images/parho-logo.svg" alt="Parho logo" width={58} height={64} className="h-full w-full object-contain" priority /></span>
        </Link>
        <button type="button" className="mt-1 rounded-lg p-2 text-[#51627F] hover:bg-[#F1F6FD] md:hidden" onClick={onClose} aria-label="Close menu"><XIcon /></button>
      </div>
      <NavItems onNavigate={onClose} />
    </aside>
  </>;
}
