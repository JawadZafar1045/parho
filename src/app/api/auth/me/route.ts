import { NextRequest, NextResponse } from "next/server";
import { apiSuccess } from "@/lib/api/response";
import { handleApiError } from "@/lib/api/handler";
import { getSessionUser, SESSION_COOKIE_NAME } from "@/lib/auth/store";
import { UnauthorizedError } from "@/lib/api/errors";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const user = getSessionUser(token);

    if (!user) {
      throw new UnauthorizedError("Authentication required.");
    }

    return NextResponse.json(
      apiSuccess({
        message: "Authenticated user loaded.",
        data: { user },
      }),
    );
  } catch (error) {
    return handleApiError(error);
  }
}
