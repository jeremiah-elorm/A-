import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isReminderDue } from "@/lib/reminders";

const REMINDER_TOKEN = process.env.REMINDER_DISPATCH_TOKEN ?? "";
const WEBHOOK_URL = process.env.REMINDER_WEBHOOK_URL ?? "";
const WEBHOOK_SECRET = process.env.REMINDER_WEBHOOK_SECRET ?? "";

async function sendReminderEmail(payload: {
  email: string;
  name: string | null;
  frequency: string;
}) {
  if (!WEBHOOK_URL) {
    return { ok: false, error: "REMINDER_WEBHOOK_URL not configured." };
  }

  const response = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(WEBHOOK_SECRET ? { "X-Reminder-Secret": WEBHOOK_SECRET } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    return { ok: false, error: `Webhook failed with ${response.status}.` };
  }

  return { ok: true };
}

export async function POST(request: Request) {
  const token = request.headers.get("x-reminder-token") ?? "";
  if (!REMINDER_TOKEN || token !== REMINDER_TOKEN) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const now = new Date();
  const users = await prisma.user.findMany({
    where: { reminderEnabled: true },
  });

  if (users.length === 0) {
    return NextResponse.json({ ok: true, sent: 0, skipped: 0 });
  }

  const latestAttempts = await prisma.attempt.groupBy({
    by: ["userId"],
    _max: { createdAt: true },
    where: {
      userId: { in: users.map((user) => user.id) },
    },
  });

  const lastAttemptByUser = new Map(
    latestAttempts.map((attempt) => [attempt.userId, attempt._max.createdAt])
  );

  let sent = 0;
  let skipped = 0;
  const errors: Array<{ userId: string; error: string }> = [];

  for (const user of users) {
    const lastAttemptAt = lastAttemptByUser.get(user.id) ?? null;
    const due = isReminderDue({
      frequency: user.reminderFrequency,
      lastReminderAt: user.lastReminderAt ?? null,
      lastAttemptAt,
      now,
    });

    if (!due) {
      skipped += 1;
      continue;
    }

    const delivery = await sendReminderEmail({
      email: user.email,
      name: user.name,
      frequency: user.reminderFrequency,
    });

    if (!delivery.ok) {
      errors.push({ userId: user.id, error: delivery.error ?? "Unknown error" });
      continue;
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { lastReminderAt: now },
      }),
      prisma.analyticsEvent.create({
        data: {
          name: "reminder_sent",
          metadata: {
            userId: user.id,
            frequency: user.reminderFrequency,
          },
        },
      }),
    ]);

    sent += 1;
  }

  return NextResponse.json({ ok: true, sent, skipped, errors });
}
