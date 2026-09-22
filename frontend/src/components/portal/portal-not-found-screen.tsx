import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PortalNotFoundScreen() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6 py-16">
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
        <FileQuestion className="size-10 text-text-muted" strokeWidth={1.5} />
        <h1 className="font-display text-xl font-semibold text-text">Record not found</h1>
        <p className="font-sans text-sm text-text-muted">
          This item doesn&apos;t exist, or you may not have access to it. If you followed a link to get
          here, it may be out of date.
        </p>
        <Link href="/portal">
          <Button variant="primary">Back to dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
