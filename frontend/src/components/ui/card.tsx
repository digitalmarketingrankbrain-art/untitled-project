import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Interactive cards get a hover shadow; static cards stay flat (Phase 4: no shadow at rest). */
  interactive?: boolean;
  variant?: "default" | "glass" | "gradient";
}

function Card({ className, interactive, variant = "default", ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200/90 bg-white p-6 transition-all duration-200 shadow-xs",
        variant === "glass" && "glass-card",
        variant === "gradient" && "bg-gradient-to-br from-slate-50 to-blue-50/30 border-blue-100",
        interactive &&
          "cursor-pointer hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-900/5",
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4 flex flex-col gap-1", className)} {...props} />;
}

function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("font-sans text-lg font-semibold text-text", className)}
      {...props}
    />
  );
}

function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-text-muted", className)} {...props} />
  );
}

function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("text-sm text-text", className)} {...props} />;
}

function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mt-4 flex items-center gap-3 border-t border-border pt-4", className)}
      {...props}
    />
  );
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
