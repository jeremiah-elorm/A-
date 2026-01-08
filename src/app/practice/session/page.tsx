import { Suspense } from "react";
import PracticeSessionClient from "./practice-session-client";

export default function PracticeSessionPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
          <p className="text-sm text-slate-600">Loading session...</p>
        </div>
      }
    >
      <PracticeSessionClient />
    </Suspense>
  );
}
