# PARHO Portal

A student learning portal built with Next.js App Router, TypeScript, React, MongoDB, Mongoose, REST Route Handlers, Tailwind CSS, and Zod.

## Project Overview

The portal includes student authentication, a MongoDB-backed course catalog, payment-request submission, and protected course-material routes. Course business logic is implemented in feature modules rather than pages or React components.

## Technology Stack

- Next.js App Router
- React
- TypeScript with strict mode
- Node.js runtime
- MongoDB + Mongoose
- REST-style Next.js Route Handlers
- Tailwind CSS
- Zod
- ESLint
- Prettier
- Vitest
- Git + GitHub Actions

## Architecture

```text
UI / Pages
    ↓
Next.js Route Handlers
    ↓
Services
    ↓
Models / MongoDB
```

Keep each layer focused:

- UI renders state and collects user input.
- Route Handlers handle HTTP concerns.
- Services contain application/business logic.
- Models encapsulate persistence concerns.
- Zod validates untrusted input at boundaries.

## Folder Structure

```text
src/
├── app/            # Next.js pages, layouts, route handlers
├── components/     # Shared reusable UI
├── features/       # Feature-based modules
├── lib/            # Shared infrastructure: DB, API, auth, logging
├── models/         # Mongoose models
├── services/       # Truly shared application services
├── validations/    # Truly shared validation
├── middleware/     # Middleware boundary
├── hooks/          # Shared React hooks
├── types/          # Shared TypeScript types
├── constants/      # Shared constants
├── utils/          # Small generic utilities
└── config/         # Validated application configuration
```

## Installation

```bash
git clone <repository-url>
cd project
npm install
```

## Environment Setup

Copy `.env.example` to `.env.local` and provide local development values.

```bash
cp .env.example .env.local
```

Never commit `.env.local` or real credentials.

## Development

```bash
npm run dev
```

Then open `http://localhost:3000`.

The health endpoint is available at `/api/health`.

## Course Catalog and Development Enrollment

Configure `MONGODB_URI` in `.env.local`. Catalog seed data defaults to PKR 200 per course (20,000 integer paisa) and can be overridden per course with `COURSE_<COURSE_ID>_FEE_PAISA`. For example, `COURSE_CSS_FEE_PAISA=30000` sets CSS to PKR 300.

Seed or update the published catalog idempotently:

```bash
npm run seed:courses
```

To create a separate development-only test student with a verified PPSC enrollment, first have an administrator verify an actual JazzCash payment for that test account. Then set `DEV_TEST_STUDENT_PASSWORD`, `DEV_TEST_PPSC_PAYMENT_VERIFIED=true`, and `DEV_TEST_PPSC_VERIFIED_TRANSACTION_ID` to the verified transaction ID in `.env.local` (optionally set `DEV_TEST_STUDENT_EMAIL`), then run:

```bash
npm run seed:courses -- --with-dev-enrollment
```

The test account email defaults to `course-test@parho.local`. The dev enrollment option refuses to run with `NODE_ENV=production`, requires the explicit verified-payment attestation and actual verified transaction ID, only inserts records when they do not already exist, and never changes real student records. Do not use the development test account in production.

Student payment requests are stored with the current catalog price calculated server-side. Submitting a JazzCash transaction ID does not activate access. This project does not yet include an administrator interface/API for approving or rejecting requests; a verified enrollment must be provisioned through a trusted administrator workflow before paid course access is granted.

## Quality Checks

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

Format code with:

```bash
npm run format
```

Check formatting without changing files:

```bash
npm run format:check
```

## Git Workflow

Branches:

- `main` → production
- `develop` → active development
- `feature/*` → individual features
- `bugfix/*` → bug fixes
- `hotfix/*` → urgent production fixes

Examples:

```text
feature/user-authentication
feature/dashboard
feature/product-module
bugfix/login-validation
```

Rules:

1. Never push directly to `main`.
2. Pull the latest `develop` before starting work.
3. Create a separate branch for each feature or bug fix.
4. Keep commits focused.
5. Never commit `.env` files or credentials.
6. Open a Pull Request before merging.
7. Code should be reviewed before merging.
8. Keep PRs reasonably small.
9. Resolve merge conflicts before requesting final review.

See `CONTRIBUTING.md` for the team workflow.

## Pull Requests

A PR should explain:

- what changed
- why it changed
- how it was tested
- any migration or configuration requirements

Before requesting review, run type checking, linting, tests, and a production build.

## Coding Standards

- Use strict TypeScript.
- Avoid `any` unless there is a documented reason.
- Keep functions small and focused.
- Prefer explicit names over clever abstractions.
- Validate untrusted input with Zod.
- Keep business logic out of components and route handlers.
- Avoid duplicated logic.
- Add shared abstractions only when reuse is real.
- Never log passwords, tokens, API keys, or credentials.

## Implemented vs Placeholder

### Implemented

- Next.js App Router foundation
- TypeScript strict configuration
- Tailwind CSS
- MongoDB/Mongoose connection foundation
- Common API response helpers
- Central API error translation
- Zod validation utility
- Basic health endpoint
- Logger abstraction
- ESLint
- Prettier
- Vitest test runner
- GitHub CI for typecheck, lint, test, and build
- GitHub PR template
- Development documentation

### Placeholder / Future Work

- Business features
- Domain-specific models
- Complete authentication
- Authorization policies
- Password hashing implementation
- Session/token lifecycle
- Password reset and email verification
- Email delivery
- Payments
- Notifications
- File storage
- Analytics
- External API integrations
- Production rate limiting
- Production CORS policy
- Full security-header policy

Do not treat placeholders as implemented security controls.

## Intern-Friendly Guidance

Start with `docs/development/README.md`.

As a general rule:

- Modify `src/features/<feature>/` for feature-specific work.
- Modify `src/components/` for shared UI.
- Add API endpoints under `src/app/api/`.
- Put persistence models in `src/models/`.
- Put shared infrastructure in `src/lib/`.

## Lead Developer Ownership

The following normally require lead/architecture review:

- `src/config/`
- authentication/session architecture
- authorization/middleware
- database connection strategy
- security controls
- CI/CD workflows
- production configuration
- dependency upgrades
- shared API/error architecture
- changes affecting multiple feature modules

These files are not technically locked; they simply deserve architectural review before changes are merged.

## Validation Note

The repository was generated with no real credentials or business data. Dependency installation/build verification may require network access to npm; the CI workflow therefore installs from `package.json` directly in this starter archive.
