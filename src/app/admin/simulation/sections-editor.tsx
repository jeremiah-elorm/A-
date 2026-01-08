"use client";

import { useMemo, useState } from "react";
import { SIMULATION_SECTION_SCHEMA } from "@/lib/simulation";

type Props = {
  name: string;
  label: string;
  defaultValue: string;
};

type ParsedSection = {
  id: string;
  label: string;
  type: string;
  durationMinutes: number;
  questionCount: number;
  topics?: string[];
};
type ParsedResult =
  | { ok: true; sections: ParsedSection[] }
  | { ok: false; error: string };

export function SectionsEditor({ name, label, defaultValue }: Props) {
  const [value, setValue] = useState(defaultValue);

  const parsed: ParsedResult = useMemo(() => {
    try {
      const json = JSON.parse(value);
      if (!Array.isArray(json)) {
        return { ok: false, error: "Sections must be a JSON array." };
      }
      const parsedSections = json.map((entry) =>
        SIMULATION_SECTION_SCHEMA.parse(entry)
      ) as ParsedSection[];
      return { ok: true, sections: parsedSections };
    } catch (error) {
      return {
        ok: false,
        error:
          error instanceof Error ? error.message : "Invalid JSON format.",
      };
    }
  }, [value]);

  const missingQuestionCount = useMemo(() => {
    if (!parsed.ok) return 0;
    return parsed.sections.filter((section) => !section.questionCount).length;
  }, [parsed]);

  return (
    <div className="space-y-3">
      <label className="text-sm text-slate-600">
        {label}
        <textarea
          name={name}
          required
          rows={6}
          className="mt-2 w-full rounded-2xl border border-sand bg-white p-4 text-sm"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      </label>

      <div className="rounded-2xl border border-sand bg-white p-4 text-sm text-slate-600">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          Preview
        </p>
        {missingQuestionCount > 0 && (
          <p className="mt-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
            Add questionCount to every section for full-paper simulations.
          </p>
        )}
        {parsed.ok ? (
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {parsed.sections.map((section) => (
              <div
                key={section.id}
                className="rounded-xl border border-sand bg-sand/40 px-3 py-2"
              >
                <p className="font-semibold text-slate-700">{section.label}</p>
                <p className="text-xs text-slate-500">
                  {section.type} • {section.durationMinutes} min
                </p>
                <p className="text-xs text-slate-500">
                  {section.questionCount} questions
                </p>
                {section.topics?.length ? (
                  <p className="text-xs text-slate-500">
                    Topics: {section.topics.join(", ")}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-rose-600">{parsed.error}</p>
        )}
      </div>
    </div>
  );
}
