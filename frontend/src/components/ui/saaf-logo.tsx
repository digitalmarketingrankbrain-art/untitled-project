import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface UaslLogoProps {
  variant?: "emblem" | "horizontal" | "full";
  size?: "sm" | "md" | "lg" | "xl";
  lightMode?: boolean;
  className?: string;
}

/** Official UASL logo lockup featuring Shield, UASL typography, and IAAB Recognition Seal */
export function SaafLogo({ size = "md", className }: UaslLogoProps) {
  const heightClasses = {
    sm: "h-8 sm:h-9",
    md: "h-10 sm:h-12",
    lg: "h-14 sm:h-16",
    xl: "h-20 sm:h-24",
  };

  const imageSizeMap = {
    sm: { width: 140, height: 42 },
    md: { width: 190, height: 56 },
    lg: { width: 240, height: 72 },
    xl: { width: 320, height: 96 },
  };

  const { width, height } = imageSizeMap[size];

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center shrink-0 transition-all duration-200",
        heightClasses[size],
        className
      )}
    >
      <Image
        src="/uasl-logo.png"
        alt="United Assessment Services Limited (UASL)"
        width={width}
        height={height}
        className="h-full w-auto object-contain"
        priority
      />
    </div>
  );
}
