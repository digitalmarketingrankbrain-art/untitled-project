"use client";

import * as React from "react";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

function FraudReportForm() {
  const [submitted, setSubmitted] = React.useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <Alert tone="success" title="Report received">
        We review all reports; we may not be able to share investigation
        outcomes, but every report is logged and reviewed.
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <FormField
        label="What did you see, and where?"
        htmlFor="details"
        required
        hint="Include the accreditation reference number if you have it."
      >
        <textarea
          id="details"
          required
          rows={5}
          className="w-full rounded-[6px] border border-border bg-surface px-3 py-2 font-sans text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
        />
      </FormField>
      <FormField label="Your contact information (optional)" htmlFor="contact" hint="Reports can be submitted anonymously.">
        <Input id="contact" placeholder="Email (optional)" />
      </FormField>
      <Button type="submit" variant="destructive" className="self-start">
        Submit a report
      </Button>
    </form>
  );
}

export { FraudReportForm };
