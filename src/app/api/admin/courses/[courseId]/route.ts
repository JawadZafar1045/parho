import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSessionUser, SESSION_COOKIE_NAME } from "@/lib/auth/store";
import { updateCourse, getCourseById } from "@/services/courseStore";
import { apiSuccess } from "@/lib/api/response";
import { ForbiddenError, NotFoundError, UnauthorizedError } from "@/lib/api/errors";
import { handleApiError } from "@/lib/api/handler";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
    const sessionUser = getSessionUser(token);

    if (!sessionUser) {
      throw new UnauthorizedError("Authentication required.");
    }

    if (sessionUser.role !== "admin") {
      throw new ForbiddenError("Admin privileges required.");
    }

    const { courseId } = await params;
    const existing = await getCourseById(courseId);

    if (!existing) {
      throw new NotFoundError("Course not found.");
    }

    const body = await request.json();

    const price = body.price !== undefined ? Number(body.price) : existing.price;
    const originalPrice = body.originalPrice !== undefined ? Number(body.originalPrice) : existing.originalPrice;
    const discountPercent =
      originalPrice && price && originalPrice > price
        ? Math.round(((originalPrice - price) / originalPrice) * 100)
        : 0;

    const discountLabel = body.discountLabel || (discountPercent > 0 ? `${discountPercent}% OFF` : "");

    const updated = await updateCourse(courseId, {
      name: body.name || existing.name,
      description: body.description !== undefined ? body.description : existing.description,
      price,
      originalPrice,
      discountPercent,
      discountLabel,
      badge: body.badge !== undefined ? body.badge : existing.badge,
      imageLabel: body.imageLabel || existing.imageLabel,
      subjects: body.subjects || existing.subjects,
      features: body.features || existing.features,
    });

    return NextResponse.json(
      apiSuccess({
        message: `Course '${courseId}' updated successfully.`,
        data: { course: updated },
      })
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
    const sessionUser = getSessionUser(token);

    if (!sessionUser) {
      throw new UnauthorizedError("Authentication required.");
    }

    if (sessionUser.role !== "admin") {
      throw new ForbiddenError("Admin privileges required.");
    }

    const { courseId } = await params;
    const course = await getCourseById(courseId);

    if (!course) {
      throw new NotFoundError(`Course '${courseId}' not found.`);
    }

    return NextResponse.json(
      apiSuccess({
        message: `Course '${courseId}' retrieved successfully.`,
        data: { course },
      })
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
    const sessionUser = getSessionUser(token);

    if (!sessionUser) {
      throw new UnauthorizedError("Authentication required.");
    }

    if (sessionUser.role !== "admin") {
      throw new ForbiddenError("Admin privileges required.");
    }

    const { courseId } = await params;
    const { deleteCourse } = await import("@/services/courseStore");
    await deleteCourse(courseId);

    return NextResponse.json(
      apiSuccess({
        message: `Course '${courseId}' deleted successfully.`,
      })
    );
  } catch (error) {
    return handleApiError(error);
  }
}


