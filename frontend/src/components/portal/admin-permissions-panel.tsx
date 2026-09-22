"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { grantPermission, revokePermission } from "@/lib/portal/admin-permissions-actions";
import type { AdminPermission, AdminUserPermissionRow } from "@/lib/portal/admin-permissions-data";

const ALL_PERMISSIONS: AdminPermission[] = ["FULL_ADMIN", "REVIEWER", "FINANCE", "DECISION_MAKER"];

export function AdminPermissionsPanel({ admins }: { admins: AdminUserPermissionRow[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [pending, setPending] = React.useState<string | null>(null);

  async function toggle(userId: string, permission: AdminPermission, has: boolean) {
    setPending(`${userId}:${permission}`);
    try {
      if (has) await revokePermission(userId, permission);
      else await grantPermission(userId, permission);
      router.refresh();
    } catch (err) {
      toast({ tone: "error", persistent: true, title: "Failed", description: err instanceof Error ? err.message : undefined });
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="mt-8">
      <h2 className="mb-1 font-sans text-sm font-semibold text-text">Admin Permissions</h2>
      <p className="mb-4 font-sans text-xs text-text-muted">
        Only FULL_ADMIN can grant/revoke. DECISION_MAKER or FULL_ADMIN is required to record a final accreditation decision or issue a certificate.
      </p>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-background-portal">
            <tr>
              <th className="border-b border-border px-4 py-3 text-left font-sans text-xs font-medium uppercase tracking-[0.02em] text-text-muted">Admin</th>
              {ALL_PERMISSIONS.map((p) => (
                <th key={p} className="border-b border-border px-4 py-3 text-left font-sans text-xs font-medium uppercase tracking-[0.02em] text-text-muted">{p}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {admins.map((a) => (
              <tr key={a.userId} className="border-b border-border last:border-b-0">
                <td className="px-4 py-3 text-text">{a.name} <span className="font-sans text-xs text-text-muted">({a.email})</span></td>
                {ALL_PERMISSIONS.map((p) => {
                  const has = a.permissions.includes(p);
                  const key = `${a.userId}:${p}`;
                  return (
                    <td key={p} className="px-4 py-3">
                      <Button
                        variant={has ? "primary" : "secondary"}
                        size="sm"
                        onClick={() => toggle(a.userId, p, has)}
                        loading={pending === key}
                      >
                        {has ? "Granted" : "Grant"}
                      </Button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
