-- AlterTable
ALTER TABLE "AttemptQuestion" ADD COLUMN "sectionId" TEXT;

-- AlterTable
ALTER TABLE "AttemptSection" ADD COLUMN "scorePercent" INTEGER;
ALTER TABLE "AttemptSection" ADD COLUMN "correctCount" INTEGER;
ALTER TABLE "AttemptSection" ADD COLUMN "totalCount" INTEGER;
ALTER TABLE "AttemptSection" ADD COLUMN "topicBreakdown" JSONB;

-- CreateIndex
CREATE INDEX "AttemptQuestion_sectionId_idx" ON "AttemptQuestion"("sectionId");

-- AddForeignKey
ALTER TABLE "AttemptQuestion" ADD CONSTRAINT "AttemptQuestion_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "AttemptSection"("id") ON DELETE SET NULL ON UPDATE CASCADE;
