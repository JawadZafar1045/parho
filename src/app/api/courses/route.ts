import { NextResponse } from "next/server";
import { getAllCourses } from "@/services/courseStore";
import { apiSuccess } from "@/lib/api/response";

export async function GET() {
  const courses = await getAllCourses();
  return NextResponse.json(
    apiSuccess({
      message: "Courses retrieved successfully.",
      data: { courses },
    })
  );
}
