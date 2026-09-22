import { prisma } from "../prisma";
import type { AdminPermission } from "@prisma/client";

/**
 * AdminPermission/AdminPermissionGrant existed in the schema since Milestone
 * 11 but were never read anywhere in application code — any ADMIN could
 * record a final accreditation decision. This module is the first real
 * enforcement point.
 */

export async function getPermissionsForUser(userId: string): Promise<AdminPermission[]> {
  const grants = await prisma.adminPermissionGrant.findMany({ where: { userId } });
  return grants.map((g) => g.permission);
}

export async function hasAdminPermission(userId: string, permission: AdminPermission): Promise<boolean> {
  const count = await prisma.adminPermissionGrant.count({ where: { userId, permission } });
  return count > 0;
}

export interface AdminUserPermissionRow {
  userId: string;
  name: string;
  email: string;
  permissions: AdminPermission[];
}

export async function getAllAdminPermissions(): Promise<AdminUserPermissionRow[]> {
  const admins = await prisma.user.findMany({
    where: { primaryRole: "ADMIN" },
    include: { adminPermissions: true },
    orderBy: { name: "asc" },
  });
  return admins.map((a) => ({
    userId: a.id,
    name: a.name,
    email: a.email,
    permissions: a.adminPermissions.map((g) => g.permission),
  }));
}

export async function grantAdminPermission(userId: string, permission: AdminPermission, grantedById: string): Promise<boolean> {
  const already = await hasAdminPermission(userId, permission);
  if (already) return true;
  await prisma.adminPermissionGrant.create({ data: { userId, permission, grantedById } });
  return true;
}

export async function revokeAdminPermission(userId: string, permission: AdminPermission): Promise<boolean> {
  await prisma.adminPermissionGrant.deleteMany({ where: { userId, permission } });
  return true;
}
