import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSessionUser, SESSION_COOKIE_NAME } from "@/lib/auth/store";
import { getMaterials, addMaterial } from "@/services/materialStore";
import { apiSuccess } from "@/lib/api/response";
import { UnauthorizedError, ForbiddenError, ValidationError } from "@/lib/api/errors";
import { handleApiError } from "@/lib/api/handler";

export async function GET(request: NextRequest) {
  try {
    const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
    const user = getSessionUser(token);

    if (!user) {
      throw new UnauthorizedError("Authentication required.");
    }
    if (user.role !== "admin") {
      throw new ForbiddenError("Admin privilege required.");
    }

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId") || undefined;

    const materials = await getMaterials(courseId);
    return NextResponse.json(
      apiSuccess({
        message: "Materials fetched successfully.",
        data: { materials },
      })
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
    const user = getSessionUser(token);

    if (!user) {
      throw new UnauthorizedError("Authentication required.");
    }
    if (user.role !== "admin") {
      throw new ForbiddenError("Admin privilege required.");
    }

    const contentType = request.headers.get("content-type") || "";

    let courseId = "";
    let subjectId = "";
    let subjectName = "";
    let title = "";
    let fileName = "";
    let fileSize = "2.1 MB";
    let isFreePreview = false;
    let r2Url: string | undefined;
    let fileBuffer: Buffer | undefined;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      courseId = (formData.get("courseId") as string) || "";
      subjectId = (formData.get("subjectId") as string) || "";
      subjectName = (formData.get("subjectName") as string) || "";
      title = (formData.get("title") as string) || "";
      r2Url = (formData.get("r2Url") as string) || undefined;
      isFreePreview = formData.get("isFreePreview") === "true";
      const customSize = (formData.get("fileSize") as string) || "";
      if (customSize) fileSize = customSize;

      const file = formData.get("file") as File | null;
      if (file && file.size > 0) {
        fileName = file.name;
        const bytes = await file.arrayBuffer();
        fileBuffer = Buffer.from(bytes);
        fileSize = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
      }
    } else {
      const json = await request.json();
      courseId = json.courseId;
      subjectId = json.subjectId;
      subjectName = json.subjectName;
      title = json.title;
      fileName = json.fileName;
      fileSize = json.fileSize || "2.1 MB";
      r2Url = json.r2Url;
      isFreePreview = Boolean(json.isFreePreview);
    }

    if (!courseId || !subjectId || !title) {
      throw new ValidationError("Course, Subject, and Note Title are all required.");
    }

    const created = await addMaterial({
      courseId,
      subjectId,
      subjectName: subjectName || subjectId,
      title,
      fileName,
      fileSize,
      isFreePreview,
      fileBuffer,
      r2Url,
    });

    return NextResponse.json(
      apiSuccess({
        message: "Teaching material uploaded and published successfully.",
        data: { material: created },
      }),
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
