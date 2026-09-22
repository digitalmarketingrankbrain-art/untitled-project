import { rpc } from "@/lib/rpc-client";

export type NotificationChannel = "EMAIL" | "IN_APP";

/**
 * Thin proxy over backend/src/data/notifications.ts. Note getNotificationCopy
 * is NOT re-exported here (as the old file did) — it's pure/no-DB and lives
 * in ./notification-copy so the client-side notification bell can import it
 * without pulling this RPC-backed module into the browser bundle; its one
 * real caller already imports it from there directly.
 */
export interface NotificationRecord {
  id: string;
  userId: string;
  type: string;
  relatedType: string | null;
  relatedId: string | null;
  channel: NotificationChannel;
  status: "PENDING" | "SENT" | "FAILED";
  sentAt: string | null;
  readAt: string | null;
}

const MODULE = "notifications";

export function createNotification(input: {
  userId: string;
  type: string;
  relatedType?: string;
  relatedId?: string;
  channel: NotificationChannel;
}): Promise<NotificationRecord> {
  return rpc(MODULE, "createNotification", [input]);
}

export function getNotificationsForUser(userId: string): Promise<NotificationRecord[]> {
  return rpc(MODULE, "getNotificationsForUser", [userId]);
}

export function getUnreadNotificationCount(userId: string): Promise<number> {
  return rpc(MODULE, "getUnreadNotificationCount", [userId]);
}

export function markNotificationRead(notificationId: string, userId: string): Promise<void> {
  return rpc(MODULE, "markNotificationRead", [notificationId, userId]);
}

export function markAllNotificationsRead(userId: string): Promise<void> {
  return rpc(MODULE, "markAllNotificationsRead", [userId]);
}
