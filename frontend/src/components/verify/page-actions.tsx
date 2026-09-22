"use client";

import * as React from "react";
import { Link2, Check, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

function CopyLinkButton() {
  const [copied, setCopied] = React.useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can fail (permissions, non-secure context) — the
      // button simply doesn't confirm; nothing else on the page depends on it.
    }
  }

  return (
    <Button variant="secondary" size="sm" onClick={handleCopy}>
      {copied ? <Check className="size-4" strokeWidth={1.75} /> : <Link2 className="size-4" strokeWidth={1.75} />}
      {copied ? "Link copied" : "Copy link"}
    </Button>
  );
}

function PrintButton() {
  return (
    <Button variant="secondary" size="sm" onClick={() => window.print()}>
      <Printer className="size-4" strokeWidth={1.75} />
      Print this page
    </Button>
  );
}

export { CopyLinkButton, PrintButton };
