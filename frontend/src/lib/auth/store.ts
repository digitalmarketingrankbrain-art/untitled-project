import { rpc } from "@/lib/rpc-client";

export type Role = "APPLICANT" | "ASSESSOR" | "ADMIN";

/**
 * Thin proxy over backend/src/data/auth-store.ts — the actual Prisma
 * queries live there now (moved verbatim from this file) since only the
 * backend process holds DATABASE_URL. Function names/shapes kept stable so
 * auth.ts/actions.ts/the portals didn't need to change.
 *
 * createdAt/updatedAt come back as ISO strings, not Date instances, since
 * they cross the JSON RPC boundary — no caller of these functions relies on
 * Date methods on them (verified before this migration), so that's safe.
 */
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  primaryRole: Role;
  status: "ACTIVE" | "SUSPENDED" | "LOCKED";
  createdAt: string;
  updatedAt: string;
}

const MODULE = "auth-store";

export function findUserByEmail(email: string): Promise<AuthUser | null> {
  return rpc(MODULE, "findUserByEmail", [email]);
}

export function findUserById(id: string): Promise<AuthUser | null> {
  return rpc(MODULE, "findUserById", [id]);
}

export function updateUserName(userId: string, name: string): Promise<AuthUser | null> {
  return rpc(MODULE, "updateUserName", [userId, name]);
}

export function getAllUsers(): Promise<AuthUser[]> {
  return rpc(MODULE, "getAllUsers", []);
}

export interface SafeUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: string;
}

export function getAllUsersSafe(): Promise<SafeUser[]> {
  return rpc(MODULE, "getAllUsersSafe", []);
}

export function getUsersByRoleSafe(role: Role): Promise<SafeUser[]> {
  return rpc(MODULE, "getUsersByRoleSafe", [role]);
}


export function getUserOrganisationName(userId: string): Promise<string> {
  return rpc(MODULE, "getUserOrganisationName", [userId]);
}

export function getUserOrganisationId(userId: string): Promise<string | null> {
  return rpc(MODULE, "getUserOrganisationId", [userId]);
}

export function createLoginOtp(email: string): Promise<string> {
  return rpc(MODULE, "createLoginOtp", [email]);
}

export function consumeLoginOtp(email: string, code: string): Promise<boolean> {
  return rpc(MODULE, "consumeLoginOtp", [email, code]);
}
