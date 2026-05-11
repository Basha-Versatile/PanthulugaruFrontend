"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Camera, UtensilsCrossed, BookOpen, Heart,
  Briefcase, BookMarked, UserCheck, MessageSquare, CreditCard,
  Megaphone, FileText, LogOut, ChevronLeft
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useAdmin } from "@/contexts/AdminContext";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const SIDEBAR_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/pgs", label: "PGs", icon: Users },
  { href: "/admin/photographers", label: "Photographers", icon: Camera },
  { href: "/admin/caterers", label: "Caterers", icon: UtensilsCrossed },
  { href: "/admin/death-anniversaries", label: "Death Anniversaries", icon: Heart },
  { href: "/admin/greetings", label: "Greetings", icon: MessageSquare },
  { href: "/admin/temple-jobs", label: "Temple Jobs", icon: Briefcase },
  { href: "/admin/rituals", label: "Rituals", icon: BookOpen },
  { href: "/admin/customers", label: "Customers", icon: UserCheck },
  { href: "/admin/leads", label: "Leads", icon: MessageSquare },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/ads", label: "Ads", icon: Megaphone },
  { href: "/admin/articles", label: "Articles", icon: FileText },
];

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAdmin();

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onToggle} />
      )}

      <aside className={cn(
        "fixed top-0 left-0 z-50 h-full bg-white dark:bg-[#1A1210] border-r border-gray-200 dark:border-[#D4AF37]/10 transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "w-64 flex flex-col"
      )}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-[#D4AF37]/10">
          <Link href="/admin" className="flex items-center gap-2">
            <img src="/logo-full.png" alt="Panthulu Garu" className="h-8 w-8 rounded-full object-cover" />
            <span className="font-bold text-gray-900 dark:text-white">PG <span className="text-[#FF6B00]">Admin</span></span>
          </Link>
          <button onClick={onToggle} className="lg:hidden p-1 text-gray-400 dark:text-[#E8DDD0]/40 hover:text-gray-600 dark:hover:text-[#E8DDD0]/70">
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => { if (window.innerWidth < 1024) onToggle(); }}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive ? "text-[#FF6B00] bg-[#FF6B00]/5" : "text-gray-600 dark:text-[#E8DDD0]/70 hover:text-[#FF6B00] hover:bg-gray-50 dark:hover:bg-[#241C16]"
                )}
              >
                <Icon className="h-4.5 w-4.5 flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-[#D4AF37]/10">
          {user && (
            <div className="flex items-center gap-3 mb-3">
              <div className="h-9 w-9 rounded-full bg-[#FF6B00]/10 text-[#FF6B00] flex items-center justify-center text-sm font-semibold">
                {user.name?.[0]?.toUpperCase() || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.name}</p>
                <p className="text-xs text-gray-500 dark:text-[#E8DDD0]/60 truncate">{user.role}</p>
              </div>
            </div>
          )}
          <button onClick={logout} className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
