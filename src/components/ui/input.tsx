"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, type = "text", ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[#361E1E] dark:text-[#E8DDD0]/80 mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={cn(
            "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-[#361E1E] placeholder:text-[#8B4513]/40",
            "dark:bg-[#241C16] dark:text-[#E8DDD0] dark:placeholder:text-[#E8DDD0]/30",
            "transition-colors duration-200",
            "focus:outline-none focus:ring-2 focus:ring-offset-0",
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-200 dark:focus:ring-red-900/30"
              : "border-[#D4AF37]/20 dark:border-[#D4AF37]/10 focus:border-[#FF6B00] focus:ring-[#FF6B00]/20",
            "disabled:cursor-not-allowed disabled:bg-[#FDF8F0] disabled:text-[#8B4513]/50 dark:disabled:bg-[#0D0907] dark:disabled:text-[#E8DDD0]/30",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-[#8B4513]/60 dark:text-[#E8DDD0]/50">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
