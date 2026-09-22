"use client";

import React from "react";
import { X, Printer, ShieldCheck, CheckCircle2 } from "lucide-react";
import { SaafLogo } from "@/components/ui/saaf-logo";

export interface CertificateData {
  title: string;
  cabName: string;
  accreditationNumber: string;
  address: string;
  contactPerson?: string;
  scope: string;
  issueDate: string;
  expiryDate: string;
  status: "Valid" | "Suspended" | "Withdrawn";
  type: "CAB" | "ORGANIZATION";
}

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: CertificateData | null;
}

export function CertificateModal({ isOpen, onClose, data }: CertificateModalProps) {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-white p-6 sm:p-10 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          aria-label="Close modal"
        >
          <X className="size-5" />
        </button>

        {/* Action Header */}
        <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4 pr-10">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="size-3.5 text-emerald-600" />
              Verified SAAF Record
            </span>
          </div>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <Printer className="size-3.5" />
            Print Certificate
          </button>
        </div>

        {/* Certificate Border Frame */}
        <div className="relative rounded-xl border-4 border-double border-blue-900/80 bg-slate-50/40 p-6 sm:p-8 text-center shadow-inner">
          {/* Top Logo & Title */}
          <div className="mb-4 flex flex-col items-center justify-center">
            <SaafLogo variant="horizontal" size="lg" className="h-12 mb-3" />
            <span className="text-[11px] font-extrabold tracking-widest text-slate-500 uppercase">
              SOUTH ASIA ACCREDITATION FOUNDATION
            </span>
            <h2 className="mt-2 font-display text-xl sm:text-2xl font-extrabold tracking-wide text-blue-950 uppercase">
              {data.type === "CAB" ? "Certificate of Accreditation" : "Accredited Certificate of Conformity"}
            </h2>
            <div className="mt-1 h-0.5 w-24 bg-blue-600" />
          </div>

          <p className="mt-4 text-xs text-slate-600 font-medium">
            This is to certify that the organization named below has been evaluated and accredited by SAAF as per international standard ISO/IEC 17011 criteria:
          </p>

          {/* CAB / Org Name */}
          <div className="my-5 rounded-lg bg-white p-4 border border-slate-200 shadow-2xs">
            <h3 className="text-lg font-bold text-slate-900 leading-snug">
              {data.cabName}
            </h3>
            <p className="mt-1 text-xs text-slate-500 font-medium">{data.address}</p>
          </div>

          {/* Details Table */}
          <div className="my-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left text-xs">
            <div className="rounded-lg bg-white p-3 border border-slate-200">
              <span className="text-slate-400 font-medium block text-[10px] uppercase tracking-wider">Accreditation Number</span>
              <span className="font-mono font-bold text-slate-900 text-sm">{data.accreditationNumber}</span>
            </div>
            <div className="rounded-lg bg-white p-3 border border-slate-200">
              <span className="text-slate-400 font-medium block text-[10px] uppercase tracking-wider">Accreditation Status</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded inline-block mt-0.5">{data.status}</span>
            </div>
            <div className="rounded-lg bg-white p-3 border border-slate-200 sm:col-span-2">
              <span className="text-slate-400 font-medium block text-[10px] uppercase tracking-wider">Accredited Scope / Standard</span>
              <span className="font-semibold text-slate-800 leading-relaxed block mt-0.5">{data.scope}</span>
            </div>
            <div className="rounded-lg bg-white p-3 border border-slate-200">
              <span className="text-slate-400 font-medium block text-[10px] uppercase tracking-wider">Date of Issue</span>
              <span className="font-semibold text-slate-800">{data.issueDate}</span>
            </div>
            <div className="rounded-lg bg-white p-3 border border-slate-200">
              <span className="text-slate-400 font-medium block text-[10px] uppercase tracking-wider">Expiry Date</span>
              <span className="font-semibold text-slate-800">{data.expiryDate}</span>
            </div>
          </div>

          {/* Footer Seals */}
          <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4 text-[11px] text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-blue-600" />
              <span className="font-bold text-slate-700">Official SAAF Secretariat Register</span>
            </div>
            <div className="text-right">
              <span className="block font-semibold text-slate-800">Chief Technical Officer</span>
              <span className="text-[10px] text-slate-400">South Asia Accreditation Foundation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
