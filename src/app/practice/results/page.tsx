import { Suspense } from "react";
import PracticeResultsClient from "./practice-results-client";

export default function PracticeResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
          <p className="text-sm text-slate-600">Loading results...</p>
        </div>
      }
    >
      <PracticeResultsClient />
    </Suspense>
  );
}
