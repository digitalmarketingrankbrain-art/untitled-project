"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  User,
  Building2,
  Mail,
  MapPin,
  Globe,
  FileText,
  CheckCircle2,
  Printer,
  Upload,
  Calendar,
  ShieldCheck,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { submitApplicationRequestAction } from "@/lib/portal/application-request-actions";
import {
  DEFAULT_CALLING_ISO,
  OTHER_CALLING_CODES,
  SOUTH_ASIA_CALLING_CODES,
  findCallingCode,
} from "@/lib/calling-codes";
import {
  FIELD_ORDER,
  normalizeWebsite,
  validateAll,
  validateField,
  validateLicenseFile,
  type ApplicationFormValues,
  type FormErrors,
} from "@/lib/application-request-validation";

function FieldError({ name, message }: { name: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={`${name}-error`} role="alert" className="mt-1 text-[11px] font-medium text-red-600">
      {message}
    </p>
  );
}

const APPLY_FOR_OPTIONS = [
  { id: "ms", label: "Management Systems" },
  { id: "ib", label: "Inspection Bodies" },
  { id: "pcb", label: "Personnel Certification Bodies" },
  { id: "tl", label: "Testing Laboratories" },
  { id: "vvb", label: "Validation and Verification Bodies" },
  { id: "prod", label: "Product Certification Bodies" },
];

export function ApplicationRequestForm() {
  const [formData, setFormData] = useState<ApplicationFormValues>({
    // Personal Info
    firstName: "",
    lastName: "",
    email: "",
    phoneCode: "+1",
    phoneNumber: "",
    address1: "",
    address2: "",
    addressDetails: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",

    // Company Info
    companyName: "",
    companyWebsite: "",
    directors: "",
    responsiblePerson: "",
    isAlreadyAccredited: "No",
    dateOfEstablishment: "",
    licenseNumber: "",
    licenseFileName: "",

    // Apply For
    applyFor: [] as string[],

    // Remarks
    remarks: "",

    // Captcha
    isCaptchaChecked: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  // The selected country is tracked by ISO code because many countries share one calling code (e.g. +1).
  const [phoneIso, setPhoneIso] = useState(DEFAULT_CALLING_ISO);

  const handlePhoneCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const entry = findCallingCode(e.target.value);
    if (!entry) return;
    setPhoneIso(entry.iso);
    setFormData((prev) => ({ ...prev, phoneCode: entry.code }));
  };

  // Once a field has shown an error, re-check it as the user types so the message clears the moment it's fixed.
  React.useEffect(() => {
    setErrors((prev) => {
      let changed = false;
      const next: FormErrors = { ...prev };
      for (const key of Object.keys(prev) as (keyof FormErrors)[]) {
        if (key === "licenseFile") continue;
        const message = validateField(key, formData) ?? undefined;
        if (message !== prev[key]) {
          changed = true;
          if (message) next[key] = message;
          else delete next[key];
        }
      }
      return changed ? next : prev;
    });
  }, [formData]);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const name = e.target.name as keyof ApplicationFormValues;
    if (!FIELD_ORDER.includes(name)) return;
    const message = validateField(name, formData) ?? undefined;
    setErrors((prev) => {
      const next = { ...prev };
      if (message) next[name] = message;
      else delete next[name];
      return next;
    });
  };

  /** Shared props for every text input / select: value, change + blur handlers, and the invalid state for styling and screen readers. */
  const fp = (name: keyof ApplicationFormValues) => ({
    name,
    value: formData[name] as string,
    onChange: handleInputChange,
    onBlur: handleBlur,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState("");
  const [submittedDate, setSubmittedDate] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleApplyForToggle = (id: string) => {
    setFormData((prev) => {
      const exists = prev.applyFor.includes(id);
      return {
        ...prev,
        applyFor: exists
          ? prev.applyFor.filter((item) => item !== id)
          : [...prev.applyFor, id],
      };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const problem = validateLicenseFile(file);
    if (problem) {
      e.target.value = "";
      setErrors((prev) => ({ ...prev, licenseFile: problem }));
      return;
    }
    setErrors((prev) => {
      const next = { ...prev };
      delete next.licenseFile;
      return next;
    });
    setFormData((prev) => ({
      ...prev,
      licenseFileName: file.name,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const found = validateAll(formData);
    setErrors((prev) => ({ ...found, ...(prev.licenseFile ? { licenseFile: prev.licenseFile } : {}) }));
    const firstInvalid = FIELD_ORDER.find((name) => found[name]);
    if (firstInvalid) {
      setSubmitError("Please fix the highlighted fields and submit again.");
      const el = document.querySelector<HTMLElement>(`[name="${firstInvalid}"], [data-field="${firstInvalid}"]`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.focus({ preventScroll: true });
      return;
    }
    setIsSubmitting(true);

    const result = await submitApplicationRequestAction({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phoneCode: formData.phoneCode,
      phoneNumber: formData.phoneNumber,
      address1: formData.address1,
      address2: formData.address2,
      addressDetails: formData.addressDetails,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
      country: formData.country,
      companyName: formData.companyName,
      companyWebsite: normalizeWebsite(formData.companyWebsite) ?? undefined,
      directors: formData.directors,
      responsiblePerson: formData.responsiblePerson,
      isAlreadyAccredited: formData.isAlreadyAccredited === "Yes",
      dateOfEstablishment: formData.dateOfEstablishment || undefined,
      licenseNumber: formData.licenseNumber,
      licenseFileName: formData.licenseFileName,
      applyFor: formData.applyFor,
      remarks: formData.remarks,
    });

    setIsSubmitting(false);
    if (!result.ok) {
      setSubmitError(result.error);
      return;
    }
    setReferenceId(result.referenceId);
    setSubmittedDate(
      new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    );
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setErrors({});
    setSubmitError(null);
    setPhoneIso(DEFAULT_CALLING_ISO);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phoneCode: "+1",
      phoneNumber: "",
      address1: "",
      address2: "",
      addressDetails: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
      companyName: "",
      companyWebsite: "",
      directors: "",
      responsiblePerson: "",
      isAlreadyAccredited: "No",
      dateOfEstablishment: "",
      licenseNumber: "",
      licenseFileName: "",
      applyFor: [],
      remarks: "",
      isCaptchaChecked: false,
    });
  };

  if (isSubmitted) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
            <div className="rounded-full bg-emerald-50 p-2 text-emerald-600">
              <CheckCircle2 className="size-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                Application Received
              </span>
              <h2 className="mt-1 font-display text-xl font-bold text-slate-900">
                Application Request Form Submitted
              </h2>
            </div>
            <button
              onClick={() => window.print()}
              className="ml-auto text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1.5 border border-slate-200 rounded-lg px-3 py-1.5"
            >
              <Printer className="size-3.5" /> Print
            </button>
          </div>

          {/* Details Bar */}
          <div className="my-6 grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4 text-xs">
            <div>
              <span className="text-slate-500 block">Reference ID</span>
              <span className="font-mono font-bold text-slate-900 text-sm">{referenceId}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Date Submitted</span>
              <span className="font-medium text-slate-900">{submittedDate}</span>
            </div>
          </div>

          {/* Overview */}
          <div className="space-y-4 border-b border-slate-100 pb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="rounded-xl border border-slate-100 p-4">
                <span className="text-xs font-semibold text-slate-400 block mb-1">PERSONAL INFO</span>
                <p className="font-semibold text-slate-900">{formData.firstName} {formData.lastName}</p>
                <p className="text-xs text-slate-600 mt-1">{formData.email}</p>
                <p className="text-xs text-slate-600">{formData.phoneCode} {formData.phoneNumber}</p>
              </div>

              <div className="rounded-xl border border-slate-100 p-4">
                <span className="text-xs font-semibold text-slate-400 block mb-1">COMPANY INFO</span>
                <p className="font-semibold text-slate-900">{formData.companyName || "Organization"}</p>
                <p className="text-xs text-slate-600 mt-1">License No: {formData.licenseNumber || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="mt-6 space-y-2">
            <p className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
              <Info className="size-3.5 text-blue-600" /> What happens next?
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our team will review your request. You will receive an email at the address you provided once it is approved or rejected. If approved, you can then sign in as a Certification Body with that email address.
            </p>
          </div>

          <div className="mt-8 flex items-center gap-3">
            <Link
              href="/login"
              className={cn(buttonVariants({ variant: "primary", size: "sm" }), "bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-4")}
            >
              Go to Sign In
            </Link>
            <button
              onClick={handleReset}
              className={cn(buttonVariants({ variant: "tertiary", size: "sm" }), "text-slate-600 hover:text-slate-900")}
            >
              Submit Another Request
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full" suppressHydrationWarning>
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        
        {/* SECTION 1: Personal Info* */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm">
          <div className="border-b border-slate-100 pb-3 mb-5">
            <h3 className="font-display text-base font-bold text-slate-900 flex items-center gap-2">
              <User className="size-4 text-blue-600" />
              Personal Info<span className="text-red-500">*</span>
            </h3>
          </div>

          <div className="space-y-4">
            {/* First Name & Last Name */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...fp("firstName")}
                  placeholder="First name"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 aria-invalid:border-red-500 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
                <FieldError name="firstName" message={errors.firstName} />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...fp("lastName")}
                  placeholder="Last Name"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 aria-invalid:border-red-500 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
                <FieldError name="lastName" message={errors.lastName} />
              </div>
            </div>

            {/* Email Address & Phone */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    {...fp("email")}
                    placeholder="Email address"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/50 aria-invalid:border-red-500 py-2.5 pl-9 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <FieldError name="email" message={errors.email} />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <select
                    name="phoneCode"
                    value={phoneIso}
                    onChange={handlePhoneCountryChange}
                    aria-label="Country calling code"
                    className="w-[8.5rem] shrink-0 rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 py-2.5 text-sm font-medium text-slate-800 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  >
                    <optgroup label="South Asia">
                      {SOUTH_ASIA_CALLING_CODES.map((c) => (
                        <option key={c.iso} value={c.iso}>
                          {c.code} {c.name}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="All countries">
                      {OTHER_CALLING_CODES.map((c) => (
                        <option key={c.iso} value={c.iso}>
                          {c.code} {c.name}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                  <input
                    type="tel"
                    {...fp("phoneNumber")}
                    placeholder="Phone number"
                    className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50/50 aria-invalid:border-red-500 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <FieldError name="phoneNumber" message={errors.phoneNumber} />
              </div>
            </div>

            {/* Address Line 1 & Apt/Suite */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Search and select address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    {...fp("address1")}
                    placeholder="Search and select address"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/50 aria-invalid:border-red-500 py-2.5 pl-9 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <FieldError name="address1" message={errors.address1} />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Apartment/Suite/Building No.
                </label>
                <input
                  type="text"
                  {...fp("address2")}
                  placeholder="Apartment/Suite/Building No."
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 aria-invalid:border-red-500 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
                <FieldError name="address2" message={errors.address2} />
              </div>
            </div>

            {/* Enter Address Details & City */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Enter Address Details
                </label>
                <input
                  type="text"
                  {...fp("addressDetails")}
                  placeholder="Enter Address Details"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 aria-invalid:border-red-500 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
                <p className="mt-1 text-[11px] text-red-500 font-medium">
                  Can&apos;t find your address in suggestions? Enter Address Details manually above.
                </p>
                <FieldError name="addressDetails" message={errors.addressDetails} />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...fp("city")}
                  placeholder="City"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 aria-invalid:border-red-500 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
                <FieldError name="city" message={errors.city} />
              </div>
            </div>

            {/* State, Zip Code, Country */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...fp("state")}
                  placeholder="State"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 aria-invalid:border-red-500 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
                <FieldError name="state" message={errors.state} />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Zip Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...fp("zipCode")}
                  placeholder="Zip Code"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 aria-invalid:border-red-500 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
                <FieldError name="zipCode" message={errors.zipCode} />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Country <span className="text-red-500">*</span>
                </label>
                <select
                  {...fp("country")}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 aria-invalid:border-red-500 px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                >
                  <optgroup label="South Asia">
                    {SOUTH_ASIA_CALLING_CODES.map((c) => (
                      <option key={c.iso} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="All countries">
                    {OTHER_CALLING_CODES.map((c) => (
                      <option key={c.iso} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Company Info* */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm">
          <div className="border-b border-slate-100 pb-3 mb-5">
            <h3 className="font-display text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="size-4 text-blue-600" />
              Company Info<span className="text-red-500">*</span>
            </h3>
          </div>

          <div className="space-y-4">
            {/* Company Name & Company Website */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...fp("companyName")}
                  placeholder="Company Name"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 aria-invalid:border-red-500 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
                <FieldError name="companyName" message={errors.companyName} />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Company Website
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    inputMode="url"
                    {...fp("companyWebsite")}
                    placeholder="Company Website"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/50 aria-invalid:border-red-500 py-2.5 pl-9 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <FieldError name="companyWebsite" message={errors.companyWebsite} />
              </div>
            </div>

            {/* Directors/Managing Director & Certification Manager */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Directors/Managing Director
                </label>
                <input
                  type="text"
                  {...fp("directors")}
                  placeholder="Directors/Managing Director"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 aria-invalid:border-red-500 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
                <FieldError name="directors" message={errors.directors} />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Certification Manager /Operations Manager/Responsible Person
                </label>
                <input
                  type="text"
                  {...fp("responsiblePerson")}
                  placeholder="Certification Manager /Operations Manager/Responsible Person"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 aria-invalid:border-red-500 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
                <FieldError name="responsiblePerson" message={errors.responsiblePerson} />
              </div>
            </div>

            {/* Is Already Accredited By another IAF MLA Body & Date Of Establishment */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Is Already Accredited By another IAF MLA Accreditation Body
                </label>
                <select
                  {...fp("isAlreadyAccredited")}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 aria-invalid:border-red-500 px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Date Of Establishment
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="date"
                    {...fp("dateOfEstablishment")}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/50 aria-invalid:border-red-500 py-2.5 pl-9 pr-3.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <FieldError name="dateOfEstablishment" message={errors.dateOfEstablishment} />
              </div>
            </div>

            {/* License/ Registration Number & Upload Document */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  License/ Registration Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...fp("licenseNumber")}
                  placeholder="License/ Registration Number"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 aria-invalid:border-red-500 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
                <FieldError name="licenseNumber" message={errors.licenseNumber} />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Upload License/Registration Document
                </label>
                <label className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 text-xs font-semibold text-white transition-colors hover:bg-blue-700">
                  <Upload className="size-4" />
                  <span>
                    {formData.licenseFileName ? formData.licenseFileName : "Upload License/Registration Document"}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.jpg,.png"
                  />
                </label>
                <FieldError name="licenseFile" message={errors.licenseFile} />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: Apply for* */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm">
          <div className="border-b border-slate-100 pb-3 mb-5">
            <h3 className="font-display text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="size-4 text-blue-600" />
              Apply for<span className="text-red-500">*</span>
            </h3>
          </div>

          <div data-field="applyFor" tabIndex={-1} aria-invalid={errors.applyFor ? true : undefined} className="divide-y divide-slate-100 border-y border-slate-100 py-1 space-y-2 focus:outline-none aria-invalid:border-red-500">
            {APPLY_FOR_OPTIONS.map((option) => {
              const isChecked = formData.applyFor.includes(option.id);
              return (
                <label
                  key={option.id}
                  className="flex items-center gap-3 py-2.5 cursor-pointer text-sm font-medium text-slate-700 hover:text-slate-900"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleApplyForToggle(option.id)}
                    className="size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>{option.label}</span>
                </label>
              );
            })}
          </div>
          <FieldError name="applyFor" message={errors.applyFor} />
        </div>

        {/* SECTION 4: Remarks */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm">
          <div className="mb-3">
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Remarks
            </label>
            <textarea
              rows={4}
              {...fp("remarks")}
              placeholder="Remarks"
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 aria-invalid:border-red-500 p-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            <FieldError name="remarks" message={errors.remarks} />
          </div>

          {/* Captcha Box */}
          <div className="mt-4 flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3 max-w-xs">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="isCaptchaChecked"
                aria-invalid={errors.isCaptchaChecked ? true : undefined}
                checked={formData.isCaptchaChecked}
                onChange={handleInputChange}
                className="size-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs font-medium text-slate-700">I&apos;m not a robot</span>
            </label>
            <div className="flex flex-col items-end">
              <ShieldCheck className="size-5 text-blue-600" />
              <span className="text-[9px] text-slate-400">reCAPTCHA</span>
            </div>
          </div>
          <FieldError name="isCaptchaChecked" message={errors.isCaptchaChecked} />
        </div>

        {submitError && (
          <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {submitError}
          </p>
        )}

        {/* Action Button */}
        <div className="flex items-center justify-center pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              buttonVariants({ variant: "primary", size: "md" }),
              "h-11 px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all shadow-none"
            )}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2 text-sm">
                <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Submitting...
              </span>
            ) : (
              <span className="flex items-center gap-2 text-sm">
                Submit &raquo;
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
