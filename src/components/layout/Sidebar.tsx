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
        "fixed top-0 left-0 z-50 h-full bg-white border-r border-gray-200 transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "w-64 flex flex-col"
      )}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="text-lg text-[#E07B39] font-bold">Om</span>
            <span className="font-bold text-gray-900">PG <span className="text-[#E07B39]">Admin</span></span>
          </Link>
          <button onClick={onToggle} className="lg:hidden p-1 text-gray-400 hover:text-gray-600">
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
                  isActive ? "text-[#E07B39] bg-[#E07B39]/5" : "text-gray-600 hover:text-[#E07B39] hover:bg-gray-50"
                )}
              >
                <Icon className="h-4.5 w-4.5 flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          {user && (
            <div className="flex items-center gap-3 mb-3">
              <div className="h-9 w-9 rounded-full bg-[#E07B39]/10 text-[#E07B39] flex items-center justify-center text-sm font-semibold">
                {user.name?.[0]?.toUpperCase() || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.role}</p>
              </div>
            </div>
          )}
          <button onClick={logout} className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
