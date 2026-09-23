# Parho Signup Page

## Route

`/signup`

## Main files

- `src/app/(auth)/signup/page.tsx` — route entry and metadata.
- `src/features/auth/components/SignupForm.tsx` — responsive client UI and interactive validation state.
- `src/features/auth/validations/signup.ts` — Zod validation schema.
- `public/images/parho-logo.svg` — current placeholder logo.

## Replacing the logo

When the final Parho SVG is available, replace:

`public/images/parho-logo.svg`

Keep the same filename to avoid changing the component code. Other SVG assets can be stored under `public/icons/`.

## Current behavior

The form validates required fields in the browser and shows a pending-verification confirmation modal after a valid submission. No account or payment data is sent to a backend yet.

The next implementation step is to connect the form to a registration API, hash the password on the server, create a pending user/payment record, and activate the user's test access after admin payment verification.
