import Link from "next/link";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdminUser } from "@/lib/admin-auth";

async function togglePublish(formData: FormData) {
  "use server";
  await requireAdminUser();
  const id = formData.get("id")?.toString();
  const published = formData.get("published") === "true";
  if (!id) return;
  await prisma.question.update({
    where: { id },
    data: { published: !published },
  });
  revalidatePath("/admin/questions");
}

export default async function AdminQuestionsPage() {
  await requireAdminUser();
  const questions = await prisma.question.findMany({
    orderBy: [{ exam: "asc" }, { subject: "asc" }, { year: "desc" }],
  });

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-6 py-12">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Admin
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">Question bank</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/questions/upload"
            className="rounded-full border border-sand px-4 py-2 text-sm font-semibold text-slate-700"
          >
            Bulk upload CSV
          </Link>
          <Link
            href="/admin/questions/new"
            className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white"
          >
            New question
          </Link>
        </div>
      </header>

      <div className="grid gap-4">
        {questions.map((question) => (
          <div
            key={question.id}
            className="rounded-2xl border border-sand bg-white p-4 shadow-card"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  {question.exam} • {question.subject} • {question.year}
                </p>
                <p className="mt-1 text-base font-semibold text-slate-900">
                  {question.prompt}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {question.topic} • {question.type} • {question.difficulty}
                  {question.imageUrl ? " • Image" : ""}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/admin/questions/${question.id}/edit`}
                  className="rounded-full border border-sand px-4 py-2 text-xs font-semibold text-slate-700"
                >
                  Edit
                </Link>
                <form action={togglePublish}>
                  <input type="hidden" name="id" value={question.id} />
                  <input
                    type="hidden"
                    name="published"
                    value={String(question.published)}
                  />
                  <button
                    type="submit"
                    className="rounded-full bg-sand px-4 py-2 text-xs font-semibold text-slate-700"
                  >
                    {question.published ? "Unpublish" : "Publish"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
