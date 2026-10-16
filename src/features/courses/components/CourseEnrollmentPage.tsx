"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { StudentHeader } from "./StudentHeader";
import { StudentSidebar } from "./StudentSidebar";
import { formatPkr } from "../currency";
import type { PublishedCourse } from "../server-data";

export function CourseEnrollmentPage({
  course,
  hasPendingRequest,
}: {
  course: PublishedCourse;
  hasPendingRequest: boolean;
}) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/student/payment-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course.id, transactionId }),
      });
      const payload = (await response.json()) as { success?: boolean; message?: string };
      if (!response.ok || !payload.success) {
        setMessage(payload.message ?? "Unable to submit the payment request.");
        return;
      }
      setMessage(
        "Payment request submitted. Course access stays locked until an administrator verifies the JazzCash transaction.",
      );
      setTransactionId("");
      router.refresh();
    } catch {
      setMessage("Could not reach the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F2F7FD] text-[#0F172A]">
      <StudentSidebar open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <div className="md:pl-[268px]">
        <StudentHeader onMenuOpen={() => setIsMenuOpen(true)} />
        <main className="px-4 py-7 sm:px-7 sm:py-8 md:px-9 lg:px-10">
          <div className="mx-auto max-w-[900px]">
            <Link
              href="/student/course-catalog"
              className="inline-flex min-h-9 items-center gap-2 rounded-lg px-2 text-sm font-semibold text-[#445675] hover:bg-white hover:text-[#1478F2]"
            >
              <span aria-hidden="true">←</span>
              Available Courses
            </Link>
            <section className="mt-5 rounded-2xl border border-[#DDE8F5] bg-white p-5 shadow-[0_5px_16px_rgba(46,93,145,0.035)] sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-[28px] font-extrabold tracking-[-0.035em] text-[#12234A]">
                    {course.name}
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-[#71809A]">
                    {course.description}
                  </p>
                </div>
                <p className="rounded-lg bg-[#F0F6FF] px-4 py-3 text-sm font-bold text-[#1B5EC5]">
                  Course fee: {formatPkr(course.feePaisa)}
                </p>
              </div>

              <div className="mt-6 rounded-xl border border-[#E5EDF7] bg-[#F8FAFD] p-4">
                <h2 className="font-bold text-[#17284B]">JazzCash payment instructions</h2>
                <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-[#64748B]">
                  <li>
                    Pay exactly {formatPkr(course.feePaisa)} using JazzCash to 0328 7267519 or 0307
                    8557982.
                  </li>
                  <li>Keep the JazzCash transaction ID and receipt.</li>
                  <li>
                    Submit the transaction ID below. An administrator must verify it before course
                    access is activated.
                  </li>
                </ol>
              </div>

              {hasPendingRequest ? (
                <p className="mt-6 rounded-lg bg-[#FFF4D9] p-4 text-sm font-medium leading-6 text-[#946100]">
                  A payment request for this course is already awaiting verification. It will remain
                  locked until an administrator reviews it.
                </p>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-3">
                  <label
                    htmlFor="transaction-id"
                    className="block text-sm font-semibold text-[#334563]"
                  >
                    JazzCash transaction ID
                  </label>
                  <input
                    id="transaction-id"
                    value={transactionId}
                    onChange={(event) => setTransactionId(event.target.value)}
                    minLength={4}
                    maxLength={100}
                    required
                    className="min-h-11 w-full rounded-lg border border-[#D6E1EE] px-3 text-sm text-[#17284B] outline-none focus:border-[#1478F2] focus:ring-2 focus:ring-blue-100"
                  />
                  <p className="text-xs text-[#71809A]">
                    The amount is taken from the course price stored by the server.
                  </p>
                  {message && (
                    <p role="status" className="text-sm leading-6 text-[#526480]">
                      {message}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#1478F2] px-5 text-sm font-bold text-white hover:bg-[#0868DD] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? "Submitting…" : "Submit for Verification"}
                  </button>
                </form>
              )}
              {message && hasPendingRequest && (
                <p role="status" className="mt-4 text-sm">
                  {message}
                </p>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
