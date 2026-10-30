"use client";

import Link from "next/link";
import type { QuizAttemptResult } from "../types";

type QuizResultViewProps = {
  result: QuizAttemptResult;
};

export function QuizResultView({ result }: QuizResultViewProps) {
  function formatDuration(totalSecs: number) {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}m ${secs}s`;
  }

  return (
    <div className="min-h-screen bg-[#F7FAFE] text-slate-900 pb-16">
      {/* Top Header */}
      <header className="border-b border-slate-200 bg-white px-4 py-4 sm:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Exam Performance Report
            </span>
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900">
              {result.quizTitle}
            </h1>
          </div>
          <Link
            href="/student/quizzes"
            className="rounded-xl border border-slate-200 px-4 py-2 text-xs sm:text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            All Quizzes
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pt-8 sm:px-6">
        {/* Scorecard Hero Banner */}
        <section
          className={`rounded-2xl border p-6 sm:p-8 text-center shadow-sm ${
            result.isPassed
              ? "border-emerald-200 bg-gradient-to-b from-emerald-50/70 to-white"
              : "border-amber-200 bg-gradient-to-b from-amber-50/70 to-white"
          }`}
        >
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full text-2xl shadow-inner mb-3">
            {result.isPassed ? "🏆" : "🎯"}
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {result.isPassed ? "Congratulations! You Passed" : "Good Effort! Keep Practicing"}
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            {result.isPassed
              ? "You demonstrated strong mastery of this subject matter."
              : "Review the explanations below to identify and strengthen your weak areas."}
          </p>

          {/* Key Metrics Grid */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 max-w-2xl mx-auto">
            <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
              <span className="text-[11px] font-bold uppercase text-slate-400">Score</span>
              <p className="mt-1 text-xl sm:text-2xl font-black text-slate-900">
                {result.score} / {result.totalMarks}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
              <span className="text-[11px] font-bold uppercase text-slate-400">Accuracy</span>
              <p
                className={`mt-1 text-xl sm:text-2xl font-black ${
                  result.isPassed ? "text-emerald-600" : "text-amber-600"
                }`}
              >
                {result.percentage}%
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
              <span className="text-[11px] font-bold uppercase text-slate-400">Correct / Wrong</span>
              <p className="mt-1 text-xl sm:text-2xl font-black text-slate-900">
                <span className="text-emerald-600">{result.correctCount}</span> /{" "}
                <span className="text-red-500">{result.wrongCount}</span>
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
              <span className="text-[11px] font-bold uppercase text-slate-400">Time Taken</span>
              <p className="mt-1 text-xl sm:text-2xl font-black text-slate-900">
                {formatDuration(result.timeSpentSeconds)}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={`/student/quizzes/${result.quizId}`}
              className="rounded-xl bg-[#2563EB] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm transition hover:bg-[#1D4ED8]"
            >
              Retake Test ↻
            </Link>
            <Link
              href="/student/quizzes"
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              Browse More Quizzes
            </Link>
          </div>
        </section>

        {/* Detailed Answer Key & Explanations Review */}
        <section className="mt-10" aria-labelledby="review-heading">
          <div className="mb-4 flex items-center justify-between">
            <h3 id="review-heading" className="text-xl font-bold tracking-tight text-[#101B45]">
              Question Review &amp; Explanations
            </h3>
            <span className="text-xs font-semibold text-slate-500">
              {result.totalQuestions} Questions total
            </span>
          </div>

          <div className="space-y-4">
            {result.answers.map((ans, idx) => {
              const statusTag = !ans.selectedOptionKey
                ? { label: "Unanswered", color: "bg-slate-100 text-slate-600 border-slate-200" }
                : ans.isCorrect
                ? { label: "Correct ✓", color: "bg-emerald-50 text-emerald-700 border-emerald-200" }
                : { label: "Incorrect ✗", color: "bg-red-50 text-red-700 border-red-200" };

              return (
                <article
                  key={ans.questionId}
                  className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-400 uppercase">
                      Question {idx + 1}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-bold ${statusTag.color}`}
                    >
                      {statusTag.label}
                    </span>
                  </div>

                  <p className="mt-3 text-base font-bold text-slate-900 leading-snug">
                    {ans.questionText}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-4 text-xs sm:text-sm">
                    <div className="rounded-xl border border-slate-100 bg-slate-50 px-3.5 py-2">
                      <span className="text-slate-400 font-medium">Your Answer: </span>
                      <span
                        className={`font-bold ${
                          ans.isCorrect ? "text-emerald-700" : "text-red-600"
                        }`}
                      >
                        {ans.selectedOptionKey ? `Option ${ans.selectedOptionKey}` : "None"}
                      </span>
                    </div>

                    <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-3.5 py-2">
                      <span className="text-emerald-700 font-medium">Correct Answer: </span>
                      <span className="font-bold text-emerald-800">
                        Option {ans.correctOptionKey}
                      </span>
                    </div>
                  </div>

                  {/* High Yield Explanation Box */}
                  {ans.explanation && (
                    <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/60 p-4">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-blue-800">
                        <span aria-hidden="true">💡</span>
                        <span>High-Yield Explanation</span>
                      </div>
                      <p className="mt-1 text-xs sm:text-sm text-blue-950 leading-relaxed font-medium">
                        {ans.explanation}
                      </p>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
