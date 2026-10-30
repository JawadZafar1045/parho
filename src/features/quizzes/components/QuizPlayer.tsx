"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { QuizItem, QuizQuestion } from "../types";

type QuizPlayerProps = {
  quiz: QuizItem;
};

export function QuizPlayer({ quiz }: QuizPlayerProps) {
  const router = useRouter();
  const questions: QuizQuestion[] = quiz.questions || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [secondsRemaining, setSecondsRemaining] = useState(quiz.timeLimitMinutes * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;

  // Countdown timer
  useEffect(() => {
    if (secondsRemaining <= 0) {
      handleFinalSubmit();
      return;
    }

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinalSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsRemaining]);

  function formatTimer(totalSecs: number) {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  function handleSelectOption(optionKey: string) {
    if (!currentQuestion) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionKey,
    }));
  }

  function handleClearResponse() {
    if (!currentQuestion) return;
    setSelectedAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentQuestion.id];
      return copy;
    });
  }

  function toggleFlag() {
    if (!currentQuestion) return;
    setFlaggedQuestions((prev) => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id],
    }));
  }

  async function handleFinalSubmit() {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setShowSubmitModal(false);

    const submissionPayload = {
      answers: Object.entries(selectedAnswers).map(([questionId, selectedOptionKey]) => ({
        questionId,
        selectedOptionKey,
      })),
      timeSpentSeconds: quiz.timeLimitMinutes * 60 - secondsRemaining,
    };

    try {
      const res = await fetch(`/api/quizzes/${quiz.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionPayload),
      });

      const data = await res.json();
      if (data.success && data.data?.result?.attemptId) {
        router.push(`/student/quizzes/${quiz.id}/results/${data.data.result.attemptId}`);
      } else {
        alert("Failed to evaluate test. Please try again.");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("Error submitting test. Please check connection.");
      setIsSubmitting(false);
    }
  }

  const answeredCount = Object.keys(selectedAnswers).length;
  const unansweredCount = totalQuestions - answeredCount;
  const isTimeCritical = secondsRemaining < 120; // < 2 minutes

  if (!currentQuestion) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7FAFE]">
        <div className="text-center">
          <p className="text-lg font-bold text-slate-700">No questions found in this quiz.</p>
          <Link href="/student/quizzes" className="mt-3 inline-block font-bold text-blue-600">
            Back to Quizzes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7FAFE] text-slate-900 pb-12">
      {/* Quiz Top Fixed Navigation Bar */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm sm:px-8">
        <div>
          <span className="inline-block rounded-md bg-slate-900 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-white">
            {quiz.courseName}
          </span>
          <h1 className="text-sm font-extrabold text-slate-900 sm:text-base truncate max-w-[200px] sm:max-w-md">
            {quiz.title}
          </h1>
        </div>

        {/* Timer & Submit CTA */}
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 font-mono text-sm font-black transition ${
              isTimeCritical
                ? "border-red-500 bg-red-50 text-red-600 animate-pulse"
                : "border-slate-200 bg-slate-50 text-slate-800"
            }`}
          >
            <span aria-hidden="true">⏱</span>
            <span>{formatTimer(secondsRemaining)}</span>
          </div>

          <button
            type="button"
            onClick={() => setShowSubmitModal(true)}
            disabled={isSubmitting}
            className="rounded-xl bg-[#2563EB] px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-sm transition hover:bg-[#1D4ED8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? "Grading..." : "Finish Test"}
          </button>
        </div>
      </header>

      {/* Main Test Grid */}
      <div className="mx-auto max-w-[1200px] px-4 pt-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Main Question Card Area (8 cols) */}
          <main className="lg:col-span-8 flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8 min-h-[500px]">
            <div>
              {/* Question Header & Meta */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Question {currentIndex + 1} of {totalQuestions}
                </span>

                <button
                  type="button"
                  onClick={toggleFlag}
                  className={`flex items-center gap-1.5 rounded-lg border px-3 py-1 text-xs font-bold transition ${
                    flaggedQuestions[currentQuestion.id]
                      ? "border-amber-400 bg-amber-50 text-amber-700"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span>{flaggedQuestions[currentQuestion.id] ? "★" : "☆"}</span>
                  <span>{flaggedQuestions[currentQuestion.id] ? "Flagged for Review" : "Flag Question"}</span>
                </button>
              </div>

              {/* Question Text */}
              <div className="mt-5">
                <h2 className="text-base sm:text-lg font-bold leading-relaxed text-slate-900">
                  {currentQuestion.questionText}
                </h2>
              </div>

              {/* Options List */}
              <div className="mt-6 space-y-3">
                {currentQuestion.options.map((opt) => {
                  const isSelected = selectedAnswers[currentQuestion.id] === opt.key;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => handleSelectOption(opt.key)}
                      className={`flex w-full items-center gap-3.5 rounded-xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                        isSelected
                          ? "border-[#2563EB] bg-[#EFF6FF] text-[#1E3A8A] shadow-sm ring-1 ring-[#2563EB]"
                          : "border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-extrabold ${
                          isSelected
                            ? "bg-[#2563EB] text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {opt.key}
                      </span>
                      <span className="text-sm sm:text-base font-medium leading-normal">
                        {opt.text}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
              <button
                type="button"
                onClick={handleClearResponse}
                disabled={!selectedAnswers[currentQuestion.id]}
                className="text-xs font-bold text-slate-500 hover:text-red-600 disabled:opacity-40"
              >
                Clear Response
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentIndex((idx) => Math.max(idx - 1, 0))}
                  disabled={currentIndex === 0}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs sm:text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-40"
                >
                  ← Previous
                </button>

                {currentIndex < totalQuestions - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentIndex((idx) => Math.min(idx + 1, totalQuestions - 1))}
                    className="rounded-xl bg-[#2563EB] px-5 py-2 text-xs sm:text-sm font-bold text-white shadow-sm transition hover:bg-[#1D4ED8]"
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(true)}
                    className="rounded-xl bg-emerald-600 px-5 py-2 text-xs sm:text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700"
                  >
                    Review &amp; Submit ✓
                  </button>
                )}
              </div>
            </div>
          </main>

          {/* Question Palette / Navigator Sidebar (4 cols) */}
          <aside className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900">Question Palette</h3>
            <p className="mt-1 text-xs text-slate-500">
              Click any question number to jump directly.
            </p>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-semibold text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded bg-emerald-500" /> Answered ({answeredCount})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded bg-amber-400" /> Flagged
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded bg-slate-100 border border-slate-300" /> Unanswered ({unansweredCount})
              </span>
            </div>

            {/* Question Numbers Grid */}
            <div className="mt-5 grid grid-cols-5 gap-2 sm:grid-cols-6 lg:grid-cols-5">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const isAnswered = Boolean(selectedAnswers[q.id]);
                const isFlagged = Boolean(flaggedQuestions[q.id]);

                let bgClasses = "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100";
                if (isCurrent) {
                  bgClasses = "border-blue-600 bg-blue-600 text-white ring-2 ring-blue-300 font-extrabold";
                } else if (isFlagged) {
                  bgClasses = "border-amber-400 bg-amber-400 text-slate-900 font-bold";
                } else if (isAnswered) {
                  bgClasses = "border-emerald-500 bg-emerald-500 text-white font-bold";
                }

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`flex h-10 w-full items-center justify-center rounded-xl border text-xs transition ${bgClasses}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setShowSubmitModal(true)}
                className="w-full rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800"
              >
                Submit Test
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900">Are you sure you want to finish?</h3>
            <p className="mt-2 text-sm text-slate-600">
              You have answered <span className="font-bold text-emerald-600">{answeredCount}</span> out of{" "}
              <span className="font-bold text-slate-900">{totalQuestions}</span> questions.
            </p>

            {unansweredCount > 0 && (
              <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-medium text-amber-800">
                ⚠️ Notice: You still have {unansweredCount} unanswered question{unansweredCount > 1 ? "s" : ""}.
              </div>
            )}

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Continue Test
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="rounded-xl bg-[#2563EB] px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#1D4ED8]"
              >
                {isSubmitting ? "Submitting..." : "Yes, Submit Test"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
