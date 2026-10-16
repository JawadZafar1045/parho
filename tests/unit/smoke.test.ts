import { describe, expect, it } from "vitest";
import { StudentDashboardPage } from "@/features/courses/components/StudentDashboardPage";

describe("foundation", () => {
  it("runs the test suite", () => {
    expect(true).toBe(true);
  });

  it("exports the student dashboard component", () => {
    expect(StudentDashboardPage).toBeDefined();
  });
});
