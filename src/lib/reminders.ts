import type { ReminderFrequency } from "@prisma/client";

export type ReminderCheck = {
  frequency: ReminderFrequency;
  lastReminderAt: Date | null;
  lastAttemptAt: Date | null;
  now?: Date;
};

const DAY_MS = 24 * 60 * 60 * 1000;

export function getFrequencyDays(frequency: ReminderFrequency) {
  return frequency === "DAILY" ? 1 : 7;
}

export function isReminderDue({
  frequency,
  lastReminderAt,
  lastAttemptAt,
  now = new Date(),
}: ReminderCheck) {
  const intervalMs = getFrequencyDays(frequency) * DAY_MS;
  const lastSentMs = lastReminderAt?.getTime() ?? 0;
  const lastAttemptMs = lastAttemptAt?.getTime() ?? 0;
  const nowMs = now.getTime();

  if (nowMs - lastSentMs < intervalMs) {
    return false;
  }

  if (lastAttemptMs && nowMs - lastAttemptMs < intervalMs) {
    return false;
  }

  return true;
}
