"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";

const navigationItems = [
  ["ABOUT", "about"],
  ["PROGRAMS", "programs"],
  ["CONTACT", "contact"],
] as const;

export default function HomePage() {
  const [contactOpen, setContactOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [newsletterSent, setNewsletterSent] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const targetId = window.location.hash.slice(1);
    if (!targetId) return;

    const target = document.getElementById(targetId);
    if (!target) return;

    window.requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  function handleSectionClick(event: React.MouseEvent<HTMLAnchorElement>) {
    const targetId = event.currentTarget.hash.slice(1);
    const target = document.getElementById(targetId);
    if (!target) return;

    event.preventDefault();
    setMobileMenuOpen(false);
    window.history.replaceState(null, "", `#${targetId}`);
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function openContact() {
    setSent(false);
    setMobileMenuOpen(false);
    setContactOpen(true);
  }

  function handleContactSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <main className="min-h-screen bg-[#F4F7FC] text-slate-900">
      <section className="mx-auto min-h-screen max-w-[1500px] px-4 pb-0 pt-4 sm:px-6 lg:px-12">
        <nav className="sticky top-3 z-50 mx-auto flex w-full max-w-[1180px] flex-wrap items-center justify-between rounded-full border border-slate-200 bg-white/95 px-4 py-2.5 shadow-[0_8px_24px_rgba(30,74,140,0.08)] backdrop-blur sm:top-5 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-[#2D67DF] p-1.5 shadow-md shadow-blue-200">
              <Image src="/images/parho-logo.svg" alt="Parho logo" width={40} height={40} className="h-full w-full object-contain" priority />
            </span>
            <span className="text-xl font-extrabold tracking-tight text-slate-950">Parho</span>
          </Link>

          <div className="hidden items-center gap-7 text-xs font-bold tracking-wide text-slate-600 md:flex">
            {navigationItems.map(([label, id]) => (
              <Link key={id} href={`#${id}`} prefetch={false} onClick={handleSectionClick} className="transition hover:text-[#2D67DF]">
                {label}
              </Link>
            ))}
            <span className="h-5 w-px bg-slate-200" />
            <Link href="/login" prefetch={false} className="transition hover:text-[#2D67DF]">LOGIN</Link>
            <Link href="/signup" prefetch={false} className="rounded-full bg-[#2D67DF] px-6 py-3 text-white shadow-lg shadow-blue-200 transition hover:bg-[#2358C7]">
              JOIN WITH US
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className="h-0.5 w-5 rounded-full bg-current" />
            <span className="h-0.5 w-5 rounded-full bg-current" />
            <span className="h-0.5 w-5 rounded-full bg-current" />
          </button>

          {mobileMenuOpen && (
            <div className="order-3 mt-3 basis-full rounded-2xl border border-slate-100 bg-white p-3 shadow-lg md:hidden">
              <div className="grid gap-1 text-xs font-bold tracking-wide text-slate-600">
                {navigationItems.map(([label, id]) => (
                  <Link key={id} href={`#${id}`} prefetch={false} onClick={handleSectionClick} className="rounded-lg px-3 py-3 transition hover:bg-blue-50 hover:text-[#2D67DF]">
                    {label}
                  </Link>
                ))}
                <Link href="/login" prefetch={false} onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-3 transition hover:bg-blue-50 hover:text-[#2D67DF]">
                  LOGIN
                </Link>
                <Link href="/signup" prefetch={false} onClick={() => setMobileMenuOpen(false)} className="rounded-lg bg-[#2D67DF] px-3 py-3 text-center text-white">
                  JOIN WITH US
                </Link>
              </div>
            </div>
          )}
        </nav>

        <div className="mx-auto grid max-w-[1180px] items-center gap-8 pt-14 sm:pt-16 md:min-h-[560px] md:grid-cols-[1.08fr_0.92fr] md:gap-0 md:pt-10">
          <div className="relative z-10 min-w-0 max-w-[680px] text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-[11px] font-extrabold uppercase tracking-wide text-[#2D67DF]">
              <span className="h-2 w-2 rounded-full bg-[#2D67DF]" />
              Focused preparation for competitive exams
            </div>

            <h1 className="mt-6 text-[clamp(2.4rem,9vw,4.4rem)] font-black leading-[0.98] tracking-[-0.045em] text-slate-950">
              Your preparation deserves a <span className="text-[#2D67DF]">better plan.</span>
            </h1>

            <h2 className="mt-5 text-base font-extrabold text-slate-900 sm:text-xl">
              Your focused space for competitive exam preparation
            </h2>

            <p className="mt-4 max-w-[620px] text-sm leading-7 text-slate-500 sm:text-base">
              Parho helps ambitious learners prepare with structured notes, practice quizzes and trusted study resources, all in one clear and consistent routine.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/signup" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#2D67DF] px-6 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-[#2358C7] sm:h-14 sm:px-8">
                Start Preparing <span className="text-lg">→</span>
              </Link>
              <Link href="/login" className="inline-flex h-12 items-center justify-center rounded-xl border-2 border-slate-200 bg-white px-6 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:text-[#2D67DF] sm:h-14 sm:px-8">
                Student Portal
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-2">
                <span className="h-8 w-8 rounded-full border-2 border-white bg-[#2D67DF]" />
                <span className="h-8 w-8 rounded-full border-2 border-white bg-[#83B8F4]" />
                <span className="h-8 w-8 rounded-full border-2 border-white bg-[#244E88]" />
              </div>
              <div>
                <p className="text-sm font-extrabold text-slate-900">Built for serious learners</p>
                <p className="mt-1 text-xs text-slate-500">Notes, practice and progress in one place.</p>
              </div>
            </div>
          </div>

          <div className="relative hidden h-[440px] min-w-0 md:block lg:h-[500px]">
            <Image src="/images/hero-study-desk.svg" alt="Study desk with books, laptop, notebook and study supplies" fill className="object-contain object-center" />
          </div>
        </div>

        <div className="mx-auto mt-14 grid max-w-[980px] gap-4 border-t border-slate-200 pt-8 text-center sm:grid-cols-3">
          <div>
            <p className="text-2xl font-black text-[#2D67DF]">PPSC</p>
            <p className="mt-1 text-xs text-slate-500">Focused preparation</p>
          </div>
          <div>
            <p className="text-2xl font-black text-[#2D67DF]">5+</p>
            <p className="mt-1 text-xs text-slate-500">Exam tracks supported</p>
          </div>
          <div>
            <p className="text-2xl font-black text-[#2D67DF]">24/7</p>
            <p className="mt-1 text-xs text-slate-500">Access to your study plan</p>
          </div>
        </div>

        <section id="about" className="mx-auto mt-20 max-w-[980px] scroll-mt-24 text-center">
          <p className="mx-auto inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[9px] font-extrabold uppercase tracking-[0.18em] text-[#2D67DF]">
            Learn. Practice. Improve.
          </p>
          <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Welcome to <span className="text-[#2D67DF]">Parho</span>
          </h2>
          <p className="mx-auto mt-4 max-w-[720px] text-xs leading-6 text-slate-500 sm:text-sm">
            Parho is a focused learning platform for students preparing for competitive tests. We make preparation more organized, measurable and accessible with purposeful study material and regular practice.
          </p>
          <p className="mx-auto mt-2 max-w-[720px] text-xs leading-6 text-slate-500 sm:text-sm">
            From your first topic to your final revision, Parho keeps your learning journey clear, practical and built around progress.
          </p>

          <div className="mt-10 grid gap-3 text-left sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(30,74,140,0.07)]">
              <p className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-[#2D67DF]">01</p>
              <h3 className="mt-4 text-sm font-extrabold text-slate-900">Structured Notes</h3>
              <p className="mt-2 text-[11px] leading-5 text-slate-500">Understand important concepts with concise, exam-focused notes.</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(30,74,140,0.07)]">
              <p className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-[#2D67DF]">02</p>
              <h3 className="mt-4 text-sm font-extrabold text-slate-900">Practice Quizzes</h3>
              <p className="mt-2 text-[11px] leading-5 text-slate-500">Test your preparation with questions that reveal where to improve.</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(30,74,140,0.07)]">
              <p className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-[#2D67DF]">03</p>
              <h3 className="mt-4 text-sm font-extrabold text-slate-900">Guided Progress</h3>
              <p className="mt-2 text-[11px] leading-5 text-slate-500">Build a steady routine and keep every revision session on track.</p>
            </div>
          </div>
        </section>

        <section id="programs" className="mx-auto mt-20 max-w-[980px] scroll-mt-24 text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#2D67DF]">Our programs</p>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Choose your preparation track.</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
            Focused resources and practice material for the exams students prepare for most.
          </p>

          <div className="mt-8 grid gap-3 text-left sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(30,74,140,0.07)]">
              <p className="text-xs font-extrabold text-[#2D67DF]">PPSC</p>
              <h3 className="mt-2 font-extrabold text-slate-900">Punjab Public Service Commission</h3>
              <p className="mt-2 text-xs leading-5 text-slate-500">Structured notes, quizzes, and revision support for PPSC tests.</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(30,74,140,0.07)]">
              <p className="text-xs font-extrabold text-[#2D67DF]">FPSC</p>
              <h3 className="mt-2 font-extrabold text-slate-900">Federal Public Service Commission</h3>
              <p className="mt-2 text-xs leading-5 text-slate-500">Build a consistent routine for federal competitive exams.</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(30,74,140,0.07)]">
              <p className="text-xs font-extrabold text-[#2D67DF]">CSS</p>
              <h3 className="mt-2 font-extrabold text-slate-900">Competitive Examination</h3>
              <p className="mt-2 text-xs leading-5 text-slate-500">Plan your preparation with focused practice and progress tracking.</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(30,74,140,0.07)]">
              <p className="text-xs font-extrabold text-[#2D67DF]">NTS</p>
              <h3 className="mt-2 font-extrabold text-slate-900">National Testing Service</h3>
              <p className="mt-2 text-xs leading-5 text-slate-500">Practice question sets and improve your test readiness.</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(30,74,140,0.07)]">
              <p className="text-xs font-extrabold text-[#2D67DF]">PMS</p>
              <h3 className="mt-2 font-extrabold text-slate-900">Provincial Management Service</h3>
              <p className="mt-2 text-xs leading-5 text-slate-500">Keep your provincial exam preparation clear and measurable.</p>
            </div>
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
              <p className="text-xs font-extrabold text-[#2D67DF]">More coming</p>
              <h3 className="mt-2 font-extrabold text-slate-900">Your next goal</h3>
              <p className="mt-2 text-xs leading-5 text-slate-500">New preparation tracks will be added as Parho grows.</p>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-20 max-w-[980px] text-left">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#2D67DF]">Choose your direction</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">Preparation tracks for your next goal.</h2>
            </div>
            <p className="max-w-xs text-xs leading-5 text-slate-500">Start with the subject that matters most and build a routine that works for you.</p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(30,74,140,0.07)]">
              <span className="rounded-md bg-blue-50 px-2 py-1 text-[10px] font-extrabold text-[#2D67DF]">01</span>
              <h3 className="mt-5 text-sm font-extrabold text-slate-900">Competitive Exams</h3>
              <p className="mt-2 text-[11px] leading-5 text-slate-500">Build your base with current affairs, general knowledge and core concepts.</p>
              <p className="mt-5 text-[9px] font-extrabold uppercase tracking-wide text-[#2D67DF]">12 modules →</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(30,74,140,0.07)]">
              <span className="rounded-md bg-blue-50 px-2 py-1 text-[10px] font-extrabold text-[#2D67DF]">02</span>
              <h3 className="mt-5 text-sm font-extrabold text-slate-900">Subject Revision</h3>
              <p className="mt-2 text-[11px] leading-5 text-slate-500">Revise difficult topics with notes and focused question sets.</p>
              <p className="mt-5 text-[9px] font-extrabold uppercase tracking-wide text-[#2D67DF]">20 topics →</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(30,74,140,0.07)]">
              <span className="rounded-md bg-blue-50 px-2 py-1 text-[10px] font-extrabold text-[#2D67DF]">03</span>
              <h3 className="mt-5 text-sm font-extrabold text-slate-900">Daily Practice</h3>
              <p className="mt-2 text-[11px] leading-5 text-slate-500">Turn small daily sessions into confidence for the final exam.</p>
              <p className="mt-5 text-[9px] font-extrabold uppercase tracking-wide text-[#2D67DF]">20 questions/day →</p>
            </div>
          </div>
        </section>

        <footer id="contact" className="mx-[-1rem] mt-20 scroll-mt-24 bg-white px-4 pb-8 pt-14 text-left sm:mx-[-2rem] sm:px-8 lg:mx-[-3rem] lg:px-12">
          <div className="grid min-w-0 gap-12 lg:grid-cols-[1.15fr_0.55fr_0.55fr_1.1fr]">
            <div className="min-w-0">
              <Link href="/" className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-[#2D67DF] p-2 shadow-md shadow-blue-200">
                  <Image src="/images/parho-logo.svg" alt="Parho logo" width={48} height={48} className="h-full w-full object-contain" />
                </span>
                <span className="text-2xl font-extrabold text-slate-950">Parho</span>
              </Link>
              <p className="mt-8 max-w-sm text-sm leading-7 text-slate-500">
                Parho is a focused preparation platform for students preparing for PPSC, FPSC, CSS, NTS, PMS, and other competitive exams.
              </p>
            </div>

            <div className="min-w-0">
              <h3 className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-950">Navigation</h3>
              <div className="mt-8 space-y-5 text-sm text-slate-600">
                <Link href="#about" className="block transition hover:text-[#2D67DF]">About</Link>
                <Link href="#programs" className="block transition hover:text-[#2D67DF]">Programs</Link>
                <button type="button" onClick={openContact} className="block transition hover:text-[#2D67DF]">Contact</button>
                <Link href="/login" className="block transition hover:text-[#2D67DF]">Login</Link>
                <Link href="/signup" className="block transition hover:text-[#2D67DF]">Sign Up</Link>
              </div>
            </div>

            <div className="min-w-0">
              <h3 className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-950">Parho</h3>
              <div className="mt-8 space-y-5 text-sm text-slate-600">
                <Link href="#about" className="block transition hover:text-[#2D67DF]">How It Works</Link>
                <Link href="/student/support" className="block transition hover:text-[#2D67DF]">Help & Support</Link>
                <Link href="/signup" className="block transition hover:text-[#2D67DF]">Create Account</Link>
              </div>
            </div>

            <div className="min-w-0">
              <h3 className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-950">Stay Updated</h3>
              <p className="mt-8 text-sm leading-7 text-slate-500">Get the latest preparation updates and study insights delivered to your inbox.</p>

              {newsletterSent ? (
                <p className="mt-6 rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-[#2D67DF]">
                  You are subscribed to Parho updates.
                </p>
              ) : (
                <form onSubmit={(event) => { event.preventDefault(); setNewsletterSent(true); }} className="mt-6 flex min-w-0 rounded-xl border border-slate-200 bg-slate-50 p-1.5 shadow-sm">
                  <input required type="email" aria-label="Email address" placeholder="Enter your email" className="min-w-0 flex-1 bg-transparent px-3 text-sm text-slate-900 outline-none" />
                  <button type="submit" className="shrink-0 rounded-lg bg-[#2D67DF] px-4 py-3 text-xs font-bold text-white transition hover:bg-[#2358C7]">
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="mt-14 flex flex-col gap-4 border-t border-slate-200 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Parho. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="transition hover:text-[#2D67DF]">Twitter</Link>
              <Link href="#" className="transition hover:text-[#2D67DF]">LinkedIn</Link>
              <Link href="#" className="transition hover:text-[#2D67DF]">Facebook</Link>
            </div>
          </div>
        </footer>
      </section>

      {contactOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="contact-title">
          <div className="max-h-[92vh] w-full max-w-[570px] overflow-y-auto rounded-[28px] bg-white shadow-2xl">
            <div className="flex items-start justify-between bg-[#2D67DF] px-6 py-6 text-white sm:px-8">
              <div>
                <h2 id="contact-title" className="text-2xl font-extrabold">Contact Parho</h2>
                <p className="mt-1 text-sm text-blue-100">Get in touch with our team for admissions and student support.</p>
              </div>
              <button type="button" onClick={() => setContactOpen(false)} aria-label="Close contact form" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-2xl leading-none transition hover:bg-white/25">
                ×
              </button>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-5 px-6 py-7 sm:px-8">
              {sent ? (
                <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-5 text-center text-sm font-semibold text-green-700">
                  Thank you. Your message has been received.
                </div>
              ) : (
                <>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                      Full Name
                      <input required name="name" placeholder="John Doe" className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-normal normal-case tracking-normal text-slate-900 outline-none focus:border-[#2D67DF] focus:ring-4 focus:ring-blue-100" />
                    </label>
                    <label className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                      Email Address
                      <input required type="email" name="email" placeholder="john@example.com" className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-normal normal-case tracking-normal text-slate-900 outline-none focus:border-[#2D67DF] focus:ring-4 focus:ring-blue-100" />
                    </label>
                    <label className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                      Phone Number
                      <input required type="tel" name="phone" placeholder="+92 300 1234567" className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-normal normal-case tracking-normal text-slate-900 outline-none focus:border-[#2D67DF] focus:ring-4 focus:ring-blue-100" />
                    </label>
                    <label className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                      Subject
                      <input required name="subject" placeholder="How can we help you?" className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-normal normal-case tracking-normal text-slate-900 outline-none focus:border-[#2D67DF] focus:ring-4 focus:ring-blue-100" />
                    </label>
                  </div>

                  <label className="block text-[11px] font-bold uppercase tracking-wide text-slate-500">
                    Message
                    <textarea required name="message" rows={5} placeholder="Write details of your query..." className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-normal normal-case tracking-normal text-slate-900 outline-none focus:border-[#2D67DF] focus:ring-4 focus:ring-blue-100" />
                  </label>

                  <button type="submit" className="flex h-13 w-full items-center justify-center gap-3 rounded-xl bg-[#2D67DF] px-5 py-4 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-[#2358C7]">
                    Send Message <span className="text-lg">➤</span>
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
