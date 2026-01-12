import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/session";
import { getRecommendations, getWeakTopics } from "@/lib/insights";
import { formatDuration } from "@/lib/format";

function formatDate(value: Date) {
  return value.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  const attempts = await prisma.attempt.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const insightAttempts = attempts.map((attempt) => ({
    exam: attempt.exam,
    subject: attempt.subject,
    topicBreakdown: attempt.topicBreakdown,
    createdAt: attempt.createdAt,
    scorePercent: attempt.scorePercent,
  }));
  const weakTopics = getWeakTopics(insightAttempts);
  const recommendations = getRecommendations(insightAttempts);

  const scored = attempts.filter((attempt) => attempt.scorePercent !== null);
  const recentScores = scored.slice(0, 5);
  const latest = scored[0]?.scorePercent ?? null;
  const previous = scored[1]?.scorePercent ?? null;
  const trend =
    latest !== null && previous !== null
      ? latest > previous
        ? "up"
        : latest < previous
        ? "down"
        : "flat"
      : "flat";
  const avgScore =
    scored.length > 0
      ? Math.round(
          scored.reduce((sum, attempt) => sum + (attempt.scorePercent ?? 0), 0) /
            scored.length
        )
      : null;

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-6 py-12">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Dashboard
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">
            Welcome{user.name ? `, ${user.name}` : ""}
          </h1>
          <p className="mt-2 text-sm text-slate-600">{user.email}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">
            Reminders: {user.reminderEnabled ? user.reminderFrequency : "Off"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/profile"
            className="rounded-full border border-sand px-4 py-2 text-sm font-semibold text-slate-700"
          >
            Profile
          </Link>
          <Link
            href="/practice"
            className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white"
          >
            New practice
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

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-white/80 bg-white/90 p-5 shadow-card">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Total attempts
          </p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {attempts.length}
          </p>
        </div>
        <div className="rounded-3xl border border-white/80 bg-white/90 p-5 shadow-card">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Average score
          </p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {avgScore !== null ? `${avgScore}%` : "—"}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Trend:{" "}
            {trend === "up"
              ? "Improving"
              : trend === "down"
              ? "Slipping"
              : "Flat"}
          </p>
        </div>
        <div className="rounded-3xl border border-white/80 bg-white/90 p-5 shadow-card">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Last attempt
          </p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {attempts[0] ? formatDate(attempts[0].createdAt) : "—"}
          </p>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-white/80 bg-white/90 p-6 shadow-card">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-slate-900">Weak topics</h2>
            <span className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Last attempts
            </span>
          </div>
          {weakTopics.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-sand p-5 text-sm text-slate-600">
              Complete a few MCQ attempts to surface your weakest topics.
            </div>
          ) : (
            <div className="mt-4 grid gap-3">
              {weakTopics.map((topic) => (
                <div
                  key={`${topic.exam}-${topic.subject}-${topic.topic}`}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-sand bg-white px-4 py-3 text-sm"
                >
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      {topic.exam} • {topic.subject}
                    </p>
                    <p className="mt-1 text-base font-semibold text-slate-900">
                      {topic.topic}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-semibold text-slate-900">
                      {topic.accuracy}%
                    </p>
                    <p className="text-xs text-slate-500">
                      {topic.correct}/{topic.total} correct
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-white/80 bg-white/90 p-6 shadow-card">
          <h2 className="text-xl font-semibold text-slate-900">
            Recommended practice
          </h2>
          {recommendations.length === 0 ? (
            <p className="mt-4 text-sm text-slate-600">
              Take a scored attempt to unlock personalized recommendations.
            </p>
          ) : (
            <div className="mt-4 grid gap-3">
              {recommendations.map((item) => (
                <div
                  key={`${item.exam}-${item.subject}-${item.topic}`}
                  className="rounded-2xl border border-sand bg-white px-4 py-3 text-sm"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    {item.exam} • {item.subject}
                  </p>
                  <p className="mt-1 text-base font-semibold text-slate-900">
                    {item.topic}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{item.reason}</p>
                  <Link
                    href={`/practice?exam=${item.exam}&subject=${encodeURIComponent(
                      item.subject
                    )}`}
                    className="mt-3 inline-flex rounded-full border border-sand px-3 py-1 text-xs font-semibold text-slate-700"
                  >
                    Practice now
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="rounded-3xl border border-white/80 bg-white/90 p-6 shadow-card">
        <h2 className="text-xl font-semibold text-slate-900">Recent attempts</h2>
        {attempts.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-sand p-6 text-center">
            <p className="text-sm text-slate-600">
              No attempts yet. Start a practice session to see results here.
            </p>
          </div>
        ) : (
          <div className="mt-4 grid gap-3">
            {recentScores.length > 0 && (
              <div className="rounded-2xl border border-dashed border-sand bg-white px-4 py-3 text-sm text-slate-600">
                Last scores: {recentScores.map((attempt) => attempt.scorePercent).join(", ")}
              </div>
            )}
            {attempts.map((attempt) => (
              <div
                key={attempt.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-sand bg-white px-4 py-3 text-sm"
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    {attempt.exam} • {attempt.subject}
                  </p>
                  <p className="mt-1 text-base font-semibold text-slate-900">
                    {attempt.type} • {attempt.timed ? "Timed" : "Untimed"}
                  </p>
                  {attempt.mode === "SIMULATION" && (
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">
                      Simulation
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-base font-semibold text-slate-900">
                    {attempt.scorePercent !== null
                      ? `${attempt.scorePercent}%`
                      : "Self-assess"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatDuration(attempt.durationSec ?? 0)} •{" "}
                    {formatDate(attempt.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
