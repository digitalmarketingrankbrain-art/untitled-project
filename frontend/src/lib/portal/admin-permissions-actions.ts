"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { grantAdminPermission, revokeAdminPermission, hasAdminPermission, type AdminPermission } from "./admin-permissions-data";
import { logAction } from "./audit-log";
import { getClientIp } from "@/lib/request-ip";

/** Only an existing FULL_ADMIN can grant/revoke permissions — prevents a REVIEWER/FINANCE admin from self-escalating. */
async function requireFullAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") throw new Error("Not authorised.");
  const isFullAdmin = await hasAdminPermission(session.user.id, "FULL_ADMIN");
  if (!isFullAdmin) throw new Error("Only a FULL_ADMIN can manage permission grants.");
  const ip = await getClientIp();
  return { ...session.user, ip };
}

export async function grantPermission(userId: string, permission: AdminPermission) {
  const admin = await requireFullAdmin();
  await grantAdminPermission(userId, permission, admin.id);
  await logAction({ actorUserId: admin.id, actorRole: "ADMIN", ipAddress: admin.ip, action: "permission.granted", targetType: "User", targetId: userId, after: permission });
  revalidatePath("/admin/users");
  return { ok: true as const };
}

export async function revokePermission(userId: string, permission: AdminPermission) {
  const admin = await requireFullAdmin();
  await revokeAdminPermission(userId, permission);
  await logAction({ actorUserId: admin.id, actorRole: "ADMIN", ipAddress: admin.ip, action: "permission.revoked", targetType: "User", targetId: userId, before: permission });
  revalidatePath("/admin/users");
  return { ok: true as const };
}
