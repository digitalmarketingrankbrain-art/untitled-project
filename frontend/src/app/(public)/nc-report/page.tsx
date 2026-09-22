import React from "react";
import type { Metadata } from "next";
import { NonConformityReportView } from "@/components/portal/non-conformity-report-view";

export const metadata: Metadata = {
  title: "Non-Conformity Report (UASL-F-045) | UASL",
};

export default function NcReportPage() {
  return (
    <div className="bg-slate-100 min-h-screen py-8 px-4 sm:px-6">
      <NonConformityReportView />
    </div>
  );
}
