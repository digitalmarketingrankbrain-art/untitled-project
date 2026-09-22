"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { useToast } from "@/components/ui/toast";
import { COUNTRIES } from "@/lib/countries";
import { addCertificateAction, type AdditionalSiteInput } from "@/lib/portal/add-certificate-actions";
import type { CabDetails } from "@/lib/portal/cab-info-data";

interface AddCertificateFormProps {
  cabDetails: CabDetails;
}

export function AddCertificateForm({ cabDetails }: AddCertificateFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

  // Add Certificate Section State
  const [cabName] = React.useState(cabDetails.displayName || "Global Tech Care Pvt Ltd");
  const [certificateId, setCertificateId] = React.useState("");
  const [certificateType, setCertificateType] = React.useState("");
  const [program, setProgram] = React.useState("");
  const [scheme, setScheme] = React.useState("");
  const [certificateStandard, setCertificateStandard] = React.useState("");
  const [scopeTechnicalArea, setScopeTechnicalArea] = React.useState("");
  const [issueDate, setIssueDate] = React.useState("");
  const [expiryDate, setExpiryDate] = React.useState("");
  const [status, setStatus] = React.useState("Active");
  const [descriptionOfScope, setDescriptionOfScope] = React.useState("");

  // Organisation Section State
  const [organisationId, setOrganisationId] = React.useState(cabDetails.cabNumber ? `ORG-${cabDetails.cabNumber}` : "ORG-133");
  const [organisationName, setOrganisationName] = React.useState(cabDetails.displayName || "");
  const [tradingName, setTradingName] = React.useState(cabDetails.shortCode || "");
  const [primaryContact, setPrimaryContact] = React.useState(
    [cabDetails.contactFirstName, cabDetails.contactLastName].filter(Boolean).join(" ") || ""
  );
  const [organisationPhone, setOrganisationPhone] = React.useState(cabDetails.contactPhone || "");
  const [organisationEmail, setOrganisationEmail] = React.useState(cabDetails.contactEmail || "");
  const [locationCertifiedAddress, setLocationCertifiedAddress] = React.useState(cabDetails.address || "");
  const [city, setCity] = React.useState(cabDetails.city || "");
  const [state, setState] = React.useState(cabDetails.state || "");
  const [postalCode, setPostalCode] = React.useState(cabDetails.postalCode || "");
  const [country, setCountry] = React.useState(cabDetails.country || "IN");

  // Additional Sites State
  const [additionalSites, setAdditionalSites] = React.useState<AdditionalSiteInput[]>([]);

  function addSite() {
    setAdditionalSites((prev) => [
      ...prev,
      { address: "", city: "", state: "", postalCode: "", country: "IN" },
    ]);
  }

  function removeSite(index: number) {
    setAdditionalSites((prev) => prev.filter((_, i) => i !== index));
  }

  function updateSite(index: number, field: keyof AdditionalSiteInput, value: string) {
    setAdditionalSites((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setSubmitting(true);

    const result = await addCertificateAction({
      cabName,
      certificateId,
      certificateType,
      program,
      scheme,
      certificateStandard,
      scopeTechnicalArea,
      issueDate,
      expiryDate,
      status,
      descriptionOfScope,
      organisationId,
      organisationName,
      tradingName,
      primaryContact,
      organisationPhone,
      organisationEmail,
      locationCertifiedAddress,
      city,
      state,
      postalCode,
      country,
      additionalSites,
    });

    setSubmitting(false);

    if (!result.ok) {
      setError(result.error);
      toast({
        title: "Validation Error",
        description: result.error,
        tone: "error",
      });
      return;
    }

    setSuccessMsg(`Certificate ${certificateId} added successfully! Redirecting to profile...`);
    toast({
      title: "Certificate Added",
      description: `Certificate ${certificateId} has been successfully recorded.`,
      tone: "success",
    });

    setTimeout(() => {
      router.push("/cab/applicant/profile");
    }, 1500);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 pb-12">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <Link
            href="/cab/applicant/profile"
            className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-text-muted hover:text-text transition-colors mb-1"
          >
            <ArrowLeft className="size-3.5" /> Back to Profile
          </Link>
          <h1 className="font-display text-2xl font-bold text-[#041f19]">Add Certificate</h1>
        </div>
      </div>

      {error && <Alert tone="error" title="Submission Failed">{error}</Alert>}
      {successMsg && <Alert tone="success" title="Success">{successMsg}</Alert>}

      {/* SECTION 1: Add Certificate Card */}
      <div className="rounded-lg border border-border bg-white shadow-xs">
        <div className="border-b border-border bg-[#f8faf9] px-6 py-4">
          <h2 className="font-display text-lg font-semibold text-[#041f19]">Add Certificate</h2>
        </div>

        <div className="p-6 flex flex-col gap-6">
          {/* Row 1: CAB *, Certificate Id *, Certificate Type * */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <FormField label="CAB" htmlFor="cabName" required>
              <Input id="cabName" value={cabName} readOnly className="bg-[#f0f4f2] text-text cursor-not-allowed font-medium" />
            </FormField>

            <FormField label="Certificate Id" htmlFor="certificateId" required>
              <Input
                id="certificateId"
                placeholder="-- (e.g. CERT-2026-8891)"
                value={certificateId}
                onChange={(e) => setCertificateId(e.target.value)}
                required
              />
            </FormField>

            <FormField label="Certificate Type" htmlFor="certificateType" required>
              <select
                id="certificateType"
                value={certificateType}
                onChange={(e) => setCertificateType(e.target.value)}
                required
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text focus:outline-hidden focus:ring-2 focus:ring-secondary/20"
              >
                <option value="">Select...</option>
                <option value="Initial">Initial</option>
                <option value="Recertification">Recertification</option>
                <option value="Scope Extension">Scope Extension</option>
                <option value="Surveillance">Surveillance</option>
              </select>
            </FormField>
          </div>

          {/* Row 2: Program *, Scheme *, Certificate Standard * */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <FormField label="Program" htmlFor="program" required>
              <select
                id="program"
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                required
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text focus:outline-hidden focus:ring-2 focus:ring-secondary/20"
              >
                <option value="">Select...</option>
                <option value="testing-calibration-laboratories">Testing & Calibration Laboratories</option>
                <option value="inspection-bodies">Inspection Bodies</option>
                <option value="management-systems-certification-bodies">Management Systems Certification Bodies</option>
                <option value="product-certification-bodies">Product Certification Bodies</option>
                <option value="certification-bodies-for-persons">Certification Bodies for Persons</option>
              </select>
            </FormField>

            <FormField label="Scheme" htmlFor="scheme" required>
              <select
                id="scheme"
                value={scheme}
                onChange={(e) => setScheme(e.target.value)}
                required
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text focus:outline-hidden focus:ring-2 focus:ring-secondary/20"
              >
                <option value="">Select...</option>
                <option value="QMS">Quality Management System (QMS - ISO 9001)</option>
                <option value="ISMS">Information Security (ISMS - ISO 27001)</option>
                <option value="EMS">Environmental Management (EMS - ISO 14001)</option>
                <option value="OHSMS">Occupational Health & Safety (OHSMS - ISO 45001)</option>
                <option value="FSMS">Food Safety Management (FSMS - ISO 22000)</option>
                <option value="Medical Devices">Medical Devices QMS (ISO 13485)</option>
              </select>
            </FormField>

            <FormField label="Certificate Standard" htmlFor="certificateStandard" required>
              <select
                id="certificateStandard"
                value={certificateStandard}
                onChange={(e) => setCertificateStandard(e.target.value)}
                required
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text focus:outline-hidden focus:ring-2 focus:ring-secondary/20"
              >
                <option value="">Select...</option>
                <option value="ISO/IEC 17021-1:2015">ISO/IEC 17021-1:2015</option>
                <option value="ISO 9001:2015">ISO 9001:2015</option>
                <option value="ISO/IEC 27001:2022">ISO/IEC 27001:2022</option>
                <option value="ISO 14001:2015">ISO 14001:2015</option>
                <option value="ISO 45001:2018">ISO 45001:2018</option>
                <option value="ISO 13485:2016">ISO 13485:2016</option>
                <option value="ISO 22000:2018">ISO 22000:2018</option>
              </select>
            </FormField>
          </div>

          {/* Row 3: Scope/Technical Area, Issue Date *, Expiry Date * */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <FormField label="Scope/Technical Area" htmlFor="scopeTechnicalArea">
              <select
                id="scopeTechnicalArea"
                value={scopeTechnicalArea}
                onChange={(e) => setScopeTechnicalArea(e.target.value)}
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text focus:outline-hidden focus:ring-2 focus:ring-secondary/20"
              >
                <option value="">Select...</option>
                <option value="IAF 17">IAF 17: Basic Metals & Fabricated Products</option>
                <option value="IAF 19">IAF 19: Electrical & Optical Equipment</option>
                <option value="IAF 28">IAF 28: Construction & Building Works</option>
                <option value="IAF 29">IAF 29: Wholesale & Retail Trade</option>
                <option value="IAF 33">IAF 33: Information Technology</option>
                <option value="Technical Testing">Technical Testing & Analysis</option>
                <option value="Healthcare">Healthcare & Pharmaceuticals</option>
              </select>
            </FormField>

            <FormField label="Issue Date" htmlFor="issueDate" required>
              <Input
                id="issueDate"
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                required
              />
            </FormField>

            <FormField label="Expiry Date" htmlFor="expiryDate" required>
              <Input
                id="expiryDate"
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                required
              />
            </FormField>
          </div>

          {/* Row 4: Status * */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <FormField label="Status" htmlFor="status" required>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text focus:outline-hidden focus:ring-2 focus:ring-secondary/20"
              >
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Under Review">Under Review</option>
                <option value="Suspended">Suspended</option>
                <option value="Withdrawn">Withdrawn</option>
              </select>
            </FormField>
          </div>

          {/* Row 5: Description of Scope * */}
          <FormField label="Description of Scope" htmlFor="descriptionOfScope" required>
            <textarea
              id="descriptionOfScope"
              rows={4}
              value={descriptionOfScope}
              onChange={(e) => setDescriptionOfScope(e.target.value)}
              placeholder="Provide a full detailed technical description of certified activities and scope..."
              required
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text focus:outline-hidden focus:ring-2 focus:ring-secondary/20"
            />
          </FormField>
        </div>
      </div>

      {/* SECTION 2: Organisation Card */}
      <div className="rounded-lg border border-border bg-white shadow-xs">
        <div className="border-b border-border bg-[#f8faf9] px-6 py-4">
          <h2 className="font-display text-lg font-semibold text-[#041f19]">Organisation</h2>
        </div>

        <div className="p-6 flex flex-col gap-6">
          {/* Row 1: Organisation ID *, Organisation *, Trading Name */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <FormField label="Organisation ID" htmlFor="organisationId" required>
              <Input
                id="organisationId"
                value={organisationId}
                onChange={(e) => setOrganisationId(e.target.value)}
                required
              />
            </FormField>

            <FormField label="Organisation" htmlFor="organisationName" required>
              <Input
                id="organisationName"
                placeholder="--"
                value={organisationName}
                onChange={(e) => setOrganisationName(e.target.value)}
                required
              />
            </FormField>

            <FormField label="Trading Name" htmlFor="tradingName">
              <Input
                id="tradingName"
                value={tradingName}
                onChange={(e) => setTradingName(e.target.value)}
              />
            </FormField>
          </div>

          {/* Row 2: Primary Contact, Organisation Phone Number, Organisation Email * */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <FormField label="Primary Contact" htmlFor="primaryContact">
              <Input
                id="primaryContact"
                value={primaryContact}
                onChange={(e) => setPrimaryContact(e.target.value)}
              />
            </FormField>

            <FormField label="Organisation Phone Number" htmlFor="organisationPhone">
              <Input
                id="organisationPhone"
                type="tel"
                value={organisationPhone}
                onChange={(e) => setOrganisationPhone(e.target.value)}
              />
            </FormField>

            <FormField label="Organisation Email" htmlFor="organisationEmail" required>
              <Input
                id="organisationEmail"
                type="email"
                value={organisationEmail}
                onChange={(e) => setOrganisationEmail(e.target.value)}
                required
              />
            </FormField>
          </div>

          {/* Row 3: Location Certified Address *, City *, State */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <FormField label="Location Certified Address" htmlFor="locationCertifiedAddress" required>
              <Input
                id="locationCertifiedAddress"
                value={locationCertifiedAddress}
                onChange={(e) => setLocationCertifiedAddress(e.target.value)}
                required
              />
            </FormField>

            <FormField label="City" htmlFor="city" required>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </FormField>

            <FormField label="State" htmlFor="state">
              <Input
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </FormField>
          </div>

          {/* Row 4: Postal Code, Country * */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <FormField label="Postal Code" htmlFor="postalCode">
              <Input
                id="postalCode"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </FormField>

            <FormField label="Country" htmlFor="country" required>
              <select
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text focus:outline-hidden focus:ring-2 focus:ring-secondary/20"
              >
                <option value="">Select...</option>
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </FormField>
          </div>
        </div>
      </div>

      {/* SECTION 3: Additional Sites List (Dynamic) */}
      {additionalSites.length > 0 && (
        <div className="flex flex-col gap-4">
          <h3 className="font-display text-lg font-semibold text-[#041f19]">Additional Certified Sites</h3>
          {additionalSites.map((site, index) => (
            <div key={index} className="rounded-lg border border-border bg-white p-5 shadow-xs flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="font-sans text-sm font-bold text-[#041f19]">Additional Site #{index + 1}</span>
                <button
                  type="button"
                  onClick={() => removeSite(index)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 className="size-3.5" /> Remove Site
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField label="Location Address" htmlFor={`site-addr-${index}`}>
                  <Input
                    id={`site-addr-${index}`}
                    value={site.address}
                    onChange={(e) => updateSite(index, "address", e.target.value)}
                  />
                </FormField>

                <FormField label="City" htmlFor={`site-city-${index}`}>
                  <Input
                    id={`site-city-${index}`}
                    value={site.city}
                    onChange={(e) => updateSite(index, "city", e.target.value)}
                  />
                </FormField>

                <FormField label="State" htmlFor={`site-state-${index}`}>
                  <Input
                    id={`site-state-${index}`}
                    value={site.state}
                    onChange={(e) => updateSite(index, "state", e.target.value)}
                  />
                </FormField>

                <FormField label="Postal Code" htmlFor={`site-postal-${index}`}>
                  <Input
                    id={`site-postal-${index}`}
                    value={site.postalCode}
                    onChange={(e) => updateSite(index, "postalCode", e.target.value)}
                  />
                </FormField>

                <FormField label="Country" htmlFor={`site-country-${index}`}>
                  <select
                    id={`site-country-${index}`}
                    value={site.country}
                    onChange={(e) => updateSite(index, "country", e.target.value)}
                    className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text focus:outline-hidden focus:ring-2 focus:ring-secondary/20"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </FormField>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons at Bottom */}
      <div className="flex flex-wrap items-center gap-4 pt-2">
        <button
          type="button"
          onClick={addSite}
          className="inline-flex items-center gap-2 rounded-md bg-[#18759e] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#135d7e] transition-all shadow-xs"
        >
          <Plus className="size-4" /> Add Additional Site
        </button>

        <Button
          type="submit"
          loading={submitting}
          className="bg-[#18759e] hover:bg-[#135d7e] text-white px-8 py-2.5 text-sm font-semibold rounded-md shadow-xs transition-all"
        >
          {submitting ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </form>
  );
}
