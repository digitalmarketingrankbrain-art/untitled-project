"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { requestLoginOtp } from "@/lib/auth/actions";
import type { Role } from "@/lib/auth/store";

type Step = "email" | "otp";
type Portal = "cb" | "assessor" | "admin";

/** /login shows Certification Body + Assessor; the Admin sign-in lives on its own page at /admin. */
const DEFAULT_PORTALS: Portal[] = ["cb", "assessor"];

/** One sign-in tab per role. The tab only decides which accounts may request a code here; real access control is the /portal RBAC in middleware. */
const PORTAL_CONFIG: Record<Portal, { label: string; allowedRoles: Role[]; wrongPortalMessage: string }> = {
  cb: {
    label: "Certification Body",
    allowedRoles: ["APPLICANT"],
    wrongPortalMessage: "This isn't a Certification Body account. Assessors, use the Assessor tab above.",
  },
  assessor: {
    label: "Assessor",
    allowedRoles: ["ASSESSOR"],
    wrongPortalMessage: "This isn't an Assessor account. Certification Bodies, use the Certification Body tab above.",
  },
  admin: {
    label: "Admin",
    allowedRoles: ["ADMIN"],
    wrongPortalMessage: "This isn't an Admin account.",
  },
};

function LoginForm({ portals = DEFAULT_PORTALS }: { portals?: Portal[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/portal";

  const [portal, setPortal] = React.useState<Portal>(portals[0] ?? "cb");
  const [step, setStep] = React.useState<Step>("email");
  const [email, setEmail] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [devCode, setDevCode] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const config = PORTAL_CONFIG[portal];

  function selectPortal(next: Portal) {
    setPortal(next);
    setStep("email");
    setOtp("");
    setDevCode(null);
    setError(null);
  }

  async function requestCode() {
    setError(null);
    setLoading(true);
    const result = await requestLoginOtp(email, config.allowedRoles);
    setLoading(false);

    if (!result.ok) {
      if ("wrongPortal" in result && result.wrongPortal) {
        setError(config.wrongPortalMessage);
        return;
      }
      setError(result.error);
      return;
    }
    setDevCode(result.devCode);
    setStep("otp");
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    await requestCode();
  }

  async function handleOtpSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await signIn("credentials", { email, otp, redirect: false });
    setLoading(false);

    if (result?.error) {
      setError("That code didn't match or has expired. Try again or request a new one.");
      return;
    }
    router.push(callbackUrl);
  }

  // A single portal (the /admin page) needs no switcher.
  const portalToggle = portals.length < 2 ? null : (
    <div className="mb-6" role="radiogroup" aria-label="Login as">
      <p className="mb-2 font-sans text-xs font-medium text-text-muted">Login as</p>
      <div className={cn("grid gap-1.5 rounded-lg border border-border bg-background p-1", portals.length === 3 ? "grid-cols-3" : "grid-cols-2")}>
        {portals.map((key) => (
          <button
            key={key}
            type="button"
            role="radio"
            aria-checked={portal === key}
            onClick={() => selectPortal(key)}
            className={cn(
              "rounded-md px-2 py-2 text-center font-sans text-sm font-medium leading-tight transition",
              portal === key
                ? "bg-surface text-text shadow-sm"
                : "text-text-muted hover:text-text",
            )}
          >
            {PORTAL_CONFIG[key].label}
          </button>
        ))}
      </div>
    </div>
  );

  if (step === "otp") {
    return (
      <div>
        {portalToggle}
        <form onSubmit={handleOtpSubmit} className="flex flex-col gap-5">
          <p className="font-sans text-sm text-text-muted">
            Enter the 6-digit code sent for <span className="font-medium text-text">{email}</span>.
          </p>
          {error && <Alert tone="error" title="Sign in failed">{error}</Alert>}
          {devCode && (
            <Alert tone="info" title="[DEV ONLY] No email/SMS provider is connected yet">
              <p>This code would normally be sent to your email. For now, here it is:</p>
              <p className="mt-1 font-mono text-lg text-text">{devCode}</p>
            </Alert>
          )}
          <FormField label="One-time code" htmlFor="otp" required>
            <Input
              id="otp"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              autoFocus
              required
              suppressHydrationWarning
            />
          </FormField>
          <Button type="submit" variant="primary" loading={loading}>
            {loading ? "Verifying…" : "Sign in"}
          </Button>
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setStep("email");
                setOtp("");
                setDevCode(null);
                setError(null);
              }}
              className="font-sans text-sm text-text-muted hover:underline"
            >
              ← Use a different email
            </button>
            <button
              type="button"
              onClick={requestCode}
              disabled={loading}
              className="font-sans text-sm text-secondary hover:underline"
            >
              Resend code
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      {portalToggle}
      <form onSubmit={handleEmailSubmit} className="flex flex-col gap-5">
        {error && <Alert tone="error" title="Couldn't send code">{error}</Alert>}
        <FormField label="Email" htmlFor="email" required>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
            required
            suppressHydrationWarning
          />
        </FormField>
        <Button type="submit" variant="primary" loading={loading}>
          {loading ? "Sending code…" : "Send code"}
        </Button>
      </form>

      {portal === "cb" && (
        <p className="mt-4 font-sans text-sm text-text-muted">
          New applicant organisation?{" "}
          <Link href="/apply" className="text-secondary hover:underline">
            Apply for accreditation
          </Link>
        </p>
      )}
    </div>
  );
}

export { LoginForm };
