-- CreateEnum
CREATE TYPE "AttemptMode" AS ENUM ('PRACTICE', 'SIMULATION');

-- AlterTable
ALTER TABLE "Question" ADD COLUMN "section" TEXT;

-- AlterTable
ALTER TABLE "Attempt" ADD COLUMN "mode" "AttemptMode" NOT NULL DEFAULT 'PRACTICE';

-- CreateTable
CREATE TABLE "AttemptSection" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "durationSec" INTEGER,
    "startedAt" TIMESTAMP(3),
    "submittedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AttemptSection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AttemptSection_attemptId_order_key" ON "AttemptSection"("attemptId", "order");

-- CreateIndex
CREATE INDEX "AttemptSection_attemptId_idx" ON "AttemptSection"("attemptId");

-- AddForeignKey
ALTER TABLE "AttemptSection" ADD CONSTRAINT "AttemptSection_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "Attempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;
