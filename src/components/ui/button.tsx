"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link" | "sacred";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading = false, disabled, children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary:
        "bg-[#FF6B00] text-white hover:bg-[#E05E00] focus:ring-[#FF6B00] active:bg-[#CC5500] shadow-sm hover:shadow-md hover:shadow-[#FF6B00]/15",
      secondary:
        "bg-[#361E1E] text-white hover:bg-[#4A2828] focus:ring-[#361E1E] active:bg-[#1F0F0F]",
      outline:
        "border-2 border-[#D4AF37] text-[#8B4513] bg-transparent hover:bg-[#D4AF37]/10 focus:ring-[#D4AF37]",
      ghost:
        "text-[#361E1E] bg-transparent hover:bg-[#D4AF37]/10 focus:ring-[#D4AF37]/30 dark:text-[#E8DDD0] dark:hover:bg-[#D4AF37]/10",
      link:
        "text-[#FF6B00] bg-transparent underline-offset-4 hover:underline focus:ring-[#FF6B00] p-0",
      sacred:
        "bg-gradient-to-r from-[#D4AF37] to-[#FF6B00] text-white hover:from-[#B8962E] hover:to-[#E05E00] focus:ring-[#D4AF37] shadow-md shadow-[#D4AF37]/20 hover:shadow-lg hover:shadow-[#D4AF37]/30",
    };

    const sizes = {
      sm: "h-8 px-3 text-sm gap-1.5",
      md: "h-10 px-4 text-sm gap-2",
      lg: "h-12 px-6 text-base gap-2.5",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
