"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { QuizItem } from "@/features/quizzes/types";
import type { Course } from "@/features/courses/types";

export default function AdminQuizzesGlobalPage() {
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const [quizRes, coursesRes] = await Promise.all([
        fetch("/api/admin/quizzes"),
        fetch("/api/admin/courses"),
      ]);

      const quizData = await quizRes.json();
      const coursesData = await coursesRes.json();

      if (quizData.success && quizData.data?.quizzes) {
        setQuizzes(quizData.data.quizzes);
      }
      if (coursesData.success && coursesData.data?.courses) {
        setCourses(coursesData.data.courses);
      }
    } catch (err) {
      console.error("Failed to fetch quizzes data:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteQuiz(quizId: string) {
    if (!confirm("Are you sure you want to permanently delete this quiz?")) return;
    try {
      const res = await fetch(`/api/admin/quizzes/${quizId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
      } else {
        alert(data.message || "Failed to delete quiz.");
      }
    } catch (err) {
      console.error("Delete quiz error:", err);
      alert("Error deleting quiz.");
    }
  }

  const filteredQuizzes =
    selectedCourseId === "all"
      ? quizzes
      : quizzes.filter((q) => q.courseId === selectedCourseId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">
            Quizzes &amp; Assessment Engine
          </h2>
          <p className="text-xs sm:text-sm font-medium text-slate-500">
            All timed MCQ examinations, model papers, and assessments across all courses.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Tracks ({quizzes.length})</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm font-semibold text-slate-500">
          Loading quizzes...
        </div>
      ) : filteredQuizzes.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <span className="text-3xl">📝</span>
          <h4 className="mt-2 text-base font-bold text-slate-800">No Quizzes Found</h4>
          <p className="mt-1 text-xs text-slate-500">
            Go to any course management page to upload quizzes via CSV.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredQuizzes.map((q) => (
            <div
              key={q.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-md bg-slate-900 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white">
                    {q.courseId.toUpperCase()} • {q.subjectName}
                  </span>
                  <span className="rounded-md bg-slate-200 px-2.5 py-0.5 text-[10px] font-bold text-slate-800">
                    ⏱ {q.timeLimitMinutes} Mins
                  </span>
                </div>

                <h4 className="mt-3 text-base font-bold text-slate-900 line-clamp-2">
                  {q.title}
                </h4>

                <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                  {q.description}
                </p>

                <div className="mt-4 flex items-center gap-3 text-xs font-semibold text-slate-600">
                  <span className="rounded-md bg-slate-200 px-2.5 py-1 text-[11px] font-bold text-slate-800">
                    ❓ {q.questionCount} MCQs
                  </span>
                  <span>•</span>
                  <span>Pass: {q.passingPercentage}%</span>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">
                <Link
                  href={`/student/quizzes/${q.id}`}
                  target="_blank"
                  className="text-xs font-bold text-blue-600 hover:text-blue-700"
                >
                  Take Exam →
                </Link>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/courses/${q.courseId}`}
                    className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-200"
                  >
                    Manage
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDeleteQuiz(q.id)}
                    className="rounded-lg p-1 text-xs text-red-500 hover:bg-red-50 hover:text-red-700"
                    title="Delete Quiz"
                  >
                    🗑
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
