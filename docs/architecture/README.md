# Architecture

The intended dependency flow is:

UI / Pages
↓
Next.js Route Handlers
↓
Services
↓
Models / Database

Keep business rules out of React components and route handlers. Route handlers should translate HTTP requests into calls to application services and translate results/errors back into HTTP responses.

Prefer feature modules for domain functionality. Shared code belongs in `components`, `lib`, `types`, `utils`, or other shared directories only when it is genuinely reusable.
