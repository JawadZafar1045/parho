import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSessionUser, SESSION_COOKIE_NAME } from "@/lib/auth/store";
import { AdminLayoutClient } from "./AdminLayoutClient";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const user = getSessionUser(token);

  if (!user || user.role !== "admin") {
    redirect("/login?error=admin_required");
  }

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
