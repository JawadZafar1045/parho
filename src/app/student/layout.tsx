import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSessionUser, SESSION_COOKIE_NAME } from "@/lib/auth/store";

export default async function StudentLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;

  if (!getSessionUser(token)) {
    redirect("/login");
  }

  return children;
}
