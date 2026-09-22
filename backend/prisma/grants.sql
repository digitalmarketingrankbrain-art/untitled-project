-- Least-privilege application role, per Phase 11/12: the audit log is
-- append-only enforced at the database grant level, not just application
-- convention — this role has SELECT/INSERT on audit_logs but never
-- UPDATE/DELETE, so even a bug in application code cannot rewrite history.
-- Run once per environment as a superuser; not a Prisma migration (Prisma
-- migrations run as the superuser/owner role, the app connects as this
-- restricted role at runtime instead).

DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'app_user') THEN
    CREATE ROLE app_user WITH LOGIN PASSWORD '__APP_USER_PASSWORD__';
  END IF;
END
$$;

GRANT CONNECT ON DATABASE meridian_accreditation TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;

-- Full CRUD on every table except the append-only ones below.
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
REVOKE UPDATE, DELETE ON audit_logs FROM app_user;
GRANT SELECT, INSERT ON audit_logs TO app_user;

-- Assessment notification acknowledgements are a digital-signature record —
-- immutable once written, same append-only guarantee as audit_logs (see
-- schema.prisma's AssessmentAcknowledgement doc comment).
REVOKE UPDATE, DELETE ON assessment_acknowledgements FROM app_user;
GRANT SELECT, INSERT ON assessment_acknowledgements TO app_user;

-- Sequences (for any serial/identity columns) and future tables.
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_user;
