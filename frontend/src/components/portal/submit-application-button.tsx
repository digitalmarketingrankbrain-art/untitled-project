"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { submitApplicationForReview } from "@/lib/portal/applicant-actions";

function SubmitApplicationButton({ applicationId }: { applicationId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [submitting, setSubmitting] = React.useState(false);

  async function handleSubmit() {
    setSubmitting(true);
    const result = await submitApplicationForReview(applicationId);
    setSubmitting(false);
    if (!result.ok) {
      toast({ tone: "error", persistent: true, title: "Couldn't submit", description: result.error });
      return;
    }
    toast({ tone: "success", title: "Application submitted" });
    router.refresh();
  }

  return (
    <Button variant="primary" onClick={handleSubmit} loading={submitting}>
      {submitting ? "Submitting…" : "Submit application"}
    </Button>
  );
}

export { SubmitApplicationButton };
