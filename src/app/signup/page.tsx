"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAnonymousId } from "@/lib/storage";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name: name.trim() || undefined }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setError(data?.error ?? "Signup failed. Try again.");
        return;
      }

      const anonymousId = getAnonymousId();
      if (anonymousId) {
        await fetch("/api/auth/claim", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ anonymousId }),
        });
      }

      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-6 py-12">
      <header className="text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          Create your account
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Track progress</h1>
        <p className="mt-3 text-sm text-slate-600">
          Save your attempts and unlock progress tracking in Phase 2.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-3xl border border-white/80 bg-white/90 p-6 shadow-card"
      >
        <label className="text-sm text-slate-600">
          Name
          <input
            type="text"
            className="mt-2 w-full rounded-2xl border border-sand bg-white px-4 py-3"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Optional"
          />
        </label>
        <label className="text-sm text-slate-600">
          Email
          <input
            type="email"
            required
            className="mt-2 w-full rounded-2xl border border-sand bg-white px-4 py-3"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label className="text-sm text-slate-600">
          Password
          <input
            type="password"
            required
            minLength={8}
            className="mt-2 w-full rounded-2xl border border-sand bg-white px-4 py-3"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>

        {error && <p className="text-sm text-rose-600">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-2xl bg-accent px-4 py-3 text-base font-semibold text-white"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-slate-900">
          Log in
        </Link>
      </p>
    </div>
  );
}
