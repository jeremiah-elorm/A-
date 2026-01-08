import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { parseSimulationForm } from "@/lib/admin-simulation";
import { SectionsEditor } from "@/app/admin/simulation/sections-editor";
import { requireAdminUser } from "@/lib/admin-auth";

async function updateSimulationConfig(formData: FormData) {
  "use server";
  await requireAdminUser();
  const id = formData.get("id")?.toString();
  if (!id) {
    redirect("/admin/simulation");
  }

  const parsed = parseSimulationForm(formData);
  if (!parsed.ok) {
    const error = encodeURIComponent(parsed.error);
    redirect(`/admin/simulation/${id}/edit?error=${error}`);
  }

  await prisma.simulationConfig.update({
    where: { id },
    data: {
      exam: parsed.data.exam,
      subject: parsed.data.subject,
      label: parsed.data.label,
      sections: parsed.data.sections,
      published: parsed.data.published,
    },
  });

  redirect("/admin/simulation");
}

export default async function EditSimulationConfigPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: { error?: string };
}) {
  await requireAdminUser();
  const { id } = await params;
  const config = await prisma.simulationConfig.findUnique({
    where: { id },
  });

  if (!config) {
    redirect("/admin/simulation");
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-6 py-12">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Admin • Simulation
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">
            Edit config
          </h1>
        </div>
        <Link
          href="/admin/simulation"
          className="rounded-full border border-sand px-4 py-2 text-sm font-semibold text-slate-700"
        >
          Back to list
        </Link>
      </header>

      {searchParams?.error && (
        <p className="text-sm text-rose-600">{searchParams.error}</p>
      )}

      <form
        action={updateSimulationConfig}
        className="space-y-5 rounded-3xl border border-white/80 bg-white/90 p-6 shadow-card"
      >
        <input type="hidden" name="id" value={config.id} />
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm text-slate-600">
            Exam
            <select
              name="exam"
              className="mt-2 w-full rounded-2xl border border-sand bg-white px-4 py-3"
              defaultValue={config.exam}
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
              defaultValue={config.subject}
            />
          </label>
        </div>

        <label className="text-sm text-slate-600">
          Label
          <input
            name="label"
            required
            className="mt-2 w-full rounded-2xl border border-sand bg-white px-4 py-3"
            defaultValue={config.label}
          />
        </label>

        <SectionsEditor
          name="sections"
          label="Sections (JSON array)"
          defaultValue={JSON.stringify(config.sections, null, 2)}
        />

        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            name="published"
            type="checkbox"
            defaultChecked={config.published}
            className="h-4 w-4 rounded border-sand"
          />
          Published
        </label>

        <button
          type="submit"
          className="rounded-2xl bg-accent px-5 py-3 text-base font-semibold text-white"
        >
          Save changes
        </button>
      </form>
    </div>
  );
}
