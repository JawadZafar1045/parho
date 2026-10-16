import type { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement>;

export function SparkIcon(props: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
      {...props}
    >
      <path d="m12 3 1.8 6.2L20 11l-6.2 1.8L12 19l-1.8-6.2L4 11l6.2-1.8L12 3Z" />
    </svg>
  );
}

export function CheckIcon(props: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
      {...props}
    >
      <path d="m5 12.5 4.1 4.1L19 7" />
    </svg>
  );
}

export function ArrowIcon(props: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
      {...props}
    >
      <path d="M5 12h13M13 6l6 6-6 6" />
    </svg>
  );
}

export function UserIcon(props: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="8" r="3.1" />
      <path d="M5.4 19.2c.9-3.2 3.1-4.8 6.6-4.8s5.7 1.6 6.6 4.8" />
    </svg>
  );
}

export function PhoneIcon(props: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
      {...props}
    >
      <path d="M7.1 4.7 9.1 4l2 4-1.6 1.6a14.4 14.4 0 0 0 4.9 4.9l1.6-1.7 4 2-.7 2.1c-.3 1.1-1.4 1.8-2.5 1.6C10.1 17.2 6.8 13.8 5.5 6.9 5.3 5.9 6 5 7.1 4.7Z" />
    </svg>
  );
}

export function MailIcon(props: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
      {...props}
    >
      <rect x="3.5" y="5" width="17" height="14" rx="2" />
      <path d="m4.5 6.5 7.5 6 7.5-6" />
    </svg>
  );
}

export function LockIcon(props: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
      {...props}
    >
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V7.6a4 4 0 0 1 8 0V10" />
    </svg>
  );
}

export function ReceiptIcon(props: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
      {...props}
    >
      <path d="M6 4v16l3-1.7 3 1.7 3-1.7 3 1.7V4l-3 1.7L12 4l-3 1.7L6 4Z" />
      <path d="M9 9h6M9 12h6M9 15h4" />
    </svg>
  );
}

export function EducationIcon(props: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
      {...props}
    >
      <path d="m3.5 9 8.5-4 8.5 4-8.5 4-8.5-4Z" />
      <path d="M6.6 11.1v4.3c2.7 1.8 8.1 1.8 10.8 0v-4.3M21 10v5" />
    </svg>
  );
}

export function EyeIcon({ open, ...props }: Props & { open: boolean }) {
  if (open) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
        {...props}
      >
        <path d="M2.8 12s3.2-5.1 9.2-5.1 9.2 5.1 9.2 5.1-3.2 5.1-9.2 5.1S2.8 12 2.8 12Z" />
        <circle cx="12" cy="12" r="2.1" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
      {...props}
    >
      <path d="M3 3l18 18" />
      <path d="M9.6 6.8a10 10 0 0 1 2.4-.3c6 0 9.2 5.5 9.2 5.5a16 16 0 0 1-3.4 3.9M6.4 6.7C4.2 8.1 2.8 12 2.8 12s3.2 5.5 9.2 5.5c1.2 0 2.4-.2 3.5-.7" />
      <path d="M10.1 10.2a2.5 2.5 0 0 0 3.6 3.5" />
    </svg>
  );
}

export function ChevronIcon(props: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
      {...props}
    >
      <path d="m7 10 5 5 5-5" />
    </svg>
  );
}

export function GoogleIcon(props: Props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="#4285F4"
        d="M21.35 12.22c0-.7-.06-1.4-.2-2.06H12v3.9h5.22a4.5 4.5 0 0 1-1.94 2.96v2.46h3.14c1.84-1.7 2.93-4.2 2.93-7.26Z"
      />
      <path
        fill="#34A853"
        d="M12 21.6c2.63 0 4.83-.86 6.43-2.33l-3.14-2.46c-.87.58-1.98.93-3.29.93-2.53 0-4.67-1.71-5.44-4.01H3.31v2.54A9.72 9.72 0 0 0 12 21.6Z"
      />
      <path
        fill="#FBBC05"
        d="M6.56 13.73A5.84 5.84 0 0 1 6.25 12c0-.6.1-1.19.31-1.73V7.73H3.31A9.63 9.63 0 0 0 2.28 12c0 1.55.37 3.02 1.03 4.27l3.25-2.54Z"
      />
      <path
        fill="#EA4335"
        d="M12 6.26c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.82 3.36 14.62 2.4 12 2.4a9.72 9.72 0 0 0-8.69 5.33l3.25 2.54C7.33 7.97 9.47 6.26 12 6.26Z"
      />
    </svg>
  );
}
