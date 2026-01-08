import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { parseQuestionFormData } from "@/lib/admin-questions";
import { requireAdminUser } from "@/lib/admin-auth";

async function updateQuestion(formData: FormData) {
  "use server";
  await requireAdminUser();
  const parsed = parseQuestionFormData(formData);
  if (!parsed.ok) {
    const error = encodeURIComponent("Invalid question data.");
    redirect(`/admin/questions/${formData.get("id")}/edit?error=${error}`);
  }

  await prisma.question.update({
    where: { id: parsed.data.id },
    data: parsed.data,
  });

  redirect("/admin/questions");
}

export default async function EditQuestionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: { error?: string };
}) {
  await requireAdminUser();
  const { id } = await params;
  const question = await prisma.question.findUnique({
    where: { id },
  });

  if (!question) {
    redirect("/admin/questions");
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 px-6 py-12">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Admin • Edit question
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">{question.id}</h1>
        </div>
        <Link
          href="/admin/questions"
          className="text-sm uppercase tracking-[0.2em] text-slate-500"
        >
          Back to list
        </Link>
      </header>

      {searchParams?.error && (
        <p className="text-sm text-rose-600">{searchParams.error}</p>
      )}

      <form action={updateQuestion} className="space-y-5">
        <input type="hidden" name="id" value={question.id} />
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm text-slate-600">
            Exam
            <select
              name="exam"
              className="mt-2 w-full rounded-2xl border border-sand bg-white px-4 py-3"
              defaultValue={question.exam}
            >
              <option value="BECE">BECE</option>
              <option value="WASSCE">WASSCE</option>
            </select>
          </label>
          <label className="text-sm text-slate-600">
            Subject
            <input
              name="subject"
              required
              className="mt-2 w-full rounded-2xl border border-sand bg-white px-4 py-3"
              defaultValue={question.subject}
            />
          </label>
          <label className="text-sm text-slate-600">
            Topic
            <input
              name="topic"
              required
              className="mt-2 w-full rounded-2xl border border-sand bg-white px-4 py-3"
              defaultValue={question.topic}
            />
          </label>
          <label className="text-sm text-slate-600">
            Year
            <input
              name="year"
              type="number"
              required
              className="mt-2 w-full rounded-2xl border border-sand bg-white px-4 py-3"
              defaultValue={question.year}
            />
          </label>
          <label className="text-sm text-slate-600">
            Paper (optional)
            <input
              name="paper"
              className="mt-2 w-full rounded-2xl border border-sand bg-white px-4 py-3"
              defaultValue={question.paper ?? ""}
            />
          </label>
          <label className="text-sm text-slate-600">
            Difficulty
            <select
              name="difficulty"
              className="mt-2 w-full rounded-2xl border border-sand bg-white px-4 py-3"
              defaultValue={question.difficulty}
            >
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </label>
          <label className="text-sm text-slate-600">
            Type
            <select
              name="type"
              className="mt-2 w-full rounded-2xl border border-sand bg-white px-4 py-3"
              defaultValue={question.type}
            >
              <option value="MCQ">MCQ</option>
              <option value="ESSAY">Essay</option>
            </select>
          </label>
        </div>

        <label className="text-sm text-slate-600">
          Prompt
          <textarea
            name="prompt"
            required
            rows={4}
            className="mt-2 w-full rounded-2xl border border-sand bg-white p-4"
            defaultValue={question.prompt}
          />
        </label>

        <label className="text-sm text-slate-600">
          Options (MCQ only, one per line)
          <textarea
            name="options"
            rows={4}
            className="mt-2 w-full rounded-2xl border border-sand bg-white p-4"
            defaultValue={question.options.join("\n")}
          />
        </label>

        <label className="text-sm text-slate-600">
          Correct option index (0-based, MCQ only)
          <input
            name="correctIndex"
            type="number"
            className="mt-2 w-full rounded-2xl border border-sand bg-white px-4 py-3"
            defaultValue={question.correctIndex ?? 0}
          />
        </label>

        <label className="text-sm text-slate-600">
          Explanation (MCQ only)
          <textarea
            name="explanation"
            rows={3}
            className="mt-2 w-full rounded-2xl border border-sand bg-white p-4"
            defaultValue={question.explanation ?? ""}
          />
        </label>

        <label className="text-sm text-slate-600">
          Marking guide (Essay only)
          <textarea
            name="markingGuide"
            rows={3}
            className="mt-2 w-full rounded-2xl border border-sand bg-white p-4"
            defaultValue={question.markingGuide ?? ""}
          />
        </label>

        <label className="text-sm text-slate-600">
          Sample answer (Essay only)
          <textarea
            name="sampleAnswer"
            rows={3}
            className="mt-2 w-full rounded-2xl border border-sand bg-white p-4"
            defaultValue={question.sampleAnswer ?? ""}
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm text-slate-600">
            Image URL (optional)
            <input
              name="imageUrl"
              className="mt-2 w-full rounded-2xl border border-sand bg-white px-4 py-3"
              defaultValue={question.imageUrl ?? ""}
              placeholder="/questions/diagrams/heart.svg"
            />
          </label>
          <label className="text-sm text-slate-600">
            Image alt text
            <input
              name="imageAlt"
              className="mt-2 w-full rounded-2xl border border-sand bg-white px-4 py-3"
              defaultValue={question.imageAlt ?? ""}
              placeholder="Diagram of the human heart"
            />
          </label>
        </div>

        <label className="text-sm text-slate-600">
          Image caption (optional)
          <input
            name="imageCaption"
            className="mt-2 w-full rounded-2xl border border-sand bg-white px-4 py-3"
            defaultValue={question.imageCaption ?? ""}
            placeholder="Figure 1: Human heart (front view)"
          />
        </label>

        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            name="published"
            type="checkbox"
            defaultChecked={question.published}
            className="h-4 w-4 rounded border-sand"
          />
          Published
        </label>

        <button
          type="submit"
          className="rounded-full bg-accent px-6 py-3 text-base font-semibold text-white"
        >
          Update question
        </button>
      </form>
    </div>
  );
}
