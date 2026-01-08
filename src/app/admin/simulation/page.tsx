import Link from "next/link";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireAdminUser } from "@/lib/admin-auth";

export default async function SimulationAdminPage() {
  await requireAdminUser();
  const configs = await prisma.simulationConfig.findMany({
    orderBy: [{ exam: "asc" }, { subject: "asc" }],
  });

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-6 py-12">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Admin • Simulation
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">
            Simulation configs
          </h1>
        </div>
        <Link
          href="/admin/simulation/new"
          className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white"
        >
          New config
        </Link>
      </header>

      <div className="grid gap-4">
        {configs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-sand bg-white p-6 text-center text-sm text-slate-600">
            No simulation configs yet. Add one to override defaults.
          </div>
        ) : (
          configs.map((config) => (
            <div
              key={config.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-sand bg-white p-4 shadow-card"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  {config.exam} • {config.subject}
                </p>
                <p className="mt-1 text-base font-semibold text-slate-900">
                  {config.label}
                </p>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="rounded-full bg-sand px-3 py-1 text-xs font-semibold text-slate-700">
                  {config.published ? "Published" : "Draft"}
                </span>
                <Link
                  href={`/admin/simulation/${config.id}/edit`}
                  className="rounded-full border border-sand px-3 py-1 font-semibold text-slate-700"
                >
                  Edit
                </Link>
                <form action={duplicateConfig}>
                  <input type="hidden" name="id" value={config.id} />
                  <button
                    type="submit"
                    className="rounded-full border border-sand px-3 py-1 font-semibold text-slate-700"
                  >
                    Duplicate
                  </button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

async function duplicateConfig(formData: FormData) {
  "use server";
  await requireAdminUser();
  const id = formData.get("id")?.toString();
  if (!id) return;

  const config = await prisma.simulationConfig.findUnique({ where: { id } });
  if (!config) return;

  let suffix = 1;
  let nextSubject = `${config.subject} Copy`;
  while (
    await prisma.simulationConfig.findUnique({
      where: { exam_subject: { exam: config.exam, subject: nextSubject } },
    })
  ) {
    suffix += 1;
    nextSubject = `${config.subject} Copy ${suffix}`;
  }

  await prisma.simulationConfig.create({
    data: {
      exam: config.exam,
      subject: nextSubject,
      label: `${config.label} (Copy)`,
      sections: config.sections as Prisma.InputJsonValue,
      published: false,
    },
  });
}
