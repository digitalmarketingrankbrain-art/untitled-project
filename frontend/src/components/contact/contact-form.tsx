"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Building,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const COUNTRY_CODES = [
  { code: "+1", country: "US/CA" },
  { code: "+91", country: "IN" },
  { code: "+92", country: "PK" },
  { code: "+880", country: "BD" },
  { code: "+94", country: "LK" },
  { code: "+977", country: "NP" },
  { code: "+975", country: "BT" },
  { code: "+960", country: "MV" },
  { code: "+44", country: "UK" },
  { code: "+971", country: "UAE" },
  { code: "+65", country: "SG" },
];

const SUBJECT_OPTIONS = [
  { value: "general", label: "General Enquiry" },
  { value: "accreditation-request", label: "Accreditation Request" },
  { value: "applicant", label: "Applicant & Onboarding Support" },
  { value: "audit-assessment", label: "Audit & Assessment Schedule" },
  { value: "media", label: "Press & Media Enquiries" },
  { value: "complaint", label: "Complaints & Appeals" },
  { value: "fraud", label: "Report Fraud / Impersonation" },
  { value: "other", label: "Other Inquiry" },
];

export function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneCode: "+1",
    phoneNumber: "",
    company: "",
    subject: "general",
    message: "",
    isCaptchaChecked: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState("");

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      setReferenceId(`SAAF-MSG-2026-${randomNum}`);
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 500);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phoneCode: "+1",
      phoneNumber: "",
      company: "",
      subject: "general",
      message: "",
      isCaptchaChecked: false,
    });
  };

  if (isSubmitted) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="rounded-full bg-emerald-50 p-2 text-emerald-600">
            <CheckCircle2 className="size-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
              Message Sent
            </span>
            <h3 className="mt-1 font-display text-lg font-bold text-slate-900">
              Thank You for Contacting SAAF
            </h3>
          </div>
        </div>

        <div className="my-5 rounded-xl bg-slate-50 p-4 text-xs space-y-1">
          <p className="text-slate-500">Inquiry Reference Number:</p>
          <p className="font-mono text-base font-bold text-slate-900">{referenceId}</p>
          <p className="text-slate-500 pt-1">
            Our Secretariat team will review your enquiry and respond within 24 business hours to <strong>{formData.email}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleReset}
            className={cn(
              buttonVariants({ variant: "primary", size: "sm" }),
              "bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-4"
            )}
          >
            Send Another Message
          </button>
          <Link
            href="/apply"
            className={cn(
              buttonVariants({ variant: "tertiary", size: "sm" }),
              "text-slate-700 hover:text-slate-900"
            )}
          >
            Apply for Accreditation →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* First Name & Last Name */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            First name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="First name"
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="Last Name"
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* Email Address & Phone Number */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Email address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              required
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email address"
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2.5 pl-9 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Phone Number
          </label>
          <div className="flex gap-2">
            <select
              name="phoneCode"
              value={formData.phoneCode}
              onChange={handleInputChange}
              className="rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 py-2.5 text-sm font-medium text-slate-800 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              {COUNTRY_CODES.map((item) => (
                <option key={item.code + item.country} value={item.code}>
                  {item.country} {item.code}
                </option>
              ))}
            </select>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="Phone number"
              className="flex-1 rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Company & Subject */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Company <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              required
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              placeholder="Company name"
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2.5 pl-9 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Subject <span className="text-red-500">*</span>
          </label>
          <select
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
          >
            {SUBJECT_OPTIONS.map((sub) => (
              <option key={sub.value} value={sub.value}>
                {sub.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Redirect Warning Alert for Special Enquiries */}
      {formData.subject === "complaint" && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
          <AlertCircle className="size-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Complaints & Appeals Process</p>
            <p className="mt-0.5 text-amber-800">
              For formal complaints regarding an accredited body or SAAF decision, please visit our dedicated{" "}
              <Link href="/complaints-and-appeals" className="font-bold underline hover:text-amber-950">
                Complaints & Appeals Page →
              </Link>
            </p>
          </div>
        </div>
      )}

      {formData.subject === "fraud" && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3.5 text-xs text-red-900 flex items-start gap-2.5">
          <AlertCircle className="size-4 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Report Counterfeit / Fraud</p>
            <p className="mt-0.5 text-red-800">
              To report fake certificates or fraudulent claims, please submit details to our confidential{" "}
              <Link href="/report-fraud" className="font-bold underline hover:text-red-950">
                Fraud Reporting Portal →
              </Link>
            </p>
          </div>
        </div>
      )}

      {/* Message */}
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
          Message
        </label>
        <textarea
          rows={5}
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          placeholder="Message"
          className="w-full rounded-lg border border-slate-200 bg-slate-50/50 p-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
        />
      </div>

      {/* Captcha Box */}
      <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3 max-w-xs">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            required
            name="isCaptchaChecked"
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

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            buttonVariants({ variant: "primary", size: "md" }),
            "h-11 px-7 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all shadow-none"
          )}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2 text-sm">
              <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Sending...
            </span>
          ) : (
            <span className="flex items-center gap-2 text-sm">
              Submit &raquo;
            </span>
          )}
        </button>
      </div>
    </form>
  );
}
