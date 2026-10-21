import { z } from "zod";

export const coursePaymentRequestSchema = z
  .object({
    courseId: z
      .string()
      .trim()
      .regex(/^[a-z0-9-]+$/),
    transactionId: z.string().trim().min(4).max(100),
  })
  .strict();
