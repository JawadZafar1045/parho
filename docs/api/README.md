# API Guidelines

Use Next.js Route Handlers under `src/app/api`.

Return the common response envelope:

```json
{
  "success": true,
  "message": "Human-readable message",
  "data": {},
  "meta": {}
}
```

For failures:

```json
{
  "success": false,
  "message": "Safe client-facing message",
  "error": {
    "code": "ERROR_CODE"
  }
}
```

Do not return stack traces, secrets, credentials, tokens, or raw database errors to clients.
