import { describe, expect, it } from "vitest";
import { createUser, getSessionUser, verifyLogin, createSession } from "@/lib/auth/store";

describe("auth store", () => {
  it("creates a user and verifies credentials", () => {
    const user = createUser({
      test: "ppsc",
      fullName: "Ali Khan",
      education: "BSCS",
      whatsapp: "03001234567",
      email: "ali@example.com",
      password: "secret123",
      transactionId: "TXN-1001",
        confirmPassword: "secret123",
    });

    expect(user.email).toBe("ali@example.com");
    expect(verifyLogin("ali@example.com", "secret123")).toBeTruthy();
  });

  it("verifies the seeded Jawad account", () => {
    expect(verifyLogin("jawad@gmail.com", "12345678")?.email).toBe("jawad@gmail.com");
  });

  it("creates a session for an authenticated user", () => {
    const session = createSession("ali@example.com");

    expect(session).toBeTypeOf("string");
    expect(getSessionUser(session)?.email).toBe("ali@example.com");
  });
});
