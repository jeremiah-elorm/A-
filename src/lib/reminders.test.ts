import { describe, expect, it } from "vitest";
import { isReminderDue } from "./reminders";
import type { ReminderFrequency } from "@prisma/client";

const now = new Date("2024-05-10T12:00:00Z");

function daysAgo(days: number) {
  return new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
}

describe("isReminderDue", () => {
  it("sends when no reminder has ever been sent", () => {
    const due = isReminderDue({
      frequency: "WEEKLY" as ReminderFrequency,
      lastReminderAt: null,
      lastAttemptAt: daysAgo(10),
      now,
    });

    expect(due).toBe(true);
  });

  it("does not send if within frequency window", () => {
    const due = isReminderDue({
      frequency: "DAILY" as ReminderFrequency,
      lastReminderAt: daysAgo(0.5),
      lastAttemptAt: daysAgo(5),
      now,
    });

    expect(due).toBe(false);
  });

  it("skips when the user practiced recently", () => {
    const due = isReminderDue({
      frequency: "WEEKLY" as ReminderFrequency,
      lastReminderAt: daysAgo(10),
      lastAttemptAt: daysAgo(2),
      now,
    });

    expect(due).toBe(false);
  });
});
