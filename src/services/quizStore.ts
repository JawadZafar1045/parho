import { connectToDatabase } from "@/lib/db/mongodb";
import { Quiz as QuizModel } from "@/models/Quiz";
import { Question as QuestionModel } from "@/models/Question";
import { initialQuizzes } from "@/features/quizzes/data";
import type { QuizItem, QuizQuestion } from "@/features/quizzes/types";

export interface ParsedCsvQuestion {
  questionNumber: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string; // "A" | "B" | "C" | "D"
  explanation?: string;
  points?: number;
}

/**
 * Get all quizzes (optionally filtered by courseId)
 */
export async function getAllQuizzes(courseId?: string): Promise<QuizItem[]> {
  try {
    const isConnected = await connectToDatabase();
    if (isConnected) {
      const query = courseId ? { courseId } : {};
      const quizDocs = await QuizModel.find(query).sort({ createdAt: -1 }).lean();
      
      if (quizDocs && quizDocs.length > 0) {
        const quizzes: QuizItem[] = [];
        for (const doc of quizDocs as any[]) {
          const questionDocs = await QuestionModel.find({ quizId: doc.quizId })
            .sort({ questionNumber: 1 })
            .lean();

          quizzes.push({
            id: doc.quizId,
            courseId: doc.courseId,
            courseName: doc.courseId.toUpperCase() + " Preparation",
            subjectId: doc.subjectId,
            subjectName: doc.subjectId.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
            title: doc.title,
            description: doc.description || "",
            timeLimitMinutes: doc.timeLimitMinutes || 20,
            totalMarks: doc.totalMarks || questionDocs.length,
            passingPercentage: doc.passingPercentage || 50,
            questionCount: questionDocs.length,
            questions: questionDocs.map((q: any) => ({
              id: q._id.toString(),
              questionNumber: q.questionNumber,
              questionText: q.questionText,
              options: q.options,
              correctOptionKey: q.correctOptionKey,
              explanation: q.explanation || "",
              points: q.points || 1,
            })),
          });
        }
        return quizzes;
      }
    }
  } catch (err) {
    console.warn("MongoDB unavailable for quizzes, using in-memory store:", err);
  }

  if (courseId) {
    return initialQuizzes.filter((q) => q.courseId === courseId);
  }
  return [...initialQuizzes];
}

/**
 * Get a single quiz by ID
 */
export async function getQuizDetails(quizId: string, includeAnswers = true): Promise<QuizItem | undefined> {
  const memoryQuiz = initialQuizzes.find((q) => q.id === quizId);
  if (memoryQuiz) {
    if (includeAnswers) return memoryQuiz;
    return {
      ...memoryQuiz,
      questions: memoryQuiz.questions?.map((q) => ({
        ...q,
        correctOptionKey: undefined,
        explanation: undefined,
      })),
    };
  }

  try {
    const isConnected = await connectToDatabase();
    if (isConnected) {
      const quizDoc = await QuizModel.findOne({ quizId }).lean();
      if (quizDoc) {
        const questionDocs = await QuestionModel.find({ quizId }).sort({ questionNumber: 1 }).lean();
        return {
          id: (quizDoc as any).quizId,
          courseId: (quizDoc as any).courseId,
          courseName: (quizDoc as any).courseId.toUpperCase() + " Preparation",
          subjectId: (quizDoc as any).subjectId,
          subjectName: (quizDoc as any).subjectId.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
          title: (quizDoc as any).title,
          description: (quizDoc as any).description || "",
          timeLimitMinutes: (quizDoc as any).timeLimitMinutes || 20,
          totalMarks: (quizDoc as any).totalMarks || questionDocs.length,
          passingPercentage: (quizDoc as any).passingPercentage || 50,
          questionCount: questionDocs.length,
          questions: questionDocs.map((q: any) => ({
            id: q._id.toString(),
            questionNumber: q.questionNumber,
            questionText: q.questionText,
            options: q.options,
            correctOptionKey: includeAnswers ? q.correctOptionKey : undefined,
            explanation: includeAnswers ? q.explanation : undefined,
            points: q.points || 1,
          })),
        };
      }
    }
  } catch (err) {
    console.warn("MongoDB getQuizDetails error:", err);
  }

  return undefined;
}

/**
 * Create a new quiz with parsed CSV questions
 */
export async function createQuizFromCsv(input: {
  courseId: string;
  courseName?: string;
  subjectId: string;
  subjectName?: string;
  title: string;
  description?: string;
  timeLimitMinutes?: number;
  passingPercentage?: number;
  questions: ParsedCsvQuestion[];
}): Promise<QuizItem> {
  const cleanCourseId = input.courseId.trim().toLowerCase();
  const cleanSubjectId = input.subjectId.trim().toLowerCase().replace(/[^a-z0-9]/g, "-");
  const cleanCourseName = input.courseName || cleanCourseId.toUpperCase() + " Preparation";
  const cleanSubjectName = input.subjectName || cleanSubjectId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  
  const quizId = `${cleanCourseId}-${cleanSubjectId}-${Date.now().toString(36)}`;
  const timeLimit = Number(input.timeLimitMinutes) || 15;
  const passingScore = Number(input.passingPercentage) || 50;

  // Format questions into QuizQuestion interface
  const formattedQuestions: QuizQuestion[] = input.questions.map((q, idx) => ({
    id: `${quizId}-q${idx + 1}`,
    questionNumber: idx + 1,
    questionText: q.questionText.trim(),
    options: [
      { key: "A", text: q.optionA.trim() },
      { key: "B", text: q.optionB.trim() },
      { key: "C", text: q.optionC.trim() },
      { key: "D", text: q.optionD.trim() },
    ],
    correctOptionKey: q.correctOption.trim().toUpperCase(),
    explanation: q.explanation ? q.explanation.trim() : `The correct answer is Option ${q.correctOption.toUpperCase()}.`,
    points: q.points || 1,
  }));

  const totalMarks = formattedQuestions.reduce((acc, q) => acc + q.points, 0);

  const newQuiz: QuizItem = {
    id: quizId,
    courseId: cleanCourseId,
    courseName: cleanCourseName,
    subjectId: cleanSubjectId,
    subjectName: cleanSubjectName,
    title: input.title.trim(),
    description: input.description || `Timed assessment containing ${formattedQuestions.length} MCQs for ${cleanSubjectName}.`,
    timeLimitMinutes: timeLimit,
    totalMarks,
    passingPercentage: passingScore,
    questionCount: formattedQuestions.length,
    questions: formattedQuestions,
  };

  // 1. Save to in-memory store
  initialQuizzes.unshift(newQuiz);

  // 2. Persist to MongoDB
  try {
    const isConnected = await connectToDatabase();
    if (isConnected) {
      await QuizModel.create({
        quizId,
        courseId: cleanCourseId,
        subjectId: cleanSubjectId,
        title: newQuiz.title,
        description: newQuiz.description,
        timeLimitMinutes: timeLimit,
        totalMarks,
        passingPercentage: passingScore,
        isPublished: true,
      });

      const questionInserts = formattedQuestions.map((q) => ({
        quizId,
        courseId: cleanCourseId,
        subjectId: cleanSubjectId,
        questionNumber: q.questionNumber,
        questionText: q.questionText,
        options: q.options,
        correctOptionKey: q.correctOptionKey,
        explanation: q.explanation,
        points: q.points,
      }));

      await QuestionModel.insertMany(questionInserts);
    }
  } catch (err) {
    console.warn("MongoDB could not save quiz and questions, kept in memory:", err);
  }

  return newQuiz;
}

/**
 * Delete a quiz
 */
export async function deleteQuiz(quizId: string): Promise<boolean> {
  const index = initialQuizzes.findIndex((q) => q.id === quizId);
  if (index >= 0) {
    initialQuizzes.splice(index, 1);
  }

  try {
    const isConnected = await connectToDatabase();
    if (isConnected) {
      await QuizModel.findOneAndDelete({ quizId });
      await QuestionModel.deleteMany({ quizId });
    }
  } catch (err) {
    console.warn("MongoDB deleteQuiz error:", err);
  }

  return true;
}
