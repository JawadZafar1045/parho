"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Course, CourseSubject } from "@/features/courses/types";

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    courseId: "",
    name: "",
    description: "",
    price: 1500,
    originalPrice: 3000,
    discountLabel: "50% OFF",
    badge: "Popular Track",
    imageLabel: "PREP",
    subjectsText: "General Knowledge, Pakistan Affairs, English",
    featuresText: "Verified PDF Study Notes, Timed Practice Quizzes, Detailed Answer Explanations",
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/courses");
      const data = await res.json();
      if (data.success && data.data?.courses) {
        setCourses(data.data.courses);
      }
    } catch (err) {
      console.error("Failed to load courses:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteCourse(id: string, name: string) {
    if (!confirm(`Are you sure you want to permanently delete '${name}'? All related materials and configurations will be removed.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/courses/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setCourses((prev) => prev.filter((c) => c.id !== id));
      } else {
        alert(data.message || "Failed to delete course.");
      }
    } catch (err) {
      console.error("Error deleting course:", err);
      alert("Error deleting course.");
    }
  }

  function openCreateModal() {
    setEditingCourseId(null);
    setFormData({
      courseId: "",
      name: "",
      description: "",
      price: 1500,
      originalPrice: 3000,
      discountLabel: "50% OFF",
      badge: "New Track",
      imageLabel: "PREP",
      subjectsText: "General Knowledge, Pakistan Affairs, English",
      featuresText: "Verified PDF Study Notes, Timed Practice Quizzes, Answer Explanations",
    });
    setIsModalOpen(true);
  }

  function openEditModal(course: Course) {
    setEditingCourseId(course.id);
    const subjectsStr = course.subjects?.map((s) => s.name).join(", ") || "";
    const featuresStr = course.features?.join(", ") || "";

    setFormData({
      courseId: course.id,
      name: course.name,
      description: course.description || "",
      price: course.price || 1500,
      originalPrice: course.originalPrice || 3000,
      discountLabel: course.discountLabel || "50% OFF",
      badge: course.badge || "",
      imageLabel: course.imageLabel || course.id.toUpperCase(),
      subjectsText: subjectsStr,
      featuresText: featuresStr,
    });
    setIsModalOpen(true);
  }

  async function handleSaveCourse(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const subjects: CourseSubject[] = formData.subjectsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((name) => ({
        id: name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        name,
        description: `Comprehensive revision notes for ${name}`,
      }));

    const features: string[] = formData.featuresText
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);

    const payload = {
      courseId: formData.courseId,
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      originalPrice: Number(formData.originalPrice),
      discountLabel: formData.discountLabel,
      badge: formData.badge,
      imageLabel: formData.imageLabel || formData.courseId.toUpperCase().slice(0, 5),
      subjects,
      features,
    };

    try {
      const url = editingCourseId
        ? `/api/admin/courses/${editingCourseId}`
        : "/api/admin/courses";
      const method = editingCourseId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchCourses();
      } else {
        alert(data.message || "Failed to save course.");
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Error saving course.");
    } finally {
      setSaving(false);
    }
  }

  // Calculate live discount for preview
  const previewDiscount =
    formData.originalPrice > formData.price
      ? Math.round(((formData.originalPrice - formData.price) / formData.originalPrice) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb / Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">
            Course Packages &amp; Curriculum Management
          </h2>
          <p className="text-xs sm:text-sm font-medium text-slate-500">
            Manage course materials, upload quizzes via CSV, configure pricing, and publish promotional discounts.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700"
        >
          <span>+</span>
          <span>Create New Course</span>
        </button>
      </div>

        {/* Courses Cards Grid */}
        <div className="mt-6">
          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm font-semibold text-slate-500">
              Loading courses and discounts...
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => {
                const discount =
                  course.originalPrice && course.price && course.originalPrice > course.price
                    ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
                    : 0;

                return (
                  <article
                    key={course.id}
                    className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-start justify-between gap-3">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-sm font-black text-white shadow-md shadow-blue-500/20">
                          {course.imageLabel}
                        </span>

                        <div className="flex flex-col items-end gap-1.5">
                          {course.badge && (
                            <span className="rounded-md bg-blue-600 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white">
                              {course.badge}
                            </span>
                          )}
                          {course.discountLabel && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-amber-400 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-950">
                              🔥 {course.discountLabel}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Course Title & Description */}
                      <div className="mt-4">
                        <h3 className="text-xl font-black text-slate-900">{course.name}</h3>
                        <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                          {course.description}
                        </p>
                      </div>

                      {/* Price & Discount Display */}
                      <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Package Pricing
                        </span>
                        <div className="mt-1 flex items-baseline gap-2.5">
                          <span className="text-2xl font-black text-slate-900">
                            Rs. {course.price?.toLocaleString()}
                          </span>
                          {course.originalPrice && course.originalPrice > (course.price || 0) && (
                            <span className="text-sm font-bold text-slate-400 line-through">
                              Rs. {course.originalPrice.toLocaleString()}
                            </span>
                          )}
                          {discount > 0 && (
                            <span className="rounded-md bg-emerald-600 px-2 py-0.5 text-[11px] font-bold text-white">
                              Save {discount}%
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Subjects & Specs */}
                      <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-semibold text-slate-600">
                        <span className="rounded-lg bg-slate-100 px-2.5 py-1">
                          📁 {course.subjectCount || course.subjects?.length || 0} Subjects
                        </span>
                        <span className="rounded-lg bg-slate-100 px-2.5 py-1">
                          📖 {course.pdfCount || 10} Study PDFs
                        </span>
                        <span className="rounded-lg bg-slate-100 px-2.5 py-1">
                          ⏱ {course.quizCount || 5} Quizzes
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 border-t border-slate-100 pt-4 space-y-2">
                      <Link
                        href={`/admin/courses/${course.id}`}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-center text-xs font-bold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700"
                      >
                        <span>⚙️ Manage Material &amp; Quizzes</span>
                        <span aria-hidden="true">→</span>
                      </Link>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(course)}
                          className="flex-1 rounded-xl border border-slate-200 bg-slate-50 py-2 text-center text-xs font-bold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
                        >
                          ✏️ Edit Pricing
                        </button>
                        <Link
                          href={`/student/courses/${course.id}`}
                          target="_blank"
                          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100"
                          title="View Live Student Course Page"
                        >
                          👁
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDeleteCourse(course.id, course.name)}
                          className="rounded-xl border border-red-200 bg-red-50/50 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-100 transition"
                          title="Delete Course"
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

      {/* Add / Edit Course Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 overflow-y-auto">
          <div className="my-8 w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  {editingCourseId ? `Edit ${formData.name}` : "Create New Course Package"}
                </h3>
                <p className="text-xs text-slate-500">
                  Configure pricing, promotional discount tags, and curriculum.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="mt-6 space-y-4">
              {/* Row 1: Name and Slug */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Course Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Educator Jobs Preparation"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Course Slug / ID *
                  </label>
                  <input
                    type="text"
                    required
                    disabled={Boolean(editingCourseId)}
                    placeholder="e.g. educators"
                    value={formData.courseId}
                    onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Course Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Summary of exam syllabus, target audience, and revision content..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Row 2: Pricing & Discounts */}
              <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
                  Pricing &amp; Promotional Discounts
                </span>

                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600">
                      Selling Price (PKR) *
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600">
                      Original Price (Strikethrough)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600">
                      Discount Badge Tag
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 50% OFF"
                      value={formData.discountLabel}
                      onChange={(e) => setFormData({ ...formData, discountLabel: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                </div>

                {/* Live Discount Calculator Preview */}
                <div className="mt-3 flex items-center justify-between text-xs text-blue-900 font-semibold border-t border-blue-200/60 pt-2.5">
                  <span>Calculated Savings:</span>
                  <span className="font-bold text-emerald-700">
                    Students save {previewDiscount}% (Rs. {(formData.originalPrice - formData.price).toLocaleString()} discount)
                  </span>
                </div>
              </div>

              {/* Row 3: Badge & Label */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Category Tag / Badge
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Most Popular, Federal Track, New"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Logo Label (4-5 chars)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. PPSC, NTS"
                    value={formData.imageLabel}
                    onChange={(e) => setFormData({ ...formData, imageLabel: e.target.value.toUpperCase() })}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* Subjects (Comma-separated) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Course Subjects (Comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. General Knowledge, Pakistan Affairs, English, Pedagogy"
                  value={formData.subjectsText}
                  onChange={(e) => setFormData({ ...formData, subjectsText: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Each comma creates an official subject bucket for notes and mock quizzes.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-[#2563EB] px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-200 hover:bg-[#1D4ED8] disabled:opacity-50"
                >
                  {saving ? "Saving..." : editingCourseId ? "Update Course & Discount" : "Create Course Package"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
