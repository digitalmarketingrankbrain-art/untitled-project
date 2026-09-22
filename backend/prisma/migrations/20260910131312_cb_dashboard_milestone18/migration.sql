-- CreateEnum
CREATE TYPE "LocationType" AS ENUM ('HEAD_OFFICE', 'KEY_LOCATION', 'OTHER');

-- CreateEnum
CREATE TYPE "CountryStatus" AS ENUM ('APPLIED', 'APPROVED');

-- CreateEnum
CREATE TYPE "ApplicationType" AS ENUM ('INITIAL_ACCREDITATION', 'SCOPE_EXTENSION');

-- CreateEnum
CREATE TYPE "NcSeverity" AS ENUM ('MINOR', 'MAJOR', 'OBSERVATION');

-- CreateEnum
CREATE TYPE "NcStatus" AS ENUM ('OPEN', 'CLOSED');

-- AlterTable
ALTER TABLE "applications" ADD COLUMN     "additional_scope_slugs" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "application_type" "ApplicationType" NOT NULL DEFAULT 'INITIAL_ACCREDITATION',
ADD COLUMN     "draft_data" JSONB;

-- AlterTable
ALTER TABLE "organisation_memberships" ADD COLUMN     "title" TEXT;

-- AlterTable
ALTER TABLE "organisations" ADD COLUMN     "address_line_2" TEXT,
ADD COLUMN     "cab_number" TEXT,
ADD COLUMN     "certification_manager" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "contact_email" TEXT,
ADD COLUMN     "contact_first_name" TEXT,
ADD COLUMN     "contact_last_name" TEXT,
ADD COLUMN     "contact_phone" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "director" TEXT,
ADD COLUMN     "postal_code" TEXT,
ADD COLUMN     "short_code" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "website" TEXT;

-- CreateTable
CREATE TABLE "organisation_locations" (
    "id" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "contact_person" TEXT,
    "mobile" TEXT,
    "address" TEXT NOT NULL,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "postal_code" TEXT,
    "location_type" "LocationType" NOT NULL DEFAULT 'OTHER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "organisation_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organisation_countries" (
    "id" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "country_code" TEXT NOT NULL,
    "country_name" TEXT NOT NULL,
    "status" "CountryStatus" NOT NULL DEFAULT 'APPLIED',
    "applied_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approved_at" TIMESTAMP(3),

    CONSTRAINT "organisation_countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "non_conformities" (
    "id" TEXT NOT NULL,
    "nc_number" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "assignment_id" TEXT,
    "category" "NcSeverity" NOT NULL,
    "standard_reference" TEXT NOT NULL,
    "status" "NcStatus" NOT NULL DEFAULT 'OPEN',
    "progress_stage" TEXT NOT NULL,
    "raised_by_user_id" TEXT,
    "team_lead_user_id" TEXT,
    "finding" TEXT NOT NULL,
    "corrective_action" TEXT,
    "raised_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closed_at" TIMESTAMP(3),

    CONSTRAINT "non_conformities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reference_documents" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "storage_key" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "size_bytes" INTEGER NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reference_documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organisation_countries_organisation_id_country_code_status_key" ON "organisation_countries"("organisation_id", "country_code", "status");

-- CreateIndex
CREATE UNIQUE INDEX "non_conformities_nc_number_key" ON "non_conformities"("nc_number");

-- CreateIndex
CREATE UNIQUE INDEX "organisations_cab_number_key" ON "organisations"("cab_number");

-- AddForeignKey
ALTER TABLE "organisation_locations" ADD CONSTRAINT "organisation_locations_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organisation_countries" ADD CONSTRAINT "organisation_countries_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "non_conformities" ADD CONSTRAINT "non_conformities_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "non_conformities" ADD CONSTRAINT "non_conformities_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "assignments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "non_conformities" ADD CONSTRAINT "non_conformities_raised_by_user_id_fkey" FOREIGN KEY ("raised_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "non_conformities" ADD CONSTRAINT "non_conformities_team_lead_user_id_fkey" FOREIGN KEY ("team_lead_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

