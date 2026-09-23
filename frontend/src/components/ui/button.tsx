import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Spinner } from "./spinner";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg font-sans text-sm font-semibold tracking-tight transition-all duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:active:scale-100 cursor-pointer select-none",
  {
    variants: {
      variant: {
        primary: "bg-slate-900 text-white shadow-xs hover:bg-slate-800 active:bg-slate-950",
        accent: "bg-amber-600 text-white shadow-xs hover:bg-amber-700 active:bg-amber-800",
        secondary:
          "border border-slate-300 bg-white text-slate-800 shadow-2xs hover:bg-slate-50 hover:border-slate-400 active:bg-slate-100",
        tertiary: "text-sky-700 underline-offset-4 hover:underline hover:text-sky-800",
        destructive: "bg-red-600 text-white shadow-xs hover:bg-red-700 active:bg-red-800",
        "destructive-outline":
          "border border-red-200 bg-white text-red-700 shadow-2xs hover:bg-red-50 hover:border-red-300",
        inverse: "bg-white text-slate-900 shadow-xs hover:bg-slate-100 focus-visible:ring-white",
        ghost:
          "border border-slate-200 bg-white/80 text-slate-700 hover:bg-slate-100/80 hover:text-slate-900",
      },
      size: {
        default: "h-10 px-4 text-sm",
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-11 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Shows an inline spinner and disables the button — per Phase 4, button actions get a spinner, never a full-page blocking one. */
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {loading && <Spinner className="size-4" />}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
