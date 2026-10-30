"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Subject } from "../types";

type SecurePdfReaderProps = {
  courseId: string;
  courseName: string;
  subject: Subject;
  pdfId: string;
  pdfTitle: string;
  userEmail: string;
  userPhone: string;
  userName: string;
};

export function SecurePdfReader({
  courseId,
  courseName,
  subject,
  pdfId,
  pdfTitle,
  userEmail,
  userPhone,
  userName,
}: SecurePdfReaderProps) {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [nightMode, setNightMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const streamUrl = `/api/notes/${courseId}/${subject.id}/${pdfId}`;

  // Watermark text for anti-piracy
  const watermarkText = `PARHO · ${userName} · ${userPhone} · ${userEmail}`;

  useEffect(() => {
    // Disable right-click context menu on viewer
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // Intercept print shortcuts (Ctrl+P, Cmd+P)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "p" || e.key === "s")) {
        e.preventDefault();
        alert("Saving or printing course study notes is restricted to protect intellectual property.");
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  }

  return (
    <div className={`flex min-h-screen flex-col ${nightMode ? "bg-[#0b101b] text-slate-100" : "bg-[#0f172a] text-white"}`}>
      {/* Top Header / Control Bar */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Link
            href={`/student/notes/${courseId}/${subject.id}`}
            className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-slate-700 hover:text-white"
          >
            <span aria-hidden="true">←</span>
            <span>Back to {subject.name}</span>
          </Link>
          <div className="hidden border-l border-slate-700 pl-3 md:block">
            <h1 className="truncate text-sm font-bold text-slate-100 sm:text-base">
              {pdfTitle}
            </h1>
            <p className="text-[11px] font-medium text-slate-400">
              {courseName} · {subject.name}
            </p>
          </div>
        </div>

        {/* Reader Controls */}
        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <div className="flex items-center rounded-lg border border-slate-700 bg-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(z - 15, 60))}
              className="px-2.5 py-1.5 font-bold hover:bg-slate-700 text-slate-200"
              title="Zoom Out"
            >
              -
            </button>
            <span className="px-2 font-mono text-[11px] text-slate-300">{zoomLevel}%</span>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(z + 15, 180))}
              className="px-2.5 py-1.5 font-bold hover:bg-slate-700 text-slate-200"
              title="Zoom In"
            >
              +
            </button>
          </div>

          {/* Night Mode Toggle */}
          <button
            type="button"
            onClick={() => setNightMode(!nightMode)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
              nightMode
                ? "border-amber-500/40 bg-amber-500/20 text-amber-300"
                : "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {nightMode ? "🌙 Night" : "☀️ Day"}
          </button>

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="hidden rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 sm:inline-block"
          >
            {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          </button>

          {/* Security Badge */}
          <span className="hidden items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-400 lg:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Protected Reader
          </span>
        </div>
      </header>

      {/* Main Reader View with Anti-Piracy Watermark Overlay */}
      <main className="relative flex-1 overflow-auto p-2 sm:p-6 flex justify-center items-start">
        <div
          className="relative w-full max-w-5xl rounded-xl overflow-hidden shadow-2xl bg-white border border-slate-700"
          style={{
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: "top center",
            transition: "transform 0.15s ease",
            filter: nightMode ? "invert(0.88) hue-rotate(180deg)" : "none",
          }}
        >
          {/* Transparent Floating Anti-Piracy Watermark Grid */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20 flex flex-wrap items-center justify-around gap-20 p-8 select-none opacity-15 overflow-hidden"
          >
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className="transform -rotate-24 whitespace-nowrap text-base sm:text-lg font-black tracking-widest text-slate-900"
              >
                {watermarkText}
              </div>
            ))}
          </div>

          {/* PDF Viewer Frame */}
          <iframe
            src={`${streamUrl}#toolbar=0&navpanes=0`}
            title={pdfTitle}
            className="h-[82vh] w-full border-0 bg-white"
          />
        </div>
      </main>

      {/* Mobile Title Bar */}
      <footer className="border-t border-slate-800 bg-slate-900 px-4 py-2 text-center text-[11px] text-slate-400 md:hidden">
        Licensed to: {userName} ({userEmail})
      </footer>
    </div>
  );
}
