"use client";

import * as React from "react";
import { UploadCloud, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const ACCEPTED_TYPES = [".pdf", ".doc", ".docx", ".xls", ".xlsx"];
const MAX_SIZE_BYTES = 25 * 1024 * 1024;

export interface FileUploaderProps {
  onUpload: (file: File) => Promise<{ ok: boolean; error?: string }>;
  className?: string;
}

type UploadState = "idle" | "uploading" | "success" | "error";

/**
 * Exact file-constraint microcopy from the project brief: "PDF, DOCX or
 * XLSX files up to 25 MB." No real storage backend exists yet (Milestone
 * 13) — the parent's onUpload callback records the version against the
 * placeholder document data so the status/version-increment behavior is
 * real, just not durably stored.
 */
function FileUploader({ onUpload, className }: FileUploaderProps) {
  const [state, setState] = React.useState<UploadState>("idle");
  const [error, setError] = React.useState<string | null>(null);
  const [dragActive, setDragActive] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError(null);
    if (file.size > MAX_SIZE_BYTES) {
      setState("error");
      setError("That file is larger than 25 MB. Please upload a smaller file.");
      return;
    }
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!ACCEPTED_TYPES.includes(ext)) {
      setState("error");
      setError("Only PDF, DOC(X), or XLS(X) files are accepted.");
      return;
    }

    setState("uploading");
    const result = await onUpload(file);
    if (result.ok) {
      setState("success");
      setTimeout(() => setState("idle"), 2500);
    } else {
      setState("error");
      setError(result.error ?? "We couldn't upload this file. Your existing document has not been removed. Please try again.");
    }
  }

  return (
    <div
      className={cn(
        "rounded-lg border-2 border-dashed px-4 py-6 text-center transition-colors",
        dragActive ? "border-primary bg-background-portal" : "border-border",
        className,
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragActive(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />

      {state === "uploading" && (
        <p className="font-sans text-sm text-text-muted">Uploading…</p>
      )}
      {state === "success" && (
        <p className="flex items-center justify-center gap-2 font-sans text-sm text-success-text">
          <CheckCircle2 className="size-4" strokeWidth={1.75} /> Uploaded
        </p>
      )}
      {(state === "idle" || state === "error") && (
        <>
          <UploadCloud className="mx-auto size-6 text-text-muted" strokeWidth={1.5} />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mt-2 font-sans text-sm font-medium text-secondary hover:underline"
          >
            Choose a file
          </button>
          <span className="font-sans text-sm text-text-muted"> or drag it here</span>
          <p className="mt-1 font-sans text-xs text-text-muted">PDF, DOCX or XLSX files up to 25 MB.</p>
          {state === "error" && error && (
            <p className="mt-2 flex items-center justify-center gap-1.5 font-sans text-xs text-error-text">
              <XCircle className="size-3.5" strokeWidth={1.75} /> {error}
            </p>
          )}
        </>
      )}
    </div>
  );
}

export { FileUploader };
