import { z } from "zod";

const questionSchema = z.object({
  id: z.string().min(3),
  exam: z.enum(["BECE", "WASSCE"]),
  subject: z.string().min(1),
  topic: z.string().min(1),
  year: z.number().int().min(1980).max(2100),
  paper: z.string().optional().nullable(),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  type: z.enum(["MCQ", "ESSAY"]),
  prompt: z.string().min(1),
  options: z.array(z.string()),
  correctIndex: z.number().int().min(0).optional().nullable(),
  explanation: z.string().optional().nullable(),
  markingGuide: z.string().optional().nullable(),
  sampleAnswer: z.string().optional().nullable(),
  imageUrl: z.string().min(1).optional().nullable(),
  imageAlt: z.string().optional().nullable(),
  imageCaption: z.string().optional().nullable(),
  published: z.boolean(),
});

function parseOptions(raw: string) {
  return raw
    .split("\n")
    .map((option) => option.trim())
    .filter(Boolean);
}

function isValidImageUrl(value: string) {
  return value.startsWith("/") || value.startsWith("http://") || value.startsWith("https://");
}

export function parseQuestionFormData(formData: FormData) {
  const rawOptions = formData.get("options")?.toString() ?? "";
  const type = formData.get("type")?.toString() ?? "MCQ";
  const rawCorrect = formData.get("correctIndex")?.toString().trim() ?? "";
  const correctIndex =
    rawCorrect.length === 0 || Number.isNaN(Number(rawCorrect))
      ? null
      : Number(rawCorrect);
  const parsed = questionSchema.safeParse({
    id: formData.get("id")?.toString().trim(),
    exam: formData.get("exam")?.toString(),
    subject: formData.get("subject")?.toString().trim(),
    topic: formData.get("topic")?.toString().trim(),
    year: Number(formData.get("year")),
    paper: formData.get("paper")?.toString().trim() || null,
    difficulty: formData.get("difficulty")?.toString(),
    type,
    prompt: formData.get("prompt")?.toString().trim(),
    options: type === "ESSAY" ? [] : parseOptions(rawOptions),
    correctIndex: type === "ESSAY" ? null : correctIndex,
    explanation: formData.get("explanation")?.toString().trim() || null,
    markingGuide: formData.get("markingGuide")?.toString().trim() || null,
    sampleAnswer: formData.get("sampleAnswer")?.toString().trim() || null,
    imageUrl: formData.get("imageUrl")?.toString().trim() || null,
    imageAlt: formData.get("imageAlt")?.toString().trim() || null,
    imageCaption: formData.get("imageCaption")?.toString().trim() || null,
    published: formData.get("published") === "on",
  });

  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.flatten().fieldErrors };
  }

  if (parsed.data.type === "MCQ" && parsed.data.options.length === 0) {
    return {
      ok: false as const,
      error: { options: ["MCQ questions require options."] },
    };
  }

  if (parsed.data.type === "MCQ" && parsed.data.correctIndex === null) {
    return {
      ok: false as const,
      error: { correctIndex: ["MCQ questions require a correct index."] },
    };
  }

  if (parsed.data.imageUrl && !isValidImageUrl(parsed.data.imageUrl)) {
    return {
      ok: false as const,
      error: { imageUrl: ["Image URL must be a relative path or absolute URL."] },
    };
  }

  if (parsed.data.imageUrl && !parsed.data.imageAlt) {
    return {
      ok: false as const,
      error: { imageAlt: ["Image alt text is required when using an image."] },
    };
  }

  return { ok: true as const, data: parsed.data };
}

export type ParsedQuestion = z.infer<typeof questionSchema>;
