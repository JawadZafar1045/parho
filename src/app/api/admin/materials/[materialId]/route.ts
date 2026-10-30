import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSessionUser, SESSION_COOKIE_NAME } from "@/lib/auth/store";
import { deleteMaterial } from "@/services/materialStore";
import { apiSuccess } from "@/lib/api/response";
import { UnauthorizedError, ForbiddenError } from "@/lib/api/errors";
import { handleApiError } from "@/lib/api/handler";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ materialId: string }> }
) {
  try {
    const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
    const user = getSessionUser(token);

    if (!user) {
      throw new UnauthorizedError("Authentication required.");
    }
    if (user.role !== "admin") {
      throw new ForbiddenError("Admin privilege required.");
    }

    const { materialId } = await params;
    await deleteMaterial(materialId);

    return NextResponse.json(
      apiSuccess({
        message: "Teaching material removed successfully.",
      })
    );
  } catch (error) {
    return handleApiError(error);
  }
}
