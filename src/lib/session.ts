import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { hashSessionToken } from "@/lib/auth";

export async function getSessionUser() {
  const store = await cookies();
  const token = store.get("a++_session")?.value;
  if (!token) {
    return null;
  }

  const tokenHash = hashSessionToken(token);
  const session = await prisma.session.findFirst({
    where: {
      tokenHash,
      expiresAt: { gt: new Date() },
    },
    include: { user: true },
  });

  return session?.user ?? null;
}
