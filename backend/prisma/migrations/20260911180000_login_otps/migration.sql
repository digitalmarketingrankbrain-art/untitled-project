-- CreateTable
CREATE TABLE "login_otps" (
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "login_otps_pkey" PRIMARY KEY ("email")
);
