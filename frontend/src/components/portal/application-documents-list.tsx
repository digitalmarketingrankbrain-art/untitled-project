"use client";

import { useRouter } from "next/navigation";
import { FileUploader } from "@/components/ui/file-uploader";
import { StatusBadge, type StatusTone } from "@/components/ui/status-badge";
import type { Application } from "@/lib/portal/applicant-data";
import { uploadApplicationDocument } from "@/lib/portal/applicant-actions";

const DOC_STATUS_STYLE: Record<string, { tone: StatusTone; label: string }> = {
  NOT_UPLOADED: { tone: "neutral", label: "Not uploaded" },
  UPLOADED: { tone: "info", label: "Uploaded" },
  UNDER_REVIEW: { tone: "info", label: "Under review" },
  APPROVED: { tone: "success", label: "Approved" },
  NEEDS_REVISION: { tone: "warning", label: "Needs revision" },
};

/** Per-document status + upload/replace + inline reviewer comment — Phase 8. */
function ApplicationDocumentsList({ application }: { application: Application }) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4">
      {application.documents.map((doc) => {
        const style = DOC_STATUS_STYLE[doc.status] ?? { tone: "neutral" as const, label: doc.status };
        const latest = doc.versions[doc.versions.length - 1];
        return (
          <div key={doc.id} className="rounded-lg border border-border bg-surface p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-sans text-sm font-medium text-text">
                  {doc.name}
                  {doc.mandatory && <span className="ml-1 text-error-text">*</span>}
                </p>
                {latest && (
                  <p className="mt-0.5 font-mono text-xs text-text-muted">
                    v{latest.version} · {latest.filename} · {latest.uploadedAt}
                  </p>
                )}
              </div>
              <StatusBadge tone={style.tone} label={style.label} size="sm" />
            </div>

            {latest?.reviewComment && (
              <p className="mt-3 rounded-md bg-warning-surface px-3 py-2 font-sans text-xs text-warning-text">
                {latest.reviewComment}
              </p>
            )}

            <FileUploader
              className="mt-3"
              onUpload={async (file) => {
                const result = await uploadApplicationDocument(application.id, doc.id, file);
                router.refresh();
                return result;
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

export { ApplicationDocumentsList };
