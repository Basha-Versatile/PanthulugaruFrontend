"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Search,
  User,
  LogOut,
  ChevronDown,
  Phone,
  Mail,
  MapPin,
  Star,
  Calendar,
  Camera,
  UtensilsCrossed,
  Sun,
  Moon,
  BookOpen,
  CalendarDays,
  Briefcase,
  Truck,
  Heart,
  Sparkles,
  Users,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useAuth } from "@/contexts/AuthContext";
import { usePGAuth } from "@/contexts/PGAuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/features/NotificationBell";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/pandits", label: "Pandits" },
  { href: "/rituals", label: "Rituals" },
  { href: "/articles", label: "Articles" },
];

const SERVICES_LINKS = [
  {
    href: "/pandits",
    label: "Pandits",
    icon: Star,
    description: "Find experienced pandits",
  },
  {
    href: "/photographers",
    label: "Photographers",
    icon: Camera,
    description: "Capture sacred moments",
  },
  {
    href: "/caterers",
    label: "Caterers",
    icon: UtensilsCrossed,
    description: "Traditional feast service",
  },
  {
    href: "/horoscope",
    label: "Horoscope",
    icon: Sun,
    description: "Vedic astrology readings",
  },
  {
    href: "/rituals",
    label: "Rituals",
    icon: BookOpen,
    description: "Browse all Hindu poojas",
  },
  {
    href: "/panchangam",
    label: "Panchangam",
    icon: CalendarDays,
    description: "Calendar & muhurtham",
  },
  {
    href: "/temple-jobs",
    label: "Temple Jobs",
    icon: Briefcase,
    description: "Temple career openings",
  },
  {
    href: "/monthly-hire",
    label: "Monthly Hire",
    icon: Clock,
    description: "Hire pandits monthly",
  },
  {
    href: "/greetings",
    label: "Greetings",
    icon: Sparkles,
    description: "Festival greetings cards",
  },
];

const MORE_LINKS = [
  {
    href: "/vaahan-puja",
    label: "Vaahan Puja",
    icon: Truck,
    description: "Vehicle blessing ceremonies",
  },
  {
    href: "/death-anniversary",
    label: "Death Anniversary",
    icon: Heart,
    description: "Shraddha & memorial rituals",
  },
  {
    href: "/celebrities",
    label: "Celebrities",
    icon: Users,
    description: "Celebrity endorsements",
  },
];

export function Header() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout, openLoginModal } = useAuth();
  const pgAuth = usePGAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const isAnyUserAuthenticated = isAuthenticated || pgAuth.isAuthenticated;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Dropdown hover states (desktop)
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  // Mobile accordion states
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);

  const servicesRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const servicesTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const moreTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMobileServicesOpen(false);
    setIsMobileMoreOpen(false);
  }, [pathname]);

  const handleServicesEnter = () => {
    if (servicesTimeoutRef.current) clearTimeout(servicesTimeoutRef.current);
    setIsServicesOpen(true);
    setIsMoreOpen(false);
  };
  const handleServicesLeave = () => {
    servicesTimeoutRef.current = setTimeout(
      () => setIsServicesOpen(false),
      150,
    );
  };
  const handleMoreEnter = () => {
    if (moreTimeoutRef.current) clearTimeout(moreTimeoutRef.current);
    setIsMoreOpen(true);
    setIsServicesOpen(false);
  };
  const handleMoreLeave = () => {
    moreTimeoutRef.current = setTimeout(() => setIsMoreOpen(false), 150);
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* ─── Top Bar ─── */}
      <div className="bg-gradient-to-r from-[#8B1A1A] via-[#6B0F0F] to-[#8B1A1A] text-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-8 text-xs">
            <div className="hidden sm:flex items-center gap-4">
              <a
                href="tel:+919876543210"
                className="flex items-center gap-1.5 hover:text-[#F0C040] transition-colors"
              >
                <Phone className="h-3 w-3" />
                <span>+91 9876543210</span>
              </a>
              <span className="w-px h-3 bg-white/20" />
              <a
                href="mailto:info@panthulugaru.com"
                className="flex items-center gap-1.5 hover:text-[#F0C040] transition-colors"
              >
                <Mail className="h-3 w-3" />
                <span>info@panthulugaru.com</span>
              </a>
            </div>
            <div className="flex items-center gap-1 sm:gap-3 mx-auto sm:mx-0">
              <span className="hidden md:inline text-white/60 text-[10px] uppercase tracking-widest mr-1">
                Follow Us
              </span>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 hover:text-[#F0C040] transition-colors"
                aria-label="Facebook"
              >
                <svg
                  className="h-3.5 w-3.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 hover:text-[#F0C040] transition-colors"
                aria-label="Instagram"
              >
                <svg
                  className="h-3.5 w-3.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 hover:text-[#F0C040] transition-colors"
                aria-label="YouTube"
              >
                <svg
                  className="h-3.5 w-3.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 hover:text-[#F0C040] transition-colors"
                aria-label="Twitter"
              >
                <svg
                  className="h-3.5 w-3.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Main Navigation Bar ─── */}
      <div className="bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-md border-b border-[#D4A017]/10 shadow-[0_2px_16px_rgba(139,26,26,0.06)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* ─── Logo ─── */}
            <Link
              href="/"
              className="flex items-center gap-2 flex-shrink-0 group"
            >
              <img
                src="/logo.png"
                alt="Panthulu Garu"
                className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <div className="flex flex-col leading-tight">
                <span className="text-lg font-bold tracking-tight text-[#8B1A1A]">
                  Panthulu <span className="gradient-text">Garu</span>
                </span>
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#D4A017]/80 font-medium hidden sm:block">
                  Sacred Services Platform
                </span>
              </div>
            </Link>

            {/* ─── Desktop Navigation ─── */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {/* Home */}
              <Link
                href="/"
                className={cn(
                  "relative px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 group",
                  pathname === "/"
                    ? "text-[#8B1A1A] dark:text-[#D4A017]"
                    : "text-gray-600 dark:text-gray-300 hover:text-[#8B1A1A] dark:hover:text-[#D4A017]",
                )}
              >
                <span className="relative z-10">Home</span>
                {pathname === "/" && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-[#D4A017] to-[#E07B39] rounded-full" />
                )}
                <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#D4A017]/0 to-[#E07B39]/0 group-hover:from-[#D4A017]/5 group-hover:to-[#E07B39]/5 transition-all duration-200" />
              </Link>

              {/* Services Dropdown */}
              <div
                ref={servicesRef}
                className="relative"
                onMouseEnter={handleServicesEnter}
                onMouseLeave={handleServicesLeave}
              >
                <button
                  className={cn(
                    "relative flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 group",
                    SERVICES_LINKS.some((l) => pathname === l.href)
                      ? "text-[#8B1A1A] dark:text-[#D4A017]"
                      : "text-gray-600 dark:text-gray-300 hover:text-[#8B1A1A] dark:hover:text-[#D4A017]",
                  )}
                >
                  <span className="relative z-10">Services</span>
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 transition-transform duration-200",
                      isServicesOpen && "rotate-180",
                    )}
                  />
                  {SERVICES_LINKS.some((l) => pathname === l.href) && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-[#D4A017] to-[#E07B39] rounded-full" />
                  )}
                  <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#D4A017]/0 to-[#E07B39]/0 group-hover:from-[#D4A017]/5 group-hover:to-[#E07B39]/5 transition-all duration-200" />
                </button>

                {/* Services Dropdown - Compact 3x3 Grid */}
                {isServicesOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[480px] bg-white dark:bg-[#1e1e1e] rounded-xl shadow-2xl border border-[#D4A017]/10 dark:border-gray-700 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                    <div className="p-3 grid grid-cols-3 gap-1.5">
                      {SERVICES_LINKS.map((link) => {
                        const Icon = link.icon;
                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsServicesOpen(false)}
                            className={cn(
                              "flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all duration-150 group/item",
                              pathname === link.href
                                ? "bg-[#FFF8F0] dark:bg-[#D4A017]/10 text-[#8B1A1A] dark:text-[#D4A017]"
                                : "hover:bg-[#FFF8F0] dark:hover:bg-[#D4A017]/10 text-gray-700 dark:text-gray-300 hover:text-[#8B1A1A] dark:hover:text-[#D4A017]",
                            )}
                          >
                            <div
                              className={cn(
                                "flex-shrink-0 p-2 rounded-lg transition-all duration-200",
                                pathname === link.href
                                  ? "bg-gradient-to-br from-[#D4A017] to-[#E07B39] text-white shadow-sm"
                                  : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 group-hover/item:bg-gradient-to-br group-hover/item:from-[#D4A017] group-hover/item:to-[#E07B39] group-hover/item:text-white group-hover/item:shadow-sm",
                              )}
                            >
                              <Icon className="h-4.5 w-4.5" />
                            </div>
                            <span className="text-sm font-semibold">
                              {link.label}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Articles */}
              <Link
                href="/articles"
                className={cn(
                  "relative px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 group",
                  pathname === "/articles"
                    ? "text-[#8B1A1A] dark:text-[#D4A017]"
                    : "text-gray-600 dark:text-gray-300 hover:text-[#8B1A1A] dark:hover:text-[#D4A017]",
                )}
              >
                <span className="relative z-10">Articles</span>
                {pathname === "/articles" && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-[#D4A017] to-[#E07B39] rounded-full" />
                )}
                <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#D4A017]/0 to-[#E07B39]/0 group-hover:from-[#D4A017]/5 group-hover:to-[#E07B39]/5 transition-all duration-200" />
              </Link>

              {/* More Dropdown */}
              <div
                ref={moreRef}
                className="relative"
                onMouseEnter={handleMoreEnter}
                onMouseLeave={handleMoreLeave}
              >
                <button
                  className={cn(
                    "relative flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 group",
                    MORE_LINKS.some((l) => pathname === l.href)
                      ? "text-[#8B1A1A] dark:text-[#D4A017]"
                      : "text-gray-600 dark:text-gray-300 hover:text-[#8B1A1A] dark:hover:text-[#D4A017]",
                  )}
                >
                  <span className="relative z-10">More</span>
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 transition-transform duration-200",
                      isMoreOpen && "rotate-180",
                    )}
                  />
                  {MORE_LINKS.some((l) => pathname === l.href) && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-[#D4A017] to-[#E07B39] rounded-full" />
                  )}
                  <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#D4A017]/0 to-[#E07B39]/0 group-hover:from-[#D4A017]/5 group-hover:to-[#E07B39]/5 transition-all duration-200" />
                </button>

                {/* More Dropdown Panel - Compact */}
                {isMoreOpen && (
                  <div className="absolute top-full right-0 mt-1 bg-white dark:bg-[#1e1e1e] rounded-xl shadow-2xl border border-[#D4A017]/10 dark:border-gray-700 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                    <div className="p-2.5">
                      {MORE_LINKS.map((link) => {
                        const Icon = link.icon;
                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsMoreOpen(false)}
                            className={cn(
                              "flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all duration-150 group/item whitespace-nowrap",
                              pathname === link.href
                                ? "bg-[#FFF8F0] dark:bg-[#D4A017]/10 text-[#8B1A1A] dark:text-[#D4A017]"
                                : "hover:bg-[#FFF8F0] dark:hover:bg-[#D4A017]/10 text-gray-700 dark:text-gray-300 hover:text-[#8B1A1A] dark:hover:text-[#D4A017]",
                            )}
                          >
                            <div
                              className={cn(
                                "flex-shrink-0 p-2 rounded-lg transition-all duration-200",
                                pathname === link.href
                                  ? "bg-gradient-to-br from-[#D4A017] to-[#E07B39] text-white shadow-sm"
                                  : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 group-hover/item:bg-gradient-to-br group-hover/item:from-[#D4A017] group-hover/item:to-[#E07B39] group-hover/item:text-white group-hover/item:shadow-sm",
                              )}
                            >
                              <Icon className="h-4.5 w-4.5" />
                            </div>
                            <span className="text-sm font-semibold">
                              {link.label}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </nav>

            {/* ─── Desktop Right Actions ─── */}
            <div className="hidden lg:flex items-center gap-2">
              {/* Search */}
              <div className="relative">
                {isSearchOpen ? (
                  <form onSubmit={handleSearch} className="flex items-center">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search pandits, rituals..."
                      className="w-64 pl-10 pr-10 py-2 border border-[#D4A017]/30 rounded-full text-sm bg-[#FFF8F0]/50 dark:bg-[#2a2a2a] dark:text-white dark:placeholder:text-gray-500 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#D4A017]/20 focus:border-[#D4A017] transition-all"
                      autoFocus
                    />
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#D4A017]/60" />
                    <button
                      type="button"
                      onClick={() => setIsSearchOpen(false)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-[#D4A017] hover:bg-[#D4A017]/5 dark:hover:bg-[#D4A017]/10 rounded-full transition-all duration-200"
                    aria-label="Search"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-[#D4A017] hover:bg-[#D4A017]/5 dark:hover:bg-[#D4A017]/10 rounded-full transition-all duration-200"
                aria-label="Toggle dark mode"
              >
                {isDark ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>

              {/* Notification Bell */}
              {isAnyUserAuthenticated && <NotificationBell />}

              {/* Profile / Auth */}
              {isAuthenticated && user ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() =>
                      setIsProfileDropdownOpen(!isProfileDropdownOpen)
                    }
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-[#FFF8F0] dark:hover:bg-[#D4A017]/10 border border-transparent hover:border-[#D4A017]/20 transition-all duration-200"
                  >
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#D4A017] to-[#E07B39] text-white flex items-center justify-center text-sm font-semibold shadow-sm">
                      {user.firstName?.[0]?.toUpperCase() || "U"}
                    </div>
                    <span className="hidden xl:block max-w-[100px] truncate">
                      {user.firstName}
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 transition-transform duration-200",
                        isProfileDropdownOpen && "rotate-180",
                      )}
                    />
                  </button>

                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#1e1e1e] rounded-xl shadow-2xl border border-[#D4A017]/10 dark:border-gray-700 py-1 z-50 overflow-hidden">
                      {/* User info header */}
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-[#FFF8F0]/50 dark:bg-[#2a2a2a]">
                        <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-gray-400 truncate mt-0.5">
                          {user.email}
                        </p>
                      </div>
                      <Link
                        href="/profile"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-[#FFF8F0] dark:hover:bg-[#D4A017]/10 transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <User className="h-4 w-4 text-gray-400" />
                        Profile
                      </Link>
                      <Link
                        href="/my-bookings"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-[#FFF8F0] dark:hover:bg-[#D4A017]/10 transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <Calendar className="h-4 w-4 text-gray-400" />
                        My Bookings
                      </Link>
                      <hr className="my-1 border-gray-100 dark:border-gray-700" />
                      <button
                        onClick={() => {
                          logout();
                          setIsProfileDropdownOpen(false);
                        }}
                        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openLoginModal()}
                    className="text-gray-600 dark:text-gray-300 hover:text-[#8B1A1A] dark:hover:text-[#D4A017] hover:bg-[#FFF8F0] dark:hover:bg-[#D4A017]/10"
                  >
                    Login
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => openLoginModal("/signup")}
                    className="bg-gradient-to-r from-[#D4A017] to-[#E07B39] hover:from-[#c99315] hover:to-[#c96a2e] shadow-sm border-0"
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>

            {/* ─── Mobile Menu Toggle ─── */}
            <div className="flex lg:hidden items-center gap-2">
              {/* Mobile dark mode toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-[#D4A017] transition-colors"
                aria-label="Toggle dark mode"
              >
                {isDark ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
              {/* Mobile search icon */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-[#D4A017] transition-colors"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
              {isAnyUserAuthenticated && <NotificationBell />}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={cn(
                  "p-2 rounded-lg transition-all duration-200",
                  isMobileMenuOpen
                    ? "text-[#8B1A1A] dark:text-[#D4A017] bg-[#FFF8F0] dark:bg-[#D4A017]/10"
                    : "text-gray-500 dark:text-gray-400 hover:text-[#8B1A1A] dark:hover:text-[#D4A017] hover:bg-gray-50 dark:hover:bg-gray-800",
                )}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* ─── Mobile Search Bar (Expandable) ─── */}
          {isSearchOpen && (
            <div className="lg:hidden pb-3">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#D4A017]/60" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search pandits, rituals..."
                  className="w-full pl-10 pr-10 py-2.5 border border-[#D4A017]/30 dark:border-gray-600 rounded-full text-sm bg-[#FFF8F0]/50 dark:bg-[#2a2a2a] dark:text-white dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D4A017]/20 focus:border-[#D4A017]"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* ─── Mobile Menu ─── */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-[#1a1a1a] border-b border-[#D4A017]/10 shadow-lg overflow-y-auto max-h-[calc(100vh-7rem)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            {/* Main Navigation */}
            <div className="mb-4">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#D4A017] px-3 mb-2">
                Navigation
              </p>
              <nav className="space-y-0.5">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                      pathname === link.href
                        ? "text-[#8B1A1A] dark:text-[#D4A017] bg-gradient-to-r from-[#D4A017]/10 to-[#E07B39]/5"
                        : "text-gray-600 dark:text-gray-300 hover:text-[#8B1A1A] dark:hover:text-[#D4A017] hover:bg-[#FFF8F0] dark:hover:bg-[#D4A017]/10",
                    )}
                  >
                    {pathname === link.href && (
                      <span className="w-1 h-5 rounded-full bg-gradient-to-b from-[#D4A017] to-[#E07B39]" />
                    )}
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Services Section (Accordion) */}
            <div className="mb-4">
              <button
                onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                className="w-full flex items-center justify-between px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-[#D4A017] hover:text-[#8B1A1A] transition-colors"
              >
                <span>Services</span>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 transition-transform duration-200",
                    isMobileServicesOpen && "rotate-180",
                  )}
                />
              </button>
              {isMobileServicesOpen && (
                <nav className="space-y-0.5 mt-1">
                  {SERVICES_LINKS.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                          pathname === link.href
                            ? "text-[#8B1A1A] dark:text-[#D4A017] bg-gradient-to-r from-[#D4A017]/10 to-[#E07B39]/5"
                            : "text-gray-600 dark:text-gray-300 hover:text-[#8B1A1A] dark:hover:text-[#D4A017] hover:bg-[#FFF8F0] dark:hover:bg-[#D4A017]/10",
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-4 w-4 flex-shrink-0",
                            pathname === link.href
                              ? "text-[#D4A017]"
                              : "text-gray-400",
                          )}
                        />
                        <div>
                          <p>{link.label}</p>
                          <p className="text-[11px] text-gray-400 font-normal">
                            {link.description}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </nav>
              )}
            </div>

            {/* More Section (Accordion) */}
            <div className="mb-4">
              <button
                onClick={() => setIsMobileMoreOpen(!isMobileMoreOpen)}
                className="w-full flex items-center justify-between px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-[#D4A017] hover:text-[#8B1A1A] transition-colors"
              >
                <span>More</span>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 transition-transform duration-200",
                    isMobileMoreOpen && "rotate-180",
                  )}
                />
              </button>
              {isMobileMoreOpen && (
                <nav className="space-y-0.5 mt-1">
                  {MORE_LINKS.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                          pathname === link.href
                            ? "text-[#8B1A1A] dark:text-[#D4A017] bg-gradient-to-r from-[#D4A017]/10 to-[#E07B39]/5"
                            : "text-gray-600 dark:text-gray-300 hover:text-[#8B1A1A] dark:hover:text-[#D4A017] hover:bg-[#FFF8F0] dark:hover:bg-[#D4A017]/10",
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-4 w-4 flex-shrink-0",
                            pathname === link.href
                              ? "text-[#D4A017]"
                              : "text-gray-400",
                          )}
                        />
                        <div>
                          <p>{link.label}</p>
                          <p className="text-[11px] text-gray-400 font-normal">
                            {link.description}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </nav>
              )}
            </div>

            {/* Notifications (authenticated users) */}
            {isAnyUserAuthenticated && (
              <div className="mb-4 pt-3 border-t border-[#D4A017]/10 dark:border-gray-700">
                <Link
                  href="/notifications"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:text-[#8B1A1A] dark:hover:text-[#D4A017] hover:bg-[#FFF8F0] dark:hover:bg-[#D4A017]/10 rounded-lg transition-all"
                >
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>Notifications</span>
                </Link>
              </div>
            )}

            {/* Auth / Profile Section */}
            <div className="pt-3 border-t border-[#D4A017]/10 dark:border-gray-700">
              {isAuthenticated && user ? (
                <div>
                  {/* User Card */}
                  <div className="flex items-center gap-3 px-3 py-3 mb-2 bg-gradient-to-r from-[#FFF8F0] to-[#D4A017]/5 dark:from-[#2a2a2a] dark:to-[#D4A017]/5 rounded-xl">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#D4A017] to-[#E07B39] text-white flex items-center justify-center text-base font-semibold shadow-sm">
                      {user.firstName?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:text-[#8B1A1A] dark:hover:text-[#D4A017] hover:bg-[#FFF8F0] dark:hover:bg-[#D4A017]/10 rounded-lg transition-all"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="h-4 w-4 text-gray-400" />
                      Profile
                    </Link>
                    <Link
                      href="/my-bookings"
                      className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:text-[#8B1A1A] dark:hover:text-[#D4A017] hover:bg-[#FFF8F0] dark:hover:bg-[#D4A017]/10 rounded-lg transition-all"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Calendar className="h-4 w-4 text-gray-400" />
                      My Bookings
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2 px-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      openLoginModal();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-[#D4A017] to-[#E07B39] border-0"
                    onClick={() => {
                      openLoginModal("/signup");
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Contact Info */}
            <div className="mt-4 pt-3 border-t border-[#D4A017]/10 dark:border-gray-700">
              <div className="flex flex-wrap items-center gap-3 px-3 text-xs text-gray-400">
                <a
                  href="tel:+919876543210"
                  className="flex items-center gap-1.5 hover:text-[#D4A017] transition-colors"
                >
                  <Phone className="h-3 w-3" />
                  <span>+91 9876543210</span>
                </a>
                <a
                  href="mailto:info@panthulugaru.com"
                  className="flex items-center gap-1.5 hover:text-[#D4A017] transition-colors"
                >
                  <Mail className="h-3 w-3" />
                  <span>info@panthulugaru.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
