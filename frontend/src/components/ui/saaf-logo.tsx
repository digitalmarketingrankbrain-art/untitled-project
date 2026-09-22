import * as React from "react";
import { cn } from "@/lib/utils";

interface UaslLogoProps {
  variant?: "emblem" | "horizontal" | "full";
  size?: "sm" | "md" | "lg" | "xl";
  lightMode?: boolean;
  className?: string;
}

/** Official UASL emblem & horizontal lockup for United Assessment Services Limited */
export function SaafLogo({ variant = "horizontal", size = "md", lightMode = false, className }: UaslLogoProps) {
  const heightClasses = {
    sm: "h-8",
    md: "h-11 sm:h-12",
    lg: "h-14 sm:h-16",
    xl: "h-20 sm:h-24",
  };

  return (
    <div className={cn("inline-flex items-center gap-3 select-none", heightClasses[size], className)}>
      {/* UASL Shield / Crown Emblem */}
      <div className="relative flex items-center justify-center shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-gradient-to-br from-blue-900 via-blue-950 to-slate-950 border border-amber-400/40 shadow-md">
        <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
          <path d="M18 3L4 9V17C4 25.5 10 32.5 18 35C26 32.5 32 25.5 32 17V9L18 3Z" fill="url(#shield-grad)" stroke="#D4AF37" strokeWidth="1.5"/>
          <path d="M18 9L21.5 14.5L27.5 15.5L23 19.5L24.5 25.5L18 22L11.5 25.5L13 19.5L8.5 15.5L14.5 14.5L18 9Z" fill="#D4AF37"/>
          <defs>
            <linearGradient id="shield-grad" x1="4" y1="3" x2="32" y2="35" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0B2341"/>
              <stop offset="1" stopColor="#0056B3"/>
            </linearGradient>
          </defs>
        </svg>
      </div>

      {variant !== "emblem" && (
        <div className="flex flex-col justify-center leading-tight">
          <div className="flex items-center gap-1.5">
            <span className={cn("font-display font-black text-xl sm:text-2xl tracking-wider", lightMode ? "text-white" : "text-slate-900")}>
              UASL
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-500 border border-amber-500/30">
              UK
            </span>
          </div>
          <span className={cn("font-sans text-[10px] sm:text-xs tracking-tight font-semibold", lightMode ? "text-amber-300" : "text-blue-900")}>
            United Assessment Services Limited
          </span>
        </div>
      )}
    </div>
  );
}
