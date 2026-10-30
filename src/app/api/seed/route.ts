import { NextResponse } from "next/server";
import { seedInitialData } from "@/services/seedService";
import { apiSuccess } from "@/lib/api/response";
import { handleApiError } from "@/lib/api/handler";

export async function POST() {
  try {
    await seedInitialData();
    return NextResponse.json(
      apiSuccess({
        message: "Courses, mock quizzes, and question bank initialized successfully.",
      })
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET() {
  return POST();
}
