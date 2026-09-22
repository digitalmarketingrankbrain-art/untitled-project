"use client";

import * as React from "react";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { saveBasicDetails } from "@/lib/portal/cab-info-actions";
import type { CabDetails } from "@/lib/portal/cab-info-data";

function CabBasicDetailsForm({ details }: { details: CabDetails }) {
  const { toast } = useToast();
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState({
    displayName: details.displayName,
    website: details.website ?? "",
    shortCode: details.shortCode ?? "",
    address: details.address ?? "",
    addressLine2: details.addressLine2 ?? "",
    country: details.country ?? "",
    state: details.state ?? "",
    city: details.city ?? "",
    postalCode: details.postalCode ?? "",
    contactFirstName: details.contactFirstName ?? "",
    contactLastName: details.contactLastName ?? "",
    contactEmail: details.contactEmail ?? "",
    contactPhone: details.contactPhone ?? "",
    director: details.director ?? "",
    certificationManager: details.certificationManager ?? "",
    registrationNumber: details.registrationNumber ?? "",
    dateOfEstablishment: details.dateOfEstablishment ?? "",
    alreadyAccreditedElsewhere: details.alreadyAccreditedElsewhere,
    alreadyAccreditedDetails: details.alreadyAccreditedDetails ?? "",
  });

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    const result = await saveBasicDetails(form);
    setSaving(false);
    if (result.ok) {
      toast({ tone: "success", title: "Basic details saved." });
    } else {
      toast({ tone: "error", title: "Couldn't save changes.", persistent: true });
    }
  }

  return (
    <div className="grid max-w-3xl grid-cols-1 gap-5 sm:grid-cols-2">
      <FormField label="Company" htmlFor="company">
        <Input id="company" value={form.displayName} onChange={(e) => set("displayName", e.target.value)} />
      </FormField>
      <FormField label="Company website" htmlFor="website">
        <Input id="website" value={form.website} onChange={(e) => set("website", e.target.value)} />
      </FormField>
      <FormField label="Company short code" htmlFor="shortCode">
        <Input id="shortCode" value={form.shortCode} onChange={(e) => set("shortCode", e.target.value)} />
      </FormField>
      <FormField label="CAB ID" htmlFor="cabId">
        <Input id="cabId" value={details.cabNumber ?? "—"} disabled />
      </FormField>
      <FormField label="Address" htmlFor="address" className="sm:col-span-2">
        <Input id="address" value={form.address} onChange={(e) => set("address", e.target.value)} />
      </FormField>
      <FormField label="Address line 2" htmlFor="address2" className="sm:col-span-2">
        <Input id="address2" value={form.addressLine2} onChange={(e) => set("addressLine2", e.target.value)} />
      </FormField>
      <FormField label="Country" htmlFor="country">
        <Input id="country" value={form.country} onChange={(e) => set("country", e.target.value)} />
      </FormField>
      <FormField label="State" htmlFor="state">
        <Input id="state" value={form.state} onChange={(e) => set("state", e.target.value)} />
      </FormField>
      <FormField label="City" htmlFor="city">
        <Input id="city" value={form.city} onChange={(e) => set("city", e.target.value)} />
      </FormField>
      <FormField label="Pincode/Zipcode" htmlFor="postalCode">
        <Input id="postalCode" value={form.postalCode} onChange={(e) => set("postalCode", e.target.value)} />
      </FormField>
      <FormField label="First name" htmlFor="firstName">
        <Input id="firstName" value={form.contactFirstName} onChange={(e) => set("contactFirstName", e.target.value)} />
      </FormField>
      <FormField label="Last name" htmlFor="lastName">
        <Input id="lastName" value={form.contactLastName} onChange={(e) => set("contactLastName", e.target.value)} />
      </FormField>
      <FormField label="Email" htmlFor="email">
        <Input id="email" type="email" value={form.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} />
      </FormField>
      <FormField label="Phone number" htmlFor="phone">
        <Input id="phone" value={form.contactPhone} onChange={(e) => set("contactPhone", e.target.value)} />
      </FormField>
      <FormField label="Director" htmlFor="director">
        <Input id="director" value={form.director} onChange={(e) => set("director", e.target.value)} />
      </FormField>
      <FormField label="Certification manager" htmlFor="certManager">
        <Input id="certManager" value={form.certificationManager} onChange={(e) => set("certificationManager", e.target.value)} />
      </FormField>
      <FormField label="License / Registration Number" htmlFor="registrationNumber">
        <Input id="registrationNumber" value={form.registrationNumber} onChange={(e) => set("registrationNumber", e.target.value)} />
      </FormField>
      <FormField label="Date of Establishment" htmlFor="dateOfEstablishment">
        <Input id="dateOfEstablishment" type="date" value={form.dateOfEstablishment} onChange={(e) => set("dateOfEstablishment", e.target.value)} />
      </FormField>
      <div className="sm:col-span-2">
        <label className="flex items-center gap-2 font-sans text-sm text-text">
          <input
            type="checkbox"
            checked={form.alreadyAccreditedElsewhere}
            onChange={(e) => set("alreadyAccreditedElsewhere", e.target.checked)}
          />
          Already accredited by another IAF MLA accreditation body
        </label>
        {form.alreadyAccreditedElsewhere && (
          <Input
            className="mt-2"
            placeholder="Which body, scope, and accreditation number"
            value={form.alreadyAccreditedDetails}
            onChange={(e) => set("alreadyAccreditedDetails", e.target.value)}
          />
        )}
      </div>

      <div className="flex gap-3 sm:col-span-2">
        <Button onClick={handleSave} loading={saving}>
          Save changes
        </Button>
      </div>
    </div>
  );
}

export { CabBasicDetailsForm };
