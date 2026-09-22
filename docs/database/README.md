# Database Guidelines

MongoDB access is centralized through `src/lib/db/mongodb.ts`.

Models belong in `src/models/`. Add domain models only when the domain is known.

The connection helper reuses the Mongoose connection promise to avoid unnecessary connections during development and hot reloads.
