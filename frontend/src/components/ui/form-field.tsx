import * as React from "react";
import { cn } from "@/lib/utils";

export interface FormFieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Label always above the field (never placeholder-as-label), per Phase 4.
 */
function FormField({
  label,
  htmlFor,
  required,
  hint,
  error,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className="font-sans text-sm font-medium text-text"
      >
        {label}
        {required && <span className="ml-0.5 text-error-text">*</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="text-xs text-text-muted">{hint}</p>
      )}
      {error && (
        <p role="alert" className="text-xs text-error-text">
          {error}
        </p>
      )}
    </div>
  );
}

export { FormField };
