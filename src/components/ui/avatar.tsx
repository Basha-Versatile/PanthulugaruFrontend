"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils/cn";

export interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

function getInitials(name: string): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function Avatar({ src, alt = "", fallback, size = "md", className }: AvatarProps) {
  const [hasError, setHasError] = useState(false);

  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-12 w-12 text-sm",
    lg: "h-16 w-16 text-base",
    xl: "h-24 w-24 text-xl",
  };

  const showFallback = !src || hasError;
  const initials = fallback ? getInitials(fallback) : alt ? getInitials(alt) : "?";

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center rounded-full overflow-hidden bg-[#FF6B00]/10 text-[#FF6B00] font-semibold flex-shrink-0",
        sizes[size],
        className
      )}
    >
      {showFallback ? (
        <span>{initials}</span>
      ) : (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          onError={() => setHasError(true)}
        />
      )}
    </div>
  );
}

export { Avatar };
