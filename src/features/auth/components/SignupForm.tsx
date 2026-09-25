"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent, type ReactNode } from "react";
import { signupSchema, type SignupFormValues } from "@/features/auth/validations/signup";

const testOptions = [
  { value: "ppsc", label: "PPSC Preparation" },
  { value: "fpsc", label: "FPSC Preparation" },
  { value: "nts", label: "NTS Preparation" },
  { value: "police", label: "Police Tests" },
  { value: "teaching", label: "Teaching / Lecturer Tests" },
  { value: "banking", label: "Banking Tests" },
];

const initialValues: SignupFormValues = {
  test: "",
  fullName: "",
  education: "",
  whatsapp: "",
  email: "",
  password: "",
  confirmPassword: "",
  transactionId: "",
};

type FormErrors = Partial<Record<keyof SignupFormValues, string>>;

type IconProps = {
  className?: string;
};

function IconWrap({ children }: { children: ReactNode }) {
  return (
    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
      {children}
    </span>
  );
}

function UserIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="12" cy="8" r="3.1" />
      <path d="M5.4 19.2c.9-3.2 3.1-4.8 6.6-4.8s5.7 1.6 6.6 4.8" />
    </svg>
  );
}

function PhoneIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M7.1 4.7 9.1 4l2 4-1.6 1.6a14.4 14.4 0 0 0 4.9 4.9l1.6-1.7 4 2-.7 2.1c-.3 1.1-1.4 1.8-2.5 1.6C10.1 17.2 6.8 13.8 5.5 6.9 5.3 5.9 6 5 7.1 4.7Z" />
    </svg>
  );
}

function MailIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="3.5" y="5" width="17" height="14" rx="2" />
      <path d="m4.5 6.5 7.5 6 7.5-6" />
    </svg>
  );
}

function EducationIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="m3.5 9 8.5-4 8.5 4-8.5 4-8.5-4Z" />
      <path d="M6.6 11.1v4.3c2.7 1.8 8.1 1.8 10.8 0v-4.3M21 10v5" />
    </svg>
  );
}

function LockIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V7.6a4 4 0 0 1 8 0V10" />
    </svg>
  );
}

function ReceiptIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M6 4v16l3-1.7 3 1.7 3-1.7 3 1.7V4l-3 1.7L12 4l-3 1.7L6 4Z" />
      <path d="M9 9h6M9 12h6M9 15h4" />
    </svg>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M2.8 12s3.2-5.1 9.2-5.1 9.2 5.1 9.2 5.1-3.2 5.1-9.2 5.1S2.8 12 2.8 12Z" />
        <circle cx="12" cy="12" r="2.1" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M3 3l18 18" />
      <path d="M9.6 6.8a10 10 0 0 1 2.4-.3c6 0 9.2 5.5 9.2 5.5a16 16 0 0 1-3.4 3.9M6.4 6.7C4.2 8.1 2.8 12 2.8 12s3.2 5.5 9.2 5.5c1.2 0 2.4-.2 3.5-.7" />
      <path d="M10.1 10.2a2.5 2.5 0 0 0 3.6 3.5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m5 12.5 4.1 4.1L19 7" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h13M13 6l6 6-6 6" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="m7 10 5 5 5-5" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="m12 3 1.8 6.2L20 11l-6.2 1.8L12 19l-1.8-6.2L4 11l6.2-1.8L12 3Z" />
    </svg>
  );
}

function FieldLabel({
  htmlFor,
  children,
  optional = false,
}: {
  htmlFor: string;
  children: ReactNode;
  optional?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block text-[11px] font-bold uppercase tracking-[0.08em] text-slate-800"
    >
      {children}
      {optional ? (
        <span className="ml-1 font-medium normal-case tracking-normal text-slate-400">
          (Optional)
        </span>
      ) : (
        <span className="ml-1 text-[#2D67DF]">*</span>
      )}
    </label>
  );
}

function inputClass(error: boolean) {
  return `h-12 w-full rounded-xl border bg-white pl-10 pr-4 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:ring-4 ${
    error
      ? "border-red-300 focus:border-red-500 focus:ring-red-100"
      : "border-slate-200 focus:border-[#2D67DF] focus:ring-blue-100"
  }`;
}

export default function SignupForm() {
  const [values, setValues] = useState<SignupFormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPaymentGuide, setShowPaymentGuide] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField<K extends keyof SignupFormValues>(field: K, value: SignupFormValues[K]) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSuccess(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const result = signupSchema.safeParse(values);

    if (!result.success) {
      const nextErrors: FormErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof SignupFormValues | undefined;
        if (field && !nextErrors[field]) nextErrors[field] = issue.message;
      }
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      const payload = (await response.json()) as {
        success?: boolean;
        message?: string;
        error?: { message?: string } | string;
      };

      if (!response.ok || !payload.success) {
        const message =
          typeof payload.error === "string"
            ? payload.error
            : payload.error?.message || payload.message || "Registration failed.";
        throw new Error(message);
      }

      setValues(initialValues);
      setSuccess(true);
    } catch (error) {
      setErrors({
        transactionId: error instanceof Error ? error.message : "Registration failed. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-[100svh] overflow-x-hidden bg-[#F4F7FC] text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col overflow-hidden lg:grid lg:grid-cols-[0.78fr_1.22fr]">
        <aside className="relative hidden overflow-hidden bg-[#205ED1] text-white lg:flex lg:min-h-screen lg:flex-col lg:justify-between">
          <div className="auth-orb-one absolute -left-20 -top-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <div className="auth-orb-two absolute -bottom-28 -right-10 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
          <div className="auth-spin pointer-events-none absolute left-1/2 top-1/3 h-40 w-40 -translate-x-1/2 rounded-full border border-white/10" />
          <div className="absolute inset-y-0 right-0 w-px bg-white/10" />

          <div className="relative z-10 flex h-full flex-col justify-between px-9 py-9 xl:px-12 xl:py-12">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/12 p-2 shadow-lg ring-1 ring-white/20 backdrop-blur">
                  <Image
                    src="/images/parho-logo.svg"
                    alt="Parho logo"
                    width={56}
                    height={56}
                    className="h-full w-full object-contain"
                    priority
                  />
                </div>
                <div>
                  <p className="text-2xl font-extrabold tracking-tight">Parho</p>
                  <p className="text-xs font-medium text-blue-100">Competitive Exam Preparation</p>
                </div>
              </div>

              <div className="mt-14 max-w-xl animate-fade-up">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-blue-50 ring-1 ring-white/15">
                  <SparkIcon />
                  Prepare with purpose
                </span>
                <h1 className="mt-5 text-4xl font-extrabold leading-[1.06] xl:text-5xl">
                  Your preparation starts here.
                </h1>
                <p className="mt-5 max-w-lg text-sm leading-7 text-blue-50/90 xl:text-base">
                  Create your Parho account and get access to structured notes, quizzes and focused
                  preparation resources for competitive tests.
                </p>
              </div>

              <div className="mt-10 grid gap-3">
                {[
                  ["Focused resources", "Notes organized around the test you choose."],
                  ["Practice quizzes", "Check your preparation with exam-style questions."],
                  ["Verified access", "Paid content is activated after payment verification."],
                ].map(([title, description], index) => (
                  <div
                    key={title}
                    className="animate-fade-up flex items-start gap-3 rounded-2xl border border-white/15 bg-white/8 p-4 backdrop-blur-sm"
                    style={{ animationDelay: `${220 + index * 90}ms` }}
                  >
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/12 text-blue-50">
                      <CheckIcon />
                    </span>
                    <div>
                      <p className="text-sm font-bold">{title}</p>
                      <p className="mt-1 text-xs leading-5 text-blue-100/85">{description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-blue-100/70">
              © {new Date().getFullYear()} Parho. All rights reserved.
            </p>
          </div>
        </aside>

        <section className="flex min-h-[100svh] items-start justify-center p-4 sm:p-6 lg:items-center lg:p-10 xl:p-12">
          <div className="w-full max-w-3xl animate-fade-up rounded-[28px] border border-slate-200 bg-white/95 p-5 shadow-[0_24px_70px_rgba(30,74,140,0.11)] backdrop-blur sm:p-8 xl:p-10">
            <div className="mb-7 flex items-center gap-3 lg:hidden">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2D67DF] p-2 shadow-md shadow-blue-200">
                <Image
                  src="/images/parho-logo.svg"
                  alt="Parho logo"
                  width={56}
                  height={56}
                  className="h-full w-full object-contain"
                  priority
                />
              </div>
              <div>
                <p className="text-xl font-extrabold tracking-tight text-slate-950">Parho</p>
                <p className="text-[11px] text-slate-500">Competitive Exam Preparation</p>
              </div>
            </div>

            <div className="mb-8">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#2D67DF]">
                Create your account
              </p>
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
                Start your preparation
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Select your test, enter your details and submit your payment transaction ID for
                verification.
              </p>
            </div>

            {showPaymentGuide && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
                role="dialog"
                aria-modal="true"
                aria-labelledby="payment-guide-title"
                onMouseDown={(event) => {
                  if (event.target === event.currentTarget) setShowPaymentGuide(false);
                }}
              >
                <div className="max-h-[88svh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl animate-fade-up sm:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#2D67DF]">
                        Payment Guide
                      </p>
                      <h3 id="payment-guide-title" className="mt-1 text-2xl font-extrabold text-slate-950">
                        How to Pay
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPaymentGuide(false)}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-100"
                      aria-label="Close payment guide"
                    >
                      <span className="text-xl leading-none" aria-hidden="true">×</span>
                    </button>
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4 sm:p-5">
                      <p className="text-sm font-extrabold text-slate-950">English</p>
                      <ol className="mt-3 space-y-2.5 text-sm leading-6 text-slate-600">
                        <li><span className="font-bold text-slate-800">1.</span> Select the course you want to purchase.</li>
                        <li><span className="font-bold text-slate-800">2.</span> Pay the course fee through JazzCash.</li>
                      </ol>
                      <div className="mt-3 rounded-xl border border-white bg-white p-3">
                        <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">JazzCash</p>
                        <p className="mt-1 text-base font-extrabold tracking-wide text-slate-900">0328 7267519</p>
                        <p className="text-base font-extrabold tracking-wide text-slate-900">0307 8557982</p>
                      </div>
                      <ol start={3} className="mt-3 space-y-2.5 text-sm leading-6 text-slate-600">
                        <li><span className="font-bold text-slate-800">3.</span> Keep your transaction ID after payment.</li>
                        <li><span className="font-bold text-slate-800">4.</span> Send the payment receipt/screenshot on WhatsApp to the same number you used for the payment.</li>
                        <li><span className="font-bold text-slate-800">5.</span> Enter the transaction ID on the signup form and submit it.</li>
                        <li><span className="font-bold text-slate-800">6.</span> We will verify your payment. After confirmation, your account will be approved for the course you selected.</li>
                      </ol>
                    </div>

                    <div dir="rtl" className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-right sm:p-5">
                      <p className="text-sm font-extrabold text-slate-950">اردو</p>
                      <ol className="mt-3 space-y-2.5 text-sm leading-7 text-slate-600">
                        <li><span className="font-bold text-slate-800">1۔</span> جس کورس کی تیاری کرنی ہے وہ منتخب کریں۔</li>
                        <li><span className="font-bold text-slate-800">2۔</span> JazzCash کے ذریعے کورس کی فیس ادا کریں۔</li>
                      </ol>
                      <div dir="ltr" className="mt-3 rounded-xl border border-white bg-white p-3 text-left">
                        <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">JazzCash</p>
                        <p className="mt-1 text-base font-extrabold tracking-wide text-slate-900">0328 7267519</p>
                        <p className="text-base font-extrabold tracking-wide text-slate-900">0307 8557982</p>
                      </div>
                      <ol start={3} className="mt-3 space-y-2.5 text-sm leading-7 text-slate-600">
                        <li><span className="font-bold text-slate-800">3۔</span> ادائیگی کے بعد Transaction ID محفوظ رکھیں۔</li>
                        <li><span className="font-bold text-slate-800">4۔</span> جس نمبر پر ادائیگی کی ہے، اسی نمبر پر WhatsApp کے ذریعے رسید یا اسکرین شاٹ بھیجیں۔</li>
                        <li><span className="font-bold text-slate-800">5۔</span> Signup فارم میں Transaction ID درج کرکے فارم جمع کریں۔</li>
                        <li><span className="font-bold text-slate-800">6۔</span> ہماری ٹیم آپ کی ادائیگی کی تصدیق کرے گی۔ تصدیق کے بعد منتخب کورس کے لیے آپ کا اکاؤنٹ منظور کر دیا جائے گا اور آپ لاگ اِن کر سکیں گے۔</li>
                      </ol>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-800">
                    <span className="font-bold">Important:</span> Do not send payment before checking the course you have selected. Keep the transaction ID and payment receipt until your registration is confirmed.
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowPaymentGuide(false)}
                    className="mt-5 flex h-11 w-full items-center justify-center rounded-xl bg-[#2D67DF] text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-px hover:bg-[#2358C7] focus:outline-none focus:ring-4 focus:ring-blue-100"
                  >
                    I Understand
                  </button>
                </div>
              </div>
            )}

            {success && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
                role="dialog"
                aria-modal="true"
                aria-labelledby="signup-success-title"
              >
                <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#2D67DF]">
                    <CheckIcon />
                  </div>
                  <h3
                    id="signup-success-title"
                    className="mt-5 text-center text-2xl font-extrabold text-slate-950"
                  >
                    Registration submitted
                  </h3>
                  <p className="mt-3 text-center text-sm leading-6 text-slate-500">
                    Your account is now{" "}
                    <span className="font-semibold text-slate-800">pending verification</span>.
                    After the payment is confirmed, your access can be activated.
                  </p>
                  <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-xs leading-5 text-slate-500">
                    Your registration has been submitted successfully and is pending payment verification.
                  </div>
                  <button
                    type="button"
                    onClick={() => setSuccess(false)}
                    className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-[#2D67DF] text-sm font-bold text-white shadow-lg shadow-blue-200 transition duration-200 hover:-translate-y-px hover:bg-[#2358C7] hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-100"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <FieldLabel htmlFor="test">Select Preparation Test</FieldLabel>
                <div className="relative">
                  <IconWrap>
                    <EducationIcon />
                  </IconWrap>
                  <select
                    id="test"
                    value={values.test}
                    onChange={(event) => updateField("test", event.target.value)}
                    className={`h-12 w-full appearance-none rounded-xl border bg-white pl-10 pr-11 text-sm font-medium outline-none transition focus:ring-4 ${
                      errors.test
                        ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                        : "border-slate-200 focus:border-[#2D67DF] focus:ring-blue-100"
                    } ${values.test ? "text-slate-900" : "text-slate-400"}`}
                  >
                    <option value="">Choose a preparation test</option>
                    {testOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <ChevronIcon />
                  </span>
                </div>
                {errors.test && <p className="mt-1.5 text-xs text-red-600">{errors.test}</p>}
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
                  <div className="relative">
                    <IconWrap>
                      <UserIcon />
                    </IconWrap>
                    <input
                      id="fullName"
                      type="text"
                      value={values.fullName}
                      onChange={(event) => updateField("fullName", event.target.value)}
                      placeholder="e.g. Muhammad Ali"
                      autoComplete="name"
                      className={inputClass(Boolean(errors.fullName))}
                    />
                  </div>
                  {errors.fullName && (
                    <p className="mt-1.5 text-xs text-red-600">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <FieldLabel htmlFor="whatsapp">WhatsApp Number</FieldLabel>
                  <div className="relative">
                    <IconWrap>
                      <PhoneIcon />
                    </IconWrap>
                    <input
                      id="whatsapp"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel"
                      maxLength={13}
                      value={values.whatsapp}
                      onChange={(event) =>
                        updateField("whatsapp", event.target.value.replace(/\D/g, "").slice(0, 13))
                      }
                      placeholder="e.g. 03001234567"
                      className={inputClass(Boolean(errors.whatsapp))}
                    />
                  </div>
                  <p className="mt-1.5 text-[11px] text-slate-400">11–13 digits required</p>
                  {errors.whatsapp && (
                    <p className="mt-1 text-xs text-red-600">{errors.whatsapp}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="email">Email Address</FieldLabel>
                  <div className="relative">
                    <IconWrap>
                      <MailIcon />
                    </IconWrap>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={values.email}
                      onChange={(event) => updateField("email", event.target.value)}
                      placeholder="e.g. ali@example.com"
                      className={inputClass(Boolean(errors.email))}
                    />
                  </div>
                  {errors.email && <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <FieldLabel htmlFor="education" optional>
                    Education
                  </FieldLabel>
                  <div className="relative">
                    <IconWrap>
                      <EducationIcon />
                    </IconWrap>
                    <input
                      id="education"
                      type="text"
                      autoComplete="organization-title"
                      value={values.education}
                      onChange={(event) => updateField("education", event.target.value)}
                      placeholder="e.g. BS Computer Science"
                      className={inputClass(false)}
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <div className="relative">
                    <IconWrap>
                      <LockIcon />
                    </IconWrap>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={values.password}
                      onChange={(event) => updateField("password", event.target.value)}
                      placeholder="Minimum 6 characters"
                      className={inputClass(Boolean(errors.password))}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      <EyeIcon open={showPassword} />
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1.5 text-xs text-red-600">{errors.password}</p>
                  )}
                </div>

                <div>
                  <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                  <div className="relative">
                    <IconWrap>
                      <LockIcon />
                    </IconWrap>
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={values.confirmPassword}
                      onChange={(event) => updateField("confirmPassword", event.target.value)}
                      placeholder="Re-enter your password"
                      className={inputClass(Boolean(errors.confirmPassword))}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((current) => !current)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      <EyeIcon open={showConfirmPassword} />
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1.5 text-xs text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4 sm:p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#2D67DF] shadow-sm">
                      <ReceiptIcon />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Payment details</p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Pay by JazzCash, send your receipt on WhatsApp, then enter the transaction ID.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPaymentGuide(true)}
                    className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl border border-blue-200 bg-white px-4 text-xs font-bold text-[#2D67DF] shadow-sm transition hover:-translate-y-px hover:border-blue-300 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-blue-100"
                  >
                    How to Pay
                  </button>
                </div>

                <div className="mt-4">
                  <FieldLabel htmlFor="transactionId">Transaction ID</FieldLabel>
                  <div className="relative">
                    <IconWrap>
                      <ReceiptIcon />
                    </IconWrap>
                    <input
                      id="transactionId"
                      type="text"
                      value={values.transactionId}
                      onChange={(event) => updateField("transactionId", event.target.value)}
                      placeholder="e.g. 1234567890"
                      autoComplete="off"
                      className={inputClass(Boolean(errors.transactionId))}
                    />
                  </div>
                  {errors.transactionId && (
                    <p className="mt-1.5 text-xs text-red-600">{errors.transactionId}</p>
                  )}
                </div>
              </div>

              <label className="flex items-start gap-3 text-xs leading-5 text-slate-500">
                <input
                  type="checkbox"
                  required
                  className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 accent-[#2D67DF]"
                />
                <span>
                  I confirm that the information above is correct and that the transaction ID
                  belongs to my selected preparation package.
                </span>
              </label>

              <button
                type="submit"
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#2D67DF] px-5 text-sm font-bold text-white shadow-lg shadow-blue-200 transition duration-200 hover:-translate-y-px hover:bg-[#2358C7] hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-100 active:scale-[0.99]"
              >
                Submit Registration
                <ArrowIcon />
              </button>

              <div className="flex flex-col items-center justify-between gap-2 border-t border-slate-100 pt-5 text-center text-sm text-slate-500 sm:flex-row sm:text-left">
                <p>Already have an account?</p>
                <Link href="/login" className="font-bold text-[#2D67DF] hover:underline">
                  Login to Parho
                </Link>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
