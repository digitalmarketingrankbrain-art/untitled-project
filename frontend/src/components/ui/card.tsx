import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Interactive cards get a hover shadow; static cards stay flat with crisp hairline border. */
  interactive?: boolean;
  variant?: "default" | "glass" | "gradient" | "subtle";
}

function Card({ className, interactive, variant = "default", ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/80 bg-white p-6 transition-all duration-200 shadow-[0_8px_24px_rgba(7,26,47,.05)]",
        variant === "glass" && "glass-card",
        variant === "subtle" && "bg-slate-50/50 border-slate-200/60 shadow-none",
        variant === "gradient" && "bg-gradient-to-br from-white via-sky-50/20 to-slate-50 border-sky-100/80",
        interactive &&
          "cursor-pointer hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-lg hover:shadow-teal-900/10 active:translate-y-0",
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4 flex flex-col gap-1.5", className)} {...props} />;
}

function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("font-sans text-lg font-bold tracking-tight text-slate-900", className)}
      {...props}
    />
  );
}

function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-slate-500 leading-relaxed", className)} {...props} />
  );
}

function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("text-sm text-slate-700", className)} {...props} />;
}

function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mt-5 flex items-center gap-3 border-t border-slate-100 pt-4 text-sm text-slate-600", className)}
      {...props}
    />
  );
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
