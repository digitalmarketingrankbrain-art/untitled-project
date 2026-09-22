"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { toggleVerificationPublished, toggleCertificateVisible } from "@/lib/portal/admin-actions";

/**
 * The public /verify page mirrors only these two admin-controlled flags,
 * never the full internal record — Phase 2/10/12's "thin curated layer"
 * decision. "Preview public page" opens the actual rendered result so
 * admin verifies what the public sees, not just the underlying data.
 */
function VerificationCurationControls({
  reference,
  isPublished,
  certificateVisible,
}: {
  reference: string;
  isPublished: boolean;
  certificateVisible: boolean;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [busy, setBusy] = React.useState(false);

  async function handleTogglePublished() {
    setBusy(true);
    const result = await toggleVerificationPublished(reference, !isPublished);
    setBusy(false);
    if (!result.ok) return toast({ tone: "error", persistent: true, title: "Failed", description: result.error });
    router.refresh();
  }

  async function handleToggleCertificate() {
    setBusy(true);
    const result = await toggleCertificateVisible(reference, !certificateVisible);
    setBusy(false);
    if (!result.ok) return toast({ tone: "error", persistent: true, title: "Failed", description: result.error });
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-3">
      <label className="flex items-center gap-2 font-sans text-sm text-text">
        <input type="checkbox" checked={isPublished} onChange={handleTogglePublished} disabled={busy} />
        Published on the public verification page
      </label>
      <label className="flex items-center gap-2 font-sans text-sm text-text">
        <input type="checkbox" checked={certificateVisible} onChange={handleToggleCertificate} disabled={busy} />
        Certificate document visible to the public
      </label>
      <Link href={`/verify/${reference}`} target="_blank">
        <Button variant="secondary" size="sm">
          <Eye className="size-4" strokeWidth={1.75} />
          Preview public page
        </Button>
      </Link>
    </div>
  );
}

export { VerificationCurationControls };
