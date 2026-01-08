import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";

function parseAdminEmails() {
  const raw = process.env.ADMIN_EMAILS;
  if (!raw) return [];
  return raw
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

export async function requireAdminUser() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  const allowed = parseAdminEmails();
  if (allowed.length === 0) {
    redirect("/");
  }

  if (!allowed.includes(user.email.toLowerCase())) {
    redirect("/");
  }

  return user;
}
