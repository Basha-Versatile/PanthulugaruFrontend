"use client";

import React, { type ReactNode } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { PGAuthProvider } from "@/contexts/PGAuthContext";
import { LocaleProvider } from "@/contexts/LocaleContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <AuthProvider>
          <PGAuthProvider>
            {children}
          </PGAuthProvider>
        </AuthProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}
