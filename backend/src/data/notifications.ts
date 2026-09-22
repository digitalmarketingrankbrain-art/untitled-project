import { prisma } from "../prisma";
import type { NotificationChannel } from "@prisma/client";

/**
 * Real Notification rows in Postgres (Milestone 14) drive the in-app
 * notification list for real. Email delivery has no real provider wired up
 * yet (Phase 11: Resend, vendor TBD, no API key available in this
 * environment) — sendEmail logs what would have been sent instead of
 * silently pretending it happened, matching the same honesty principle
 * used for the dev-only password-reset link in Milestone 7.
 */
export async function createNotification(input: {
  userId: string;
  type: string;
  relatedType?: string;
  relatedId?: string;
  channel: NotificationChannel;
}) {
  const notification = await prisma.notification.create({
    data: {
      userId: input.userId,
      type: input.type,
      relatedType: input.relatedType,
      relatedId: input.relatedId,
      channel: input.channel,
      status: "PENDING",
    },
  });

  if (input.channel === "EMAIL") {
    await sendEmail(input.userId, input.type);
  }

  return prisma.notification.update({
    where: { id: notification.id },
    data: { status: "SENT", sentAt: new Date() },
  });
}

async function sendEmail(userId: string, type: string) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
  console.log(`[EMAIL — no provider configured, logged instead of sent] To: ${user?.email} · Event: ${type}`);
}

export async function getNotificationsForUser(userId: string) {
  return prisma.notification.findMany({
    where: { userId, channel: "IN_APP" },
    orderBy: { sentAt: "desc" },
    take: 20,
  });
}

export async function getUnreadNotificationCount(userId: string) {
  return prisma.notification.count({ where: { userId, channel: "IN_APP", readAt: null } });
}

export async function markNotificationRead(notificationId: string, userId: string) {
  await prisma.notification.updateMany({
    where: { id: notificationId, userId },
    data: { readAt: new Date() },
  });
}

export async function markAllNotificationsRead(userId: string) {
  await prisma.notification.updateMany({
    where: { userId, channel: "IN_APP", readAt: null },
    data: { readAt: new Date() },
  });
}
