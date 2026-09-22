import * as authStore from "./data/auth-store";
import * as notifications from "./data/notifications";
import * as applicantData from "./data/applicant-data";
import * as assessorData from "./data/assessor-data";
import * as auditLog from "./data/audit-log";
import * as cabInfoData from "./data/cab-info-data";
import * as cbAssessmentsData from "./data/cb-assessments-data";
import * as cbDashboardData from "./data/cb-dashboard-data";
import * as documentData from "./data/document-data";
import * as ncData from "./data/nc-data";
import * as referenceDocuments from "./data/reference-documents";
import * as programFees from "./data/program-fees";
import * as storage from "./data/storage";
import * as assessorTeamData from "./data/assessor-team-data";
import * as adminPermissionsData from "./data/admin-permissions-data";
import * as assessmentNotificationData from "./data/assessment-notification-data";
import * as certificateData from "./data/certificate-data";
import * as accreditationRecordData from "./data/accreditation-record-data";
import * as requiredFormsData from "./data/required-forms-data";
import * as workflowProgressData from "./data/workflow-progress-data";
import * as applicationRequests from "./data/application-requests";
import * as invoicePdf from "./data/invoice-pdf";
import * as applicationDetailsData from "./data/application-details-data";
import * as agreementPdf from "./data/agreement-pdf";

const MODULES: Record<string, Record<string, unknown>> = {
  "auth-store": authStore,
  notifications,
  "applicant-data": applicantData,
  "assessor-data": assessorData,
  "audit-log": auditLog,
  "cab-info-data": cabInfoData,
  "cb-assessments-data": cbAssessmentsData,
  "cb-dashboard-data": cbDashboardData,
  "document-data": documentData,
  "nc-data": ncData,
  "reference-documents": referenceDocuments,
  "program-fees": programFees,
  storage,
  "assessor-team-data": assessorTeamData,
  "admin-permissions-data": adminPermissionsData,
  "assessment-notification-data": assessmentNotificationData,
  "certificate-data": certificateData,
  "accreditation-record-data": accreditationRecordData,
  "required-forms-data": requiredFormsData,
  "workflow-progress-data": workflowProgressData,
  "application-requests": applicationRequests,
  "invoice-pdf": invoicePdf,
  "application-details-data": applicationDetailsData,
  "agreement-pdf": agreementPdf,
};

interface BufferMarker {
  __rpcBuffer: true;
  base64: string;
}

function isBufferMarker(value: unknown): value is BufferMarker {
  return typeof value === "object" && value !== null && (value as { __rpcBuffer?: unknown }).__rpcBuffer === true;
}

/** Recursively converts {__rpcBuffer, base64} markers (produced by the frontend RPC client) back into real Buffers before calling into the data layer. */
export function reviveBuffers(value: unknown): unknown {
  if (isBufferMarker(value)) return Buffer.from(value.base64, "base64");
  if (Array.isArray(value)) return value.map(reviveBuffers);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, reviveBuffers(v)]));
  }
  return value;
}

/** Recursively converts real Buffers in a function's result into {__rpcBuffer, base64} markers so they survive JSON.stringify. */
export function markBuffers(value: unknown): unknown {
  if (Buffer.isBuffer(value)) return { __rpcBuffer: true, base64: value.toString("base64") } satisfies BufferMarker;
  if (value instanceof Date) return value;
  if (Array.isArray(value)) return value.map(markBuffers);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, markBuffers(v)]));
  }
  return value;
}

export class RpcError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
  ) {
    super(message);
  }
}

function isDatabaseUnreachable(err: unknown): boolean {
  const name = err instanceof Error ? err.name : "";
  const message = err instanceof Error ? err.message : String(err);
  return (
    name === "PrismaClientInitializationError" ||
    message.includes("Can't reach database server") ||
    message.includes("PrismaClientInitializationError")
  );
}

export async function dispatch(moduleName: string, fnName: string, rawArgs: unknown[]): Promise<unknown> {
  const mod = MODULES[moduleName];
  if (!mod) throw new RpcError(`Unknown module: ${moduleName}`, 404);
  const fn = mod[fnName];
  if (typeof fn !== "function") throw new RpcError(`Unknown function: ${moduleName}.${fnName}`, 404);

  const args = (reviveBuffers(rawArgs) as unknown[]) ?? [];

  try {
    const result = await fn(...args);
    return markBuffers(result ?? null);
  } catch (err: unknown) {
    // Report the outage honestly instead of returning a guessed null/[]/0 —
    // a wrong-shaped fake result crashed callers (e.g. null.map) and hid the
    // real problem.
    if (isDatabaseUnreachable(err)) {
      console.error(`[rpc] DB unreachable in ${moduleName}.${fnName}`);
      throw new RpcError("Database connection issue — the backend cannot reach the database.", 503, "DATABASE_UNAVAILABLE");
    }
    throw err;
  }
}

