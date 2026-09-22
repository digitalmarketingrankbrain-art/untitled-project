"use server";

import { auth } from "@/auth";
import { getNotificationsForUser, getUnreadNotificationCount, markNotificationRead, markAllNotificationsRead } from "./notifications";

export async function getMyNotifications() {
  const session = await auth();
  if (!session?.user) return { notifications: [], unreadCount: 0 };
  const [notifications, unreadCount] = await Promise.all([
    getNotificationsForUser(session.user.id),
    getUnreadNotificationCount(session.user.id),
  ]);
  return {
    notifications: notifications.map((n) => ({
      id: n.id,
      type: n.type,
      sentAt: n.sentAt,
      readAt: n.readAt,
    })),
    unreadCount,
  };
}

export async function markMyNotificationRead(notificationId: string) {
  const session = await auth();
  if (!session?.user) return { ok: false as const };
  await markNotificationRead(notificationId, session.user.id);
  return { ok: true as const };
}

export async function markAllMyNotificationsRead() {
  const session = await auth();
  if (!session?.user) return { ok: false as const };
  await markAllNotificationsRead(session.user.id);
  return { ok: true as const };
}
