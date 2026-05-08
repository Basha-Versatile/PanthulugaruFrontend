"use client";

import React, { type ReactNode } from "react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { PGAuthProvider } from "@/contexts/PGAuthContext";
import { LocaleProvider } from "@/contexts/LocaleContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LoginModal } from "@/components/auth/LoginModal";

function GlobalLoginModal() {
  const { isLoginModalOpen, closeLoginModal, loginRedirectPath } = useAuth();
  return (
    <LoginModal
      isOpen={isLoginModalOpen}
      onClose={closeLoginModal}
      role="customer"
      redirectPath={loginRedirectPath}
    />
  );
}

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
            <GlobalLoginModal />
          </PGAuthProvider>
        </AuthProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}
