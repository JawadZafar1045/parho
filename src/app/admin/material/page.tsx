"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { StoredMaterial } from "@/services/materialStore";
import type { Course } from "@/features/courses/types";

export default function AdminMaterialsGlobalPage() {
  const [materials, setMaterials] = useState<StoredMaterial[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const [matRes, coursesRes] = await Promise.all([
        fetch("/api/admin/materials"),
        fetch("/api/admin/courses"),
      ]);

      const matData = await matRes.json();
      const coursesData = await coursesRes.json();

      if (matData.success && matData.data?.materials) {
        setMaterials(matData.data.materials);
      }
      if (coursesData.success && coursesData.data?.courses) {
        setCourses(coursesData.data.courses);
      }
    } catch (err) {
      console.error("Failed to fetch materials data:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteMaterial(materialId: string) {
    if (!confirm("Are you sure you want to permanently delete this study note?")) return;
    try {
      const res = await fetch(`/api/admin/materials/${materialId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setMaterials((prev) => prev.filter((m) => m.id !== materialId));
      } else {
        alert(data.message || "Failed to remove material.");
      }
    } catch (err) {
      console.error("Delete material error:", err);
      alert("Error removing material.");
    }
  }

  const filteredMaterials =
    selectedCourseId === "all"
      ? materials
      : materials.filter((m) => m.courseId === selectedCourseId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">
            Teaching Materials &amp; Study Notes
          </h2>
          <p className="text-xs sm:text-sm font-medium text-slate-500">
            All PDF notes, Cloudflare R2 shared documents, and chapter guides published across Parho tracks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Courses ({materials.length})</option>
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
          Loading teaching materials...
        </div>
      ) : filteredMaterials.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <span className="text-3xl">📖</span>
          <h4 className="mt-2 text-base font-bold text-slate-800">No Study Notes Found</h4>
          <p className="mt-1 text-xs text-slate-500">
            Go to any course management page to upload new PDF notes.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredMaterials.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-black uppercase text-blue-700">
                    {item.courseId.toUpperCase()} • {item.subjectName}
                  </span>
                  <div className="flex items-center gap-1">
                    {item.r2Url || item.storageType === "r2" ? (
                      <span className="rounded-full bg-indigo-50 border border-indigo-200 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
                        ⚡ Cloudflare R2
                      </span>
                    ) : null}
                    {item.isFreePreview ? (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                        Free Preview
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                        Enrolled
                      </span>
                    )}
                  </div>
                </div>

                <h4 className="mt-3 text-base font-bold text-slate-900 line-clamp-2">
                  {item.title}
                </h4>

                <div className="mt-3 flex items-center gap-3 text-xs text-slate-400">
                  <span>📄 {item.fileSize}</span>
                  <span>•</span>
                  <span className="truncate max-w-[150px]">{item.fileName}</span>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">
                <Link
                  href={`/student/notes/view/${item.courseId}/${item.subjectId}/${item.id}`}
                  target="_blank"
                  className="text-xs font-bold text-blue-600 hover:text-blue-700"
                >
                  Read in Reader →
                </Link>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/courses/${item.courseId}`}
                    className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-200"
                  >
                    Manage
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDeleteMaterial(item.id)}
                    className="rounded-lg p-1 text-xs text-red-500 hover:bg-red-50 hover:text-red-700"
                    title="Delete Note"
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
