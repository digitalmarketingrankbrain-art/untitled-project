import { getUsersByRoleSafe } from "@/lib/auth/store";
import { createNotification } from "@/lib/notifications";

/**
 * The existing notification system only ever addressed a single user (the
 * applicant) — nothing notified the AB side at all, even though the spec
 * calls for it on several events (application submitted, forms submitted,
 * assessor team submitted, NC response submitted, report submitted). There's
 * no "AB inbox" concept in this schema, so this fans out to every ADMIN user
 * individually via the existing per-user Notification table.
 */
export async function notifyAllAdmins(input: { type: string; relatedType?: string; relatedId?: string }) {
  const admins = await getUsersByRoleSafe("ADMIN");
  await Promise.all(
    admins.map((admin) =>
      createNotification({ userId: admin.id, type: input.type, relatedType: input.relatedType, relatedId: input.relatedId, channel: "IN_APP" }),
    ),
  );
}
