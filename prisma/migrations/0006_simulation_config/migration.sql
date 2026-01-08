-- CreateTable
CREATE TABLE "SimulationConfig" (
    "id" TEXT NOT NULL,
    "exam" "ExamType" NOT NULL,
    "subject" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "sections" JSONB NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SimulationConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SimulationConfig_exam_subject_key" ON "SimulationConfig"("exam", "subject");

-- CreateIndex
CREATE INDEX "SimulationConfig_exam_subject_published_idx" ON "SimulationConfig"("exam", "subject", "published");
