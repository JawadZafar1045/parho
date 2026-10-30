import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSessionUser, SESSION_COOKIE_NAME } from "@/lib/auth/store";
import { getAllCourses, createCourse } from "@/services/courseStore";
import { apiSuccess } from "@/lib/api/response";
import { ForbiddenError, UnauthorizedError, ValidationError } from "@/lib/api/errors";
import { handleApiError } from "@/lib/api/handler";

export async function GET(_request: NextRequest) {
  try {
    const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
    const sessionUser = getSessionUser(token);

    if (!sessionUser) {
      throw new UnauthorizedError("Authentication required.");
    }

    if (sessionUser.role !== "admin") {
      throw new ForbiddenError("Admin privileges required.");
    }

    const courses = await getAllCourses();

    return NextResponse.json(
      apiSuccess({
        message: "Admin courses retrieved successfully.",
        data: { courses },
      })
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
    const sessionUser = getSessionUser(token);

    if (!sessionUser) {
      throw new UnauthorizedError("Authentication required.");
    }

    if (sessionUser.role !== "admin") {
      throw new ForbiddenError("Admin privileges required.");
    }

    const body = await request.json();

    if (!body.name || !body.courseId) {
      throw new ValidationError("Both Course name and Course ID are required.");
    }

    const price = Number(body.price) || 1500;
    const originalPrice = Number(body.originalPrice) || price * 2;
    const discountLabel = body.discountLabel || (originalPrice > price ? `${Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF` : "");

    const newCourse = await createCourse({
      courseId: body.courseId,
      name: body.name,
      description: body.description || "",
      price,
      originalPrice,
      discountLabel,
      badge: body.badge || "New Course",
      imageLabel: body.imageLabel,
      subjects: body.subjects || [],
      features: body.features || [
        "Verified PDF Study Notes",
        "Timed Practice Quizzes",
        "Detailed Answer Explanations",
      ],
    });

    return NextResponse.json(
      apiSuccess({
        message: `Course '${newCourse.name}' created successfully.`,
        data: { course: newCourse },
      }),
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
