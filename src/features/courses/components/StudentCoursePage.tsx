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
  showDemoActiveCourse?: boolean;
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

function ActiveCourseRow({
  course,
  isDemo = false,
}: {
  course: StudentCourseItem;
  isDemo?: boolean;
}) {
  return (
    <article className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 px-3 py-3 sm:flex sm:gap-4 sm:px-6 sm:py-4">
      <div className="min-w-0 sm:flex-1">
        <h3 className="text-sm font-bold text-[#17284B] sm:text-base">{course.name}</h3>
        <p className="mt-0.5 text-xs leading-4 text-[#71809A] sm:mt-1 sm:text-sm sm:leading-5">
          {course.description}
        </p>
      </div>
      {isDemo ? (
        <div className="col-start-1 row-start-2 shrink-0 sm:col-auto sm:row-auto">
          <span className="inline-flex w-fit items-center rounded-full bg-[#EEF1F5] px-2.5 py-1 text-[11px] font-bold text-[#65738A] sm:px-3 sm:py-1.5 sm:text-xs">
            Demo preview
          </span>
        </div>
      ) : (
        <>
          <span className="col-start-1 row-start-2 inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full bg-[#E7F8EF] px-2.5 py-1 text-[11px] font-bold text-[#159A51] sm:col-auto sm:row-auto sm:gap-2 sm:px-3 sm:py-1.5 sm:text-xs">
            <span className="h-2 w-2 rounded-full bg-[#17A963]" aria-hidden="true" />
            Active
          </span>
          <Link
            href={`/student/courses/${course.id}`}
            prefetch={false}
            className="row-span-2 inline-flex min-h-9 shrink-0 items-center justify-center gap-1 rounded-lg bg-[#1478F2] px-3 text-xs font-bold text-white shadow-[0_5px_12px_rgba(20,120,242,0.18)] transition hover:bg-[#0868DD] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:min-h-11 sm:gap-2 sm:px-4 sm:text-sm sm:w-[180px]"
          >
            <SettingsIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="sm:hidden">Manage</span>
            <span className="hidden sm:inline">Manage Course</span>
          </Link>
        </>
      )}
      {isDemo && (
        <Link
          href="/student/courses/preview"
          prefetch={false}
          className="row-span-2 inline-flex min-h-9 shrink-0 items-center justify-center rounded-lg border border-[#1478F2] px-3 text-xs font-bold text-[#1478F2] transition hover:bg-[#EFF6FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:min-h-11 sm:px-4 sm:text-sm"
        >
          Preview
        </Link>
      )}
    </article>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className ?? "h-5 w-5"} fill="none" aria-hidden="true">
      <path
        d="M2.5 12s3.3-6 9.5-6 9.5 6 9.5 6-3.3 6-9.5 6-9.5-6-9.5-6Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="2.7" stroke="currentColor" strokeWidth="1.8" />
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
    <article className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 px-3 py-3 sm:flex sm:gap-4 sm:px-6 sm:py-4">
      <div className="min-w-0 sm:flex-1">
        <h3 className="text-sm font-bold text-[#17284B] sm:text-base">{request.name}</h3>
        <p className="mt-0.5 text-xs leading-4 text-[#71809A] sm:mt-1 sm:text-sm sm:leading-5">
          {request.description}
        </p>
      </div>
      <div className="col-start-1 row-start-2 flex min-w-0 shrink-0 flex-wrap items-center gap-x-2 gap-y-1 sm:col-auto sm:row-auto sm:flex-col sm:items-start sm:gap-1.5 sm:w-[245px]">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF4D9] px-2.5 py-1 text-[11px] font-bold text-[#B87500] sm:gap-2 sm:px-3 sm:py-1.5 sm:text-xs">
          <span className="h-2 w-2 rounded-full bg-[#E7A000]" aria-hidden="true" />
          Pending
        </span>
        <p className="text-[10px] leading-4 text-[#71809A] sm:text-xs sm:leading-5">
          ID: {maskedTransactionId}
          <span className="px-1.5" aria-hidden="true">
            |
          </span>
          Amount: {formatPkr(request.amountPaisa)}
        </p>
      </div>
      <button
        type="button"
        onClick={onViewRequest}
        className="row-span-2 inline-flex min-h-9 shrink-0 items-center justify-center gap-1 rounded-lg border border-[#1478F2] px-3 text-xs font-bold text-[#1478F2] transition hover:bg-[#EFF6FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:min-h-11 sm:gap-2 sm:px-4 sm:text-sm sm:w-[170px]"
      >
        <EyeIcon className="h-4 w-4 sm:h-5 sm:w-5" />
        <span className="sm:hidden">View</span>
        <span className="hidden sm:inline">View Request</span>
      </button>
    </article>
  );
}

export function StudentCoursePage({
  activeCourses,
  pendingRequests,
  inactiveCourses,
  showDemoActiveCourse = false,
}: StudentCoursePageProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<StudentPaymentRequest | null>(null);
  const visibleInactiveCourses = inactiveCourses.slice(0, 3);
  const demoActiveCourse: StudentCourseItem = {
    id: "demo-preview",
    name: "PPSC Preparation",
    description: "Sample course shown for development preview only.",
    feePaisa: 20000,
  };
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

            <div className="space-y-5 sm:space-y-7">
              <section aria-labelledby="active-courses-heading">
                <SectionHeading
                  id="active-courses-heading"
                  tone="green"
                  title="Active Courses"
                  count={showDemoActiveCourse ? undefined : activeCourses.length}
                  description={
                    showDemoActiveCourse
                      ? "Preview upcoming course features. This demo does not unlock course materials."
                      : "These are the courses you can currently access."
                  }
                />
                <div className="divide-y divide-[#E5EDF7] overflow-hidden rounded-xl border border-[#DDE8F5] bg-white shadow-[0_5px_16px_rgba(46,93,145,0.035)]">
                  {activeCourses.map((course) => (
                    <ActiveCourseRow key={course.id} course={course} />
                  ))}
                  {showDemoActiveCourse && <ActiveCourseRow course={demoActiveCourse} isDemo />}
                  {!activeCourses.length && !showDemoActiveCourse && (
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
                <div className="divide-y divide-[#E5EDF7] overflow-hidden rounded-xl border border-[#DDE8F5] bg-white px-3 shadow-[0_5px_16px_rgba(46,93,145,0.035)] sm:px-5">
                  {inactiveCourses.length ? (
                    visibleInactiveCourses.map((course) => (
                      <article
                        key={course.id}
                        className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 py-3 sm:flex sm:gap-4 sm:py-4"
                      >
                        <div className="min-w-0 sm:flex-1">
                          <h3 className="text-sm font-bold text-[#17284B] sm:text-base">
                            {course.name}
                          </h3>
                          <p className="mt-0.5 line-clamp-2 text-xs leading-4 text-[#71809A] sm:mt-1 sm:text-sm sm:leading-5">
                            {course.description}
                          </p>
                        </div>
                        <div className="col-start-1 row-start-2 flex min-w-0 shrink-0 flex-wrap items-center gap-x-2 gap-y-1 sm:col-auto sm:row-auto sm:flex-col sm:items-start sm:gap-1.5 sm:w-[190px]">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EEF1F5] px-2.5 py-1 text-[11px] font-bold text-[#65738A] sm:gap-2 sm:px-3 sm:py-1.5 sm:text-xs">
                            <span
                              className="h-2 w-2 rounded-full bg-[#77849A]"
                              aria-hidden="true"
                            />
                            Not Enrolled
                          </span>
                          <span className="text-[10px] text-[#71809A] sm:text-xs">
                            {formatPkr(course.feePaisa)}
                          </span>
                        </div>
                        <Link
                          href={`/student/course-catalog/${course.id}`}
                          prefetch={false}
                          className="row-span-2 inline-flex min-h-9 shrink-0 items-center justify-center whitespace-nowrap rounded-lg bg-[#1478F2] px-3 text-xs font-bold text-white shadow-[0_5px_12px_rgba(20,120,242,0.18)] transition hover:bg-[#0868DD] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:min-h-11 sm:px-4 sm:text-sm sm:w-[160px]"
                        >
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
                {inactiveCourses.length > 3 && (
                  <div className="mt-4 flex justify-end">
                    <Link
                      href="/student/course-catalog"
                      prefetch={false}
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#1478F2] px-4 text-xs font-bold text-white transition hover:bg-[#0868DD] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:min-h-11 sm:px-5 sm:text-sm"
                    >
                      View All Courses
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                )}
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
