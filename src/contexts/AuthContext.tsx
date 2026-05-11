"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { Customer, GoogleAuthData } from "@/types";
import { customerEmailLogin, customerEmailSignup, customerGoogleAuth, getCustomerMe, customerLogout } from "@/lib/api/customerAuth";
import toast from "react-hot-toast";

interface AuthContextType {
  user: Customer | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoginModalOpen: boolean;
  loginRedirectPath: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: { firstName: string; lastName: string; email: string; phone: string; password: string }) => Promise<boolean>;
  googleAuth: (data: GoogleAuthData) => Promise<boolean>;
  logout: () => void;
  openLoginModal: (redirectPath?: string) => void;
  closeLoginModal: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginRedirectPath, setLoginRedirectPath] = useState<string | null>(null);

  const isAuthenticated = !!user;

  const checkAuth = useCallback(async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("pg_customer_token") : null;
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }
      const response = await getCustomerMe();
      if (response.success && response.data) {
        setUser(response.data);
        if (typeof window !== "undefined") {
          localStorage.setItem("pg_user", JSON.stringify(response.data));
        }
      } else {
        setUser(null);
        if (typeof window !== "undefined") {
          localStorage.removeItem("pg_customer_token");
          localStorage.removeItem("pg_user");
        }
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const storedUser = typeof window !== "undefined" ? localStorage.getItem("pg_user") : null;
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        // ignore parse error
      }
    }
    checkAuth();
  }, [checkAuth]);

  const extractUserData = (data: any) => {
    return data.user || data.customer;
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await customerEmailLogin({ email, password });
      if (response.success && response.data) {
        const { token } = response.data;
        const userData = extractUserData(response.data);
        if (typeof window !== "undefined") {
          localStorage.setItem("pg_customer_token", token);
          localStorage.setItem("pg_user", JSON.stringify(userData));
        }
        setUser(userData);
        toast.success("Login successful!");
        return true;
      }
      toast.error(response.message || "Login failed");
      return false;
    } catch {
      toast.error("Login failed. Please try again.");
      return false;
    }
  };

  const signup = async (data: { firstName: string; lastName: string; email: string; phone: string; password: string }): Promise<boolean> => {
    try {
      const response = await customerEmailSignup(data);
      if (response.success && response.data) {
        const { token } = response.data;
        const userData = extractUserData(response.data);
        if (typeof window !== "undefined") {
          localStorage.setItem("pg_customer_token", token);
          localStorage.setItem("pg_user", JSON.stringify(userData));
        }
        setUser(userData);
        toast.success("Account created successfully!");
        return true;
      }
      toast.error(response.message || "Signup failed");
      return false;
    } catch {
      toast.error("Signup failed. Please try again.");
      return false;
    }
  };

  const googleAuth = async (data: GoogleAuthData): Promise<boolean> => {
    try {
      const response = await customerGoogleAuth(data);
      if (response.success && response.data) {
        const { token } = response.data;
        const userData = extractUserData(response.data);
        if (typeof window !== "undefined") {
          localStorage.setItem("pg_customer_token", token);
          localStorage.setItem("pg_user", JSON.stringify(userData));
        }
        setUser(userData);
        toast.success("Login successful!");
        return true;
      }
      toast.error(response.message || "Google authentication failed");
      return false;
    } catch {
      toast.error("Google authentication failed.");
      return false;
    }
  };

  const logout = () => {
    customerLogout().catch(() => {});
    if (typeof window !== "undefined") {
      localStorage.removeItem("pg_customer_token");
      localStorage.removeItem("pg_user");
    }
    setUser(null);
    toast.success("Logged out successfully");
  };

  const openLoginModal = (redirectPath?: string) => {
    setLoginRedirectPath(redirectPath || null);
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    setLoginRedirectPath(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        isLoginModalOpen,
        loginRedirectPath,
        login,
        signup,
        googleAuth,
        logout,
        openLoginModal,
        closeLoginModal,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
