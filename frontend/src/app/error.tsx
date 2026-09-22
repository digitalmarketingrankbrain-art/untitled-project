"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertOctagon } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

/**
 * What happened -> what it means -> what to do next (per the project's
 * microcopy standard) — never a raw stack trace, even though `error` is
 * available here for that purpose if we wanted it.
 */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center px-6 py-24">
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
          <AlertOctagon className="size-10 text-error-text" strokeWidth={1.5} />
          <h1 className="font-display text-2xl font-semibold text-text">Something went wrong</h1>
          <p className="font-sans text-sm text-text-muted">
            This page hit an unexpected error while loading. Nothing has been saved or changed as a
            result. Try again, or head back to the homepage — if this keeps happening, please contact
            us so we can look into it.
          </p>
          {error.digest && <p className="font-mono text-xs text-text-muted">Reference: {error.digest}</p>}
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            <Button variant="primary" onClick={reset}>
              Try again
            </Button>
            <Link href="/">
              <Button variant="secondary">Go to homepage</Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
