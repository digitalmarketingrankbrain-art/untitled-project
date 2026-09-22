import { EmptyState } from "@/components/ui/empty-state";
import { getAuditLog } from "@/lib/portal/audit-log";

/**
 * Read-only, immutable display — the log itself is never editable through
 * the UI, matching the real append-only INSERT-only DB grant on the
 * audit_logs table (app_user has no UPDATE/DELETE, enforced at the Postgres
 * grant level and verified in Milestone 11).
 */
export default async function AdminAuditLogsPage() {
  const entries = await getAuditLog();

  return (
    <div className="px-6 py-8">
      <h1 className="font-display text-2xl font-semibold text-text">Audit Logs</h1>
      <p className="mt-1 font-sans text-sm text-text-muted">
        Every state-changing admin action, in order, most recent first.
      </p>
      <div className="mt-6">
        {entries.length === 0 ? (
          <EmptyState title="No actions recorded yet." description="Actions taken elsewhere in the admin console will appear here." />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-background-portal">
                <tr>
                  <th className="border-b border-border px-4 py-3 text-left font-sans text-xs font-medium uppercase tracking-[0.02em] text-text-muted">Timestamp</th>
                  <th className="border-b border-border px-4 py-3 text-left font-sans text-xs font-medium uppercase tracking-[0.02em] text-text-muted">Actor</th>
                  <th className="border-b border-border px-4 py-3 text-left font-sans text-xs font-medium uppercase tracking-[0.02em] text-text-muted">Action</th>
                  <th className="border-b border-border px-4 py-3 text-left font-sans text-xs font-medium uppercase tracking-[0.02em] text-text-muted">Target</th>
                  <th className="border-b border-border px-4 py-3 text-left font-sans text-xs font-medium uppercase tracking-[0.02em] text-text-muted">Reason</th>
                  <th className="border-b border-border px-4 py-3 text-left font-sans text-xs font-medium uppercase tracking-[0.02em] text-text-muted">IP</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e) => (
                  <tr key={e.id} className="border-b border-border last:border-b-0">
                    <td className="px-4 py-3 font-mono text-xs text-text">{e.timestamp}</td>
                    <td className="px-4 py-3 text-text">{e.actorName} <span className="text-text-muted">({e.actorRole})</span></td>
                    <td className="px-4 py-3 font-mono text-xs text-text">{e.action}</td>
                    <td className="px-4 py-3 text-text-muted">{e.targetType} · {e.targetId}</td>
                    <td className="px-4 py-3 text-text-muted">{e.reason ?? "—"}</td>
                    <td className="px-4 py-3 font-mono text-xs text-text-muted">{e.ipAddress ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
