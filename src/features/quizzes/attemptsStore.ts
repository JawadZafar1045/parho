import type { QuizAttemptResult } from "./types";

const memoryAttempts = new Map<string, QuizAttemptResult>();

export function storeAttempt(attempt: QuizAttemptResult): void {
  memoryAttempts.set(attempt.attemptId, attempt);
}

export function getStoredAttempt(attemptId: string): QuizAttemptResult | undefined {
  return memoryAttempts.get(attemptId);
}
