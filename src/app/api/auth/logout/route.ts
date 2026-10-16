import { NextResponse } from "next/server";
import { apiSuccess } from "@/lib/api/response";
import { SESSION_COOKIE_NAME } from "@/lib/auth/store";

export async function POST() {
  const response = NextResponse.json(
    apiSuccess({
      message: "Logged out successfully.",
      data: { loggedOut: true },
    }),
  );

  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
    maxAge: 0,
  });

  return response;
}
