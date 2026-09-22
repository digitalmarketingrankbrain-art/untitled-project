"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertOctagon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PortalErrorScreen({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6 py-16">
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
        <AlertOctagon className="size-10 text-error-text" strokeWidth={1.5} />
        <h1 className="font-display text-xl font-semibold text-text">Something went wrong</h1>
        <p className="font-sans text-sm text-text-muted">
          This page hit an unexpected error while loading. Nothing has been saved or changed as a
          result. Try again, or go back to your dashboard.
        </p>
        {error.digest && <p className="font-mono text-xs text-text-muted">Reference: {error.digest}</p>}
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <Button variant="primary" onClick={reset}>
            Try again
          </Button>
          <Link href="/portal">
            <Button variant="secondary">Back to dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
