import fs from "node:fs";
import path from "node:path";
import { connectToDatabase } from "@/lib/db/mongodb";
import { Note as NoteModel, type INote } from "@/models/Note";
import { courseMaterials } from "@/features/notes/data";

export interface StoredMaterial {
  id: string;
  courseId: string;
  subjectId: string;
  subjectName: string;
  title: string;
  fileName: string;
  fileSize: string;
  isFreePreview: boolean;
  order: number;
  r2Url?: string;
  storageType?: "local" | "r2";
  createdAt: string;
}

// Initial memory store loaded from existing sample materials
const memoryMaterials: StoredMaterial[] = [
  // PPSC
  { id: "ppsc-gk-1", courseId: "ppsc", subjectId: "general-knowledge", subjectName: "General Knowledge", title: "World Geography, Capitals & Treaties", fileName: "ppsc-gk-1.pdf", fileSize: "2.4 MB", isFreePreview: true, order: 1, createdAt: "2026-03-01T10:00:00Z" },
  { id: "ppsc-gk-2", courseId: "ppsc", subjectId: "general-knowledge", subjectName: "General Knowledge", title: "International Organizations & Summits", fileName: "ppsc-gk-2.pdf", fileSize: "3.1 MB", isFreePreview: false, order: 2, createdAt: "2026-03-05T10:00:00Z" },
  { id: "ppsc-gk-3", courseId: "ppsc", subjectId: "general-knowledge", subjectName: "General Knowledge", title: "Famous Personalities & Discoveries", fileName: "ppsc-gk-3.pdf", fileSize: "1.8 MB", isFreePreview: false, order: 3, createdAt: "2026-03-10T10:00:00Z" },
  { id: "ppsc-pa-1", courseId: "ppsc", subjectId: "pakistan-affairs", subjectName: "Pakistan Affairs", title: "Pre-Partition Struggle (1857 - 1947)", fileName: "ppsc-pa-1.pdf", fileSize: "2.8 MB", isFreePreview: true, order: 1, createdAt: "2026-03-02T10:00:00Z" },
  { id: "ppsc-pa-2", courseId: "ppsc", subjectId: "pakistan-affairs", subjectName: "Pakistan Affairs", title: "Constitutional Development & 1973 Constitution", fileName: "ppsc-pa-2.pdf", fileSize: "3.4 MB", isFreePreview: false, order: 2, createdAt: "2026-03-08T10:00:00Z" },
  { id: "ppsc-eng-1", courseId: "ppsc", subjectId: "english", subjectName: "English", title: "High-Frequency Vocabulary & Synonyms", fileName: "ppsc-eng-1.pdf", fileSize: "1.9 MB", isFreePreview: true, order: 1, createdAt: "2026-03-03T10:00:00Z" },
  { id: "ppsc-eng-2", courseId: "ppsc", subjectId: "english", subjectName: "English", title: "Common Grammatical Errors & Idioms", fileName: "ppsc-eng-2.pdf", fileSize: "2.2 MB", isFreePreview: false, order: 2, createdAt: "2026-03-11T10:00:00Z" },
  { id: "ppsc-ca-1", courseId: "ppsc", subjectId: "current-affairs", subjectName: "Current Affairs", title: "National Political & Economic Briefs 2026", fileName: "ppsc-ca-1.pdf", fileSize: "2.1 MB", isFreePreview: true, order: 1, createdAt: "2026-03-15T10:00:00Z" },
  { id: "ppsc-ca-2", courseId: "ppsc", subjectId: "current-affairs", subjectName: "Current Affairs", title: "Foreign Policy & Middle East Geopolitics", fileName: "ppsc-ca-2.pdf", fileSize: "2.6 MB", isFreePreview: false, order: 2, createdAt: "2026-03-20T10:00:00Z" },

  // FPSC
  { id: "fpsc-gk-1", courseId: "fpsc", subjectId: "general-knowledge", subjectName: "General Knowledge", title: "Federal Standard GK & Everyday Facts", fileName: "fpsc-gk-1.pdf", fileSize: "2.4 MB", isFreePreview: true, order: 1, createdAt: "2026-03-04T10:00:00Z" },
  { id: "fpsc-ca-1", courseId: "fpsc", subjectId: "current-affairs", subjectName: "Current Affairs", title: "Global Summits & Economic Indices", fileName: "fpsc-ca-1.pdf", fileSize: "2.1 MB", isFreePreview: false, order: 1, createdAt: "2026-03-12T10:00:00Z" },
  { id: "fpsc-cs-1", courseId: "fpsc", subjectId: "computer-science", subjectName: "Computer Science", title: "MS Office & IT Concepts for Federal Tests", fileName: "fpsc-cs-1.pdf", fileSize: "2.5 MB", isFreePreview: true, order: 1, createdAt: "2026-03-16T10:00:00Z" },

  // PMS
  { id: "pms-gk-1", courseId: "pms", subjectId: "general-knowledge", subjectName: "General Knowledge", title: "Punjab History & Regional Governance", fileName: "pms-gk-1.pdf", fileSize: "2.4 MB", isFreePreview: true, order: 1, createdAt: "2026-03-05T10:00:00Z" },
  { id: "pms-pa-1", courseId: "pms", subjectId: "pakistan-affairs", subjectName: "Pakistan Affairs", title: "Post-Independence Economic Crises & Solutions", fileName: "pms-pa-1.pdf", fileSize: "2.8 MB", isFreePreview: false, order: 1, createdAt: "2026-03-14T10:00:00Z" },
  { id: "pms-essay-1", courseId: "pms", subjectId: "essay-writing", subjectName: "Essay Writing", title: "Model Essay Outlines & Argument Structuring", fileName: "pms-essay-1.pdf", fileSize: "1.9 MB", isFreePreview: true, order: 1, createdAt: "2026-03-18T10:00:00Z" },

  // CSS
  { id: "css-eng-1", courseId: "css", subjectId: "english", subjectName: "English", title: "Precis Writing & Comprehension Techniques", fileName: "css-eng-1.pdf", fileSize: "1.9 MB", isFreePreview: true, order: 1, createdAt: "2026-03-06T10:00:00Z" },
  { id: "css-ca-1", courseId: "css", subjectId: "current-affairs", subjectName: "Current Affairs", title: "Strategic Nuclear Dynamics in South Asia", fileName: "css-ca-1.pdf", fileSize: "2.1 MB", isFreePreview: false, order: 1, createdAt: "2026-03-15T10:00:00Z" },
  { id: "css-isl-1", courseId: "css", subjectId: "islamic-studies", subjectName: "Islamic Studies", title: "Governance in Seerah & Contemporary Challenges", fileName: "css-isl-1.pdf", fileSize: "2.5 MB", isFreePreview: true, order: 1, createdAt: "2026-03-22T10:00:00Z" },
];

/**
 * Sync memory materials into features/notes/data.ts structure
 */
function syncWithNotesCatalog(material: StoredMaterial) {
  const course = courseMaterials.find((c) => c.courseId === material.courseId);
  if (!course) {
    courseMaterials.push({
      courseId: material.courseId,
      subjects: [
        {
          id: material.subjectId,
          name: material.subjectName,
          pdfs: [{ id: material.id, title: material.title, size: material.fileSize }],
        },
      ],
    });
    return;
  }

  let subject = course.subjects.find((s) => s.id === material.subjectId);
  if (!subject) {
    subject = {
      id: material.subjectId,
      name: material.subjectName,
      pdfs: [],
    };
    course.subjects.push(subject);
  }

  const existingPdfIndex = subject.pdfs.findIndex((p) => p.id === material.id);
  if (existingPdfIndex >= 0) {
    subject.pdfs[existingPdfIndex] = { id: material.id, title: material.title, size: material.fileSize };
  } else {
    subject.pdfs.push({ id: material.id, title: material.title, size: material.fileSize });
  }
}

/**
 * Get all materials or materials for a specific course
 */
export async function getMaterials(courseId?: string): Promise<StoredMaterial[]> {
  try {
    const isConnected = await connectToDatabase();
    if (isConnected) {
      const query = courseId ? { courseId } : {};
      const docs = await NoteModel.find(query).sort({ courseId: 1, subjectId: 1, order: 1 }).lean();
      if (docs && docs.length > 0) {
        return docs.map((doc: any) => ({
          id: doc._id.toString(),
          courseId: doc.courseId,
          subjectId: doc.subjectId,
          subjectName: doc.subjectId.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
          title: doc.title,
          fileName: doc.fileName,
          fileSize: doc.fileSize || "1.5 MB",
          isFreePreview: Boolean(doc.isFreePreview),
          order: doc.order || 1,
          createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
        }));
      }
    }
  } catch (err) {
    console.warn("MongoDB unavailable for materials, using in-memory store:", err);
  }

  if (courseId) {
    return memoryMaterials.filter((m) => m.courseId === courseId);
  }
  return [...memoryMaterials];
}

/**
 * Add a new teaching material / PDF note
 */
export async function addMaterial(input: {
  courseId: string;
  subjectId: string;
  subjectName: string;
  title: string;
  fileName?: string;
  fileSize?: string;
  isFreePreview?: boolean;
  fileBuffer?: Buffer;
  r2Url?: string;
  storageType?: "local" | "r2";
}): Promise<StoredMaterial> {
  const cleanCourseId = input.courseId.trim().toLowerCase();
  const cleanSubjectId = input.subjectId.trim().toLowerCase().replace(/[^a-z0-9]/g, "-");
  const cleanSubjectName = input.subjectName.trim() || cleanSubjectId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const id = `${cleanCourseId}-${cleanSubjectId}-${Date.now().toString(36)}`;
  const fileName = input.fileName || `${id}.pdf`;
  const fileSize = input.fileSize || "2.1 MB";
  const r2Url = input.r2Url ? input.r2Url.trim() : undefined;
  const storageType = r2Url ? "r2" : "local";

  const newMaterial: StoredMaterial = {
    id,
    courseId: cleanCourseId,
    subjectId: cleanSubjectId,
    subjectName: cleanSubjectName,
    title: input.title.trim(),
    fileName,
    fileSize,
    isFreePreview: Boolean(input.isFreePreview),
    order: memoryMaterials.filter((m) => m.courseId === cleanCourseId && m.subjectId === cleanSubjectId).length + 1,
    r2Url,
    storageType,
    createdAt: new Date().toISOString(),
  };

  // 1. If buffer provided, write to storage/notes
  if (input.fileBuffer) {
    try {
      const targetDir = path.join(process.cwd(), "storage", "notes", cleanCourseId, cleanSubjectId);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      fs.writeFileSync(path.join(targetDir, fileName), input.fileBuffer);
    } catch (fsErr) {
      console.warn("Could not write file to storage/notes directory:", fsErr);
    }
  }

  // 2. Add to in-memory store
  memoryMaterials.unshift(newMaterial);
  syncWithNotesCatalog(newMaterial);

  // 3. Try persisting to MongoDB
  try {
    const isConnected = await connectToDatabase();
    if (isConnected) {
      await NoteModel.create({
        courseId: cleanCourseId,
        subjectId: cleanSubjectId,
        title: newMaterial.title,
        fileName: newMaterial.fileName,
        fileUrl: r2Url || `/api/notes/${cleanCourseId}/${cleanSubjectId}/${newMaterial.id}`,
        fileSize: newMaterial.fileSize,
        order: newMaterial.order,
        isFreePreview: newMaterial.isFreePreview,
      });
    }
  } catch (dbErr) {
    console.warn("MongoDB could not save note, kept in memory:", dbErr);
  }

  return newMaterial;
}

export function getMaterialById(courseId: string, subjectId: string, pdfId: string): StoredMaterial | undefined {
  return memoryMaterials.find(
    (m) =>
      m.courseId === courseId &&
      m.subjectId === subjectId &&
      (m.id === pdfId || m.fileName === `${pdfId}.pdf` || m.id.endsWith(pdfId))
  );
}

/**
 * Delete a teaching material
 */
export async function deleteMaterial(id: string): Promise<boolean> {
  const index = memoryMaterials.findIndex((m) => m.id === id);
  if (index >= 0) {
    memoryMaterials.splice(index, 1);
  }

  try {
    const isConnected = await connectToDatabase();
    if (isConnected) {
      await NoteModel.findByIdAndDelete(id);
    }
  } catch (err) {
    console.warn("MongoDB delete note error:", err);
  }

  return true;
}
