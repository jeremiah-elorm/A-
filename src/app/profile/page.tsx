import Link from "next/link";
import { redirect } from "next/navigation";
import { ReminderFrequency } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/session";
import { hashPassword, verifyPassword } from "@/lib/auth";

async function updateProfile(formData: FormData) {
  "use server";
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  const name = formData.get("name")?.toString().trim() ?? "";
  const currentPassword = formData.get("currentPassword")?.toString() ?? "";
  const newPassword = formData.get("newPassword")?.toString() ?? "";

  const reminderEnabled = formData.get("reminderEnabled") === "on";
  const reminderFrequencyValue =
    formData.get("reminderFrequency")?.toString() ?? ReminderFrequency.WEEKLY;
  const reminderFrequency = Object.values(ReminderFrequency).includes(
    reminderFrequencyValue as ReminderFrequency
  )
    ? (reminderFrequencyValue as ReminderFrequency)
    : ReminderFrequency.WEEKLY;

  const updates: {
    name?: string | null;
    passwordHash?: string;
    reminderEnabled?: boolean;
    reminderFrequency?: ReminderFrequency;
  } = {};
  updates.name = name.length ? name : null;
  updates.reminderEnabled = reminderEnabled;
  updates.reminderFrequency = reminderFrequency;

  if (newPassword) {
    if (newPassword.length < 8) {
      redirect("/profile?error=Password must be at least 8 characters.");
    }
    const freshUser = await prisma.user.findUnique({
      where: { id: user.id },
    });
    if (!freshUser) {
      redirect("/login");
    }
    const ok = await verifyPassword(currentPassword, freshUser.passwordHash);
    if (!ok) {
      redirect("/profile?error=Current password is incorrect.");
    }
    updates.passwordHash = await hashPassword(newPassword);
  }

  await prisma.user.update({
    where: { id: user.id },
    data: updates,
  });

  redirect("/profile?success=Profile updated.");
}

export default async function ProfilePage({
  searchParams,
}: {
  searchParams?: { error?: string; success?: string };
}) {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-6 py-12">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Profile
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">
            Account settings
          </h1>
          <p className="mt-2 text-sm text-slate-600">{user.email}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/dashboard"
            className="rounded-full border border-sand px-4 py-2 text-sm font-semibold text-slate-700"
          >
            Back to dashboard
          </Link>
          <form action="/api/auth/logout" method="post">
            <button
              type="submit"
              className="rounded-full border border-sand px-4 py-2 text-sm font-semibold text-slate-700"
            >
              Logout
            </button>
          </form>
        </div>
      </header>

      {searchParams?.error && (
        <p className="text-sm text-rose-600">{searchParams.error}</p>
      )}
      {searchParams?.success && (
        <p className="text-sm text-emerald-600">{searchParams.success}</p>
      )}

      <form
        action={updateProfile}
        className="space-y-5 rounded-3xl border border-white/80 bg-white/90 p-6 shadow-card"
      >
        <label className="text-sm text-slate-600">
          Name
          <input
            name="name"
            defaultValue={user.name ?? ""}
            className="mt-2 w-full rounded-2xl border border-sand bg-white px-4 py-3"
            placeholder="Add your name"
          />
        </label>

        <div className="rounded-2xl border border-sand bg-white p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Change password
          </p>
          <div className="mt-3 grid gap-3">
            <label className="text-sm text-slate-600">
              Current password
              <input
                name="currentPassword"
                type="password"
                className="mt-2 w-full rounded-2xl border border-sand bg-white px-4 py-3"
              />
            </label>
            <label className="text-sm text-slate-600">
              New password
              <input
                name="newPassword"
                type="password"
                minLength={8}
                className="mt-2 w-full rounded-2xl border border-sand bg-white px-4 py-3"
              />
            </label>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Leave blank if you do not want to change your password.
          </p>
        </div>

        <div className="rounded-2xl border border-sand bg-white p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Email reminders
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Reminders are sent when you have not practiced recently.
          </p>
          <div className="mt-3 grid gap-3">
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                name="reminderEnabled"
                defaultChecked={user.reminderEnabled}
                className="h-4 w-4 rounded border-sand text-accent"
              />
              Enable reminders
            </label>
            <label className="text-sm text-slate-600">
              Frequency
              <select
                name="reminderFrequency"
                defaultValue={user.reminderFrequency}
                className="mt-2 w-full rounded-2xl border border-sand bg-white px-4 py-3"
              >
                <option value={ReminderFrequency.WEEKLY}>Weekly</option>
                <option value={ReminderFrequency.DAILY}>Daily</option>
              </select>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="rounded-2xl bg-accent px-5 py-3 text-base font-semibold text-white"
        >
          Save changes
        </button>
      </form>
    </div>
  );
}
