import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import {
  hashPassword,
  createSessionToken,
  hashSessionToken,
  sessionExpiryDate,
  sessionCookieOptions,
} from "@/lib/auth";

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(72),
  name: z.string().min(1).max(80).optional(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = signupSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid signup payload." }, { status: 400 });
  }

  const { email, password, name } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email already in use." }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const token = createSessionToken();
  const tokenHash = hashSessionToken(token);
  const expiresAt = sessionExpiryDate();

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name,
      sessions: {
        create: {
          tokenHash,
          expiresAt,
        },
      },
    },
  });

  await prisma.analyticsEvent.create({
    data: {
      name: "user_signup",
      metadata: {
        userId: user.id,
        email,
      },
    },
  });

  const response = NextResponse.json({ ok: true, userId: user.id });
  response.cookies.set("a++_session", token, sessionCookieOptions());
  return response;
}
