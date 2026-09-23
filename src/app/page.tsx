import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F4F7FC] px-6">
      <section className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-[0_20px_60px_rgba(30,74,140,0.08)]">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#2D67DF]">Parho</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950">
          Exam Preparation Platform
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          The signup page is ready. Open it to test the responsive UI and frontend validation.
        </p>
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/signup"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#2D67DF] px-5 text-sm font-bold text-white shadow-md shadow-blue-200 transition hover:bg-[#2358C7]"
          >
            Open Signup Page
          </Link>
          <Link
            href="/login"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-slate-300 hover:shadow-md"
          >
            Open Login Page
          </Link>
        </div>
      </section>
    </main>
  );
}
