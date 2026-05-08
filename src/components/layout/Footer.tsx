"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  CreditCard,
  Users,
  ArrowRight,
  Heart,
} from "lucide-react";

/* ───────────────────────────── link data ───────────────────────────── */

const SERVICES_LINKS = [
  { href: "/pandits", label: "Pandits" },
  { href: "/photographers", label: "Photographers" },
  { href: "/caterers", label: "Caterers" },
  { href: "/rituals", label: "Rituals" },
  { href: "/temple-jobs", label: "Temple Jobs" },
  { href: "/monthly-hire", label: "Monthly Hire" },
];

const FEATURES_LINKS = [
  { href: "/horoscope", label: "Horoscope" },
  { href: "/panchangam", label: "Panchangam" },
  { href: "/death-anniversary", label: "Death Anniversary" },
  { href: "/greetings", label: "Greetings" },
  { href: "/vaahan-puja", label: "Vaahan Puja" },
  { href: "/articles", label: "Articles" },
];

const COMPANY_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/careers", label: "Careers" },
  { href: "/blog", label: "Blog" },
];

/* ───────────────────────── SVG social icons ───────────────────────── */

function FacebookIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function YouTubeIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function TwitterXIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function WhatsAppIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

/* ─────────────────── mandala decorative border SVG ─────────────────── */

function MandalaBorder() {
  return (
    <div className="w-full overflow-hidden py-1">
      <svg
        className="w-full h-6"
        viewBox="0 0 1200 24"
        preserveAspectRatio="none"
        fill="none"
      >
        {/* repeating mandala-inspired scallop pattern */}
        <defs>
          <pattern id="mandala-unit" x="0" y="0" width="60" height="24" patternUnits="userSpaceOnUse">
            {/* central lotus petal */}
            <path
              d="M30 2 Q38 12 30 22 Q22 12 30 2Z"
              fill="#D4A017"
              opacity="0.35"
            />
            {/* side arcs */}
            <path
              d="M0 20 Q15 4 30 20"
              stroke="#D4A017"
              strokeWidth="1"
              fill="none"
              opacity="0.6"
            />
            <path
              d="M30 20 Q45 4 60 20"
              stroke="#D4A017"
              strokeWidth="1"
              fill="none"
              opacity="0.6"
            />
            {/* dot accents */}
            <circle cx="15" cy="14" r="1.5" fill="#D4A017" opacity="0.5" />
            <circle cx="45" cy="14" r="1.5" fill="#D4A017" opacity="0.5" />
            <circle cx="30" cy="12" r="1" fill="#D4A017" opacity="0.7" />
          </pattern>
        </defs>
        <rect width="1200" height="24" fill="url(#mandala-unit)" />
        {/* golden baseline */}
        <line x1="0" y1="22" x2="1200" y2="22" stroke="#D4A017" strokeWidth="0.5" opacity="0.4" />
      </svg>
    </div>
  );
}

/* ════════════════════════════ FOOTER ════════════════════════════════ */

export function Footer() {
  const [email, setEmail] = useState("");

  return (
    <footer className="text-gray-300" style={{ background: "linear-gradient(180deg, #1a0a0a 0%, #2d1010 100%)" }}>

      {/* ── TOP: Newsletter subscription bar ───────────────────────── */}
      <div className="border-b border-[#D4A017]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* headline */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="h-10 w-10 rounded-full bg-[#D4A017]/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-[#D4A017]" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg leading-tight">
                  Subscribe to Festival Updates
                </h3>
                <p className="text-gray-400 text-sm">
                  Get puja reminders, muhurat alerts &amp; special offers
                </p>
              </div>
            </div>

            {/* form */}
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex w-full md:w-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full md:w-80 px-4 py-3 rounded-l-lg bg-white/5 border border-[#D4A017]/30 border-r-0 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#D4A017] transition-colors"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-r-lg bg-[#E07B39] hover:bg-[#c96a2f] text-white font-semibold text-sm flex items-center gap-2 transition-colors shrink-0"
              >
                Subscribe
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* decorative mandala border */}
        <MandalaBorder />
      </div>

      {/* ── MAIN: 4-column grid ───────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

          {/* Column 1 -- Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            {/* logo */}
            <div className="flex items-center gap-2.5 mb-4">
              <img src="/logo.png" alt="Panthulu Garu" className="h-10 w-auto object-contain" />
              <span className="text-lg font-bold text-white">
                Panthulu{" "}
                <span className="text-[#E07B39]">Garu</span>
              </span>
            </div>

            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Connecting devotees with trusted pandits for all Hindu
              ceremonies and rituals across India. Your one-stop
              destination for spiritual services.
            </p>

            {/* trust badges */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#D4A017] shrink-0" />
                <span className="text-xs text-gray-400">Verified Pandits</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-4 h-4 text-[#D4A017] shrink-0" />
                <span className="text-xs text-gray-400">Secure Payments</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-[#D4A017] shrink-0" />
                <span className="text-xs text-gray-400">500+ Pandits Nationwide</span>
              </div>
            </div>
          </div>

          {/* Column 2 -- Services */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-px bg-[#D4A017]" />
              Services
            </h3>
            <ul className="space-y-3">
              {SERVICES_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-[#D4A017] hover:pl-1 transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 -- Features */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-px bg-[#D4A017]" />
              Features
            </h3>
            <ul className="space-y-3">
              {FEATURES_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-[#D4A017] hover:pl-1 transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 -- Company */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-px bg-[#D4A017]" />
              Company
            </h3>
            <ul className="space-y-3">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-[#D4A017] hover:pl-1 transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* contact info */}
            <div className="mt-6 space-y-2.5">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#D4A017]" />
                <span className="text-xs text-gray-400">support@panthulugaru.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#D4A017]" />
                <span className="text-xs text-gray-400">+91 9999 999 999</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#D4A017]" />
                <span className="text-xs text-gray-400">Hyderabad, Telangana</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── SOCIAL LINKS ──────────────────────────────────────────── */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">Follow us on social media</p>
            <div className="flex items-center gap-3">
              {[
                { Icon: FacebookIcon, label: "Facebook", href: "#" },
                { Icon: InstagramIcon, label: "Instagram", href: "#" },
                { Icon: YouTubeIcon, label: "YouTube", href: "#" },
                { Icon: TwitterXIcon, label: "Twitter / X", href: "#" },
                { Icon: WhatsAppIcon, label: "WhatsApp", href: "#" },
              ].map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="h-9 w-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#D4A017] hover:border-[#D4A017]/40 hover:bg-[#D4A017]/10 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ────────────────────────────────────────────── */}
      <div className="border-t border-white/5" style={{ background: "rgba(0,0,0,0.25)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">

            {/* copyright */}
            <p className="text-xs text-gray-500 order-2 md:order-1">
              &copy; {new Date().getFullYear()} Panthulu Garu. All rights
              reserved.
            </p>

            {/* tagline */}
            <p className="text-xs text-gray-500 flex items-center gap-1.5 order-1 md:order-2">
              From the house of
              <a
                href="https://www.versatilecommerce.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D4A017] font-semibold hover:text-[#F0C040] transition-colors underline underline-offset-2"
              >
                Versatile Commerce
              </a>
            </p>

            {/* payment badges */}
            <div className="flex items-center gap-3 order-3">
              {/* UPI */}
              <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-bold text-gray-400 tracking-wider uppercase">
                UPI
              </span>
              {/* Visa */}
              <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-bold text-gray-400 tracking-wider uppercase">
                Visa
              </span>
              {/* Mastercard */}
              <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-bold text-gray-400 tracking-wider uppercase">
                Mastercard
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
