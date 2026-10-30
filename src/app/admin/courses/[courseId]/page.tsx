"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";
import type { Course } from "@/features/courses/types";
import type { StoredMaterial } from "@/services/materialStore";
import type { QuizItem } from "@/features/quizzes/types";

interface ParsedRow {
  questionNumber: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
  explanation?: string;
  points?: number;
}

export default function AdminCourseManagePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const unwrappedParams = use(params);
  const courseId = unwrappedParams.courseId;
  const router = useRouter();

  const [course, setCourse] = useState<Course | null>(null);
  const [materials, setMaterials] = useState<StoredMaterial[]>([]);
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"material" | "quizzes" | "pricing">("material");

  // Material Upload State
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [materialStorageMode, setMaterialStorageMode] = useState<"r2" | "file">("r2");
  const [materialForm, setMaterialForm] = useState({
    subjectId: "",
    subjectName: "",
    title: "",
    r2Url: "",
    fileSize: "2.4 MB",
    isFreePreview: false,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingMaterial, setUploadingMaterial] = useState(false);

  // CSV Quiz Ingestion State
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [quizMeta, setQuizMeta] = useState({
    title: "",
    subjectId: "",
    subjectName: "",
    timeLimitMinutes: 15,
    passingPercentage: 50,
    description: "",
  });
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [parsedQuestions, setParsedQuestions] = useState<ParsedRow[]>([]);
  const [csvParseError, setCsvParseError] = useState<string | null>(null);
  const [importingQuiz, setImportingQuiz] = useState(false);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadCourseData();
  }, [courseId]);

  async function loadCourseData() {
    try {
      setLoading(true);

      // 1. Fetch Course details
      const courseRes = await fetch(`/api/admin/courses/${courseId}`);
      const courseData = await courseRes.json();
      if (courseData.success && courseData.data?.course) {
        setCourse(courseData.data.course);
        // Default subject for forms
        if (courseData.data.course.subjects?.length > 0) {
          const firstSub = courseData.data.course.subjects[0];
          setMaterialForm((prev) => ({
            ...prev,
            subjectId: firstSub.id,
            subjectName: firstSub.name,
          }));
          setQuizMeta((prev) => ({
            ...prev,
            subjectId: firstSub.id,
            subjectName: firstSub.name,
          }));
        }
      }

      // 2. Fetch Materials
      const matRes = await fetch(`/api/admin/materials?courseId=${courseId}`);
      const matData = await matRes.json();
      if (matData.success && matData.data?.materials) {
        setMaterials(matData.data.materials);
      }

      // 3. Fetch Quizzes
      const quizRes = await fetch(`/api/admin/quizzes?courseId=${courseId}`);
      const quizData = await quizRes.json();
      if (quizData.success && quizData.data?.quizzes) {
        setQuizzes(quizData.data.quizzes);
      }
    } catch (err) {
      console.error("Failed to load course management data:", err);
    } finally {
      setLoading(false);
    }
  }

  // Handle Material Upload
  async function handleUploadMaterial(e: React.FormEvent) {
    e.preventDefault();
    if (!materialForm.title.trim()) return;

    try {
      setUploadingMaterial(true);
      const formData = new FormData();
      formData.append("courseId", courseId);
      formData.append("subjectId", materialForm.subjectId);
      formData.append("subjectName", materialForm.subjectName);
      formData.append("title", materialForm.title.trim());
      formData.append("isFreePreview", String(materialForm.isFreePreview));

      if (materialStorageMode === "r2") {
        if (!materialForm.r2Url.trim()) {
          alert("Please enter the Cloudflare R2 / CDN link for this material.");
          setUploadingMaterial(false);
          return;
        }
        formData.append("r2Url", materialForm.r2Url.trim());
        formData.append("fileSize", materialForm.fileSize || "2.1 MB");
      } else {
        if (selectedFile) {
          formData.append("file", selectedFile);
        } else {
          formData.append("fileSize", materialForm.fileSize || "2.1 MB");
        }
      }

      const res = await fetch("/api/admin/materials", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.data?.material) {
        setMaterials((prev) => [data.data.material, ...prev]);
        setIsMaterialModalOpen(false);
        setMaterialForm((prev) => ({ ...prev, title: "", r2Url: "", isFreePreview: false }));
        setSelectedFile(null);
      } else {
        alert(data.message || "Failed to upload material");
      }
    } catch (err) {
      console.error("Material upload error:", err);
      alert("Error uploading material");
    } finally {
      setUploadingMaterial(false);
    }
  }

  async function handleDeleteEntireCourse() {
    if (!course) return;
    if (!confirm(`Are you sure you want to permanently delete '${course.name}'? All related materials and configurations will be removed.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/courses/${courseId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        router.push("/admin/courses");
      } else {
        alert(data.message || "Failed to delete course.");
      }
    } catch (err) {
      console.error("Delete course error:", err);
      alert("Error deleting course.");
    }
  }

  async function handleDeleteMaterial(materialId: string) {
    if (!confirm("Are you sure you want to remove this study note?")) return;
    try {
      const res = await fetch(`/api/admin/materials/${materialId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setMaterials((prev) => prev.filter((m) => m.id !== materialId));
      }
    } catch (err) {
      console.error("Delete material error:", err);
    }
  }

  // Handle CSV Download Sample Template
  function handleDownloadSampleCsv() {
    const csvContent =
      "questionNumber,questionText,optionA,optionB,optionC,optionD,correctOption,explanation\n" +
      '1,"Which is the highest peak of the Karakoram range in Pakistan?","Nanga Parbat","K2 (Godwin Austen)","Broad Peak","Tirich Mir","B","K2 is 8611 meters high and the second highest peak on Earth."\n' +
      '2,"The Objective Resolution was passed by Constituent Assembly on:","March 12, 1949","August 14, 1947","March 23, 1940","October 16, 1951","A","Liaquat Ali Khan presented the historic Objectives Resolution."\n' +
      '3,"Which vitamin is synthesized in the human body through sunlight exposure?","Vitamin A","Vitamin C","Vitamin D","Vitamin B12","C","Skin synthesizes Vitamin D when exposed to UVB rays in sunlight."\n' +
      '4,"Who invented the World Wide Web (WWW)?","Bill Gates","Steve Jobs","Tim Berners-Lee","Alan Turing","C","British scientist Sir Tim Berners-Lee invented WWW in 1989 at CERN."\n' +
      '5,"Which is the smallest continent by land area?","Europe","Antarctica","Australia (Oceania)","South America","C","Australia is the smallest continent by land area (~7.69 million sq km)."';

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `parho_${courseId}_quiz_template.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Robust CSV parser supporting quotes & commas
  function parseCsvContent(text: string): ParsedRow[] {
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) {
      throw new Error("CSV file must have a header row and at least one question row.");
    }

    // Split CSV line respecting double quotes
    function parseCsvLine(line: string): string[] {
      const result: string[] = [];
      let current = "";
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          if (inQuotes && line[i + 1] === '"') {
            current += '"';
            i++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (char === "," && !inQuotes) {
          result.push(current.trim());
          current = "";
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    }

    const header = parseCsvLine(lines[0]).map((h) => h.toLowerCase().replace(/[^a-z0-9]/g, ""));
    const qIndex = header.findIndex((h) => h.includes("question") && !h.includes("number"));
    const aIndex = header.findIndex((h) => h.includes("optiona"));
    const bIndex = header.findIndex((h) => h.includes("optionb"));
    const cIndex = header.findIndex((h) => h.includes("optionc"));
    const dIndex = header.findIndex((h) => h.includes("optiond"));
    const correctIndex = header.findIndex((h) => h.includes("correct") || h.includes("answer"));
    const expIndex = header.findIndex((h) => h.includes("explanation"));

    if (qIndex === -1 || aIndex === -1 || bIndex === -1 || cIndex === -1 || dIndex === -1 || correctIndex === -1) {
      throw new Error("CSV missing required columns: questionText, optionA, optionB, optionC, optionD, correctOption.");
    }

    const rows: ParsedRow[] = [];
    for (let i = 1; i < lines.length; i++) {
      const parts = parseCsvLine(lines[i]);
      if (parts.length < 6) continue;

      const questionText = parts[qIndex];
      const optionA = parts[aIndex];
      const optionB = parts[bIndex];
      const optionC = parts[cIndex];
      const optionD = parts[dIndex];
      const correctOption = parts[correctIndex].toUpperCase().trim();
      const explanation = expIndex >= 0 ? parts[expIndex] : undefined;

      if (!questionText || !optionA || !optionB || !optionC || !optionD || !correctOption) {
        throw new Error(`Row ${i} is missing required question data.`);
      }

      if (!["A", "B", "C", "D"].includes(correctOption)) {
        throw new Error(`Row ${i} correct option must be A, B, C, or D (Found '${correctOption}').`);
      }

      rows.push({
        questionNumber: i,
        questionText,
        optionA,
        optionB,
        optionC,
        optionD,
        correctOption,
        explanation,
        points: 1,
      });
    }

    if (rows.length === 0) {
      throw new Error("No valid MCQ questions found in CSV.");
    }

    return rows;
  }

  // Handle CSV File Selection
  function handleCsvFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCsvParseError(null);
    setImportSuccess(null);
    const file = e.target.files?.[0];
    if (!file) return;

    setCsvFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = parseCsvContent(text);
        setParsedQuestions(parsed);
      } catch (err: any) {
        setCsvParseError(err.message || "Failed to parse CSV file.");
        setParsedQuestions([]);
      }
    };
    reader.readAsText(file);
  }

  // Submit CSV Quiz Import
  async function handleImportQuiz() {
    if (!quizMeta.title.trim()) {
      alert("Please provide a title for the new quiz.");
      return;
    }
    if (parsedQuestions.length === 0) {
      alert("Please upload and validate a CSV containing MCQs first.");
      return;
    }

    try {
      setImportingQuiz(true);
      const res = await fetch("/api/admin/quizzes/import-csv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          courseName: course?.name,
          subjectId: quizMeta.subjectId,
          subjectName: quizMeta.subjectName,
          title: quizMeta.title.trim(),
          description: quizMeta.description.trim(),
          timeLimitMinutes: quizMeta.timeLimitMinutes,
          passingPercentage: quizMeta.passingPercentage,
          questions: parsedQuestions,
        }),
      });

      const data = await res.json();
      if (data.success && data.data?.quiz) {
        setQuizzes((prev) => [data.data.quiz, ...prev]);
        setImportSuccess(`Successfully imported '${data.data.quiz.title}' with ${parsedQuestions.length} MCQs!`);
        setTimeout(() => {
          setIsCsvModalOpen(false);
          setImportSuccess(null);
          setParsedQuestions([]);
          setCsvFile(null);
          setQuizMeta((prev) => ({ ...prev, title: "", description: "" }));
        }, 1500);
      } else {
        alert(data.message || "Failed to import quiz from CSV.");
      }
    } catch (err) {
      console.error("Quiz import error:", err);
      alert("Error importing quiz.");
    } finally {
      setImportingQuiz(false);
    }
  }

  async function handleDeleteQuiz(quizId: string) {
    if (!confirm("Are you sure you want to delete this quiz?")) return;
    try {
      const res = await fetch(`/api/admin/quizzes/${quizId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
      }
    } catch (err) {
      console.error("Delete quiz error:", err);
    }
  }

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-sm font-semibold text-slate-500 shadow-sm">
        Loading course curriculum, notes and quiz engine...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
        <h2 className="text-xl font-bold">Course Not Found</h2>
        <p className="mt-2 text-sm">Could not locate course with ID '{courseId}'.</p>
        <Link href="/admin/courses" className="mt-4 inline-block font-bold underline">
          ← Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Course Hero Banner */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-xl font-black text-white shadow-lg shadow-blue-500/20">
              {course.imageLabel || course.id.toUpperCase()}
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href="/admin/courses"
                  className="text-xs font-bold text-slate-400 hover:text-blue-600"
                >
                  Courses
                </Link>
                <span className="text-xs text-slate-300">/</span>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  {course.id}
                </span>
                {course.badge && (
                  <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-blue-700">
                    {course.badge}
                  </span>
                )}
                {course.discountLabel && (
                  <span className="rounded-full bg-amber-500 px-2.5 py-0.5 text-[10px] font-black text-white">
                    🔥 {course.discountLabel}
                  </span>
                )}
              </div>

              <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                {course.name}
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-2xl">
                {course.description}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/student/courses/${course.id}`}
              target="_blank"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
            >
              <span>👁 Student View</span>
            </Link>
            <Link
              href={`/student/quizzes?course=${course.id}`}
              target="_blank"
              className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700 transition hover:bg-blue-100"
            >
              <span>⚡ Practice Quizzes</span>
            </Link>
            <button
              type="button"
              onClick={handleDeleteEntireCourse}
              className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50/50 px-3.5 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100"
              title="Delete this entire course package"
            >
              <span>🗑 Delete Course</span>
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 pt-6 sm:grid-cols-4">
          <div>
            <span className="text-[11px] font-bold uppercase text-slate-400">Enrolled Price</span>
            <p className="mt-1 text-xl font-black text-slate-900">Rs. {course.price?.toLocaleString()}</p>
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase text-slate-400">Total Subjects</span>
            <p className="mt-1 text-xl font-black text-slate-900">{course.subjects?.length || 0} Modules</p>
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase text-slate-400">Teaching Materials</span>
            <p className="mt-1 text-xl font-black text-blue-600">{materials.length} PDF Notes</p>
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase text-slate-400">Active Quizzes</span>
            <p className="mt-1 text-xl font-black text-emerald-600">{quizzes.length} Quizzes</p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1.5 shadow-sm">
        <button
          type="button"
          onClick={() => setActiveTab("material")}
          className={`flex-1 rounded-xl py-3 text-xs sm:text-sm font-bold transition-all ${
            activeTab === "material"
              ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          📖 Teaching Material (Notes &amp; PDFs) ({materials.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("quizzes")}
          className={`flex-1 rounded-xl py-3 text-xs sm:text-sm font-bold transition-all ${
            activeTab === "quizzes"
              ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          📝 Quizzes &amp; CSV Ingestion ({quizzes.length})
        </button>
      </div>

      {/* TAB 1: TEACHING MATERIAL (NOTES & PDFS) */}
      {activeTab === "material" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-black text-slate-900">Course PDF Study Notes</h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Upload chapter PDFs, past paper digests, and high-yield study packages for enrolled students.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsMaterialModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700"
            >
              <span>+</span>
              <span>Upload Study Material (PDF)</span>
            </button>
          </div>

          {materials.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <span className="text-3xl">📂</span>
              <h4 className="mt-3 text-base font-bold text-slate-800">No Teaching Material Added Yet</h4>
              <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
                Start uploading PDF notes for this course so students can read them via the anti-piracy reader.
              </p>
              <button
                type="button"
                onClick={() => setIsMaterialModalOpen(true)}
                className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
              >
                + Upload First PDF Note
              </button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {materials.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <div>
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <span className="rounded-md bg-slate-900 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white">
                        {item.subjectName}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {item.r2Url || item.storageType === "r2" ? (
                          <span className="rounded-md bg-indigo-600 px-2 py-0.5 text-[10px] font-black text-white" title={item.r2Url}>
                            ⚡ Cloudflare R2
                          </span>
                        ) : null}
                        {item.isFreePreview ? (
                          <span className="rounded-md bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">
                            Free Preview
                          </span>
                        ) : (
                          <span className="rounded-md bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-800">
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
                      <span>Order #{item.order}</span>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">
                    <Link
                      href={`/student/notes/view/${courseId}/${item.subjectId}/${item.id}`}
                      target="_blank"
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <span>Read in Reader</span>
                      <span>→</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDeleteMaterial(item.id)}
                      className="rounded-lg p-1.5 text-xs text-red-500 hover:bg-red-50 hover:text-red-700 transition"
                      title="Delete material"
                    >
                      🗑 Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: QUIZZES & CSV INGESTION */}
      {activeTab === "quizzes" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-black text-slate-900">Course Practice Quizzes &amp; Tests</h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Create new model papers or bulk upload hundreds of MCQs instantly using CSV templates.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleDownloadSampleCsv}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                <span>📥</span>
                <span>Download Sample CSV Template</span>
              </button>

              <button
                type="button"
                onClick={() => setIsCsvModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700"
              >
                <span>➕</span>
                <span>Upload Quiz via CSV</span>
              </button>
            </div>
          </div>

          {quizzes.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <span className="text-3xl">📝</span>
              <h4 className="mt-3 text-base font-bold text-slate-800">No Quizzes Published Yet</h4>
              <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
                You can easily upload a complete quiz with questions, options, and explanations using a standard CSV file.
              </p>
              <button
                type="button"
                onClick={() => setIsCsvModalOpen(true)}
                className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
              >
                Upload First Quiz via CSV
              </button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {quizzes.map((q) => (
                <div
                  key={q.id}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-md bg-slate-900 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white">
                        {q.subjectName}
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
                      <span>Passing: {q.passingPercentage}%</span>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">
                    <Link
                      href={`/student/quizzes/${q.id}`}
                      target="_blank"
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <span>Take Quiz</span>
                      <span>→</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDeleteQuiz(q.id)}
                      className="rounded-lg p-1.5 text-xs text-red-500 hover:bg-red-50 hover:text-red-700 transition"
                      title="Delete quiz"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: UPLOAD STUDY MATERIAL */}
      {isMaterialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 overflow-y-auto">
          <div className="my-8 w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900">Upload Teaching Material</h3>
                <p className="text-xs text-slate-500">
                  Add PDF notes for students in {course.name}.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsMaterialModalOpen(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadMaterial} className="mt-6 space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Select Subject Module
                </label>
                <select
                  value={materialForm.subjectId}
                  onChange={(e) => {
                    const sub = course.subjects?.find((s) => s.id === e.target.value);
                    setMaterialForm((prev) => ({
                      ...prev,
                      subjectId: e.target.value,
                      subjectName: sub ? sub.name : e.target.value,
                    }));
                  }}
                  className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:border-blue-500 focus:outline-none"
                >
                  {course.subjects?.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Material / PDF Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. World Geography &amp; Straits Complete Notes 2026"
                  value={materialForm.title}
                  onChange={(e) => setMaterialForm((prev) => ({ ...prev, title: e.target.value }))}
                  className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Storage Method Toggle */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  PDF Delivery Method
                </label>
                <div className="mt-1.5 grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
                  <button
                    type="button"
                    onClick={() => setMaterialStorageMode("r2")}
                    className={`rounded-lg py-2 text-xs font-bold transition-all ${
                      materialStorageMode === "r2"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    ⚡ Cloudflare R2 / CDN Link (Shared)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMaterialStorageMode("file")}
                    className={`rounded-lg py-2 text-xs font-bold transition-all ${
                      materialStorageMode === "file"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    📁 Upload Local PDF File
                  </button>
                </div>
              </div>

              {/* R2 Link Input */}
              {materialStorageMode === "r2" ? (
                <div className="rounded-2xl border border-slate-300 bg-slate-100 p-4 space-y-3">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      Cloudflare R2 / S3 / CDN Public URL *
                    </label>
                    <input
                      type="url"
                      required={materialStorageMode === "r2"}
                      placeholder="e.g. https://pub-xxxx.r2.dev/notes/world-geography.pdf"
                      value={materialForm.r2Url}
                      onChange={(e) => setMaterialForm((prev) => ({ ...prev, r2Url: e.target.value }))}
                      className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:border-blue-500 focus:outline-none"
                    />
                    <p className="mt-1 text-[11px] text-slate-600">
                      💡 Zero redundant storage: Multiple courses (e.g., PPSC, PMS, FPSC) can link to this exact same file without re-uploading!
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      Approximate File Size
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2.4 MB"
                      value={materialForm.fileSize}
                      onChange={(e) => setMaterialForm((prev) => ({ ...prev, fileSize: e.target.value }))}
                      className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-900 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    PDF File Attachment
                  </label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-medium text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-blue-700"
                  />
                  <p className="mt-1 text-[11px] text-slate-400">
                    Drop an actual PDF file, or Parho will synthesize a standard study material template.
                  </p>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="previewCheck"
                  checked={materialForm.isFreePreview}
                  onChange={(e) =>
                    setMaterialForm((prev) => ({ ...prev, isFreePreview: e.target.checked }))
                  }
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="previewCheck" className="text-xs font-semibold text-slate-700">
                  Allow Free Preview (Prospective students can read sample pages before payment)
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsMaterialModalOpen(false)}
                  className="flex-1 rounded-xl border border-slate-300 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingMaterial}
                  className="flex-1 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 disabled:opacity-50"
                >
                  {uploadingMaterial ? "Uploading..." : "Save & Publish Material"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: BULK CSV QUIZ INGESTION */}
      {isCsvModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 overflow-y-auto">
          <div className="my-8 w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900">Upload &amp; Ingest Quiz via CSV</h3>
                <p className="text-xs text-slate-500">
                  Import multiple-choice questions with 4 options, answer keys, and explanations.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCsvModalOpen(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            {importSuccess ? (
              <div className="my-8 rounded-2xl bg-emerald-50 border border-emerald-200 p-6 text-center text-emerald-800">
                <span className="text-4xl">🎉</span>
                <h4 className="mt-2 text-lg font-bold">{importSuccess}</h4>
                <p className="text-xs text-emerald-600 mt-1">
                  Quiz is immediately published and playable by students!
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-5">
                {/* Step 1: Quiz Details */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Quiz Title
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. October 2026 Model Paper 1"
                      value={quizMeta.title}
                      onChange={(e) => setQuizMeta((prev) => ({ ...prev, title: e.target.value }))}
                      className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Target Subject
                    </label>
                    <select
                      value={quizMeta.subjectId}
                      onChange={(e) => {
                        const sub = course.subjects?.find((s) => s.id === e.target.value);
                        setQuizMeta((prev) => ({
                          ...prev,
                          subjectId: e.target.value,
                          subjectName: sub ? sub.name : e.target.value,
                        }));
                      }}
                      className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:border-blue-500 focus:outline-none"
                    >
                      {course.subjects?.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Time Limit (Minutes)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={180}
                      value={quizMeta.timeLimitMinutes}
                      onChange={(e) =>
                        setQuizMeta((prev) => ({ ...prev, timeLimitMinutes: Number(e.target.value) }))
                      }
                      className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Passing Percentage (%)
                    </label>
                    <input
                      type="number"
                      min={10}
                      max={100}
                      value={quizMeta.passingPercentage}
                      onChange={(e) =>
                        setQuizMeta((prev) => ({ ...prev, passingPercentage: Number(e.target.value) }))
                      }
                      className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Step 2: CSV File Upload and Sample Download */}
                <div className="rounded-2xl border border-slate-300 bg-slate-100 p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                        CSV MCQ Template &amp; Formatting
                      </h4>
                      <p className="text-xs text-slate-600">
                        Columns required: <code className="font-mono bg-white border border-slate-300 px-1.5 py-0.5 rounded font-bold text-slate-900">questionText, optionA, optionB, optionC, optionD, correctOption, explanation</code>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleDownloadSampleCsv}
                      className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 hover:bg-slate-50"
                    >
                      📥 Download Template CSV
                    </button>
                  </div>

                  <div className="mt-3">
                    <input
                      type="file"
                      accept=".csv,text/csv"
                      onChange={handleCsvFileChange}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-600 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white"
                    />
                  </div>

                  {csvParseError && (
                    <div className="mt-2 text-xs font-bold text-red-600">
                      ⚠️ {csvParseError}
                    </div>
                  )}
                </div>

                {/* Step 3: Live Preview Table */}
                {parsedQuestions.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Live Preview ({parsedQuestions.length} Questions Ready to Ingest)
                      </h4>
                      <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                        ✓ Format Validated
                      </span>
                    </div>

                    <div className="mt-2 max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-2 space-y-2">
                      {parsedQuestions.map((q) => (
                        <div
                          key={q.questionNumber}
                          className="rounded-lg border border-slate-200 bg-white p-3 text-xs"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-bold text-slate-900">
                              Q{q.questionNumber}. {q.questionText}
                            </span>
                            <span className="rounded bg-emerald-600 px-2 py-0.5 text-[10px] font-black text-white">
                              Ans: {q.correctOption}
                            </span>
                          </div>

                          <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                            <div className={q.correctOption === "A" ? "font-bold text-emerald-700" : ""}>
                              A) {q.optionA}
                            </div>
                            <div className={q.correctOption === "B" ? "font-bold text-emerald-700" : ""}>
                              B) {q.optionB}
                            </div>
                            <div className={q.correctOption === "C" ? "font-bold text-emerald-700" : ""}>
                              C) {q.optionC}
                            </div>
                            <div className={q.correctOption === "D" ? "font-bold text-emerald-700" : ""}>
                              D) {q.optionD}
                            </div>
                          </div>

                          {q.explanation && (
                            <p className="mt-1.5 text-[11px] text-slate-400 italic">
                              💡 {q.explanation}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 4: Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsCsvModalOpen(false)}
                    className="flex-1 rounded-xl border border-slate-300 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={importingQuiz || parsedQuestions.length === 0 || !quizMeta.title.trim()}
                    onClick={handleImportQuiz}
                    className="flex-1 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 disabled:opacity-50"
                  >
                    {importingQuiz
                      ? "Ingesting MCQs..."
                      : `Confirm & Import ${parsedQuestions.length} MCQs to Course`}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
