import { rpc } from "@/lib/rpc-client";

/** Thin proxy over backend/src/data/audit-log.ts — see applicant-data.ts's header comment for why. */
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

const MODULE = "audit-log";

export function logAction(input: {
  actorUserId: string | null;
  actorRole: string;
  action: string;
  targetType: string;
  targetId: string;
  reason?: string | null;
  before?: unknown;
  after?: unknown;
  ipAddress?: string | null;
}): Promise<void> {
  return rpc(MODULE, "logAction", [input]);
}

export function getAuditLog(): Promise<AuditLogEntry[]> {
  return rpc(MODULE, "getAuditLog", []);
}

export function getAuditLogForTarget(targetType: string, targetId: string): Promise<AuditLogEntry[]> {
  return rpc(MODULE, "getAuditLogForTarget", [targetType, targetId]);
}
