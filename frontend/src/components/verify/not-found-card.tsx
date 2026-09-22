import Link from "next/link";
import { SearchX } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

/**
 * Deliberately NOT the same layout as VerificationCard — no organisation
 * header, no populated date fields, no card mimicking a real record, and no
 * semantic badge shape reused. This must be impossible to mistake for a
 * valid result at a glance, including in a screenshot (Phase 7).
 */
function NotFoundCard({ reference }: { reference: string }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-border bg-background-portal px-6 py-14 text-center">
      <SearchX className="size-10 text-text-muted" strokeWidth={1.5} />
      <div>
        <p className="font-sans text-lg font-semibold text-text">No matching record found</p>
        <p className="mx-auto mt-2 max-w-md font-sans text-sm text-text-muted">
          No matching public accreditation record was found for &quot;{reference}&quot;.
          Check the reference number, or search by organisation name.
        </p>
      </div>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Link href="/verify" className={cn(buttonVariants({ variant: "secondary" }))}>
          Search again
        </Link>
        <Link href="/report-fraud" className={cn(buttonVariants({ variant: "tertiary" }))}>
          Report this claim →
        </Link>
      </div>
    </div>
  );
}

export { NotFoundCard };
