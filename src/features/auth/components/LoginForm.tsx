"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent, type ReactNode } from "react";
import { loginSchema, type LoginFormValues } from "@/features/auth/validations/login";
import AuthBrandPanel from "./AuthBrandPanel";
import { ArrowIcon, EyeIcon, GoogleIcon, LockIcon, MailIcon } from "./AuthIcons";

const examTracks = ["PPSC", "FPSC", "PMS", "CSS", "NTS"];

const initialValues: LoginFormValues = {
  email: "",
  password: "",
  remember: false,
};

type FormErrors = Partial<Record<keyof LoginFormValues, string>>;

function IconWrap({ children }: { children: ReactNode }) {
  return (
    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
      {children}
    </span>
  );
}

function inputClass(error: boolean) {
  return `h-12 w-full rounded-xl border bg-white pl-10 pr-11 text-sm text-slate-900 shadow-sm outline-none transition duration-200 placeholder:text-slate-400 focus:-translate-y-px focus:ring-4 ${
    error
      ? "border-red-300 focus:border-red-500 focus:ring-red-100"
      : "border-slate-200 focus:border-[#2D67DF] focus:ring-blue-100"
  }`;
}

export default function LoginForm() {
  const [values, setValues] = useState<LoginFormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [socialMessage, setSocialMessage] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function updateField<K extends keyof LoginFormValues>(field: K, value: LoginFormValues[K]) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitted(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = loginSchema.safeParse(values);

    if (!result.success) {
      const nextErrors: FormErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof LoginFormValues | undefined;
        if (field && !nextErrors[field]) nextErrors[field] = issue.message;
      }
      setErrors(nextErrors);
      setSubmitted(false);
      return;
    }

    setErrors({});
    setSubmitted(true);
  }

  return (
    <main className="min-h-[100svh] overflow-x-hidden bg-[#F4F7FC] text-slate-900">
      <div className="auth-page-grid mx-auto flex min-h-screen w-full max-w-[1440px] flex-col overflow-hidden lg:grid lg:grid-cols-[0.88fr_1.12fr]">
        <AuthBrandPanel mode="login" />

        <section className="relative flex min-h-[100svh] items-center justify-center px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10 xl:px-14">
          <div className="pointer-events-none absolute inset-0 overflow-hidden lg:hidden">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-100 blur-3xl" />
            <div className="absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-indigo-100 blur-3xl" />
          </div>

          <div className="relative z-10 w-full max-w-[500px] animate-fade-up">
            <div className="mb-6 flex items-center justify-between gap-4 lg:hidden">
              <Link href="/" className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-[#2D67DF] p-1.5 shadow-md shadow-blue-200">
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
              </Link>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white/95 p-5 shadow-[0_24px_70px_rgba(30,74,140,0.11)] backdrop-blur sm:p-8">
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-[#2D67DF] p-2 shadow-lg shadow-blue-200 ring-1 ring-blue-500/10 auth-logo-bob">
                  <Image
                    src="/images/parho-logo.svg"
                    alt="Parho logo"
                    width={56}
                    height={56}
                    className="h-full w-full object-contain"
                    priority
                  />
                </div>
                <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.15em] text-[#2D67DF]">
                  Secure student access
                </p>
                <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-[30px]">
                  Welcome back
                </h1>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                  Sign in to continue your competitive exam preparation.
                </p>
              </div>

              <div
                className="mt-5 flex flex-wrap justify-center gap-1.5"
                aria-label="Supported preparation tracks"
              >
                {examTracks.map((track) => (
                  <span
                    key={track}
                    className="rounded-md border border-slate-100 bg-slate-50 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-slate-500"
                  >
                    {track}
                  </span>
                ))}
              </div>

              {socialMessage && (
                <div
                  className="mt-5 rounded-xl border border-blue-100 bg-blue-50 px-3.5 py-3 text-xs leading-5 text-blue-800"
                  role="status"
                >
                  Google sign-in will be connected when the authentication backend is enabled.
                </div>
              )}

              <button
                type="button"
                onClick={() => setSocialMessage(true)}
                className="mt-6 flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition duration-200 hover:-translate-y-px hover:border-slate-300 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-blue-100 active:translate-y-0"
              >
                <GoogleIcon className="h-5 w-5" />
                Continue with Google
              </button>

              <div className="my-6 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                <span className="h-px flex-1 bg-slate-100" />
                or continue with email
                <span className="h-px flex-1 bg-slate-100" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-[11px] font-bold uppercase tracking-[0.08em] text-slate-800"
                  >
                    Registered Email <span className="text-[#2D67DF]">*</span>
                  </label>
                  <div className="relative">
                    <IconWrap>
                      <MailIcon className="h-4 w-4" />
                    </IconWrap>
                    <input
                      id="email"
                      type="email"
                      value={values.email}
                      onChange={(event) => updateField("email", event.target.value)}
                      placeholder="e.g. ali@example.com"
                      autoComplete="email"
                      className={inputClass(Boolean(errors.email))}
                    />
                  </div>
                  {errors.email && <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-[11px] font-bold uppercase tracking-[0.08em] text-slate-800"
                  >
                    Password <span className="text-[#2D67DF]">*</span>
                  </label>
                  <div className="relative">
                    <IconWrap>
                      <LockIcon className="h-4 w-4" />
                    </IconWrap>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={values.password}
                      onChange={(event) => updateField("password", event.target.value)}
                      placeholder="Enter your Parho password"
                      autoComplete="current-password"
                      className={inputClass(Boolean(errors.password))}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      <EyeIcon open={showPassword} className="h-4 w-4" />
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1.5 text-xs text-red-600">{errors.password}</p>
                  )}
                </div>

                <div className="flex flex-col gap-3 text-xs sm:flex-row sm:items-start sm:justify-between">
                  <label className="flex items-start gap-2.5 text-slate-500">
                    <input
                      type="checkbox"
                      checked={values.remember}
                      onChange={(event) => updateField("remember", event.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-[#2D67DF]"
                    />
                    <span>Keep me signed in on this device</span>
                  </label>
                  <span className="text-left leading-5 text-slate-400 sm:max-w-[205px] sm:text-right">
                    Forgot your password? Please contact our team.
                  </span>
                </div>

                {submitted && (
                  <div
                    className="rounded-xl border border-blue-100 bg-blue-50 px-3.5 py-3 text-xs leading-5 text-blue-800"
                    role="status"
                  >
                    Login form is ready. Authentication API integration will be connected next.
                  </div>
                )}

                <button
                  type="submit"
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#2D67DF] px-5 text-sm font-bold text-white shadow-lg shadow-blue-200 transition duration-200 hover:-translate-y-px hover:bg-[#2358C7] hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-100 active:translate-y-0"
                >
                  Login to Parho
                  <ArrowIcon className="h-4 w-4" />
                </button>
              </form>

              <div className="mt-6 border-t border-slate-100 pt-5 text-center text-sm text-slate-500">
                Don&apos;t have a Parho account?{" "}
                <Link href="/signup" className="font-bold text-[#2D67DF] hover:underline">
                  Register for Parho
                </Link>
              </div>
            </div>

            <p className="mt-5 text-center text-[11px] text-slate-400">
              © {new Date().getFullYear()} Parho · Competitive Exam Preparation
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
