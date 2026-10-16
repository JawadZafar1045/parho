import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { apiError } from "@/lib/api/response";
import { AppError } from "@/lib/api/errors";
import { logger } from "@/lib/logger";

export function handleApiError(error: unknown): NextResponse {
  if (error instanceof ZodError) {
    return NextResponse.json(
      apiError({
        message: "Validation failed",
        error: error.flatten(),
      }),
      { status: 400 },
    );
  }

  if (error instanceof AppError) {
    return NextResponse.json(
      apiError({
        message: error.message,
        error: { code: error.code },
      }),
      { status: error.statusCode },
    );
  }

  logger.error("Unhandled API error", {
    error: error instanceof Error ? error.message : "Unknown error",
  });

  return NextResponse.json(
    apiError({ message: "An unexpected server error occurred." }),
    { status: 500 },
  );
}
