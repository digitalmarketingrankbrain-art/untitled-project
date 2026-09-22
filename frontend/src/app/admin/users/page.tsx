import { AdminUsersTable } from "@/components/portal/admin-users-table";
import { AdminPermissionsPanel } from "@/components/portal/admin-permissions-panel";
import { getAllUsersSafe } from "@/lib/auth/store";
import { getAllAdminPermissions } from "@/lib/portal/admin-permissions-data";

/**
 * getAllUsersSafe() selects only display-safe fields at the Prisma query
 * level (see src/lib/auth/store.ts) rather than loading a full user record
 * into this Server Component just to pass a subset to the Client Component
 * below. Milestone 10 caught the "never pass full user records to a Client
 * Component" version of this rule; this applies it one layer earlier.
 */
export default async function AdminUsersPage() {
  const [rows, admins] = await Promise.all([getAllUsersSafe(), getAllAdminPermissions()]);

  return (
    <div className="px-6 py-8">
      <h1 className="font-display text-2xl font-semibold text-text">Users</h1>
      <div className="mt-6">
        <AdminUsersTable users={rows} />
      </div>
      <AdminPermissionsPanel admins={admins} />
    </div>
  );
}
