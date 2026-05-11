"use client";

import React, { useState } from "react";
import { Menu, Search, Bell } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { useAdmin } from "@/contexts/AdminContext";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { globalSearch, setGlobalSearch, user } = useAdmin();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0D0907] flex">
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white dark:bg-[#1A1210] border-b border-gray-200 dark:border-[#D4AF37]/10 shadow-sm dark:shadow-none">
          <div className="flex items-center justify-between px-4 sm:px-6 h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-500 dark:text-[#E8DDD0]/60 hover:text-gray-700 dark:hover:text-[#E8DDD0]/80"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="hidden sm:block relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-[#E8DDD0]/40" />
                <input
                  type="text"
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  placeholder="Search..."
                  className="w-64 lg:w-80 pl-10 pr-4 py-2 border border-gray-300 dark:border-[#D4AF37]/15 rounded-lg text-sm dark:bg-[#241C16] dark:text-white dark:placeholder:text-[#E8DDD0]/30 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 dark:focus:ring-[#D4AF37]/20 focus:border-[#FF6B00] dark:focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="p-2 text-gray-400 dark:text-[#E8DDD0]/40 hover:text-gray-600 dark:hover:text-[#E8DDD0]/70 relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
              </button>

              {user && (
                <div className="flex items-center gap-2 pl-3 border-l border-gray-200 dark:border-[#D4AF37]/10">
                  <div className="h-8 w-8 rounded-full bg-[#FF6B00]/10 text-[#FF6B00] flex items-center justify-center text-sm font-semibold">
                    {user.name?.[0]?.toUpperCase() || "A"}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-[#E8DDD0]/60">{user.role}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
