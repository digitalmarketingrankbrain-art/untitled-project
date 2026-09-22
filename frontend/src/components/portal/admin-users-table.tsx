"use client";

import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { StatusBadge, type StatusTone } from "@/components/ui/status-badge";

export interface AdminUserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

const ROLE_TONE: Record<string, StatusTone> = {
  APPLICANT: "info",
  ASSESSOR: "warning",
  ADMIN: "neutral",
};

const columns: DataTableColumn<AdminUserRow>[] = [
  { key: "name", header: "Name", render: (u) => u.name },
  { key: "email", header: "Email", render: (u) => u.email },
  {
    key: "role",
    header: "Role",
    render: (u) => <StatusBadge tone={ROLE_TONE[u.role] ?? "neutral"} label={u.role} size="sm" />,
  },
  { key: "status", header: "Status", render: (u) => u.status },
];

function AdminUsersTable({ users }: { users: AdminUserRow[] }) {
  return <DataTable columns={columns} rows={users} getRowKey={(u) => u.id} />;
}

export { AdminUsersTable };
