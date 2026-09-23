import Image from "next/image";
import Link from "next/link";
import { CheckIcon, SparkIcon } from "./AuthIcons";

type AuthBrandPanelProps = {
  mode: "signup" | "login";
};

const copy = {
  signup: {
    eyebrow: "Prepare with purpose",
    title: "Your preparation starts here.",
    description:
      "Build a focused study routine with structured notes, practice quizzes and paid preparation resources for competitive tests.",
    cards: [
      ["Focused resources", "Notes organized around the test you choose."],
      ["Practice quizzes", "Check your preparation with exam-style questions."],
      ["Verified access", "Paid content is activated after payment verification."],
    ],
  },
  login: {
    eyebrow: "Welcome back",
    title: "Keep your preparation moving.",
    description:
      "Sign in to continue with your notes, quizzes and the preparation resources you have unlocked.",
    cards: [
      ["Your resources", "Continue from the preparation package you selected."],
      ["Practice anytime", "Use your saved quizzes and revision material on any device."],
      ["Secure access", "Your account and paid resources stay behind your sign-in."],
    ],
  },
} as const;

export default function AuthBrandPanel({ mode }: AuthBrandPanelProps) {
  const content = copy[mode];

  return (
    <aside className="relative hidden min-h-screen overflow-hidden bg-[#205ED1] text-white lg:flex lg:flex-col lg:justify-between">
      <div className="pointer-events-none absolute -left-28 -top-32 h-96 w-96 rounded-full bg-white/10 blur-3xl auth-orb auth-orb-one" />
      <div className="pointer-events-none absolute -bottom-36 -right-16 h-[28rem] w-[28rem] rounded-full bg-sky-300/15 blur-3xl auth-orb auth-orb-two" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-40 w-40 -translate-x-1/2 rounded-full border border-white/10 auth-spin" />
      <div className="absolute inset-y-0 right-0 w-px bg-white/10" />

      <div className="relative z-10 flex h-full flex-col justify-between px-9 py-9 xl:px-12 xl:py-12">
        <div>
          <Link
            href="/"
            className="group inline-flex items-center gap-3 outline-none"
            aria-label="Parho home"
          >
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-white/12 p-2 shadow-lg ring-1 ring-white/20 backdrop-blur transition duration-300 group-hover:-translate-y-0.5 group-hover:bg-white/16">
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
          </Link>

          <div className="mt-14 max-w-xl animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-blue-50 ring-1 ring-white/15">
              <SparkIcon className="h-4 w-4" />
              {content.eyebrow}
            </span>
            <h1 className="mt-5 max-w-lg text-4xl font-extrabold leading-[1.04] tracking-[-0.035em] xl:text-5xl">
              {content.title}
            </h1>
            <p className="mt-5 max-w-lg text-sm leading-7 text-blue-50/90 xl:text-base">
              {content.description}
            </p>
          </div>

          <div className="mt-10 grid max-w-2xl gap-3">
            {content.cards.map(([title, description], index) => (
              <div
                key={title}
                className="animate-fade-up flex items-start gap-3 rounded-2xl border border-white/15 bg-white/8 p-4 backdrop-blur-sm"
                style={{ animationDelay: `${180 + index * 90}ms` }}
              >
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/12 text-blue-50">
                  <CheckIcon className="h-4 w-4" />
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
  );
}
