-- Login is switching from password + optional TOTP MFA to a single OTP-based
-- flow (see src/lib/auth/store.ts's createLoginOtp/consumeLoginOtp). Neither
-- a password hash nor a TOTP secret/enabled flag is read anywhere anymore.
ALTER TABLE "users" DROP COLUMN "mfa_enabled",
DROP COLUMN "mfa_secret",
DROP COLUMN "password_hash";
