import { z } from "zod";
import { ValidationError } from "@/lib/api/errors";

export function validate<T>(schema: z.ZodType<T>, input: unknown): T {
  const result = schema.safeParse(input);

  if (!result.success) {
    throw new ValidationError("Request validation failed", {
      cause: result.error,
    });
  }

  return result.data;
}
