"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { Panthulugaru } from "@/types";
import type { ApprovalStatus, FeatureAccess } from "@/lib/constants/pgApprovalStatus";
import { deriveApprovalStatus, getFeatureAccess } from "@/lib/constants/pgApprovalStatus";
import { pgEmailLogin, pgEmailSignup, verifyPGOtp, getPGMe, completePGProfile as completePGProfileApi } from "@/lib/api/pgAuth";
import toast from "react-hot-toast";

interface PGAuthContextType {
  user: Panthulugaru | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  approvalStatus: ApprovalStatus;
  featureAccess: FeatureAccess;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: { firstName: string; lastName: string; email: string; phone: string; password: string }) => Promise<boolean>;
  otpLogin: (phone: string, otp: string) => Promise<boolean>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  completePGProfile: (data: Partial<Panthulugaru>) => Promise<boolean>;
}

const defaultFeatureAccess: FeatureAccess = {
  canAccessDashboard: false,
  canEditProfile: false,
  canAccessBookings: false,
  canViewCustomerDetails: false,
  isPubliclyVisible: false,
  canReceiveBookings: false,
  showOnboardingModal: true,
  dashboardReadOnly: true,
};

const PGAuthContext = createContext<PGAuthContextType | undefined>(undefined);

export function PGAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Panthulugaru | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [approvalStatus, setApprovalStatus] = useState<ApprovalStatus>("DRAFT");
  const [featureAccess, setFeatureAccess] = useState<FeatureAccess>(defaultFeatureAccess);

  const isAuthenticated = !!user;

  const updateApprovalState = useCallback((pgUser: Panthulugaru | null) => {
    if (!pgUser) {
      setApprovalStatus("DRAFT");
      setFeatureAccess(defaultFeatureAccess);
      return;
    }
    const status = deriveApprovalStatus(pgUser.status, pgUser.onboardingStatus);
    setApprovalStatus(status);
    setFeatureAccess(getFeatureAccess(status));
  }, []);

  const refreshProfile = useCallback(async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("pg_panthulugaru_token") : null;
      if (!token) {
        setUser(null);
        updateApprovalState(null);
        setIsLoading(false);
        return;
      }
      const response = await getPGMe();
      if (response.success && response.data) {
        setUser(response.data);
        updateApprovalState(response.data);
        if (typeof window !== "undefined") {
          localStorage.setItem("pg_panthulugaru_user", JSON.stringify(response.data));
        }
      } else {
        setUser(null);
        updateApprovalState(null);
        if (typeof window !== "undefined") {
          localStorage.removeItem("pg_panthulugaru_token");
          localStorage.removeItem("pg_panthulugaru_user");
        }
      }
    } catch {
      setUser(null);
      updateApprovalState(null);
    } finally {
      setIsLoading(false);
    }
  }, [updateApprovalState]);

  useEffect(() => {
    const storedUser = typeof window !== "undefined" ? localStorage.getItem("pg_panthulugaru_user") : null;
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        updateApprovalState(parsed);
      } catch {
        // ignore
      }
    }
    refreshProfile();
  }, [refreshProfile, updateApprovalState]);

  const extractPGData = (data: any) => {
    return data.user || data.pg;
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await pgEmailLogin({ email, password });
      if (response.success && response.data) {
        const { token } = response.data;
        const userData = extractPGData(response.data);
        if (typeof window !== "undefined") {
          localStorage.setItem("pg_panthulugaru_token", token);
          localStorage.setItem("pg_panthulugaru_user", JSON.stringify(userData));
        }
        setUser(userData);
        updateApprovalState(userData);
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
      const response = await pgEmailSignup(data);
      if (response.success && response.data) {
        const { token } = response.data;
        const userData = extractPGData(response.data);
        if (typeof window !== "undefined") {
          localStorage.setItem("pg_panthulugaru_token", token);
          localStorage.setItem("pg_panthulugaru_user", JSON.stringify(userData));
        }
        setUser(userData);
        updateApprovalState(userData);
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

  const otpLogin = async (phone: string, otp: string): Promise<boolean> => {
    try {
      const response = await verifyPGOtp({ phone, otp });
      if (response.success && response.data) {
        const { token } = response.data;
        const userData = extractPGData(response.data);
        if (typeof window !== "undefined") {
          localStorage.setItem("pg_panthulugaru_token", token);
          localStorage.setItem("pg_panthulugaru_user", JSON.stringify(userData));
        }
        setUser(userData);
        updateApprovalState(userData);
        toast.success("OTP verified successfully!");
        return true;
      }
      toast.error(response.message || "OTP verification failed");
      return false;
    } catch {
      toast.error("OTP verification failed.");
      return false;
    }
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("pg_panthulugaru_token");
      localStorage.removeItem("pg_panthulugaru_user");
    }
    setUser(null);
    updateApprovalState(null);
    toast.success("Logged out successfully");
  };

  const completePGProfileFn = async (data: Partial<Panthulugaru>): Promise<boolean> => {
    try {
      const response = await completePGProfileApi(data);
      if (response.success && response.data) {
        setUser(response.data);
        updateApprovalState(response.data);
        if (typeof window !== "undefined") {
          localStorage.setItem("pg_panthulugaru_user", JSON.stringify(response.data));
        }
        toast.success("Profile completed!");
        return true;
      }
      toast.error(response.message || "Failed to complete profile");
      return false;
    } catch {
      toast.error("Failed to complete profile.");
      return false;
    }
  };

  return (
    <PGAuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        approvalStatus,
        featureAccess,
        login,
        signup,
        otpLogin,
        logout,
        refreshProfile,
        completePGProfile: completePGProfileFn,
      }}
    >
      {children}
    </PGAuthContext.Provider>
  );
}

export function usePGAuth(): PGAuthContextType {
  const context = useContext(PGAuthContext);
  if (context === undefined) {
    throw new Error("usePGAuth must be used within a PGAuthProvider");
  }
  return context;
}
