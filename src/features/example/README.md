# Example Feature

This directory demonstrates the feature-module boundary only. Do not add fake domain behavior here.

When a real domain feature is introduced, prefer:

- `components/` — feature-specific UI
- `hooks/` — feature-specific React hooks
- `services/` — feature business/application services
- `validations/` — feature-specific Zod schemas
- `types.ts` — feature-specific types
- `index.ts` — intentionally small public exports
