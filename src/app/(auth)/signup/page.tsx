import type { Metadata } from "next";
import SignupForm from "@/features/auth/components/SignupForm";

export const metadata: Metadata = {
  title: "Create Account | Parho",
  description: "Create your Parho account and submit your payment transaction for verification.",
};

export default function SignupPage() {
  return <SignupForm />;
}
