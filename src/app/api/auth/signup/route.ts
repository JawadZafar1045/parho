import { NextRequest, NextResponse } from "next/server";
import { signupSchema } from "@/features/auth/validations/signup";
import { apiSuccess } from "@/lib/api/response";
import { handleApiError } from "@/lib/api/handler";
import { createUser, publicUser } from "@/lib/auth/store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const payload = signupSchema.parse(body);
    const user = createUser(payload);

    return NextResponse.json(
      apiSuccess({
        message: "Registration submitted successfully.",
        data: {
          user: publicUser(user),
        },
      }),
      { status: 201 },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
