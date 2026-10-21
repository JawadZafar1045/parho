# Parho Authentication Pages

The frontend authentication pages are available at:

- `/signup` — account registration and payment transaction submission.
- `/login` — existing-user login UI.

## Signup

The signup form validates:

- Preparation test — required
- Full name — required
- Education — optional
- WhatsApp number — required, 11 to 13 digits
- Email — required
- Password — minimum 6 characters
- Confirm password — required and must match
- Transaction ID — required
- Registration confirmation checkbox

The page currently demonstrates the pending-verification confirmation state. It is not connected to MongoDB or a registration API yet.

## Login

The login page includes:

- Registered email
- Password with show/hide control
- Keep me signed in checkbox
- Google sign-in presentation button
- Password recovery guidance by contact only (there is intentionally no Forgot Password button)
- Link to the registration page

The Google and email login controls are frontend UI only until the authentication backend is implemented.

## Branding

The project's Parho SVG logo is stored at:

`public/images/parho-logo.svg`

Replace that file with the final SVG artwork when the logo is updated; the auth pages reference the same path.

## Responsive behavior

The layouts use fluid sizing, Tailwind breakpoints, safe viewport units (`svh`), wrapping controls, and mobile-first spacing. The desktop layout uses a split branding/form presentation, while smaller screens collapse to a single-column layout.

Animations are CSS-based and include entry transitions, subtle logo motion, ambient background motion, and hover/press feedback. `prefers-reduced-motion` is respected.
