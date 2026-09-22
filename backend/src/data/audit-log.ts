import { prisma } from "../prisma";
import type { Prisma } from "@prisma/client";

export interface AuditLogEntry {
  id: string;
  actorName: string;
  actorRole: string;
  action: string;
  targetType: string;
  targetId: string;
  reason: string | null;
  before: string | null;
  after: string | null;
  ipAddress: string | null;
  timestamp: string;
}

/**
 * Real Postgres audit_logs table (Milestone 16) — the append-only guarantee
 * is enforced at the database grant level (Milestone 11's app_user role has
 * SELECT/INSERT but no UPDATE/DELETE on this table, verified by actually
 * attempting both and confirming "permission denied"), not just by this
 * module's own discipline of never calling update/delete.
 */
export async function logAction(input: {
  actorUserId: string | null;
  actorRole: string;
  action: string;
  targetType: string;
  targetId: string;
  reason?: string | null;
  before?: unknown;
  after?: unknown;
  ipAddress?: string | null;
}) {
  await prisma.auditLog.create({
    data: {
      actorUserId: input.actorUserId,
      actorRole: input.actorRole,
      action: input.action,
      targetType: input.targetType,
      targetId: input.targetId,
      reason: input.reason ?? null,
      before: (input.before ?? undefined) as Prisma.InputJsonValue | undefined,
      after: (input.after ?? undefined) as Prisma.InputJsonValue | undefined,
      ipAddress: input.ipAddress ?? null,
    },
  });
}

type AuditLogRow = Awaited<ReturnType<typeof prisma.auditLog.findMany<{ include: { actor: true } }>>>[number];

function mapRow(row: AuditLogRow): AuditLogEntry {
  return {
    id: row.id,
    actorName: row.actor?.name ?? row.actorRole,
    actorRole: row.actorRole,
    action: row.action,
    targetType: row.targetType,
    targetId: row.targetId,
    reason: row.reason,
    before: row.before ? JSON.stringify(row.before) : null,
    after: row.after ? JSON.stringify(row.after) : null,
    ipAddress: row.ipAddress,
    timestamp: row.createdAt.toISOString(),
  };
}

export async function getAuditLog(): Promise<AuditLogEntry[]> {
  const rows = await prisma.auditLog.findMany({ include: { actor: true }, orderBy: { createdAt: "desc" } });
  return rows.map(mapRow);
}

export async function getAuditLogForTarget(targetType: string, targetId: string): Promise<AuditLogEntry[]> {
  const rows = await prisma.auditLog.findMany({
    where: { targetType, targetId },
    include: { actor: true },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(mapRow);
}
