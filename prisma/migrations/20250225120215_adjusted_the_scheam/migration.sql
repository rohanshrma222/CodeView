-- DropForeignKey
ALTER TABLE "Interview" DROP CONSTRAINT "Interview_candidateId_fkey";

-- AlterTable
ALTER TABLE "Interview" ALTER COLUMN "startTime" SET DATA TYPE BIGINT,
ALTER COLUMN "endTime" SET DATA TYPE BIGINT;

-- CreateIndex
CREATE INDEX "by_clerk_id" ON "User"("clerkId");
