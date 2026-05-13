import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

const defaultAdminEmails = ["mailme@himal.info.np"];

export function getAdminEmails() {
  const fromEnv = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  return new Set([...defaultAdminEmails, ...fromEnv]);
}

export function isAdminEmail(email?: string | null) {
  if (!email) return false;
  return getAdminEmails().has(email.trim().toLowerCase());
}

export async function requireAdminSession() {
  const session = await auth();

  if (!session?.user?.email || !isAdminEmail(session.user.email)) {
    redirect("/auth/login");
  }

  return session;
}
