'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search, Users, Camera, UtensilsCrossed, BookOpen, Briefcase, Star,
  ArrowRight, Calendar, Moon, ChevronRight, ChevronLeft, Shield,
  CheckCircle, Sparkles, MapPin, Clock, Quote,
  Award, Heart, Flower2, IndianRupee, Truck,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { LoginModal } from '@/components/auth/LoginModal';
import { useAuth } from '@/contexts/AuthContext';
import { getAllPandits } from '@/lib/api/pandits';
import { getArticles } from '@/lib/api/articles';
import {
  DUMMY_PANDITS, DUMMY_ARTICLES, DUMMY_TESTIMONIALS, DUMMY_RITUALS,
  PLATFORM_STATS, HOW_IT_WORKS, DUMMY_POOJAS, FAQ_DATA,
} from '@/lib/dummyData';
import type { Panthulugaru, Article } from '@/types';

const CATEGORIES = [
  { href: '/pandits', label: 'Pandits', icon: Users, gradient: 'from-[#E07B39] to-[#D4A017]', desc: 'Find verified & experienced priests for all ceremonies' },
  { href: '/photographers', label: 'Photographers', icon: Camera, gradient: 'from-blue-500 to-indigo-600', desc: 'Professional ceremony & event photographers' },
  { href: '/caterers', label: 'Caterers', icon: UtensilsCrossed, gradient: 'from-emerald-500 to-teal-600', desc: 'Pure sattvic food for pujas & celebrations' },
  { href: '/rituals', label: 'Rituals', icon: BookOpen, gradient: 'from-purple-500 to-violet-600', desc: 'Browse all Hindu ceremonies & poojas' },
  { href: '/horoscope', label: 'Horoscope', icon: Star, gradient: 'from-pink-500 to-rose-600', desc: 'Vedic astrology & Kundali generation' },
  { href: '/panchangam', label: 'Panchangam', icon: Calendar, gradient: 'from-indigo-500 to-blue-600', desc: 'Daily Hindu calendar & auspicious timings' },
  { href: '/temple-jobs', label: 'Temple Jobs', icon: Briefcase, gradient: 'from-amber-500 to-orange-600', desc: 'Sacred career opportunities at temples' },
  { href: '/death-anniversary', label: 'Tithi Calculator', icon: Moon, gradient: 'from-gray-500 to-slate-600', desc: 'Calculate death anniversary tithi dates' },
  { href: '/vaahan-puja', label: 'Vaahan Puja', icon: Truck, gradient: 'from-teal-500 to-cyan-600', desc: 'Vehicle blessing & protection ceremonies' },
];

const STEP_ICONS: Record<string, React.ElementType> = {
  Search, Users, Calendar, Star,
};

export default function HomePage() {
  const router = useRouter();
  const { isLoginModalOpen, closeLoginModal, loginRedirectPath } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredPandits, setFeaturedPandits] = useState<Panthulugaru[]>([]);
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [loadingPandits, setLoadingPandits] = useState(true);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    fetchFeaturedPandits();
    fetchRecentArticles();
  }, []);

  const fetchFeaturedPandits = async () => {
    try {
      const response = await getAllPandits({ page: 0, size: 6, sortBy: 'rating' });
      if (response.success && response.data && response.data.content?.length > 0) {
        setFeaturedPandits(response.data.content);
      } else {
        setFeaturedPandits(DUMMY_PANDITS.slice(0, 6));
      }
    } catch {
      setFeaturedPandits(DUMMY_PANDITS.slice(0, 6));
    } finally {
      setLoadingPandits(false);
    }
  };

  const fetchRecentArticles = async () => {
    try {
      const response = await getArticles({ page: 0, size: 3, status: 'PUBLISHED' });
      if (response.success && response.data && response.data.content?.length > 0) {
        setRecentArticles(response.data.content);
      } else {
        setRecentArticles(DUMMY_ARTICLES.slice(0, 3));
      }
    } catch {
      setRecentArticles(DUMMY_ARTICLES.slice(0, 3));
    } finally {
      setLoadingArticles(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/pandits?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen">

        {/* ══════════════ HERO SECTION ══════════════ */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#1a0a00] via-[#2d1508] to-[#3d1c0a] min-h-[85vh] flex items-center">
          {/* Decorative background elements */}
          <div className="absolute inset-0 mandala-bg opacity-30" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-radial from-[#E07B39]/15 via-transparent to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tl from-[#D4A017]/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gradient-to-tr from-[#8B1A1A]/15 to-transparent rounded-full blur-3xl" />
          {/* Floating Om watermark */}
          <div className="absolute top-20 left-12 text-[#E07B39]/[0.06] text-[200px] font-bold leading-none select-none animate-float hidden xl:block">ॐ</div>
          <div className="absolute bottom-16 right-16 text-[#D4A017]/[0.05] text-[140px] font-bold leading-none select-none hidden xl:block">श्री</div>
          {/* Decorative border lines */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4A017]/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4A017]/20 to-transparent" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 relative z-10 w-full">
            <div className="text-center max-w-4xl mx-auto">
              {/* Trust badge */}
              <div className="inline-flex items-center flex-wrap justify-center gap-2 sm:gap-2.5 px-4 sm:px-5 py-2.5 rounded-full bg-white/[0.08] border border-[#D4A017]/30 backdrop-blur-sm mb-8 animate-fade-in-up">
                <div className="h-5 w-5 rounded-full bg-gradient-to-br from-[#D4A017] to-[#E07B39] flex items-center justify-center">
                  <Shield className="h-3 w-3 text-white" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-[#F0C040]">Trusted by {PLATFORM_STATS.totalCeremonies.toLocaleString()}+ families</span>
                <div className="flex -space-x-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 text-[#F0C040] fill-[#F0C040]" />
                  ))}
                </div>
              </div>

              {/* Main heading */}
              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold leading-[1.1] animate-fade-in-up stagger-1">
                <span className="text-white">Find Trusted </span>
                <span className="bg-gradient-to-r from-[#F0C040] via-[#E07B39] to-[#D4A017] bg-clip-text text-transparent">Pandits</span>
                <br className="hidden sm:block" />
                <span className="text-white"> for Your </span>
                <span className="bg-gradient-to-r from-[#E07B39] to-[#CC3333] bg-clip-text text-transparent">Sacred Ceremonies</span>
              </h1>

              {/* Subtitle */}
              <p className="mt-6 text-base sm:text-lg lg:text-xl text-white/60 max-w-2xl mx-auto animate-fade-in-up stagger-2 leading-relaxed">
                Connect with verified and experienced pandits, photographers, and caterers
                for all Hindu ceremonies and rituals across India.
              </p>

              {/* Search bar */}
              <form onSubmit={handleSearch} className="mt-10 max-w-2xl mx-auto animate-fade-in-up stagger-3">
                <div className="flex shadow-2xl shadow-black/30 rounded-2xl overflow-hidden border border-white/10 bg-white/[0.07] backdrop-blur-md p-1.5">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search pandits by name, ritual, or location..."
                      className="w-full pl-12 pr-4 py-4 text-base bg-transparent text-white focus:outline-none placeholder:text-white/30 rounded-xl"
                    />
                  </div>
                  <button type="submit" className="flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-[#E07B39] to-[#D4A017] hover:from-[#c96a2e] hover:to-[#b8901a] text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-[#E07B39]/20 hover:shadow-[#E07B39]/40 hover:scale-[1.02] active:scale-[0.98]">
                    <Search className="h-4 w-4" />
                    <span className="hidden sm:inline">Search</span>
                  </button>
                </div>
              </form>

              {/* Popular searches */}
              <div className="mt-5 flex flex-wrap justify-center gap-2 animate-fade-in-up stagger-4">
                <span className="text-sm text-white/30 mr-1">Popular:</span>
                {['Griha Pravesam', 'Satyanarayana Puja', 'Vivaha', 'Navagraha Puja', 'Ganapathi Homam'].map((term) => (
                  <button
                    key={term}
                    onClick={() => { setSearchQuery(term); router.push(`/pandits?search=${encodeURIComponent(term)}`); }}
                    className="text-sm text-[#F0C040]/70 hover:text-[#F0C040] transition-colors hover:underline underline-offset-2"
                  >
                    {term}
                  </button>
                ))}
              </div>

              {/* Stats bar */}
              <div className="mt-14 animate-fade-in-up stagger-5">
                <div className="grid grid-cols-2 sm:inline-flex sm:items-center sm:gap-0 rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-sm overflow-hidden sm:divide-x divide-white/10">
                  {[
                    { value: `${PLATFORM_STATS.totalPandits}+`, label: 'Verified Pandits', icon: Users },
                    { value: `${(PLATFORM_STATS.totalCeremonies / 1000).toFixed(0)}K+`, label: 'Ceremonies', icon: CheckCircle },
                    { value: `${PLATFORM_STATS.totalCities}+`, label: 'Cities', icon: MapPin },
                    { value: `${PLATFORM_STATS.customerRating}`, label: 'Rating', icon: Star, isStar: true },
                  ].map((stat) => (
                    <div key={stat.label} className="flex items-center gap-3 px-4 sm:px-8 py-3 sm:py-4">
                      <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#E07B39]/20 to-[#D4A017]/10 flex items-center justify-center hidden sm:flex">
                        <stat.icon className={`h-4 w-4 ${stat.isStar ? 'text-[#F0C040] fill-[#F0C040]' : 'text-[#E07B39]'}`} />
                      </div>
                      <div className="text-center sm:text-left">
                        <p className="text-lg sm:text-2xl font-bold text-white">
                          {stat.value}
                          {stat.isStar && <Star className="inline h-3.5 w-3.5 text-[#F0C040] fill-[#F0C040] ml-0.5 -mt-1" />}
                        </p>
                        <p className="text-[10px] sm:text-xs text-white/40 font-medium uppercase tracking-wider">{stat.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════ SERVICES - Carousel with Prev/Next ══════════════ */}
        <section className="py-10 sm:py-14 bg-gradient-to-b from-[#FFF8F0]/60 to-white dark:from-[#1a1a1a] dark:to-[#121212]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Explore Our <span className="gradient-text">Services</span>
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const el = document.getElementById('services-carousel');
                    if (el) el.scrollBy({ left: -300, behavior: 'smooth' });
                  }}
                  className="h-9 w-9 rounded-full border-2 border-[#E07B39]/20 bg-white dark:bg-[#1e1e1e] flex items-center justify-center text-[#E07B39] hover:border-[#E07B39] hover:bg-[#E07B39] hover:text-white shadow-sm hover:shadow-md transition-all"
                  aria-label="Previous services"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById('services-carousel');
                    if (el) el.scrollBy({ left: 300, behavior: 'smooth' });
                  }}
                  className="h-9 w-9 rounded-full border-2 border-[#E07B39]/20 bg-white dark:bg-[#1e1e1e] flex items-center justify-center text-[#E07B39] hover:border-[#E07B39] hover:bg-[#E07B39] hover:text-white shadow-sm hover:shadow-md transition-all"
                  aria-label="Next services"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div
              id="services-carousel"
              className="flex gap-5 overflow-x-auto hide-scrollbar scroll-smooth pb-4"
            >
              {CATEGORIES.map((cat) => (
                <Link key={cat.href} href={cat.href} className="flex-shrink-0 w-[220px] sm:w-[250px]">
                  <div className="group flex flex-col items-center text-center p-5 sm:p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-[#E07B39]/40 shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgba(224,123,57,0.15)] hover:-translate-y-1.5 transition-all duration-300 bg-white dark:bg-[#1e1e1e] h-full relative overflow-hidden">
                    {/* Subtle top accent bar */}
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${cat.gradient} opacity-60 group-hover:opacity-100 transition-opacity`} />
                    <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-xl group-hover:rotate-3 transition-all duration-300 mt-1`}>
                      <cat.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mt-3.5 group-hover:text-[#E07B39] transition-colors">
                      {cat.label}
                    </h3>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed line-clamp-2">
                      {cat.desc}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Lotus Divider ── */}
        <div className="section-lotus-divider">
          <Flower2 className="lotus-icon h-5 w-5" />
        </div>

        {/* ══════════════ FEATURED PANDITS ══════════════ */}
        <section className="py-14 sm:py-20 bg-gradient-to-b from-gray-50 to-white dark:from-[#161616] dark:to-[#121212] mandala-bg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <Badge variant="saffron" className="mb-3">Top Rated</Badge>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Featured Pandits</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Verified and highly rated by thousands of devotees</p>
              </div>
              <Link href="/pandits" className="hidden sm:flex items-center gap-1.5 text-[#E07B39] font-semibold hover:gap-2.5 transition-all">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {loadingPandits ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i}><CardContent className="p-5"><div className="flex items-center gap-4"><Skeleton className="h-16 w-16 rounded-full" /><div className="flex-1"><Skeleton className="h-5 w-32" /><Skeleton className="h-4 w-24 mt-2" /><Skeleton className="h-4 w-20 mt-2" /></div></div></CardContent></Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {featuredPandits.map((pandit) => (
                  <Link key={pandit.id} href={`/pandits/${pandit.slug}`}>
                    <Card className="h-full overflow-hidden card-premium cursor-pointer group border-gray-200/80 dark:border-gray-700 dark:bg-[#1e1e1e]">
                      <div className="h-1 bg-gradient-to-r from-[#E07B39] via-[#D4A017] to-[#8B1A1A]" />
                      <CardContent className="p-5">
                        <div className="flex items-start gap-4">
                          <div className="relative">
                            <Avatar src={pandit.profileImage} alt={`${pandit.firstName} ${pandit.lastName}`} fallback={`${pandit.firstName} ${pandit.lastName}`} size="lg" />
                            {pandit.isVerified && (
                              <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-[#E07B39] rounded-full flex items-center justify-center">
                                <CheckCircle className="h-3 w-3 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-[#E07B39] transition-colors">{pandit.firstName} {pandit.lastName}</h3>
                            <div className="flex items-center gap-1.5 mt-1 text-sm text-gray-500">
                              <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                              <span className="truncate">{pandit.primaryCity || 'India'}</span>
                            </div>
                            <div className="flex items-center gap-3 mt-2">
                              {pandit.rating > 0 && (
                                <div className="flex items-center gap-1">
                                  <Star className="h-3.5 w-3.5 text-[#D4A017] fill-[#D4A017]" />
                                  <span className="text-sm font-semibold text-gray-800">{pandit.rating.toFixed(1)}</span>
                                  <span className="text-xs text-gray-400">({pandit.reviewCount})</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1 text-xs text-gray-400">
                                <Clock className="h-3 w-3" />
                                <span>{pandit.experience} yrs</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {pandit.specializations?.slice(0, 3).map((spec) => (
                            <span key={spec} className="px-2 py-0.5 text-[10px] font-medium bg-[#E07B39]/5 text-[#E07B39] rounded-full">{spec}</span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                          <div className="flex gap-1.5">
                            {pandit.isAvailable && <Badge variant="green" className="text-[10px]">Available</Badge>}
                            {pandit.minimumPricing && <span className="text-sm font-semibold text-[#E07B39]">From &#8377;{pandit.minimumPricing?.toLocaleString()}</span>}
                          </div>
                          <span className="text-xs text-[#E07B39] font-medium group-hover:underline flex items-center gap-1">View Profile <ArrowRight className="h-3 w-3" /></span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}

            <div className="text-center mt-8 sm:hidden">
              <Link href="/pandits"><Button variant="outline" size="md">View All Pandits <ArrowRight className="h-4 w-4 ml-1.5" /></Button></Link>
            </div>
          </div>
        </section>

        {/* ── Lotus Divider ── */}
        <div className="section-lotus-divider bg-gradient-to-br from-[#1a0a0a] via-[#2d1515] to-[#1a0a0a]">
          <Flower2 className="lotus-icon h-5 w-5" />
        </div>

        {/* ══════════════ HOW IT WORKS ══════════════ */}
        <section className="py-16 sm:py-24 bg-gradient-to-br from-[#1a0a0a] via-[#2d1515] to-[#1a0a0a] relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0 mandala-bg opacity-10" />
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-[#E07B39]/8 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-[#D4A017]/8 rounded-full blur-3xl" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 mb-5">
                <Sparkles className="h-4 w-4 text-[#D4A017]" />
                <span className="text-sm font-medium text-white/80">Simple 4-Step Process</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                How It <span className="gradient-text-gold">Works</span>
              </h2>
              <p className="text-white/50 mt-3 max-w-xl mx-auto text-lg">Book a pandit for your ceremony in just a few clicks</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-5">
              {HOW_IT_WORKS.map((step, index) => {
                const IconComponent = STEP_ICONS[step.icon] || Search;
                return (
                  <div key={step.step} className="relative group">
                    {/* Connector line between steps - desktop only */}
                    {index < HOW_IT_WORKS.length - 1 && (
                      <div className="hidden lg:block absolute top-14 left-[65%] w-[70%] z-0">
                        <div className="h-[2px] bg-gradient-to-r from-[#D4A017]/40 to-[#E07B39]/20 relative">
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-[#D4A017]/40" />
                        </div>
                      </div>
                    )}

                    {/* Card */}
                    <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-7 hover:bg-white/10 hover:border-[#D4A017]/30 transition-all duration-500 h-full group-hover:-translate-y-1">
                      {/* Step number - large watermark */}
                      <div className="absolute top-4 right-5 text-[56px] font-black text-white/[0.04] leading-none select-none">
                        0{step.step}
                      </div>

                      {/* Icon container */}
                      <div className="relative mb-5">
                        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#E07B39] to-[#D4A017] flex items-center justify-center shadow-lg shadow-[#E07B39]/20 group-hover:shadow-[#E07B39]/40 group-hover:scale-110 transition-all duration-300">
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <div className="absolute -top-1.5 -left-1.5 h-6 w-6 bg-white rounded-full flex items-center justify-center shadow-md">
                          <span className="text-[11px] font-black text-[#E07B39]">{step.step}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#D4A017] transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-sm text-white/50 leading-relaxed group-hover:text-white/70 transition-colors">
                        {step.description}
                      </p>

                      {/* Bottom accent */}
                      <div className="mt-5 pt-4 border-t border-white/5">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-[#D4A017]/70 group-hover:text-[#D4A017] transition-colors">
                          <CheckCircle className="h-3.5 w-3.5" />
                          <span>{['Browse & Search', 'Compare Profiles', 'Instant Booking', 'Verified Service'][index]}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom trust bar */}
            <div className="mt-12 flex flex-wrap justify-center gap-6 sm:gap-10 text-white/40 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-[#D4A017]/60" />
                <span>100% Verified Pandits</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-[#D4A017]/60 fill-[#D4A017]/60" />
                <span>{PLATFORM_STATS.customerRating} Avg Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-[#D4A017]/60" />
                <span>{(PLATFORM_STATS.totalCeremonies / 1000).toFixed(0)}K+ Happy Families</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Lotus Divider ── */}
        <div className="section-lotus-divider">
          <Flower2 className="lotus-icon h-5 w-5" />
        </div>

        {/* ══════════════ POPULAR POOJAS ══════════════ */}
        <section className="py-12 sm:py-16 bg-gradient-to-b from-[#FFF8F0] to-white dark:from-[#1a1a1a] dark:to-[#121212]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <Badge variant="maroon" className="mb-3">
                  <Sparkles className="h-3 w-3 mr-1" />Most Booked
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Popular Poojas</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Book from our most sought-after sacred ceremonies</p>
              </div>
              <Link href="/rituals" className="hidden sm:flex items-center gap-1.5 text-[#E07B39] font-semibold hover:gap-2.5 transition-all">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {DUMMY_POOJAS.map((pooja) => (
                <Link key={pooja.id} href="/rituals">
                  <Card className="h-full overflow-hidden card-premium cursor-pointer group dark:bg-[#1e1e1e] dark:border-gray-700">
                    {/* Image */}
                    <div className="h-40 bg-gray-100 relative overflow-hidden">
                      <img
                        src={pooja.image}
                        alt={pooja.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-white/90 text-[#8B1A1A] border-none text-[10px] font-semibold shadow-sm">
                          {pooja.category}
                        </Badge>
                      </div>
                      <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                        <Star className="h-3 w-3 text-[#D4A017] fill-[#D4A017]" />
                        <span className="font-semibold">{pooja.rating}</span>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-[#E07B39] transition-colors">{pooja.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">{pooja.description}</p>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-1 text-[#E07B39] font-bold text-sm">
                          <IndianRupee className="h-3.5 w-3.5" />
                          {pooja.price.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{pooja.duration}</span>
                          <span>{pooja.bookings.toLocaleString()} booked</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="text-center mt-8 sm:hidden">
              <Link href="/rituals"><Button variant="outline" size="md">View All Poojas <ArrowRight className="h-4 w-4 ml-1.5" /></Button></Link>
            </div>
          </div>
        </section>

        {/* ══════════════ TESTIMONIALS - Auto Scroll Marquee ══════════════ */}
        <section className="py-16 sm:py-24 bg-gradient-to-br from-[#8B1A1A] via-[#6B1414] to-[#4a0e0e] text-white relative overflow-hidden">
          {/* Decorative background */}
          <div className="absolute inset-0 mandala-bg opacity-10" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4A017]/8 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#E07B39]/8 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-12 px-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 mb-5">
                <Heart className="h-4 w-4 text-[#D4A017]" />
                <span className="text-sm font-medium text-white/80">Loved by {(PLATFORM_STATS.totalCeremonies / 1000).toFixed(0)}K+ families</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                What Our Customers{' '}
                <span className="gradient-text-gold">Say</span>
              </h2>
              <p className="text-white/50 mt-3 max-w-xl mx-auto text-lg">Real experiences from real devotees across India</p>
            </div>

            {/* Row 1 - scrolls left */}
            <div className="marquee-container overflow-hidden mb-5">
              <div className="marquee-track marquee-scroll-left">
                {[...DUMMY_TESTIMONIALS.slice(0, 5), ...DUMMY_TESTIMONIALS.slice(0, 5)].map((testimonial, i) => (
                  <div key={`row1-${i}`} className="flex-shrink-0 w-[280px] sm:w-[400px] mx-2.5">
                    <div className="bg-white/8 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/12 transition-all duration-300 h-full">
                      <div className="flex items-start gap-3 mb-3">
                        <Quote className="h-6 w-6 text-[#D4A017]/40 flex-shrink-0 mt-0.5" />
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, si) => (
                            <Star key={si} className={`h-3 w-3 ${si < testimonial.rating ? 'text-[#D4A017] fill-[#D4A017]' : 'text-white/20'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-white/85 text-sm leading-relaxed line-clamp-3">&quot;{testimonial.text}&quot;</p>
                      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/8">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#E07B39] to-[#D4A017] flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-lg shadow-[#E07B39]/20">
                          {testimonial.avatar}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm truncate">{testimonial.name}</p>
                          <p className="text-[11px] text-white/40 truncate">{testimonial.location} &bull; {testimonial.ritual}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Row 2 - scrolls right (reverse) */}
            <div className="marquee-container overflow-hidden">
              <div className="marquee-track marquee-scroll-right">
                {[...DUMMY_TESTIMONIALS.slice(5), ...DUMMY_TESTIMONIALS.slice(5)].map((testimonial, i) => (
                  <div key={`row2-${i}`} className="flex-shrink-0 w-[280px] sm:w-[400px] mx-2.5">
                    <div className="bg-white/8 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/12 transition-all duration-300 h-full">
                      <div className="flex items-start gap-3 mb-3">
                        <Quote className="h-6 w-6 text-[#D4A017]/40 flex-shrink-0 mt-0.5" />
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, si) => (
                            <Star key={si} className={`h-3 w-3 ${si < testimonial.rating ? 'text-[#D4A017] fill-[#D4A017]' : 'text-white/20'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-white/85 text-sm leading-relaxed line-clamp-3">&quot;{testimonial.text}&quot;</p>
                      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/8">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#E07B39] to-[#D4A017] flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-lg shadow-[#E07B39]/20">
                          {testimonial.avatar}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm truncate">{testimonial.name}</p>
                          <p className="text-[11px] text-white/40 truncate">{testimonial.location} &bull; {testimonial.ritual}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rating summary bar */}
            <div className="max-w-3xl mx-auto mt-12 px-4">
              <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-white/50 text-sm">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-[#D4A017] fill-[#D4A017]" />
                    ))}
                  </div>
                  <span className="font-semibold text-white">{PLATFORM_STATS.customerRating}</span>
                  <span>average</span>
                </div>
                <div className="h-4 w-px bg-white/20 hidden sm:block" />
                <div className="flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-[#D4A017]/60" />
                  <span>{(PLATFORM_STATS.totalReviews / 1000).toFixed(1)}K+ verified reviews</span>
                </div>
                <div className="h-4 w-px bg-white/20 hidden sm:block" />
                <div className="flex items-center gap-1.5">
                  <Shield className="h-4 w-4 text-[#D4A017]/60" />
                  <span>All reviews verified</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Lotus Divider ── */}
        <div className="section-lotus-divider">
          <Flower2 className="lotus-icon h-5 w-5" />
        </div>

        {/* ══════════════ ARTICLES ══════════════ */}
        <section className="py-14 sm:py-20 bg-gray-50 dark:bg-[#161616]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <Badge variant="saffron" className="mb-3">Knowledge</Badge>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Articles & Insights</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Learn about Hindu traditions, rituals, and spirituality</p>
              </div>
              <Link href="/articles" className="hidden sm:flex items-center gap-1.5 text-[#E07B39] font-semibold hover:gap-2.5 transition-all">View All <ArrowRight className="h-4 w-4" /></Link>
            </div>
            {loadingArticles ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i}><Skeleton className="h-52 rounded-t-xl" /><CardContent className="p-5"><Skeleton className="h-5 w-3/4" /><Skeleton className="h-4 w-full mt-2" /><Skeleton className="h-4 w-2/3 mt-1" /></CardContent></Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentArticles.map((article) => (
                  <Link key={article.id} href={`/articles/${article.slug}`}>
                    <Card className="h-full overflow-hidden card-premium cursor-pointer group dark:bg-[#1e1e1e] dark:border-gray-700">
                      {article.coverImage ? (
                        <div className="h-52 bg-gray-100 relative overflow-hidden">
                          <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                          {article.category && <div className="absolute top-3 left-3"><Badge variant="saffron" className="bg-[#E07B39] text-white border-none shadow-lg">{article.category}</Badge></div>}
                        </div>
                      ) : (
                        <div className="h-52 bg-gradient-to-br from-[#E07B39]/20 to-[#8B1A1A]/20 flex items-center justify-center relative">
                          <BookOpen className="h-16 w-16 text-[#E07B39]/30" />
                          {article.category && <div className="absolute top-3 left-3"><Badge variant="saffron">{article.category}</Badge></div>}
                        </div>
                      )}
                      <CardContent className="p-5">
                        <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-[#E07B39] transition-colors">{article.title}</h3>
                        {article.excerpt && <p className="text-sm text-gray-500 mt-2 line-clamp-2">{article.excerpt}</p>}
                        <div className="flex items-center gap-3 mt-4 text-xs text-gray-400">
                          {article.author && <span className="font-medium text-gray-600">By {article.author}</span>}
                          {article.publishedAt && <span>{new Date(article.publishedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>}
                          {article.viewCount > 0 && <span>{article.viewCount.toLocaleString()} views</span>}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
            <div className="text-center mt-8">
              <Link href="/articles"><Button variant="outline" size="md">Read All Articles <ArrowRight className="h-4 w-4 ml-1.5" /></Button></Link>
            </div>
          </div>
        </section>

        {/* ══════════════ FAQ ══════════════ */}
        <section className="py-14 sm:py-20 bg-white dark:bg-[#121212]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <Badge variant="saffron" className="mb-3">FAQ</Badge>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Everything you need to know about our platform</p>
            </div>
            <div className="space-y-3">
              {FAQ_DATA.map((faq, index) => (
                <div key={index} className={`rounded-xl border transition-all ${openFaq === index ? 'border-[#E07B39]/30 bg-[#FFF8F0] dark:bg-[#2a1a0a] shadow-sm' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e1e1e]'}`}>
                  <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="w-full flex items-center justify-between p-5 text-left">
                    <span className={`font-semibold text-sm sm:text-base ${openFaq === index ? 'text-[#E07B39]' : 'text-gray-900 dark:text-white'}`}>{faq.question}</span>
                    <ChevronRight className={`h-5 w-5 flex-shrink-0 ml-3 transition-transform duration-200 ${openFaq === index ? 'rotate-90 text-[#E07B39]' : 'text-gray-400'}`} />
                  </button>
                  {openFaq === index && (
                    <div className="px-5 pb-5 -mt-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════ CTA - JOIN AS PANDIT ══════════════ */}
        <section className="py-16 sm:py-20 bg-gradient-to-r from-[#E07B39] via-[#D4A017] to-[#E07B39] animate-gradient relative overflow-hidden">
          <div className="absolute inset-0 pattern-bg opacity-10" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 border border-white/30 mb-6">
              <Award className="h-4 w-4 text-white" />
              <span className="text-sm font-medium text-white">For Pandits & Service Providers</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">Are you a Pandit? Join our platform</h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-8 text-base sm:text-lg">Register as a Panthulugaru and reach thousands of devotees looking for trusted pandits for their ceremonies.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/pg/signup"><Button variant="secondary" size="lg" className="bg-white text-[#E07B39] hover:bg-gray-100 shadow-xl px-8">Register as Panthulugaru</Button></Link>
              <Link href="/pg/login"><Button variant="ghost" size="lg" className="text-white border-2 border-white/40 hover:bg-white/10 px-8">Already registered? Login</Button></Link>
            </div>
            <div className="flex flex-wrap justify-center gap-6 sm:gap-8 mt-10 text-white/60 text-sm">
              <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4" /><span>Free Registration</span></div>
              <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4" /><span>Get Verified</span></div>
              <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4" /><span>Grow Your Reach</span></div>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} role="customer" redirectPath={loginRedirectPath} />
    </>
  );
}
