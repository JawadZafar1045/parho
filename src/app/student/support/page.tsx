"use client";

import Link from "next/link";
import { useState } from "react";
import { StudentHeader } from "@/features/courses/components/StudentHeader";
import { StudentSidebar } from "@/features/courses/components/StudentSidebar";

const supportOptions = [
  {
    title: "Email Support",
    value: "support@parho.com",
    detail: "For admissions, courses, account help, and general support.",
  },
  {
    title: "Phone",
    value: "+92 300 1234567",
    detail: "Available Monday to Saturday, 9:00 AM to 6:00 PM.",
  },
  {
    title: "WhatsApp",
    value: "+92 300 1234567",
    detail: "Fast responses for quick course and payment questions.",
  },
];

const faqItems = [
  {
    id: "access-course",
    question: "How do I access my purchased course?",
    answer: (
      <>
        <p>
          After submitting your JazzCash transaction ID, an administrator must verify the payment.
          Course access stays locked while verification is pending.
        </p>
        <p>
          Check{" "}
          <Link className="font-semibold text-[#2D67DF] hover:underline" href="/student/courses">
            My Courses
          </Link>{" "}
          for the payment status. Once the enrollment is verified, the course appears under Active
          Courses and its notes and learning features become available.
        </p>
      </>
    ),
  },
  {
    id: "payment-verification",
    question: "Where can I contact Parho for payment verification?",
    answer: (
      <>
        <p>
          Contact the support team at{" "}
          <a
            className="font-semibold text-[#2D67DF] hover:underline"
            href="mailto:support@parho.com"
          >
            support@parho.com
          </a>{" "}
          or by phone/WhatsApp at{" "}
          <a className="font-semibold text-[#2D67DF] hover:underline" href="tel:+923001234567">
            +92 300 1234567
          </a>
          , Monday to Saturday, 9:00 AM to 6:00 PM.
        </p>
        <p>
          Include the course name and JazzCash transaction ID so the team can locate your request.
          Never send your password or other account credentials.
        </p>
      </>
    ),
  },
  {
    id: "reset-password",
    question: "How do I reset my account or password?",
    answer: (
      <>
        <p>
          Self-service password reset is not currently available in the portal. Contact{" "}
          <a
            className="font-semibold text-[#2D67DF] hover:underline"
            href="mailto:support@parho.com"
          >
            support@parho.com
          </a>{" "}
          for account assistance.
        </p>
        <p>For your safety, do not share your current password or send it by email or WhatsApp.</p>
      </>
    ),
  },
  {
    id: "technical-issues",
    question: "Who do I contact for technical issues?",
    answer: (
      <>
        <p>
          Email{" "}
          <a
            className="font-semibold text-[#2D67DF] hover:underline"
            href="mailto:support@parho.com"
          >
            support@parho.com
          </a>{" "}
          or WhatsApp{" "}
          <a className="font-semibold text-[#2D67DF] hover:underline" href="tel:+923001234567">
            +92 300 1234567
          </a>
          , Monday to Saturday, 9:00 AM to 6:00 PM.
        </p>
        <p>
          Describe what you were doing and include the page name and a screenshot of the issue. Do
          not include passwords, payment credentials, or other sensitive information.
        </p>
      </>
    ),
  },
];

export default function SupportPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F4F7FC] text-slate-900">
      <StudentSidebar open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <div className="md:pl-[268px]">
        <StudentHeader onMenuOpen={() => setIsMenuOpen(true)} />
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-8 lg:p-10">
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2D67DF]">
                Support Center
              </p>
              <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Help & Support
              </h1>
            </div>
            <Link
              href="/student/dashboard"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-[#2D67DF]"
            >
              Back to dashboard
            </Link>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
            <section className="space-y-5">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-bold text-slate-500">Need help with your account?</p>
                <h2 className="mt-2 text-2xl font-black text-slate-950">We are here for you.</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Reach out to Parho for course access, payment confirmation, account support, and
                  any learning-related questions. Our team responds as quickly as possible to keep
                  your preparation on track.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {supportOptions.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#2D67DF]">
                      {item.title}
                    </p>
                    <p className="mt-3 text-base font-extrabold text-slate-950">{item.value}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.detail}</p>
                  </div>
                ))}
              </div>
            </section>

            <aside className="rounded-2xl border border-blue-100 bg-[#F3F7FF] p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2D67DF]">
                Quick info
              </p>
              <div className="mt-5 space-y-4 text-sm text-slate-700">
                <div>
                  <p className="font-bold text-slate-900">Email</p>
                  <a
                    href="mailto:support@parho.com"
                    className="mt-1 block text-[#2D67DF] hover:underline"
                  >
                    support@parho.com
                  </a>
                </div>
                <div>
                  <p className="font-bold text-slate-900">Phone</p>
                  <a href="tel:+923001234567" className="mt-1 block text-[#2D67DF] hover:underline">
                    +92 300 1234567
                  </a>
                </div>
                <div>
                  <p className="font-bold text-slate-900">Office Hours</p>
                  <p className="mt-1">Mon - Sat • 9:00 AM to 6:00 PM</p>
                </div>
                <div>
                  <p className="font-bold text-slate-900">Location</p>
                  <p className="mt-1">Parho Support Desk, Lahore, Pakistan</p>
                </div>
              </div>
            </aside>
          </div>

          <section className="mt-10">
            <h2 className="text-2xl font-black text-slate-950">Frequently asked questions</h2>
            <div className="mt-5 divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
              {faqItems.map((item) => (
                <details key={item.id} className="group">
                  <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-[#2D67DF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 [&::-webkit-details-marker]:hidden">
                    <span>{item.question}</span>
                    <span
                      className="shrink-0 text-base font-bold text-[#2D67DF] transition-transform group-open:rotate-90"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </summary>
                  <div className="space-y-3 border-t border-slate-200 bg-white px-4 py-4 text-sm leading-7 text-slate-600">
                    {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>
          </div>
        </main>
      </div>
    </div>
  );
}
