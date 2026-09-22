
-- CreateEnum
CREATE TYPE "AssessmentReportStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'FINALIZED');

-- CreateEnum
CREATE TYPE "NcResponseType" AS ENUM ('ROOT_CAUSE', 'CORRECTION', 'CORRECTIVE_ACTION', 'ASSESSOR_REMARK');

-- CreateEnum
CREATE TYPE "AssessorTeamProposalStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'CHANGES_REQUESTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "AssessmentNotificationStatus" AS ENUM ('SENT', 'ACKNOWLEDGED');

-- CreateEnum
CREATE TYPE "CertificateStatus" AS ENUM ('ISSUED', 'REVOKED', 'REISSUED');

-- AlterEnum
ALTER TYPE "AdminPermission" ADD VALUE 'DECISION_MAKER';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "DocumentOwnerType" ADD VALUE 'NON_CONFORMITY';
ALTER TYPE "DocumentOwnerType" ADD VALUE 'ASSESSOR_TEAM_PROPOSAL';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "NcStatus" ADD VALUE 'RESPONSE_SUBMITTED';
ALTER TYPE "NcStatus" ADD VALUE 'UNDER_REVIEW';
ALTER TYPE "NcStatus" ADD VALUE 'ACCEPTED';
ALTER TYPE "NcStatus" ADD VALUE 'REJECTED';

-- AlterTable
ALTER TABLE "assessments" ADD COLUMN     "finalized_at" TIMESTAMP(3),
ADD COLUMN     "finalized_by_user_id" TEXT,
ADD COLUMN     "report_recommendation" TEXT,
ADD COLUMN     "report_status" "AssessmentReportStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "report_summary" TEXT;

-- AlterTable
ALTER TABLE "non_conformities" ADD COLUMN     "cab_representative_name" TEXT,
ADD COLUMN     "due_date" TIMESTAMP(3),
ADD COLUMN     "finding_id" TEXT,
ADD COLUMN     "locked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requirement_text" TEXT,
ADD COLUMN     "responded_at" TIMESTAMP(3),
ADD COLUMN     "review_note" TEXT,
ADD COLUMN     "reviewed_at" TIMESTAMP(3),
ADD COLUMN     "reviewed_by_user_id" TEXT,
ADD COLUMN     "scheme_text" TEXT;

-- AlterTable
ALTER TABLE "required_document_types" ADD COLUMN     "applicable_stage" "ApplicationStage",
ADD COLUMN     "deadline_days" INTEGER,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "sort_order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "template_document_id" TEXT;

-- CreateTable
CREATE TABLE "nc_response_entries" (
    "id" TEXT NOT NULL,
    "nc_id" TEXT NOT NULL,
    "type" "NcResponseType" NOT NULL,
    "body" TEXT NOT NULL,
    "submitted_by_user_id" TEXT NOT NULL,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "nc_response_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessor_team_proposals" (
    "id" TEXT NOT NULL,
    "application_id" TEXT NOT NULL,
    "status" "AssessorTeamProposalStatus" NOT NULL DEFAULT 'DRAFT',
    "submitted_by_user_id" TEXT,
    "submitted_at" TIMESTAMP(3),
    "reviewed_by_user_id" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "review_note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assessor_team_proposals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessor_team_members" (
    "id" TEXT NOT NULL,
    "proposal_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "expertise" TEXT,
    "qualification" TEXT,
    "experience_years" INTEGER,
    "proposed_scope_slugs" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "availability_note" TEXT,
    "linked_assessor_id" TEXT,

    CONSTRAINT "assessor_team_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessment_notifications" (
    "id" TEXT NOT NULL,
    "assignment_id" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "assessment_date" TIMESTAMP(3) NOT NULL,
    "assessment_type" "AssessmentType" NOT NULL,
    "location" TEXT NOT NULL,
    "scope_text" TEXT NOT NULL,
    "instructions" TEXT,
    "preparation_notes" TEXT,
    "acknowledgement_deadline" TIMESTAMP(3),
    "status" "AssessmentNotificationStatus" NOT NULL DEFAULT 'SENT',
    "sent_by_user_id" TEXT NOT NULL,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "assessment_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessment_acknowledgements" (
    "id" TEXT NOT NULL,
    "notification_id" TEXT NOT NULL,
    "notification_version" INTEGER NOT NULL,
    "acknowledged_by_user_id" TEXT NOT NULL,
    "acknowledged_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "signature_name" TEXT NOT NULL,
    "ip_address" TEXT,
    "user_agent" TEXT,

    CONSTRAINT "assessment_acknowledgements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accreditation_certificates" (
    "id" TEXT NOT NULL,
    "accreditation_record_id" TEXT NOT NULL,
    "certificate_number" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "status" "CertificateStatus" NOT NULL DEFAULT 'ISSUED',
    "issue_date" TIMESTAMP(3) NOT NULL,
    "valid_until" TIMESTAMP(3),
    "scope_text" TEXT NOT NULL,
    "standard_reference" TEXT,
    "authorized_signatory_name" TEXT NOT NULL,
    "authorized_signatory_title" TEXT,
    "storage_key" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "issued_by_user_id" TEXT NOT NULL,
    "issued_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "supersedes_id" TEXT,

    CONSTRAINT "accreditation_certificates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "assessment_acknowledgements_notification_id_key" ON "assessment_acknowledgements"("notification_id");

-- CreateIndex
CREATE UNIQUE INDEX "accreditation_certificates_certificate_number_key" ON "accreditation_certificates"("certificate_number");

-- CreateIndex
CREATE UNIQUE INDEX "accreditation_certificates_supersedes_id_key" ON "accreditation_certificates"("supersedes_id");

-- CreateIndex
CREATE UNIQUE INDEX "non_conformities_finding_id_key" ON "non_conformities"("finding_id");

-- AddForeignKey
ALTER TABLE "required_document_types" ADD CONSTRAINT "required_document_types_template_document_id_fkey" FOREIGN KEY ("template_document_id") REFERENCES "reference_documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_finalized_by_user_id_fkey" FOREIGN KEY ("finalized_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "non_conformities" ADD CONSTRAINT "non_conformities_finding_id_fkey" FOREIGN KEY ("finding_id") REFERENCES "assessment_findings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "non_conformities" ADD CONSTRAINT "non_conformities_reviewed_by_user_id_fkey" FOREIGN KEY ("reviewed_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nc_response_entries" ADD CONSTRAINT "nc_response_entries_nc_id_fkey" FOREIGN KEY ("nc_id") REFERENCES "non_conformities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nc_response_entries" ADD CONSTRAINT "nc_response_entries_submitted_by_user_id_fkey" FOREIGN KEY ("submitted_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessor_team_proposals" ADD CONSTRAINT "assessor_team_proposals_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessor_team_proposals" ADD CONSTRAINT "assessor_team_proposals_submitted_by_user_id_fkey" FOREIGN KEY ("submitted_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessor_team_proposals" ADD CONSTRAINT "assessor_team_proposals_reviewed_by_user_id_fkey" FOREIGN KEY ("reviewed_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessor_team_members" ADD CONSTRAINT "assessor_team_members_proposal_id_fkey" FOREIGN KEY ("proposal_id") REFERENCES "assessor_team_proposals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessor_team_members" ADD CONSTRAINT "assessor_team_members_linked_assessor_id_fkey" FOREIGN KEY ("linked_assessor_id") REFERENCES "assessors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_notifications" ADD CONSTRAINT "assessment_notifications_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "assignments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_notifications" ADD CONSTRAINT "assessment_notifications_sent_by_user_id_fkey" FOREIGN KEY ("sent_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_acknowledgements" ADD CONSTRAINT "assessment_acknowledgements_notification_id_fkey" FOREIGN KEY ("notification_id") REFERENCES "assessment_notifications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_acknowledgements" ADD CONSTRAINT "assessment_acknowledgements_acknowledged_by_user_id_fkey" FOREIGN KEY ("acknowledged_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accreditation_certificates" ADD CONSTRAINT "accreditation_certificates_accreditation_record_id_fkey" FOREIGN KEY ("accreditation_record_id") REFERENCES "accreditation_records"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accreditation_certificates" ADD CONSTRAINT "accreditation_certificates_issued_by_user_id_fkey" FOREIGN KEY ("issued_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accreditation_certificates" ADD CONSTRAINT "accreditation_certificates_supersedes_id_fkey" FOREIGN KEY ("supersedes_id") REFERENCES "accreditation_certificates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

