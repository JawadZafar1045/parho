import { connectToDatabase } from "@/lib/db/mongodb";
import { Course as CourseModel, type ICourse } from "@/models/Course";
import type { Course } from "@/features/courses/types";

// In-memory courses registry with realistic Pakistani competitive exam tracks & discounts
const memoryCourses: Course[] = [
  {
    id: "ppsc",
    name: "PPSC Preparation",
    status: "Active",
    imageLabel: "PPSC",
    badge: "Most Popular",
    price: 1500,
    originalPrice: 3000,
    discountPercent: 50,
    discountLabel: "50% OFF - Limited Time",
    description: "Complete structured study notes, past papers, and practice quizzes for Punjab Public Service Commission exams.",
    features: [
      "All 7 Compulsory & General Subjects Covered",
      "Over 24 Verified High-Yield PDF Notes",
      "Timed Exam Simulator with Answer Explanations",
      "Watermarked Anti-Piracy In-App PDF Reader",
      "Lifetime Revision Updates & Model Papers",
    ],
    subjectCount: 7,
    pdfCount: 24,
    quizCount: 10,
    progressPercent: 68,
    accentColor: "from-blue-600 to-indigo-600",
    logoTone: "bg-blue-50 text-blue-700 border-blue-200",
    notesRoute: "/student/notes?course=ppsc",
    quizRoute: "/student/quizzes?course=ppsc",
    subjects: [
      { id: "general-knowledge", name: "General Knowledge", description: "World history, geography, and international bodies" },
      { id: "pakistan-affairs", name: "Pakistan Affairs", description: "Constitutional history and governance" },
      { id: "english", name: "English", description: "Grammar, vocabulary, and idioms" },
      { id: "current-affairs", name: "Current Affairs", description: "National and global monthly briefs" },
      { id: "islamic-studies", name: "Islamic Studies", description: "Quran, Hadith, and Islamic history" },
      { id: "everyday-science", name: "Everyday Science", description: "Physical and environmental science concepts" },
      { id: "basic-mathematics", name: "Basic Mathematics", description: "Arithmetic, ratios, and quantitative reasoning" },
    ],
  },
  {
    id: "fpsc",
    name: "FPSC Preparation",
    status: "Active",
    imageLabel: "FPSC",
    badge: "Federal Tests",
    price: 1500,
    originalPrice: 3000,
    discountPercent: 50,
    discountLabel: "50% OFF",
    description: "Comprehensive study guides and MCQs for Federal Public Service Commission examinations.",
    features: [
      "Federal Pattern General Knowledge & Geography",
      "English Sentence Completion & Error Spotting",
      "Computer Science & IT Fundamentals",
      "Full Timed Practice Quizzes",
    ],
    subjectCount: 3,
    pdfCount: 12,
    quizCount: 6,
    progressPercent: 42,
    accentColor: "from-emerald-600 to-teal-600",
    logoTone: "bg-emerald-50 text-emerald-700 border-emerald-200",
    notesRoute: "/student/notes?course=fpsc",
    quizRoute: "/student/quizzes?course=fpsc",
    subjects: [
      { id: "general-knowledge", name: "General Knowledge", description: "World knowledge and geography" },
      { id: "current-affairs", name: "Current Affairs", description: "National and international affairs" },
      { id: "computer-science", name: "Computer Science", description: "IT fundamentals and office tools" },
    ],
  },
  {
    id: "css",
    name: "CSS Preparation",
    status: "Active",
    imageLabel: "CSS",
    badge: "Elite Track",
    price: 2500,
    originalPrice: 5000,
    discountPercent: 50,
    discountLabel: "50% OFF - Mega Package",
    description: "Compulsory subjects study materials and model tests for Central Superior Services aspirants.",
    features: [
      "English Précis & Composition High-Yield Vocabulary",
      "Pakistan Affairs & Current Affairs Analytical Outlines",
      "Islamic Studies Contemporary Perspectives",
      "Mock Paper Evaluations & Model Essays",
    ],
    subjectCount: 3,
    pdfCount: 18,
    quizCount: 8,
    progressPercent: 30,
    accentColor: "from-purple-600 to-indigo-600",
    logoTone: "bg-purple-50 text-purple-700 border-purple-200",
    notesRoute: "/student/notes?course=css",
    quizRoute: "/student/quizzes?course=css",
    subjects: [
      { id: "english", name: "English Précis & Composition", description: "Grammar, précis, and idioms" },
      { id: "current-affairs", name: "Current Affairs", description: "National and international briefs" },
      { id: "islamic-studies", name: "Islamic Studies", description: "Ideology and contemporary issues" },
    ],
  },
  {
    id: "pms",
    name: "PMS Preparation",
    status: "Active",
    imageLabel: "PMS",
    badge: "Provincial",
    price: 2000,
    originalPrice: 4000,
    discountPercent: 50,
    discountLabel: "50% OFF",
    description: "Provincial Management Service exam preparation with structured notes and past paper solutions.",
    features: [
      "Complete General Knowledge & Geography",
      "Pakistan Affairs Comprehensive Outlines",
      "Essay Writing Frameworks & Outlines",
    ],
    subjectCount: 3,
    pdfCount: 14,
    quizCount: 5,
    progressPercent: 20,
    accentColor: "from-amber-600 to-orange-600",
    logoTone: "bg-amber-50 text-amber-700 border-amber-200",
    notesRoute: "/student/notes?course=pms",
    quizRoute: "/student/quizzes?course=pms",
    subjects: [
      { id: "general-knowledge", name: "General Knowledge", description: "World GK and geography" },
      { id: "pakistan-affairs", name: "Pakistan Affairs", description: "Constitutional history" },
      { id: "essay-writing", name: "Essay Writing", description: "Outlines and structure guides" },
    ],
  },
  {
    id: "nts",
    name: "NTS Preparation",
    status: "Active",
    imageLabel: "NTS",
    badge: "Educators & Jobs",
    price: 1200,
    originalPrice: 2400,
    discountPercent: 50,
    discountLabel: "50% OFF",
    description: "Focused notes & practice quizzes for NAT, GAT, and provincial Educator job examinations.",
    features: [
      "Verbal Reasoning & Grammar Rules",
      "Analytical Reasoning Step-by-Step Problem Solving",
      "Quantitative Reasoning & Math Shortcuts",
    ],
    subjectCount: 3,
    pdfCount: 10,
    quizCount: 6,
    progressPercent: 15,
    accentColor: "from-sky-600 to-blue-600",
    logoTone: "bg-sky-50 text-sky-700 border-sky-200",
    notesRoute: "/student/notes?course=nts",
    quizRoute: "/student/quizzes?course=nts",
    subjects: [
      { id: "verbal-reasoning", name: "Verbal Reasoning", description: "Grammar and reading comprehension" },
      { id: "analytical-reasoning", name: "Analytical Reasoning", description: "Logic puzzles and scenarios" },
      { id: "quantitative-reasoning", name: "Quantitative Reasoning", description: "Maths and arithmetic" },
    ],
  },
];

export async function getAllCourses(): Promise<Course[]> {
  try {
    await connectToDatabase();
    const dbCourses = await CourseModel.find({ isPublished: true }).lean();
    if (dbCourses.length > 0) {
      return dbCourses.map((c) => ({
        id: c.courseId,
        name: c.name,
        status: "Active",
        imageLabel: c.imageLabel || c.courseId.toUpperCase(),
        description: c.description,
        price: c.price,
        originalPrice: c.originalPrice || c.price * 2,
        discountPercent: c.discountPercent || (c.originalPrice ? Math.round(((c.originalPrice - c.price) / c.originalPrice) * 100) : 50),
        discountLabel: c.discountLabel || "50% OFF",
        badge: c.badge,
        features: c.features || ["Verified PDF Notes", "Timed Mock Tests", "Answer Explanations"],
        notesRoute: `/student/notes?course=${c.courseId}`,
        quizRoute: `/student/quizzes?course=${c.courseId}`,
        subjectCount: c.subjects?.length || 0,
        pdfCount: (c.subjects?.length || 0) * 3,
        quizCount: 5,
        progressPercent: 50,
        subjects: c.subjects || [],
      }));
    }
  } catch (err) {
    // Fall back to memory courses
  }

  return memoryCourses;
}

export async function getCourseById(courseId: string): Promise<Course | undefined> {
  const all = await getAllCourses();
  return all.find((c) => c.id === courseId);
}

export async function createCourse(data: {
  courseId: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discountLabel?: string;
  badge?: string;
  imageLabel?: string;
  subjects?: { id: string; name: string; description?: string }[];
  features?: string[];
}): Promise<Course> {
  const cleanId = data.courseId.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");
  const originalPrice = data.originalPrice || data.price * 2;
  const discountPercent = originalPrice > data.price ? Math.round(((originalPrice - data.price) / originalPrice) * 100) : 0;
  const discountLabel = data.discountLabel || (discountPercent > 0 ? `${discountPercent}% OFF` : "");
  const imageLabel = data.imageLabel || cleanId.toUpperCase().slice(0, 5);

  const newCourse: Course = {
    id: cleanId,
    name: data.name.trim(),
    status: "Active",
    imageLabel,
    badge: data.badge,
    price: data.price,
    originalPrice,
    discountPercent,
    discountLabel,
    description: data.description.trim(),
    features: data.features || ["Verified Study PDFs", "Timed Practice Quizzes", "Explaining Answers"],
    subjectCount: data.subjects?.length || 0,
    pdfCount: (data.subjects?.length || 0) * 3,
    quizCount: 5,
    progressPercent: 0,
    notesRoute: `/student/notes?course=${cleanId}`,
    quizRoute: `/student/quizzes?course=${cleanId}`,
    subjects: data.subjects || [],
  };

  // Add to memory list
  const existingIdx = memoryCourses.findIndex((c) => c.id === cleanId);
  if (existingIdx >= 0) {
    memoryCourses[existingIdx] = newCourse;
  } else {
    memoryCourses.push(newCourse);
  }

  // Persist to MongoDB
  try {
    await connectToDatabase();
    await CourseModel.findOneAndUpdate(
      { courseId: cleanId },
      {
        courseId: cleanId,
        name: newCourse.name,
        description: newCourse.description,
        price: newCourse.price,
        originalPrice: newCourse.originalPrice,
        discountPercent: newCourse.discountPercent,
        discountLabel: newCourse.discountLabel,
        imageLabel: newCourse.imageLabel,
        badge: newCourse.badge,
        features: newCourse.features,
        subjects: newCourse.subjects,
        isPublished: true,
      },
      { upsert: true, new: true }
    );
  } catch (err) {
    console.warn("MongoDB course upsert skipped:", err);
  }

  return newCourse;
}

export async function updateCourse(
  courseId: string,
  data: Partial<Course>
): Promise<Course | null> {
  const cleanId = courseId.trim().toLowerCase();
  const existing = memoryCourses.find((c) => c.id === cleanId);

  const price = data.price !== undefined ? data.price : existing?.price || 1500;
  const originalPrice = data.originalPrice !== undefined ? data.originalPrice : existing?.originalPrice || 3000;
  const discountPercent = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  const discountLabel = data.discountLabel || (discountPercent > 0 ? `${discountPercent}% OFF` : "");

  const updated: Course = {
    ...(existing || {
      id: cleanId,
      name: data.name || cleanId,
      status: "Active",
      imageLabel: cleanId.toUpperCase(),
    }),
    ...data,
    id: cleanId,
    name: data.name || existing?.name || cleanId,
    price,
    originalPrice,
    discountPercent,
    discountLabel,
  };

  const idx = memoryCourses.findIndex((c) => c.id === cleanId);
  if (idx >= 0) {
    memoryCourses[idx] = updated;
  } else {
    memoryCourses.push(updated);
  }

  // Update in MongoDB
  try {
    await connectToDatabase();
    await CourseModel.findOneAndUpdate(
      { courseId: cleanId },
      {
        name: updated.name,
        description: updated.description,
        price: updated.price,
        originalPrice: updated.originalPrice,
        discountPercent: updated.discountPercent,
        discountLabel: updated.discountLabel,
        badge: updated.badge,
        imageLabel: updated.imageLabel,
        features: updated.features,
        subjects: updated.subjects,
      },
      { upsert: true }
    );
  } catch (err) {
    console.warn("MongoDB course update skipped:", err);
  }

  return updated;
}

/**
 * Delete a course by its ID
 */
export async function deleteCourse(courseId: string): Promise<boolean> {
  const cleanId = courseId.trim().toLowerCase();
  const idx = memoryCourses.findIndex((c) => c.id === cleanId);
  if (idx >= 0) {
    memoryCourses.splice(idx, 1);
  }

  try {
    await connectToDatabase();
    await CourseModel.findOneAndDelete({ courseId: cleanId });
  } catch (err) {
    console.warn("MongoDB course delete skipped:", err);
  }

  return true;
}

