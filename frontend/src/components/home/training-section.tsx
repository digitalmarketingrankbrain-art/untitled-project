import Link from "next/link";
import { GraduationCap } from "lucide-react";

/**
 * Deliberately lighter-weight than the Must-Have sections above — a single
 * row, not a full section with its own heading hierarchy weight (Phase 5).
 * Presence here still pending confirmation of Training's nav permanence
 * (Phase 2 open question); shown by default, trivial to remove.
 */
function TrainingSection() {
  return (
    <section className="border-y border-border bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-2 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <GraduationCap className="size-5 text-secondary" strokeWidth={1.5} />
          <p className="font-sans text-sm text-text">
            <span className="font-semibold">Training for assessors and applicant organisations.</span>{" "}
            <span className="text-text-muted">Courses on assessment competence and standard-specific requirements.</span>
          </p>
        </div>
        <Link href="/training" className="font-sans text-sm font-medium text-secondary hover:underline">
          View training →
        </Link>
      </div>
    </section>
  );
}

export { TrainingSection };
