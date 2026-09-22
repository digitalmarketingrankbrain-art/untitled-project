
-- AlterTable
ALTER TABLE "organisations" ADD COLUMN     "already_accredited_details" TEXT,
ADD COLUMN     "already_accredited_elsewhere" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "date_of_establishment" TIMESTAMP(3);

