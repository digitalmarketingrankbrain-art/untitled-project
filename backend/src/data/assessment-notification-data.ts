import { prisma } from "../prisma";
import { getUserOrganisationId } from "./auth-store";
import type { AssessmentNotificationStatus, AssessmentType, Prisma } from "@prisma/client";

/**
 * Assessment Notification + Acknowledgement (Spec §8). The AB sends a
 * notification for a given Assignment; the CB must explicitly acknowledge
 * and digitally sign it before the physical assessment proceeds. The
 * acknowledgement record is immutable (see schema.prisma's doc comment +
 * grants.sql) — a changed assessment date issues a NEW notification
 * (incrementing `version`) rather than editing the old one.
 */

export interface AssessmentNotificationRow {
  id: string;
  assignmentId: string;
  applicationReference: string;
  organisationName: string;
  version: number;
  assessmentDate: string;
  assessmentType: AssessmentType;
  location: string;
  scopeText: string;
  instructions: string | null;
  preparationNotes: string | null;
  acknowledgementDeadline: string | null;
  status: AssessmentNotificationStatus;
  sentByName: string;
  sentAt: string;
  acknowledgement: {
    acknowledgedByName: string;
    acknowledgedAt: string;
    signatureName: string;
  } | null;
}

function fmtDateTime(d: Date): string {
  return d.toISOString();
}

const NOTIFICATION_INCLUDE = {
  assignment: { include: { application: { include: { organisation: true } } } },
  sentBy: { select: { name: true } },
  acknowledgement: { include: { acknowledgedBy: { select: { name: true } } } },
} satisfies Prisma.AssessmentNotificationInclude;

type NotificationRow = Prisma.AssessmentNotificationGetPayload<{ include: typeof NOTIFICATION_INCLUDE }>;

function mapNotification(row: NotificationRow): AssessmentNotificationRow {
  return {
    id: row.id,
    assignmentId: row.assignmentId,
    applicationReference: row.assignment.application.referenceNumber,
    organisationName: row.assignment.application.organisation.displayName,
    version: row.version,
    assessmentDate: fmtDateTime(row.assessmentDate),
    assessmentType: row.assessmentType,
    location: row.location,
    scopeText: row.scopeText,
    instructions: row.instructions,
    preparationNotes: row.preparationNotes,
    acknowledgementDeadline: row.acknowledgementDeadline ? fmtDateTime(row.acknowledgementDeadline) : null,
    status: row.status,
    sentByName: row.sentBy.name,
    sentAt: fmtDateTime(row.sentAt),
    acknowledgement: row.acknowledgement
      ? {
          acknowledgedByName: row.acknowledgement.acknowledgedBy.name,
          acknowledgedAt: fmtDateTime(row.acknowledgement.acknowledgedAt),
          signatureName: row.acknowledgement.signatureName,
        }
      : null,
  };
}

export interface SendNotificationInput {
  assignmentId: string;
  assessmentDate: string;
  assessmentType: AssessmentType;
  location: string;
  scopeText: string;
  instructions?: string;
  preparationNotes?: string;
  acknowledgementDeadline?: string;
}

/** Sends a new notification (or a re-notification if the date/details changed — versioned, not edited). */
export async function sendAssessmentNotification(
  input: SendNotificationInput,
  sentById: string,
): Promise<{ id: string }> {
  const priorCount = await prisma.assessmentNotification.count({ where: { assignmentId: input.assignmentId } });
  const created = await prisma.assessmentNotification.create({
    data: {
      assignmentId: input.assignmentId,
      version: priorCount + 1,
      assessmentDate: new Date(input.assessmentDate),
      assessmentType: input.assessmentType,
      location: input.location,
      scopeText: input.scopeText,
      instructions: input.instructions || null,
      preparationNotes: input.preparationNotes || null,
      acknowledgementDeadline: input.acknowledgementDeadline ? new Date(input.acknowledgementDeadline) : null,
      sentById,
    },
  });
  return { id: created.id };
}

/** Latest notification for an assignment (for a CB/assessor viewing the current schedule). */
export async function getLatestNotificationForAssignment(assignmentId: string): Promise<AssessmentNotificationRow | undefined> {
  const row = await prisma.assessmentNotification.findFirst({
    where: { assignmentId },
    include: NOTIFICATION_INCLUDE,
    orderBy: { version: "desc" },
  });
  return row ? mapNotification(row) : undefined;
}

export async function getNotificationsForUserOrg(userId: string): Promise<AssessmentNotificationRow[]> {
  const organisationId = await getUserOrganisationId(userId);
  if (!organisationId) return [];
  const rows = await prisma.assessmentNotification.findMany({
    where: { assignment: { application: { organisationId } } },
    include: NOTIFICATION_INCLUDE,
    orderBy: { sentAt: "desc" },
  });
  return rows.map(mapNotification);
}

export async function getNotificationById(id: string): Promise<AssessmentNotificationRow | undefined> {
  const row = await prisma.assessmentNotification.findUnique({ where: { id }, include: NOTIFICATION_INCLUDE });
  return row ? mapNotification(row) : undefined;
}

/**
 * The CB explicitly acknowledges + digitally signs the CURRENT (latest)
 * version of the notification. Rejects if a newer version already exists
 * (the UI should always show the latest and re-fetch before signing) or if
 * this notification is already acknowledged.
 */
export async function acknowledgeNotification(
  notificationId: string,
  userId: string,
  input: { signatureName: string; ipAddress?: string; userAgent?: string },
): Promise<{ ok: boolean; error?: string }> {
  const organisationId = await getUserOrganisationId(userId);
  if (!organisationId) return { ok: false, error: "No organisation found." };

  const notification = await prisma.assessmentNotification.findFirst({
    where: { id: notificationId, assignment: { application: { organisationId } } },
    include: { assignment: true },
  });
  if (!notification) return { ok: false, error: "Notification not found." };

  const latestVersion = await prisma.assessmentNotification.aggregate({
    where: { assignmentId: notification.assignmentId },
    _max: { version: true },
  });
  if (notification.version !== latestVersion._max.version) {
    return { ok: false, error: "A newer version of this notification exists — please review the latest details before signing." };
  }

  const existing = await prisma.assessmentAcknowledgement.findUnique({ where: { notificationId } });
  if (existing) return { ok: false, error: "This notification has already been acknowledged." };
  if (!input.signatureName.trim()) return { ok: false, error: "A typed signature is required." };

  await prisma.$transaction([
    prisma.assessmentAcknowledgement.create({
      data: {
        notificationId,
        notificationVersion: notification.version,
        acknowledgedById: userId,
        signatureName: input.signatureName.trim(),
        ipAddress: input.ipAddress ?? null,
        userAgent: input.userAgent ?? null,
      },
    }),
    prisma.assessmentNotification.update({ where: { id: notificationId }, data: { status: "ACKNOWLEDGED" } }),
  ]);
  return { ok: true };
}
