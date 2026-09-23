-- CreateEnum
CREATE TYPE "ApplicationRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterEnum
ALTER TYPE "VerificationStatus" ADD VALUE 'CANCELLED';

-- CreateTable
CREATE TABLE "application_requests" (
    "id" TEXT NOT NULL,
    "status" "ApplicationRequestStatus" NOT NULL DEFAULT 'PENDING',
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_code" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "address_line_1" TEXT NOT NULL,
    "address_line_2" TEXT,
    "address_details" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT,
    "zip_code" TEXT,
    "country" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "company_website" TEXT,
    "directors" TEXT,
    "responsible_person" TEXT,
    "already_accredited" BOOLEAN NOT NULL DEFAULT false,
    "date_of_establishment" TIMESTAMP(3),
    "license_number" TEXT,
    "license_file_name" TEXT,
    "apply_for" TEXT[],
    "remarks" TEXT,
    "rejection_reason" TEXT,
    "reviewed_by_user_id" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "created_organisation_id" TEXT,
    "created_user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "application_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "application_requests_status_created_at_idx" ON "application_requests"("status", "created_at");

-- CreateIndex
CREATE INDEX "application_requests_email_idx" ON "application_requests"("email");

-- AddForeignKey
ALTER TABLE "application_requests" ADD CONSTRAINT "application_requests_reviewed_by_user_id_fkey" FOREIGN KEY ("reviewed_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
