import Link from "next/link";

const supportOptions = [
  {
    title: "Email Support",
    value: "support@parho.com",
    detail: "For admissions, courses, account help, and general support.",
  },
  {
    title: "Phone",
    value: "+92 300 1234567",
    detail: "Available Monday to Saturday, 9:00 AM to 6:00 PM.",
  },
  {
    title: "WhatsApp",
    value: "+92 300 1234567",
    detail: "Fast responses for quick course and payment questions.",
  },
];

const faqItems = [
  "How do I access my purchased course?",
  "Where can I contact Parho for payment verification?",
  "How do I reset my account or password?",
  "Who do I contact for technical issues?",
];

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-[#F4F7FC] px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-8 lg:p-10">
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2D67DF]">Support Center</p>
              <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Help & Support</h1>
            </div>
            <Link href="/student/dashboard" className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-[#2D67DF]">
              Back to dashboard
            </Link>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
            <section className="space-y-5">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-bold text-slate-500">Need help with your account?</p>
                <h2 className="mt-2 text-2xl font-black text-slate-950">We are here for you.</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Reach out to Parho for course access, payment confirmation, account support, and any learning-related questions. Our team responds as quickly as possible to keep your preparation on track.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {supportOptions.map((item) => (
                  <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#2D67DF]">{item.title}</p>
                    <p className="mt-3 text-base font-extrabold text-slate-950">{item.value}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.detail}</p>
                  </div>
                ))}
              </div>
            </section>

            <aside className="rounded-2xl border border-blue-100 bg-[#F3F7FF] p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2D67DF]">Quick info</p>
              <div className="mt-5 space-y-4 text-sm text-slate-700">
                <div>
                  <p className="font-bold text-slate-900">Email</p>
                  <a href="mailto:support@parho.com" className="mt-1 block text-[#2D67DF] hover:underline">support@parho.com</a>
                </div>
                <div>
                  <p className="font-bold text-slate-900">Phone</p>
                  <a href="tel:+923001234567" className="mt-1 block text-[#2D67DF] hover:underline">+92 300 1234567</a>
                </div>
                <div>
                  <p className="font-bold text-slate-900">Office Hours</p>
                  <p className="mt-1">Mon - Sat • 9:00 AM to 6:00 PM</p>
                </div>
                <div>
                  <p className="font-bold text-slate-900">Location</p>
                  <p className="mt-1">Parho Support Desk, Lahore, Pakistan</p>
                </div>
              </div>
            </aside>
          </div>

          <section className="mt-10">
            <h2 className="text-2xl font-black text-slate-950">Frequently asked questions</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {faqItems.map((item) => (
                <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
