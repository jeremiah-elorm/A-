import { Suspense } from "react";
import PracticeSetupClient from "./practice-setup-client";

export default function PracticePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
          <p className="text-sm text-slate-600">Loading practice setup...</p>
        </div>
      }
    >
      <PracticeSetupClient />
    </Suspense>
  );
}
