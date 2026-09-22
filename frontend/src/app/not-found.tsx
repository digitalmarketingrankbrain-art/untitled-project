import Link from "next/link";
import { Compass } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center px-6 py-24">
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
          <Compass className="size-10 text-text-muted" strokeWidth={1.5} />
          <p className="font-mono text-sm text-text-muted">404</p>
          <h1 className="font-display text-2xl font-semibold text-text">Page not found</h1>
          <p className="font-sans text-sm text-text-muted">
            The page you&apos;re looking for doesn&apos;t exist, may have moved, or the link may be out of
            date. Nothing about your account or any record has changed.
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            <Link href="/">
              <Button variant="primary">Go to homepage</Button>
            </Link>
            <Link href="/verify">
              <Button variant="secondary">Verify an accreditation</Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
