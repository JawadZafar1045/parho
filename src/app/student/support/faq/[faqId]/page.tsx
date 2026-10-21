import Link from "next/link";
import { notFound } from "next/navigation";

const faqAnswers = {
  "access-course": {
    question: "How do I access my purchased course?",
    answer: (
      <>
        <p>
          After submitting your JazzCash transaction ID, an administrator must verify the payment.
          Course access stays locked while verification is pending.
        </p>
        <p>
          Check{" "}
          <Link className="font-semibold text-[#2D67DF] hover:underline" href="/student/courses">
            My Courses
          </Link>{" "}
          for the payment status. Once the enrollment is verified, the course appears under Active
          Courses and its notes and learning features become available.
        </p>
      </>
    ),
  },
  "payment-verification": {
    question: "Where can I contact Parho for payment verification?",
    answer: (
      <>
        <p>
          Contact the support team at{" "}
          <a
            className="font-semibold text-[#2D67DF] hover:underline"
            href="mailto:support@parho.com"
          >
            support@parho.com
          </a>{" "}
          or by phone/WhatsApp at{" "}
          <a className="font-semibold text-[#2D67DF] hover:underline" href="tel:+923001234567">
            +92 300 1234567
          </a>
          , Monday to Saturday, 9:00 AM to 6:00 PM.
        </p>
        <p>
          Include the course name and JazzCash transaction ID so the team can locate your request.
          Never send your password or other account credentials.
        </p>
      </>
    ),
  },
  "reset-password": {
    question: "How do I reset my account or password?",
    answer: (
      <>
        <p>
          Self-service password reset is not currently available in the portal. Contact{" "}
          <a
            className="font-semibold text-[#2D67DF] hover:underline"
            href="mailto:support@parho.com"
          >
            support@parho.com
          </a>{" "}
          for account assistance.
        </p>
        <p>For your safety, do not share your current password or send it by email or WhatsApp.</p>
      </>
    ),
  },
  "technical-issues": {
    question: "Who do I contact for technical issues?",
    answer: (
      <>
        <p>
          Email{" "}
          <a
            className="font-semibold text-[#2D67DF] hover:underline"
            href="mailto:support@parho.com"
          >
            support@parho.com
          </a>{" "}
          or WhatsApp{" "}
          <a className="font-semibold text-[#2D67DF] hover:underline" href="tel:+923001234567">
            +92 300 1234567
          </a>
          , Monday to Saturday, 9:00 AM to 6:00 PM.
        </p>
        <p>
          Describe what you were doing and include the page name and a screenshot of the issue. Do
          not include passwords, payment credentials, or other sensitive information.
        </p>
      </>
    ),
  },
} as const;

type SupportFaqPageProps = {
  params: Promise<{ faqId: string }>;
};

export default async function SupportFaqPage({ params }: SupportFaqPageProps) {
  const { faqId } = await params;
  const faq = faqAnswers[faqId as keyof typeof faqAnswers];

  if (!faq) notFound();

  return (
    <main className="min-h-screen bg-[#F4F7FC] px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-8 lg:p-10">
          <Link
            href="/student/support"
            className="inline-flex min-h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-[#2D67DF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <span aria-hidden="true">←</span>
            Back to Help &amp; Support
          </Link>
          <article className="mt-6 border-t border-slate-200 pt-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2D67DF]">
              Frequently asked question
            </p>
            <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
              {faq.question}
            </h1>
            <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600">{faq.answer}</div>
          </article>
        </div>
      </div>
    </main>
  );
}
