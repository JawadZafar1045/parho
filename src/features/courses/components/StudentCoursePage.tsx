"use client";

import Link from "next/link";
import { useState } from "react";
import { StudentHeader } from "./StudentHeader";
import { StudentSidebar } from "./StudentSidebar";
import { SettingsIcon } from "./Icons";
import { formatPkr } from "../currency";

export type StudentCourseItem = {
  id: string;
  name: string;
  description: string;
  feePaisa: number;
};

export type StudentPaymentRequest = StudentCourseItem & {
  transactionId: string;
  amountPaisa: number;
  submittedAt: string;
};

type StudentCoursePageProps = {
  activeCourses: StudentCourseItem[];
  pendingRequests: StudentPaymentRequest[];
  inactiveCourses: StudentCourseItem[];
};

function SectionHeading({
  id,
  tone,
  title,
  description,
  count,
}: {
  id: string;
  tone: "green" | "amber" | "gray";
  title: string;
  description: string;
  count?: number;
}) {
  const dotTone = {
    green: "bg-[#17A963]",
    amber: "bg-[#E7A000]",
    gray: "bg-[#718096]",
  }[tone];

  return (
    <div className="mb-3">
      <h2
        id={id}
        className="flex items-center gap-3 text-[19px] font-bold tracking-[-0.02em] text-[#13254A] sm:text-[21px]"
      >
        <span className={`h-3 w-3 shrink-0 rounded-full ${dotTone}`} aria-hidden="true" />
        {title}
        {count !== undefined && <span>({count})</span>}
      </h2>
      <p className="ml-6 mt-1 text-sm leading-5 text-[#72819B]">{description}</p>
    </div>
  );
}

function CourseMark({ course }: { course: StudentCourseItem }) {
  return (
    <span
      role="img"
      className="flex h-[62px] w-[62px] shrink-0 flex-col items-center justify-center rounded-xl bg-[#E9F8F0] text-[#159A51]"
      aria-label={`${course.name} icon`}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#18A85D] px-1 text-[11px] font-extrabold">
        {course.id.toUpperCase()}
      </span>
      <span className="mt-0.5 text-[6px] font-extrabold tracking-[0.16em]">PREPARATION</span>
    </span>
  );
}

function ActiveCourseRow({ course }: { course: StudentCourseItem }) {
  return (
    <article className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:px-6">
      <CourseMark course={course} />
      <div className="min-w-0 flex-1">
        <h3 className="font-bold text-[#17284B]">{course.name}</h3>
        <p className="mt-1 text-sm leading-5 text-[#71809A]">{course.description}</p>
      </div>
      <span className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-[#E7F8EF] px-3 py-1.5 text-xs font-bold text-[#159A51]">
        <span className="h-2 w-2 rounded-full bg-[#17A963]" aria-hidden="true" />
        Active
      </span>
      <Link
        href={`/student/courses/${course.id}`}
        prefetch={false}
        className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#1478F2] px-4 text-sm font-bold text-white shadow-[0_5px_12px_rgba(20,120,242,0.18)] transition hover:bg-[#0868DD] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:w-[180px]"
      >
        <SettingsIcon className="h-5 w-5" />
        Manage Course
      </Link>
    </article>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M2.5 12s3.3-6 9.5-6 9.5 6 9.5 6-3.3 6-9.5 6-9.5-6-9.5-6Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="2.7" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M3.5 5.5c3.1-.9 6.2-.4 8.5 1.3v13c-2.3-1.7-5.4-2.2-8.5-1.3v-13ZM20.5 5.5c-3.1-.9-6.2-.4-8.5 1.3v13c2.3-1.7 5.4-2.2 8.5-1.3v-13Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PendingRequestRow({
  request,
  onViewRequest,
}: {
  request: StudentPaymentRequest;
  onViewRequest: () => void;
}) {
  const maskedTransactionId =
    request.transactionId.length > 4 ? `•••• ${request.transactionId.slice(-4)}` : "••••";

  return (
    <article className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:px-6">
      <CourseMark course={request} />
      <div className="min-w-0 flex-1">
        <h3 className="font-bold text-[#17284B]">{request.name}</h3>
        <p className="mt-1 text-sm leading-5 text-[#71809A]">{request.description}</p>
      </div>
      <div className="flex shrink-0 flex-col items-start gap-1.5 sm:w-[245px]">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#FFF4D9] px-3 py-1.5 text-xs font-bold text-[#B87500]">
          <span className="h-2 w-2 rounded-full bg-[#E7A000]" aria-hidden="true" />
          Pending Verification
        </span>
        <p className="text-xs leading-5 text-[#71809A]">
          Transaction ID: {maskedTransactionId}
          <span className="px-1.5" aria-hidden="true">
            |
          </span>
          Amount: {formatPkr(request.amountPaisa)}
        </p>
      </div>
      <button
        type="button"
        onClick={onViewRequest}
        className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg border border-[#1478F2] px-4 text-sm font-bold text-[#1478F2] transition hover:bg-[#EFF6FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:w-[170px]"
      >
        <EyeIcon />
        View Request
      </button>
    </article>
  );
}

export function StudentCoursePage({
  activeCourses,
  pendingRequests,
  inactiveCourses,
}: StudentCoursePageProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<StudentPaymentRequest | null>(null);

  return (
    <div className="min-h-screen bg-[#F2F7FD] text-[#0F172A]">
      <StudentSidebar open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <div className="md:pl-[268px]">
        <StudentHeader onMenuOpen={() => setIsMenuOpen(true)} />
        <main className="px-4 py-7 sm:px-7 sm:py-8 md:px-9 lg:px-10">
          <div className="mx-auto max-w-[1180px]">
            <header className="mb-7">
              <Link
                href="/student/dashboard"
                className="mb-4 inline-flex min-h-9 items-center gap-2 rounded-lg px-2 text-sm font-semibold text-[#445675] transition hover:bg-white hover:text-[#1478F2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <span aria-hidden="true">←</span>
                Back
              </Link>
              <h1 className="text-[29px] font-extrabold tracking-[-0.035em] text-[#12234A] sm:text-[34px]">
                My Courses
              </h1>
              <p className="mt-1 text-sm text-[#74839D] sm:text-[15px]">
                Track your course access and payment verification status.
              </p>
            </header>

            <div className="space-y-7">
              <section aria-labelledby="active-courses-heading">
                <SectionHeading
                  id="active-courses-heading"
                  tone="green"
                  title="Active Courses"
                  count={activeCourses.length}
                  description="These are the courses you can currently access."
                />
                <div className="divide-y divide-[#E5EDF7] overflow-hidden rounded-xl border border-[#DDE8F5] bg-white shadow-[0_5px_16px_rgba(46,93,145,0.035)]">
                  {activeCourses.length ? (
                    activeCourses.map((course) => (
                      <ActiveCourseRow key={course.id} course={course} />
                    ))
                  ) : (
                    <p className="px-5 py-5 text-sm leading-6 text-[#71809A]">
                      No verified course access is recorded yet. Course materials remain locked
                      until an administrator confirms payment.
                    </p>
                  )}
                </div>
              </section>

              <section aria-labelledby="pending-courses-heading">
                <SectionHeading
                  id="pending-courses-heading"
                  tone="amber"
                  title="Pending Payment Verification"
                  count={pendingRequests.length}
                  description={
                    pendingRequests.length
                      ? "Your payment has been submitted and is under verification."
                      : "Payments awaiting verification will appear here."
                  }
                />
                <div className="divide-y divide-[#E5EDF7] overflow-hidden rounded-xl border border-[#DDE8F5] bg-white shadow-[0_5px_16px_rgba(46,93,145,0.035)]">
                  {pendingRequests.length ? (
                    pendingRequests.map((request) => (
                      <PendingRequestRow
                        key={`${request.id}-${request.transactionId}`}
                        request={request}
                        onViewRequest={() => setSelectedRequest(request)}
                      />
                    ))
                  ) : (
                    <p className="px-5 py-5 text-sm leading-6 text-[#71809A]">
                      No pending payment request is recorded for this account.
                    </p>
                  )}
                </div>
              </section>

              <section aria-labelledby="inactive-courses-heading">
                <SectionHeading
                  id="inactive-courses-heading"
                  tone="gray"
                  title="Inactive Courses"
                  count={inactiveCourses.length}
                  description="These are other available courses you can enroll in."
                />
                <div className="divide-y divide-[#E5EDF7] overflow-hidden rounded-xl border border-[#DDE8F5] bg-white px-5 shadow-[0_5px_16px_rgba(46,93,145,0.035)]">
                  {inactiveCourses.length ? (
                    inactiveCourses.map((course) => (
                      <article
                        key={course.id}
                        className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center"
                      >
                        <CourseMark course={course} />
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-[#17284B]">{course.name}</h3>
                          <p className="mt-1 text-sm leading-5 text-[#71809A]">
                            {course.description}
                          </p>
                        </div>
                        <div className="flex shrink-0 flex-col items-start gap-1.5 sm:w-[190px]">
                          <span className="inline-flex items-center gap-2 rounded-full bg-[#EEF1F5] px-3 py-1.5 text-xs font-bold text-[#65738A]">
                            <span
                              className="h-2 w-2 rounded-full bg-[#77849A]"
                              aria-hidden="true"
                            />
                            Not Enrolled
                          </span>
                          <span className="text-xs text-[#71809A]">
                            Course fee: {formatPkr(course.feePaisa)}
                          </span>
                        </div>
                        <Link
                          href={`/student/course-catalog/${course.id}`}
                          prefetch={false}
                          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#1478F2] px-4 text-sm font-bold text-white shadow-[0_5px_12px_rgba(20,120,242,0.18)] transition hover:bg-[#0868DD] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:w-[160px]"
                        >
                          <BookIcon />
                          View Course
                        </Link>
                      </article>
                    ))
                  ) : (
                    <p className="py-5 text-sm leading-6 text-[#71809A]">
                      No published courses are currently available for enrollment.
                    </p>
                  )}
                </div>
                <div className="mt-4 flex justify-end">
                  <Link
                    href="/student/course-catalog"
                    prefetch={false}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#1478F2] px-5 text-sm font-bold text-white transition hover:bg-[#0868DD] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  >
                    View All Inactive Courses
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>

      {selectedRequest && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedRequest(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="request-dialog-title"
            className="w-full max-w-md rounded-2xl border border-[#DDE8F5] bg-white p-6 shadow-2xl"
          >
            <h2 id="request-dialog-title" className="text-xl font-extrabold text-[#13254A]">
              Payment Request
            </h2>
            <dl className="mt-5 space-y-4 text-sm">
              <div>
                <dt className="font-semibold text-[#74839D]">Course</dt>
                <dd className="mt-1 font-bold text-[#17284B]">{selectedRequest.name}</dd>
              </div>
              <div>
                <dt className="font-semibold text-[#74839D]">Transaction ID</dt>
                <dd className="mt-1 break-all font-bold text-[#17284B]">
                  {selectedRequest.transactionId}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-[#74839D]">Verification status</dt>
                <dd className="mt-1 font-bold text-[#B87500]">Pending Verification</dd>
              </div>
              <div>
                <dt className="font-semibold text-[#74839D]">Submitted amount</dt>
                <dd className="mt-1 text-[#17284B]">{formatPkr(selectedRequest.amountPaisa)}</dd>
              </div>
              <div>
                <dt className="font-semibold text-[#74839D]">Submitted</dt>
                <dd className="mt-1 text-[#17284B]">
                  {new Intl.DateTimeFormat("en-PK", { dateStyle: "medium" }).format(
                    new Date(selectedRequest.submittedAt),
                  )}
                </dd>
              </div>
            </dl>
            <button
              type="button"
              onClick={() => setSelectedRequest(null)}
              className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-[#1478F2] px-4 text-sm font-bold text-white hover:bg-[#0868DD] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              Close
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
