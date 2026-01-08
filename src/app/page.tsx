import Link from "next/link";
import { getSessionUser } from "@/lib/session";

export default async function HomePage() {
  const user = await getSessionUser();
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#fff7e3_0%,_#f8f4ea_45%,_#f0e6d6_100%)] shimmer" />
      <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-orange-200/60 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-amber-200/50 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-between px-4 py-8 sm:py-10 md:py-12">
        <header className="-mt-2 flex flex-wrap items-center justify-between gap-3 text-sm uppercase tracking-[0.25em] text-slate-700">
          <span className="ml-0 rounded-full bg-accent px-5 py-2 text-base font-semibold text-white shadow-card sm:-ml-20 md:-ml-28">
            A++
          </span>
        </header>

        <section className="grid gap-8 sm:gap-10 md:grid-cols-2">
          <div className="relative overflow-hidden rounded-3xl border border-white/60 shadow-card">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-70"
              style={{ backgroundImage: "url('/103940.jpg')" }}
            />
            <div className="absolute inset-0 bg-[rgba(90,52,18,0.8)]" />
            <div className="relative flex min-h-[clamp(260px,55vh,420px)] items-start justify-start px-6 pt-[clamp(28px,10vh,96px)] pb-[clamp(24px,8vh,64px)] text-center sm:px-8 md:px-10">
              <div className="w-full max-w-md space-y-4 text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/80 fade-up">
                  BECE & WASSCE prep
                </p>
                <h1 className="text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-6xl fade-up delay-1">
                  Real past questions. Instant clarity.
                </h1>
                <p className="text-base text-white/80 sm:text-lg md:text-xl fade-up delay-2">
                  Start practicing in under 30 seconds. See where you stand with scores,
                  topic gaps, and clear explanations that show your readiness.
                </p>
                <div className="flex flex-col items-center justify-center gap-2 pt-2 fade-up delay-3">
                  <div className="flex flex-col items-center gap-2">
                    <Link
                      href="/practice"
                      className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-card transition hover:-translate-y-0.5 ring-2 ring-white/70 sm:text-base"
                    >
                      Start Practicing
                    </Link>
                    <span className="text-sm text-white/90">
                      BECE & WASSCE aligned
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-sm font-semibold uppercase tracking-[0.2em]">
                    {user ? (
                      <>
                        <Link
                          href="/profile"
                          className="rounded-full bg-white px-4 py-2 text-slate-900 shadow-card ring-2 ring-white/70"
                        >
                          Profile
                        </Link>
                        <Link
                          href="/dashboard"
                          className="rounded-full bg-white px-4 py-2 text-slate-900 shadow-card ring-2 ring-white/70"
                        >
                          Dashboard
                        </Link>
                        <form action="/api/auth/logout" method="post">
                          <button
                            type="submit"
                            className="rounded-full bg-slate-900 px-4 py-2 text-white shadow-card"
                          >
                            Logout
                          </button>
                        </form>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          className="rounded-full bg-white px-4 py-2 text-slate-900 shadow-card ring-2 ring-white/70"
                        >
                          Login
                        </Link>
                        <Link
                          href="/signup"
                          className="rounded-full bg-accent px-4 py-2 text-white shadow-card"
                        >
                          Sign up
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden rounded-3xl border border-white/60 bg-white/85 p-5 shadow-card backdrop-blur md:block md:p-6">
            <div className="flex flex-col gap-4">
              <div className="overflow-hidden rounded-2xl border border-white/70 bg-white">
                <img
                  src="/2149610746.jpg"
                  alt="Ghanaian students preparing for exams"
                  className="h-40 w-full object-cover float-slow md:h-44"
                />
              </div>
              <div>
                <h2 className="text-lg font-semibold sm:text-xl">
                  Today&#39;s practice snapshot
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  Join learners across Ghana practicing with real past questions.
                </p>
              </div>
            </div>
            <div className="mt-4 grid gap-3 text-center">
              <div className="rounded-2xl bg-sand px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Question mix
                </p>
                <p className="text-lg font-semibold text-slate-800">
                  MCQ • Mathematics • 15 questions
                </p>
              </div>
              <div className="rounded-2xl bg-sand px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Timer
                </p>
                <p className="text-lg font-semibold text-slate-800">25 minutes</p>
              </div>
              <div className="rounded-2xl bg-sand px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Result insight
                </p>
                <p className="text-lg font-semibold text-slate-800">
                  Topic gaps highlighted instantly
                </p>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-8 flex flex-wrap items-center justify-center gap-4 text-center text-sm text-slate-500 sm:mt-10 md:mt-12">
          <span>Built for exam realism, not endless lessons.</span>
        </footer>
      </div>
    </div>
  );
}
