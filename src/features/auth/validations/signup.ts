import { z } from "zod";

export const signupSchema = z
  .object({
    test: z.string().min(1, "Please select a preparation test."),
    fullName: z.string().trim().min(2, "Please enter your full name."),
    education: z.string().trim().optional(),
    whatsapp: z
      .string()
      .regex(/^\d{11,13}$/, "WhatsApp number must contain 11 to 13 digits."),
    email: z.string().trim().email("Please enter a valid email address."),
    password: z.string().min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string().min(1, "Please confirm your password."),
    transactionId: z.string().trim().min(4, "Please enter your payment transaction ID."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export type SignupFormValues = z.infer<typeof signupSchema>;
