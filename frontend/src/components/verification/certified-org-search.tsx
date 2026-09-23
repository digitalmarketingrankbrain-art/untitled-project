"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { COUNTRIES } from "@/lib/countries";
import { CheckCircle2, AlertCircle, Building2 } from "lucide-react";
import { CertificateModal, type CertificateData } from "./certificate-modal";

export interface CertifiedOrgRecord {
  id: string;
  orgName: string;
  certificateNumber: string;
  country: string;
  standard: string;
  issuingCab: string;
  status: "Valid" | "Suspended" | "Withdrawn";
  issueDate: string;
  expiryDate: string;
  scope: string;
  address: string;
}

const CERTIFIED_ORGS_MOCK: CertifiedOrgRecord[] = [
  {
    id: "1",
    orgName: "QCC GLOBAL INDUSTRIAL SERVICES LTD",
    certificateNumber: "SAAF-9001-8841",
    country: "India",
    standard: "ISO 9001:2015 Quality Management Systems",
    issuingCab: "Quality Control Certification (QC)",
    status: "Valid",
    issueDate: "12-Feb-2023",
    expiryDate: "11-Feb-2026",
    scope: "Provision of Quality Audit, Testing & Industrial Standards Compliance Inspection Services.",
    address: "Plot 104, Industrial Area Phase II, New Delhi-110020, India",
  },
  {
    id: "2",
    orgName: "ABC LOGISTICS & SUPPLY CHAIN SOLUTION",
    certificateNumber: "SAAF-14001-4421",
    country: "India",
    standard: "ISO 14001:2015 Environmental Management Systems",
    issuingCab: "A-MARK RATINGS PRIVATE LIMITED",
    status: "Valid",
    issueDate: "01-Aug-2022",
    expiryDate: "31-Jul-2025",
    scope: "Freight Forwarding, Cold Chain Warehousing and Supply Chain Logistics Operations.",
    address: "24 Commercial Center, MG Road, Gurugram, Haryana, India",
  },
  {
    id: "3",
    orgName: "APEX CYBERSECURITY & TECH LABS",
    certificateNumber: "SAAF-27001-9012",
    country: "United Arab Emirates",
    standard: "ISO/IEC 27001:2022 Information Security Management",
    issuingCab: "ACCREDIFY GLOBAL LLC",
    status: "Valid",
    issueDate: "15-Oct-2023",
    expiryDate: "14-Oct-2026",
    scope: "Cloud Infrastructure Hosting, Managed SOC & Threat Intelligence Monitoring.",
    address: "Level 18, Al Saada Tower, DIFC, Dubai, United Arab Emirates",
  },
];

export function CertifiedOrgSearch() {
  return <Suspense fallback={<p>Loading search...</p>}><CertifiedOrgSearchForm /></Suspense>;
}

function CertifiedOrgSearchForm() {
  const params = useSearchParams();
  const query = params.get("q") || "";
  const [namePrefix, setNamePrefix] = useState(/\d/.test(query) ? "" : query.toUpperCase().slice(0, 3));
  const [certNumber, setCertNumber] = useState(/\d/.test(query) ? query : "");
  const [country, setCountry] = useState("India");
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<CertifiedOrgRecord[]>([]);
  const [selectedCert, setSelectedCert] = useState<CertificateData | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const prefix = namePrefix.trim().toUpperCase();
    const certNo = certNumber.trim().toLowerCase();

    const filtered = CERTIFIED_ORGS_MOCK.filter((item) => {
      const matchPrefix = !prefix || item.orgName.toUpperCase().startsWith(prefix) || item.orgName.toUpperCase().includes(prefix);
      const matchCert = !certNo || item.certificateNumber.toLowerCase().includes(certNo);
      const matchCountry = !country || country === "all" || item.country.toLowerCase() === country.toLowerCase();
      return matchPrefix && matchCert && matchCountry;
    });

    setResults(filtered);
  };

  const handleViewCertModal = (item: CertifiedOrgRecord) => {
    setSelectedCert({
      title: item.orgName,
      cabName: item.orgName,
      accreditationNumber: item.certificateNumber,
      address: item.address,
      scope: item.standard + " - " + item.scope,
      issueDate: item.issueDate,
      expiryDate: item.expiryDate,
      status: item.status,
      type: "ORGANIZATION",
    });
  };

  return (
    <div className="space-y-8">
      {/* Search Container Matching Screenshot 3 */}
      <div className="space-y-4">
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-4xl">
          To check out the status of an organization for the standard (management system standard/product certification/personal certification/rating), you may search as below:
        </p>

        {/* Stacked Form Matching Screenshot 3 */}
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xs">
            <div className="bg-slate-50/70 px-4 py-2.5 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-700">Search data like</span>
            </div>

            <div className="divide-y divide-slate-200">
              {/* Name Row */}
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center p-3 gap-2 sm:gap-4">
                <label htmlFor="org-name" className="sm:col-span-6 text-xs font-medium text-slate-700 px-2">
                  Name(Enter first 3 Character of your company Name in Capital Letter)<span className="text-red-500">*</span>
                </label>
                <div className="sm:col-span-6">
                  <input
                    type="text"
                    maxLength={3}
                    id="org-name"
                    value={namePrefix}
                    onChange={(e) => setNamePrefix(e.target.value.toUpperCase())}
                    placeholder="e.g. QCC or ABC"
                    className="w-full rounded border border-slate-200 bg-white px-3 py-2 text-xs uppercase text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Certificate Number Row */}
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center p-3 gap-2 sm:gap-4">
                <label htmlFor="org-certificate" className="sm:col-span-6 text-xs font-medium text-slate-700 px-2">
                  Certificate Number<span className="text-red-500">*</span>
                </label>
                <div className="sm:col-span-6">
                  <input
                    type="text"
                    value={certNumber}
                    id="org-certificate"
                    onChange={(e) => setCertNumber(e.target.value)}
                    placeholder="e.g. SAAF-9001-8841"
                    className="w-full rounded border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Country Row */}
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center p-3 gap-2 sm:gap-4">
                <label htmlFor="org-country" className="sm:col-span-6 text-xs font-medium text-slate-700 px-2">
                  Country
                </label>
                <div className="sm:col-span-6">
                  <select
                    value={country}
                    id="org-country"
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full rounded border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  >
                    {COUNTRIES.map(item => <option key={item.code} value={item.name}>{item.name}</option>)}
                    <option value="all">All Countries</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button Matching Screenshot 3 */}
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded bg-[#006699] px-6 py-2 text-xs font-bold text-white shadow hover:bg-[#005580] transition-colors"
          >
            submit
          </button>
        </form>
      </div>

      {/* Results Output Section */}
      {hasSearched && (
        <div className="space-y-4 pt-4">
          <p className="text-sm text-slate-600">Demo results from sample records. This search is not connected to the live UASL register.</p>
          <h3 className="text-base font-bold text-slate-900">
            Certified Organization Results
          </h3>

          {results.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {results.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="size-4 text-blue-600" />
                      <h4 className="font-bold text-slate-900 text-sm">{item.orgName}</h4>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                      <CheckCircle2 className="size-3 text-emerald-600" />
                      {item.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700">
                    <div>
                      <span className="text-slate-400 block font-medium">Certificate Number</span>
                      <span className="font-mono font-bold text-slate-900">{item.certificateNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Standard</span>
                      <span className="font-semibold text-slate-800">{item.standard}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Issuing Accredited CAB</span>
                      <span className="font-semibold text-slate-800">{item.issuingCab}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex gap-4 text-slate-500 font-medium">
                      <span>Valid From: <strong className="text-slate-800">{item.issueDate}</strong></span>
                      <span>Expires: <strong className="text-slate-800">{item.expiryDate}</strong></span>
                    </div>

                    <button
                      onClick={() => handleViewCertModal(item)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      <span>View Full Certificate Record &raquo;</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-500">
              <AlertCircle className="size-6 text-slate-400 mx-auto mb-2" />
              No Certified Organization matching the specified details was found.
            </div>
          )}
        </div>
      )}

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={!!selectedCert}
        onClose={() => setSelectedCert(null)}
        data={selectedCert}
      />
    </div>
  );
}
