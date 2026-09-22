import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Spinner } from "./spinner";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-[6px] font-sans text-sm font-medium transition duration-150 active:scale-[0.98] active:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:active:scale-100",
  {
    variants: {
      variant: {
        primary: "bg-primary text-text-inverse hover:bg-primary-hover",
        accent: "bg-accent text-primary hover:bg-accent-hover",
        secondary:
          "border border-primary bg-surface text-primary hover:bg-background",
        tertiary: "text-secondary underline-offset-4 hover:underline",
        destructive: "bg-error-text text-text-inverse hover:opacity-90",
        "destructive-outline":
          "border border-error-text bg-surface text-error-text hover:bg-error-surface",
        inverse: "bg-surface text-primary hover:bg-background focus-visible:ring-text-inverse",
        ghost:
          "border border-text-inverse/40 text-text-inverse hover:bg-text-inverse/10 focus-visible:ring-text-inverse",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-base",
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
