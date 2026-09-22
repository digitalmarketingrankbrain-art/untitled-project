"use client";

import React from "react";
import { SaafLogo } from "@/components/ui/saaf-logo";

export interface NcReportData {
  docNo?: string;
  revNo?: string;
  effectiveDate?: string;
  pageNo?: string;
  assessmentNumber: string;
  organisationName: string;
  ncrNumber: string;
  dateOfNcr: string;
  requirementsText: string;
  nonConformityObserved: string;
  scheme: string;
  category: string;
  standardClauseNo: string;
  teamLeader: string;
  teamMember: string;
  cabRepresentative: string;
  remarks: string;
  evidenceReference: string;
  previousRemarksDate1?: string;
  rootCauseAnalysis?: string;
  proposedCorrection?: string;
  proposedCorrectiveAction?: string;
  previousRemarksDate2?: string;
  assessorRemarks?: string;
  isApproved?: boolean;
  approvalMessage?: string;
}

const DEFAULT_NC_REPORT: NcReportData = {
  docNo: "UASL-F-045",
  revNo: "V00",
  effectiveDate: "DEC-01-2024",
  pageNo: "1",
  assessmentNumber: "26-133-661",
  organisationName: "Quality Control Certification",
  ncrNumber: "1/26-133-661",
  dateOfNcr: "05/16/2026",
  requirementsText:
    "Based on this review, the certification body shall determine the competences it needs to include in its audit team and for the certification decision.",
  nonConformityObserved:
    "The application / contract review provides documented evidence on the available competence required to conduct the audit. Evidence to confirm the available competence for the certification decision (HOD certification + identified technical reviewer) is not there.",
  scheme: "All Schemes",
  category: "Minor",
  standardClauseNo: "ISO/IEC 17021-1:2015 clause 9.1.2.3",
  teamLeader: "Anik Ajmera",
  teamMember: "Seema Khurana",
  cabRepresentative: "RK Verma",
  remarks: "N/A",
  evidenceReference: "Client Files",
  previousRemarksDate1: "05/22/26 05:35 PM",
  rootCauseAnalysis:
    "Inadequate implementation and verification of competence evaluation requirements during application review and certification decision activities.",
  proposedCorrection:
    "The new client files for certification will be reviewed and updated with documented evidence demonstrating competence evaluation and approval of personnel involved in the certification decision process.",
  proposedCorrectiveAction:
    "A verification mechanism shall be established to ensure competence requirements for audit teams and certification decision functions are consistently reviewed, documented, and verified prior to certification approval.",
  previousRemarksDate2: "05/23/26 07:42 AM",
  assessorRemarks: "The proposed CA is accepted.",
  isApproved: true,
  approvalMessage: "Assessor has already approved this RCA. Further changes are disabled.",
};

export function NonConformityReportView({ data = DEFAULT_NC_REPORT }: { data?: Partial<NcReportData> }) {
  const nc = { ...DEFAULT_NC_REPORT, ...data };

  return (
    <div className="mx-auto max-w-5xl bg-white p-4 sm:p-8 rounded-xl shadow-md border border-slate-200 text-slate-900 font-sans">
      {/* Document Header Box (Ditto Official PDF Layout) */}
      <div className="border border-slate-900 grid grid-cols-1 md:grid-cols-12 text-xs">
        {/* Left: Logo Cell */}
        <div className="md:col-span-4 border-b md:border-b-0 md:border-r border-slate-900 p-3 flex items-center justify-center bg-white">
          <SaafLogo variant="horizontal" size="md" lightMode={false} />
        </div>

        {/* Center: Title Cell */}
        <div className="md:col-span-5 border-b md:border-b-0 md:border-r border-slate-900 p-4 flex items-center justify-center text-center bg-white">
          <h1 className="font-display font-black text-base sm:text-lg tracking-wider text-slate-900 uppercase">
            NON-CONFORMITY REPORT
          </h1>
        </div>

        {/* Right: Metadata Grid (Doc No, Rev No, Date, Page) */}
        <div className="md:col-span-3 flex flex-col justify-between divide-y divide-slate-900 bg-white font-medium text-[11px]">
          <div className="p-1.5 px-3 flex justify-between">
            <span className="font-bold">Doc. No.:</span>
            <span>{nc.docNo}</span>
          </div>
          <div className="p-1.5 px-3 flex justify-between">
            <span className="font-bold">Rev. No.:</span>
            <span>{nc.revNo}</span>
          </div>
          <div className="p-1.5 px-3 flex justify-between">
            <span className="font-bold">Effective Dt.:</span>
            <span>{nc.effectiveDate}</span>
          </div>
          <div className="p-1.5 px-3 flex justify-between">
            <span className="font-bold">Page:</span>
            <span>{nc.pageNo}</span>
          </div>
        </div>
      </div>

      {/* Non-Conformity Details Section */}
      <div className="mt-8">
        <h2 className="font-display text-lg font-bold text-[#0b2341] mb-3">
          Non-Conformity Details
        </h2>

        <div className="overflow-hidden rounded-md border border-slate-300">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#0284c7] text-white font-bold">
                <th className="py-2.5 px-4 w-1/3 sm:w-1/4 border-r border-blue-400">Details</th>
                <th className="py-2.5 px-4 w-2/3 sm:w-3/4">Information</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800">
              <tr>
                <td className="py-2.5 px-4 font-bold bg-slate-50/50 border-r border-slate-200">Assessment Number</td>
                <td className="py-2.5 px-4 font-normal">{nc.assessmentNumber}</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-bold bg-slate-50/50 border-r border-slate-200">Organisation</td>
                <td className="py-2.5 px-4 font-normal">{nc.organisationName}</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-bold bg-slate-50/50 border-r border-slate-200">NCR Number</td>
                <td className="py-2.5 px-4 font-normal">{nc.ncrNumber}</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-bold bg-slate-50/50 border-r border-slate-200">Date of NCR</td>
                <td className="py-2.5 px-4 font-normal">{nc.dateOfNcr}</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-bold bg-slate-50/50 border-r border-slate-200">Standard/UASL Requirements</td>
                <td className="py-2.5 px-4 font-normal leading-relaxed">{nc.requirementsText}</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-bold bg-slate-50/50 border-r border-slate-200">Non-Conformity Observed</td>
                <td className="py-2.5 px-4 font-normal leading-relaxed">{nc.nonConformityObserved}</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-bold bg-slate-50/50 border-r border-slate-200">Scheme</td>
                <td className="py-2.5 px-4 font-normal">{nc.scheme}</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-bold bg-slate-50/50 border-r border-slate-200">Category</td>
                <td className="py-2.5 px-4 font-normal">{nc.category}</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-bold bg-slate-50/50 border-r border-slate-200">Standard / Clause No.</td>
                <td className="py-2.5 px-4 font-normal">{nc.standardClauseNo}</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-bold bg-slate-50/50 border-r border-slate-200">Team Leader, UASL</td>
                <td className="py-2.5 px-4 font-normal">{nc.teamLeader}</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-bold bg-slate-50/50 border-r border-slate-200">Team Member, UASL</td>
                <td className="py-2.5 px-4 font-normal">{nc.teamMember}</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-bold bg-slate-50/50 border-r border-slate-200">CAB Representative</td>
                <td className="py-2.5 px-4 font-normal">{nc.cabRepresentative}</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-bold bg-slate-50/50 border-r border-slate-200">Remarks</td>
                <td className="py-2.5 px-4 font-normal">{nc.remarks}</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-bold bg-slate-50/50 border-r border-slate-200">Evidence Reference</td>
                <td className="py-2.5 px-4 font-normal">{nc.evidenceReference}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Previous Remarks Section */}
      <div className="mt-8">
        <h2 className="font-display text-lg font-bold text-[#0b2341] mb-1">
          Previous Remarks
        </h2>

        {nc.previousRemarksDate1 && (
          <p className="text-xs text-slate-600 font-medium mb-3">
            Date: {nc.previousRemarksDate1}
          </p>
        )}

        {/* RCA Fieldset */}
        {nc.rootCauseAnalysis && (
          <fieldset className="rounded-lg border border-slate-300 bg-slate-50/60 p-4 pt-2 mb-4">
            <legend className="px-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded">
              Root Cause Analysis (RCA)
            </legend>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
              {nc.rootCauseAnalysis}
            </p>
          </fieldset>
        )}

        {/* Proposed Correction Fieldset */}
        {nc.proposedCorrection && (
          <fieldset className="rounded-lg border border-slate-300 bg-slate-50/60 p-4 pt-2 mb-4">
            <legend className="px-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded">
              Proposed Correction
            </legend>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
              {nc.proposedCorrection}
            </p>
          </fieldset>
        )}

        {/* Proposed Corrective Action Fieldset */}
        {nc.proposedCorrectiveAction && (
          <fieldset className="rounded-lg border border-slate-300 bg-slate-50/60 p-4 pt-2 mb-4">
            <legend className="px-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded">
              Proposed Corrective Action
            </legend>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
              {nc.proposedCorrectiveAction}
            </p>
          </fieldset>
        )}

        {/* Second Date */}
        {nc.previousRemarksDate2 && (
          <p className="text-xs text-slate-600 font-medium mt-6 mb-3">
            Date: {nc.previousRemarksDate2}
          </p>
        )}

        {/* Assessor Remarks Fieldset */}
        {nc.assessorRemarks && (
          <fieldset className="rounded-lg border border-slate-300 bg-slate-50/60 p-4 pt-2 mb-6">
            <legend className="px-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded">
              Assessor Remarks
            </legend>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
              {nc.assessorRemarks}
            </p>
          </fieldset>
        )}

        {/* Footer Status Alert */}
        {nc.isApproved && nc.approvalMessage && (
          <div className="mt-6 font-bold text-emerald-700 text-xs sm:text-sm">
            {nc.approvalMessage}
          </div>
        )}
      </div>
    </div>
  );
}
