import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, invalid, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          aria-invalid={invalid || undefined}
          className={cn(
            "h-10 w-full appearance-none rounded-lg border bg-white px-3.5 pr-9 font-sans text-sm text-slate-900 shadow-2xs transition-all duration-150 cursor-pointer",
            "focus-visible:outline-none focus-visible:border-sky-600 focus-visible:ring-3 focus-visible:ring-sky-500/15",
            invalid ? "border-red-500 focus-visible:border-red-600 focus-visible:ring-red-500/15" : "border-slate-300/90 hover:border-slate-400",
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
          strokeWidth={1.75}
        />
      </div>
    );
  },
);
Select.displayName = "Select";

export { Select };
