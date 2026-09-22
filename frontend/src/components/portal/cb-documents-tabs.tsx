"use client";

import * as React from "react";
import { FileText, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { FileUploader } from "@/components/ui/file-uploader";
import { EmptyState } from "@/components/ui/empty-state";
import { uploadOrganisationDocument } from "@/lib/portal/cab-info-actions";
import type { ReferenceDocumentEntry } from "@/lib/portal/reference-documents";

export interface OrgDocumentEntry {
  id: string;
  filename: string;
  sizeBytes: number;
  uploadedAt: string;
  currentVersionId: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function CbDocumentsTabs({
  orgDocuments,
  referenceDocuments,
}: {
  orgDocuments: OrgDocumentEntry[];
  referenceDocuments: ReferenceDocumentEntry[];
}) {
  const [tab, setTab] = React.useState<"documents" | "saaf">("documents");

  async function handleUpload(file: File) {
    const result = await uploadOrganisationDocument(file);
    return { ok: result.ok, error: "error" in result ? result.error : undefined };
  }

  return (
    <div className="space-y-6">
      <div role="tablist" className="flex items-center gap-2 border-b border-slate-200 pb-3">
        {(["documents", "saaf"] as const).map((key) => (
          <button
            key={key}
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={cn(
              "rounded-lg px-4 py-2 font-sans text-xs font-bold transition-all duration-200",
              tab === key
                ? "bg-blue-700 text-white shadow-sm shadow-blue-900/15"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
            )}
          >
            {key === "documents" ? "My Organization Documents" : "SAAF Published References"}
          </button>
        ))}
      </div>

      {tab === "documents" ? (
        <div className="flex flex-col gap-6">
          <FileUploader onUpload={handleUpload} className="max-w-xl" />
          {orgDocuments.length === 0 ? (
            <EmptyState title="No organization documents uploaded yet." description="Files you upload will appear here." />
          ) : (
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {orgDocuments.map((doc) => (
                <li key={doc.id} className="flex items-center justify-between gap-4 rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs hover:border-blue-300 hover:shadow-md transition-all">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 border border-blue-100">
                      <FileText className="size-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-sans text-xs sm:text-sm font-bold text-slate-900">{doc.filename}</p>
                      <p className="font-sans text-[11px] text-slate-500 font-medium">
                        {formatBytes(doc.sizeBytes)} · {doc.uploadedAt}
                      </p>
                    </div>
                  </div>
                  <a
                    href={`/api/documents/${doc.currentVersionId}`}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 font-sans text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors border border-slate-200"
                  >
                    <Download className="size-3.5" /> Download
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div>
          {referenceDocuments.length === 0 ? (
            <EmptyState title="No reference documents published yet." description="Checklists and forms issued by SAAF will appear here." />
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 font-semibold text-slate-600">
                    <th className="px-4 py-3 text-left w-16">#</th>
                    <th className="px-4 py-3 text-left">Document Description</th>
                    <th className="px-4 py-3 text-right">Download Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {referenceDocuments.map((doc, i) => (
                    <tr key={doc.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3 font-mono font-medium text-slate-400">{i + 1}</td>
                      <td className="px-4 py-3 font-medium text-slate-800">{doc.description}</td>
                      <td className="px-4 py-3 text-right">
                        <a href={`/api/reference-documents/${doc.id}`} className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:underline">
                          <FileText className="size-3.5" /> {doc.filename}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export { CbDocumentsTabs };
