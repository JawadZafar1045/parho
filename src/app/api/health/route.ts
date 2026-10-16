import { NextResponse } from "next/server";
import { apiSuccess } from "@/lib/api/response";

export function GET() {
  return NextResponse.json(
    apiSuccess({
      message: "Service is healthy",
      data: { status: "ok" },
    }),
  );
}
