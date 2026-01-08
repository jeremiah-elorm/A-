import Link from "next/link";
import { redirect } from "next/navigation";
import { Difficulty, ExamType, QuestionType } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireAdminUser } from "@/lib/admin-auth";

const HEADER =
  "id,exam,subject,topic,year,paper,difficulty,type,prompt,options,correctIndex,explanation,markingGuide,sampleAnswer,imageUrl,imageAlt,imageCaption,published";
const EXAMS = ["BECE", "WASSCE"] as const;
const DIFFICULTIES = ["EASY", "MEDIUM", "HARD"] as const;
const QUESTION_TYPES = ["MCQ", "ESSAY"] as const;

function parseCsvLine(line: string) {
  return line.split(",").map((cell) => cell.trim());
}

function parseEnum<T extends string>(
  value: string,
  allowed: readonly T[],
  label: string
): T {
  const normalized = value.trim().toUpperCase() as T;
  if (!allowed.includes(normalized)) {
    throw new Error(`Invalid ${label}: ${value}`);
  }
  return normalized;
}

async function uploadCsv(formData: FormData) {
  "use server";
  await requireAdminUser();
  const csv = formData.get("csv")?.toString() ?? "";
  const lines = csv
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const rows = lines[0]?.startsWith("id,") ? lines.slice(1) : lines;
  const questions = rows.map((line) => {
    const [
      id,
      exam,
      subject,
      topic,
      year,
      paper,
      difficulty,
      type,
      prompt,
      options,
      correctIndex,
      explanation,
      markingGuide,
      sampleAnswer,
      imageUrl,
      imageAlt,
      imageCaption,
      published,
    ] = parseCsvLine(line);
    const examValue = parseEnum<ExamType>(exam, EXAMS, "exam");
    const difficultyValue = parseEnum<Difficulty>(
      difficulty,
      DIFFICULTIES,
      "difficulty"
    );
    const typeValue = parseEnum<QuestionType>(
      type,
      QUESTION_TYPES,
      "type"
    );

    if (imageUrl && !imageAlt) {
      throw new Error(`Image alt text is required for ${id}.`);
    }

    return {
      id,
      exam: examValue,
      subject,
      topic,
      year: Number(year),
      paper: paper || null,
      difficulty: difficultyValue,
      type: typeValue,
      prompt,
      options:
        typeValue === "ESSAY"
          ? []
          : options.split("|").map((opt) => opt.trim()),
      correctIndex:
        typeValue === "ESSAY"
          ? null
          : Number.isNaN(Number(correctIndex))
          ? null
          : Number(correctIndex),
      explanation: explanation || null,
      markingGuide: markingGuide || null,
      sampleAnswer: sampleAnswer || null,
      imageUrl: imageUrl || null,
      imageAlt: imageAlt || null,
      imageCaption: imageCaption || null,
      published: published.toLowerCase() !== "false",
    };
  });

  await prisma.$transaction(
    questions.map((question) =>
      prisma.question.upsert({
        where: { id: question.id },
        update: question,
        create: question,
      })
    )
  );

  redirect("/admin/questions");
}

export default async function UploadQuestionsPage() {
  await requireAdminUser();
  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 px-6 py-12">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Admin • Bulk upload
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">
            CSV question import
          </h1>
        </div>
        <Link
          href="/admin/questions"
          className="text-sm uppercase tracking-[0.2em] text-slate-500"
        >
          Back to list
        </Link>
      </header>

      <div className="rounded-2xl border border-sand bg-white p-4 text-sm text-slate-600">
        <p className="font-semibold text-slate-800">Expected header</p>
        <p className="mt-2 break-words">{HEADER}</p>
        <p className="mt-2">
          Use | to separate MCQ options. Keep commas out of fields for now.
        </p>
      </div>

      <form action={uploadCsv} className="space-y-4">
        <label className="text-sm text-slate-600">
          CSV content
          <textarea
            name="csv"
            rows={12}
            className="mt-2 w-full rounded-2xl border border-sand bg-white p-4 font-mono text-xs"
            placeholder={HEADER}
          />
        </label>
        <button
          type="submit"
          className="rounded-full bg-accent px-6 py-3 text-base font-semibold text-white"
        >
          Upload questions
        </button>
      </form>
    </div>
  );
}
