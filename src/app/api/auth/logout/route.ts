import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { hashSessionToken, sessionCookieOptions } from "@/lib/auth";

export async function POST(request: Request) {
  const store = await cookies();
  const token = store.get("a++_session")?.value;

  if (token) {
    const tokenHash = hashSessionToken(token);
    await prisma.session.deleteMany({ where: { tokenHash } });
  }

  const response = NextResponse.redirect(new URL("/", request.url));
  response.cookies.set("a++_session", "", { ...sessionCookieOptions(), maxAge: 0 });
  return response;
}
