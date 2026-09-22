import { rpc } from "@/lib/rpc-client";

/** Thin proxy over backend/src/data/admin-permissions-data.ts — see applicant-data.ts's header comment for why. */

export type AdminPermission = "FULL_ADMIN" | "REVIEWER" | "FINANCE" | "DECISION_MAKER";

export interface AdminUserPermissionRow {
  userId: string;
  name: string;
  email: string;
  permissions: AdminPermission[];
}

const MODULE = "admin-permissions-data";

export function getPermissionsForUser(userId: string): Promise<AdminPermission[]> {
  return rpc(MODULE, "getPermissionsForUser", [userId]);
}

export function hasAdminPermission(userId: string, permission: AdminPermission): Promise<boolean> {
  return rpc(MODULE, "hasAdminPermission", [userId, permission]);
}

export function getAllAdminPermissions(): Promise<AdminUserPermissionRow[]> {
  return rpc(MODULE, "getAllAdminPermissions", []);
}

export function grantAdminPermission(userId: string, permission: AdminPermission, grantedById: string): Promise<boolean> {
  return rpc(MODULE, "grantAdminPermission", [userId, permission, grantedById]);
}

export function revokeAdminPermission(userId: string, permission: AdminPermission): Promise<boolean> {
  return rpc(MODULE, "revokeAdminPermission", [userId, permission]);
}
