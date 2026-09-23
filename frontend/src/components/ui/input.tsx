import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, ...props }, ref) => {
    return (
      <input
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(
          "h-10 w-full rounded-lg border bg-white px-3.5 font-sans text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-150 shadow-2xs",
          "focus-visible:outline-none focus-visible:border-sky-600 focus-visible:ring-3 focus-visible:ring-sky-500/15",
          invalid ? "border-red-500 focus-visible:border-red-600 focus-visible:ring-red-500/15" : "border-slate-300/90 hover:border-slate-400",
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
