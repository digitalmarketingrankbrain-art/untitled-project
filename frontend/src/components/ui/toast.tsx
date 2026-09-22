"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StatusTone } from "./status-badge";

export interface ToastOptions {
  tone?: StatusTone;
  title: string;
  description?: string;
  /** Confirmations auto-dismiss; anything needing acknowledgement should pass `persistent`. */
  persistent?: boolean;
  durationMs?: number;
}

interface ToastRecord extends ToastOptions {
  id: number;
}

interface ToastContextValue {
  toast: (options: ToastOptions) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

const toneIcons: Record<StatusTone, typeof Info> = {
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
  info: Info,
  neutral: Info,
};

const toneStyles: Record<StatusTone, string> = {
  success: "border-success-text/30 bg-success-surface text-success-text",
  warning: "border-warning-text/30 bg-warning-surface text-warning-text",
  error: "border-error-text/30 bg-error-surface text-error-text",
  info: "border-info-text/30 bg-info-surface text-info-text",
  neutral: "border-border bg-surface text-text",
};

let idCounter = 0;

function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastRecord[]>([]);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const dismiss = React.useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const toast = React.useCallback(
    (options: ToastOptions) => {
      const id = ++idCounter;
      setToasts((current) => [...current, { id, ...options }]);
      if (!options.persistent) {
        setTimeout(() => dismiss(id), options.durationMs ?? 2000);
      }
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {mounted &&
        createPortal(
          <div className="fixed inset-x-4 bottom-4 z-50 flex flex-col gap-2 sm:inset-x-auto sm:right-4">
            {toasts.map((t) => {
              const Icon = toneIcons[t.tone ?? "info"];
              return (
                <div
                  key={t.id}
                  role="status"
                  className={cn(
                    "flex w-full items-start gap-3 rounded-md border px-4 py-3 shadow-[0_4px_16px_rgba(13,43,32,0.12)] sm:w-96",
                    toneStyles[t.tone ?? "info"],
                  )}
                >
                  <Icon className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
                  <div className="flex-1 font-sans text-sm">
                    <p className="font-medium">{t.title}</p>
                    {t.description && <p className="text-text-muted">{t.description}</p>}
                  </div>
                  <button
                    onClick={() => dismiss(t.id)}
                    aria-label="Dismiss"
                    className="text-text-muted hover:text-text"
                  >
                    <X className="size-4" strokeWidth={1.75} />
                  </button>
                </div>
              );
            })}
          </div>,
          document.body,
        )}
    </ToastContext.Provider>
  );
}

function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}

export { ToastProvider, useToast };
