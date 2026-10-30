import { connectToDatabase } from "@/lib/db/mongodb";
import { Course } from "@/models/Course";
import { Quiz } from "@/models/Quiz";
import { Question } from "@/models/Question";
import { courseMaterials } from "@/features/notes/data";

export async function seedInitialData() {
  try {
    await connectToDatabase();

    // 1. Seed Courses if not present
    const courseCount = await Course.countDocuments();
    if (courseCount === 0) {
      const initialCourses = [
        {
          courseId: "ppsc",
          name: "PPSC Preparation",
          description: "Complete structured notes and practice quizzes for Punjab Public Service Commission exams.",
          price: 1500,
          imageLabel: "PPSC",
          badge: "Most Popular",
          isPublished: true,
          subjects: [
            { id: "general-knowledge", name: "General Knowledge", description: "World history, geography, and international organizations" },
            { id: "pakistan-affairs", name: "Pakistan Affairs", description: "History, constitution, and governance of Pakistan" },
            { id: "english", name: "English", description: "Grammar, vocabulary, idioms, and sentence correction" },
            { id: "current-affairs", name: "Current Affairs", description: "Recent national and global developments" },
            { id: "islamic-studies", name: "Islamic Studies", description: "Quran, Hadith, Seerah, and Islamic history" },
            { id: "everyday-science", name: "Everyday Science", description: "Physical, biological, and environmental sciences" },
            { id: "basic-mathematics", name: "Basic Mathematics", description: "Arithmetic, algebra, and quantitative reasoning" },
          ],
        },
        {
          courseId: "fpsc",
          name: "FPSC Preparation",
          description: "Comprehensive notes and MCQs for Federal Public Service Commission examinations.",
          price: 1500,
          imageLabel: "FPSC",
          badge: "Top Rated",
          isPublished: true,
          subjects: [
            { id: "general-knowledge", name: "General Knowledge", description: "World knowledge and geography" },
            { id: "current-affairs", name: "Current Affairs", description: "National and international current affairs" },
            { id: "computer-science", name: "Computer Science", description: "Information technology and MS Office basics" },
          ],
        },
        {
          courseId: "nts",
          name: "NTS Preparation",
          description: "Curated notes and tests for National Testing Service (NAT, GAT, and Educator jobs).",
          price: 1200,
          imageLabel: "NTS",
          isPublished: true,
          subjects: [
            { id: "verbal-reasoning", name: "Verbal Reasoning", description: "English comprehension and vocabulary" },
            { id: "analytical-reasoning", name: "Analytical Reasoning", description: "Logical deductions and scenarios" },
            { id: "quantitative-reasoning", name: "Quantitative Reasoning", description: "Maths, ratios, and percentages" },
          ],
        },
        {
          courseId: "css",
          name: "CSS Preparation",
          description: "Core compulsory subjects notes and question bank for Central Superior Services.",
          price: 2500,
          imageLabel: "CSS",
          badge: "Comprehensive",
          isPublished: true,
          subjects: [
            { id: "english", name: "English Précis & Composition", description: "Grammar, précis writing, and vocabulary" },
            { id: "current-affairs", name: "Current Affairs", description: "Analysis of national and global affairs" },
            { id: "islamic-studies", name: "Islamic Studies", description: "Islamic ideology and contemporary issues" },
          ],
        },
      ];

      await Course.insertMany(initialCourses);
    }

    // 2. Seed a sample Quiz and Questions if not present
    const quizCount = await Quiz.countDocuments();
    if (quizCount === 0) {
      const sampleQuiz = await Quiz.create({
        quizId: "ppsc-gk-mock-1",
        courseId: "ppsc",
        subjectId: "general-knowledge",
        title: "PPSC General Knowledge - Model Paper 1",
        description: "Test your preparation across Pakistan Affairs, Geography, and Everyday Science.",
        timeLimitMinutes: 15,
        totalMarks: 10,
        passingPercentage: 50,
        isPublished: true,
      });

      const sampleQuestions = [
        {
          quizId: sampleQuiz.quizId,
          courseId: "ppsc",
          subjectId: "general-knowledge",
          questionNumber: 1,
          questionText: "Which is the highest peak of the Karakoram range in Pakistan?",
          options: [
            { key: "A", text: "Nanga Parbat" },
            { key: "B", text: "K2 (Godwin Austen)" },
            { key: "C", text: "Broad Peak" },
            { key: "D", text: "Tirich Mir" },
          ],
          correctOptionKey: "B",
          explanation: "K2 is 8,611 meters high and is the second-highest mountain in the world and highest in Karakoram.",
          points: 1,
        },
        {
          quizId: sampleQuiz.quizId,
          courseId: "ppsc",
          subjectId: "general-knowledge",
          questionNumber: 2,
          questionText: "The Objective Resolution was passed by the Constituent Assembly of Pakistan on:",
          options: [
            { key: "A", text: "March 12, 1949" },
            { key: "B", text: "August 14, 1947" },
            { key: "C", text: "March 23, 1940" },
            { key: "D", text: "October 16, 1951" },
          ],
          correctOptionKey: "A",
          explanation: "Liaquat Ali Khan moved the Objectives Resolution in the Constituent Assembly on 7th March and it was adopted on 12th March 1949.",
          points: 1,
        },
        {
          quizId: sampleQuiz.quizId,
          courseId: "ppsc",
          subjectId: "general-knowledge",
          questionNumber: 3,
          questionText: "Which vitamin is synthesized in the human body through sunlight exposure?",
          options: [
            { key: "A", text: "Vitamin A" },
            { key: "B", text: "Vitamin C" },
            { key: "C", text: "Vitamin D" },
            { key: "D", text: "Vitamin B12" },
          ],
          correctOptionKey: "C",
          explanation: "Skin synthesizes Vitamin D when exposed to ultraviolet B (UVB) rays from sunlight.",
          points: 1,
        },
        {
          quizId: sampleQuiz.quizId,
          courseId: "ppsc",
          subjectId: "general-knowledge",
          questionNumber: 4,
          questionText: "The headquarters of the United Nations (UN) is located in:",
          options: [
            { key: "A", text: "Geneva, Switzerland" },
            { key: "B", text: "New York, USA" },
            { key: "C", text: "London, UK" },
            { key: "D", text: "Paris, France" },
          ],
          correctOptionKey: "B",
          explanation: "The official headquarters of the United Nations is in Manhattan, New York City.",
          points: 1,
        },
        {
          quizId: sampleQuiz.quizId,
          courseId: "ppsc",
          subjectId: "general-knowledge",
          questionNumber: 5,
          questionText: "Which pass connects Pakistan with China?",
          options: [
            { key: "A", text: "Khyber Pass" },
            { key: "B", text: "Bolan Pass" },
            { key: "C", text: "Khunjerab Pass" },
            { key: "D", text: "Lowari Pass" },
          ],
          correctOptionKey: "C",
          explanation: "Khunjerab Pass connects Gilgit-Baltistan with Xinjiang province of China through Karakoram Highway.",
          points: 1,
        },
      ];

      await Question.insertMany(sampleQuestions);
    }
  } catch (err) {
    // If MongoDB is not yet running locally, keep going smoothly
    console.warn("Database auto-seed skipped or pending MongoDB connection:", err);
  }
}
