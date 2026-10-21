# Development Guide

## Starting a Task

1. Pull the latest `develop`.
2. Create a feature or bugfix branch.
3. Understand the relevant feature/module boundary.
4. Implement the change.
5. Run linting, type checking, and tests.
6. Commit focused changes.
7. Push the branch.
8. Open a Pull Request.
9. Request review.
10. Resolve review comments and merge conflicts before final review.

## Naming Conventions

| Item | Convention | Example |
|---|---|---|
| Components | PascalCase | `UserCard.tsx` |
| Hooks | camelCase with `use` prefix | `useAuth.ts` |
| Services | dot-separated | `user.service.ts` |
| Models | PascalCase | `User.ts` |
| Utilities | camelCase | `formatDate.ts` |
| API routes | Next.js convention | `route.ts` |

## Where Code Goes

- Components: `src/components/` for reusable UI; feature-specific UI belongs under `src/features/<feature>/components/`.
- API endpoints: `src/app/api/`.
- Business/application logic: feature services or shared services.
- Database models: `src/models/`.
- Validation: feature validation folders or `src/validations/` for truly shared schemas.
- Hooks: `src/hooks/` for shared hooks; feature hooks belong in the feature.
- Types: feature `types.ts` for feature-local types; `src/types/` for shared types.
- Utilities: `src/utils/`.
- Configuration: `src/config/`.

## Security TODOs

The foundation does not claim to provide complete authentication, authorization, rate limiting, CORS policy, file upload security, or external secret management. These must be designed and reviewed before production use.
