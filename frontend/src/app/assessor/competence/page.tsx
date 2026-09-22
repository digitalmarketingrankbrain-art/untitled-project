import { auth } from "@/auth";
import { StatusBadge, type StatusTone } from "@/components/ui/status-badge";
import { getCompetenceForUser } from "@/lib/portal/assessor-data";

const STATUS_STYLE: Record<string, { tone: StatusTone; label: string }> = {
  CURRENT: { tone: "success", label: "Current" },
  EXPIRING_SOON: { tone: "warning", label: "Expiring soon" },
  EXPIRED: { tone: "error", label: "Expired" },
};

/**
 * A structured record, not free text — Phase 9: this is what would let a
 * future competence-matching feature (Future-scope per Phase 1) work at
 * all, so the data shape is worth getting right now even unautomated.
 */
export default async function CompetencePage() {
  const session = await auth();
  const entries = await getCompetenceForUser(session!.user.id);

  return (
    <div className="px-6 py-8">
      <h1 className="font-display text-2xl font-semibold text-text">Competence</h1>
      <div className="mt-6 flex flex-col gap-4">
        {entries.map((entry) => {
          const style = STATUS_STYLE[entry.status] ?? { tone: "neutral" as const, label: entry.status };
          return (
            <div key={entry.id} className="rounded-lg border border-border bg-surface p-4">
              <div className="flex items-center justify-between">
                <p className="font-sans text-sm font-semibold text-text">{entry.programName}</p>
                <StatusBadge tone={style.tone} label={style.label} size="sm" />
              </div>
              <p className="mt-1 font-sans text-sm text-text-muted">{entry.qualifyingBasis}</p>
              <div className="mt-2 flex gap-6 font-mono text-xs text-text-muted">
                <span>Qualified: {entry.dateQualified}</span>
                {entry.expiryDate && <span>Expires: {entry.expiryDate}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
