import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/session";

const claimSchema = z.object({
  anonymousId: z.string().min(6),
});

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json();
  const parsed = claimSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid claim payload." }, { status: 400 });
  }

  const { anonymousId } = parsed.data;
  const result = await prisma.attempt.updateMany({
    where: { anonymousId, userId: null },
    data: { userId: user.id },
  });

  await prisma.analyticsEvent.create({
    data: {
      name: "anonymous_attempts_claimed",
      anonymousId,
      metadata: {
        userId: user.id,
        claimedCount: result.count,
      },
    },
  });

  return NextResponse.json({ ok: true, claimed: result.count });
}
