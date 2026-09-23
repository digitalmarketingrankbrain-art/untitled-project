"use client";

import { useState } from "react";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { saveAssessorProfile } from "@/lib/portal/assessor-profile-actions";

export function AssessorProfileForm({ name: initialName, email }: { name: string; email: string }) {
  const { toast } = useToast();
  const [name, setName] = useState(initialName);
  const [saving, setSaving] = useState(false);
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true);
    try {
      const result = await saveAssessorProfile({ name });
      if (result.ok) { setName(result.name); toast({ tone: "success", title: "Profile saved." }); }
      else toast({ tone: "error", title: result.error, persistent: true });
    } catch (error) { toast({ tone: "error", title: error instanceof Error ? error.message : "Profile could not be saved.", persistent: true }); }
    finally { setSaving(false); }
  }
  return <form className="mt-6 flex max-w-md flex-col gap-5" onSubmit={handleSubmit}>
    <FormField label="Name" htmlFor="name" required><Input id="name" value={name} onChange={(event) => setName(event.target.value)} required maxLength={120} /></FormField>
    <FormField label="Email" htmlFor="email"><Input id="email" value={email} disabled /></FormField>
    <p className="font-sans text-xs text-text-muted">Your email is managed by the account administrator.</p>
    <Button type="submit" loading={saving} disabled={!name.trim()}>Save changes</Button>
  </form>;
}
