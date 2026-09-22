-- CreateEnum
CREATE TYPE "AssessmentType" AS ENUM ('WITNESS_ASSESSMENT', 'OFFICE_ASSESSMENT', 'DOCUMENT_REVIEW');

-- AlterTable
ALTER TABLE "assignments" ADD COLUMN     "assessment_number" TEXT,
ADD COLUMN     "assessment_type" "AssessmentType" NOT NULL DEFAULT 'WITNESS_ASSESSMENT',
ADD COLUMN     "scheme_slugs" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateIndex
CREATE UNIQUE INDEX "assignments_assessment_number_key" ON "assignments"("assessment_number");

