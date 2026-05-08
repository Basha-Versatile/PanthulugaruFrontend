"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { AdminUser, DateFilter } from "@/types";
import { adminLogin as adminLoginApi } from "@/lib/api/admin";
import toast from "react-hot-toast";

interface AdminContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  globalSearch: string;
  dateFilter: DateFilter | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setGlobalSearch: (search: string) => void;
  setDateFilter: (filter: DateFilter | null) => void;
  getDateRange: () => { startDate: string; endDate: string } | null;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [globalSearch, setGlobalSearch] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilter | null>(null);

  const isAuthenticated = !!user;

  const loadUser = useCallback(() => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;
      const storedUser = typeof window !== "undefined" ? localStorage.getItem("adminUser") : null;
      if (token && storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch {
      // ignore parse errors
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response: any = await adminLoginApi({ email, password });
      if (response.success && response.data) {
        const { token, user: userData } = response.data;
        const adminUser: AdminUser = {
          id: userData.id,
          name: userData.name || userData.email,
          email: userData.email,
          role: userData.role as AdminUser["role"],
        };
        if (typeof window !== "undefined") {
          localStorage.setItem("adminToken", token);
          localStorage.setItem("adminUser", JSON.stringify(adminUser));
        }
        setUser(adminUser);
        toast.success("Admin login successful!");
        return true;
      }
      toast.error(response.message || "Login failed");
      return false;
    } catch {
      toast.error("Login failed. Please try again.");
      return false;
    }
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
    }
    setUser(null);
    setGlobalSearch("");
    setDateFilter(null);
    toast.success("Logged out successfully");
  };

  const getDateRange = (): { startDate: string; endDate: string } | null => {
    if (!dateFilter) return null;
    return { startDate: dateFilter.startDate, endDate: dateFilter.endDate };
  };

  return (
    <AdminContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        globalSearch,
        dateFilter,
        login,
        logout,
        setGlobalSearch,
        setDateFilter,
        getDateRange,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin(): AdminContextType {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
