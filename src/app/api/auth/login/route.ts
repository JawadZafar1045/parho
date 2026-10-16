import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/features/auth/validations/login";
import { apiSuccess } from "@/lib/api/response";
import { handleApiError } from "@/lib/api/handler";
import { createSession, getSessionUser, publicUser, SESSION_COOKIE_NAME, verifyLogin } from "@/lib/auth/store";
import { UnauthorizedError } from "@/lib/api/errors";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const payload = loginSchema.parse(body);

    const user = verifyLogin(payload.email, payload.password);

    if (!user) {
      throw new UnauthorizedError("Invalid email or password.");
    }

    const sessionToken = createSession(user.email);
    const response = NextResponse.json(
      apiSuccess({
        message: "Login successful.",
        data: {
          user: publicUser(user),
        },
      }),
    );

    response.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const user = getSessionUser(token);

    if (!user) {
      throw new UnauthorizedError("Authentication required.");
    }

    return NextResponse.json(apiSuccess({ message: "Session active.", data: { user } }));
  } catch (error) {
    return handleApiError(error);
  }
}
