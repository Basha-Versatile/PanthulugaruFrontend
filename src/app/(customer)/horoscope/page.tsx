'use client';

import React, { useState } from 'react';
import { Star, Sun, Moon, Sparkles, Flame, Droplets, Wind, Mountain, Clock, Calendar, ArrowRight, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { createHoroscopeProfile, quickLookup } from '@/lib/api/horoscope';
import { ZODIAC_SIGNS } from '@/lib/dummyData';
import type { Horoscope } from '@/types';
import toast from 'react-hot-toast';

/* ── element color helpers ─────────────────────────────────────────── */

const ELEMENT_CONFIG: Record<string, { icon: React.ReactNode; bg: string; text: string; border: string }> = {
  Fire: {
    icon: <Flame className="h-3.5 w-3.5" />,
    bg: 'bg-red-50',
    text: 'text-red-600',
    border: 'border-red-200',
  },
  Earth: {
    icon: <Mountain className="h-3.5 w-3.5" />,
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
  },
  Air: {
    icon: <Wind className="h-3.5 w-3.5" />,
    bg: 'bg-sky-50',
    text: 'text-sky-600',
    border: 'border-sky-200',
  },
  Water: {
    icon: <Droplets className="h-3.5 w-3.5" />,
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'border-blue-200',
  },
};

/* ── daily horoscope teasers (static dummy) ────────────────────────── */

const DAILY_TEASERS = [
  {
    sign: 'Mesha',
    english: 'Aries',
    symbol: '\u2648',
    prediction:
      'A day of new beginnings. The alignment of Mars brings courage and clarity. Financial prospects look strong -- trust your instincts in important decisions today.',
  },
  {
    sign: 'Vrishabha',
    english: 'Taurus',
    symbol: '\u2649',
    prediction:
      'Venus favors relationships and creativity. Expect a meaningful conversation with a loved one. Career matters settle in your favor by evening.',
  },
  {
    sign: 'Simha',
    english: 'Leo',
    symbol: '\u264C',
    prediction:
      'The Sun empowers your ambitions today. Leadership opportunities arise -- step forward with confidence. Health and vitality are at a peak this week.',
  },
  {
    sign: 'Vrischika',
    english: 'Scorpio',
    symbol: '\u264F',
    prediction:
      'Transformative energy surrounds you. Deep insights come through meditation or quiet reflection. A surprise financial gain may arrive unexpectedly.',
  },
];

/* ── main component ────────────────────────────────────────────────── */

export default function HoroscopePage() {
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [timeOfBirth, setTimeOfBirth] = useState('');
  const [placeOfBirth, setPlaceOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [gothram, setGothram] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Horoscope | null>(null);
  const [quickResult, setQuickResult] = useState<{ nakshatra: string; rashi: string; lagna: string } | null>(null);

  const handleQuickLookup = async () => {
    if (!dateOfBirth || !timeOfBirth || !placeOfBirth) {
      toast.error('Please fill in date, time, and place of birth');
      return;
    }
    setSubmitting(true);
    try {
      const response = await quickLookup({ dateOfBirth, timeOfBirth, placeOfBirth });
      if (response.success && response.data) {
        setQuickResult(response.data);
        toast.success('Quick lookup complete');
      } else {
        toast.error(response.message || 'Failed to calculate');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFullProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !dateOfBirth || !timeOfBirth || !placeOfBirth || !gender) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSubmitting(true);
    try {
      const response = await createHoroscopeProfile({
        name,
        dateOfBirth,
        timeOfBirth,
        placeOfBirth,
        gender,
        gothram: gothram || undefined,
      });
      if (response.success && response.data) {
        setResult(response.data);
        toast.success('Horoscope profile created');
      } else {
        toast.error(response.message || 'Failed to create profile');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] dark:bg-[#121212]">
      {/* ═══════════════════════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800">
        {/* celestial decorative elements */}
        <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
          {/* large glowing orb top-right */}
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-purple-500/20 blur-3xl" />
          {/* small glowing orb bottom-left */}
          <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-indigo-400/15 blur-3xl" />
          {/* scattered stars */}
          <Star className="absolute top-12 left-[12%] h-4 w-4 text-yellow-300/40 animate-pulse" />
          <Star className="absolute top-20 right-[18%] h-3 w-3 text-yellow-200/30 animate-pulse [animation-delay:0.5s]" />
          <Star className="absolute bottom-16 left-[30%] h-3.5 w-3.5 text-yellow-300/25 animate-pulse [animation-delay:1s]" />
          <Star className="absolute top-32 left-[55%] h-2.5 w-2.5 text-white/20 animate-pulse [animation-delay:1.5s]" />
          <Star className="absolute bottom-24 right-[25%] h-3 w-3 text-yellow-200/30 animate-pulse [animation-delay:0.8s]" />
          <Sparkles className="absolute top-16 right-[40%] h-5 w-5 text-[#D4A017]/30 animate-pulse [animation-delay:0.3s]" />
          <Moon className="absolute bottom-10 right-[10%] h-8 w-8 text-purple-300/20 rotate-[-30deg]" />
          {/* thin decorative ring */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-white/[0.03]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          {/* icon cluster */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sun className="h-7 w-7 text-[#D4A017]" />
            <div className="h-10 w-10 rounded-full bg-[#D4A017]/20 flex items-center justify-center ring-2 ring-[#D4A017]/30">
              <Star className="h-5 w-5 text-[#D4A017]" />
            </div>
            <Moon className="h-7 w-7 text-purple-300" />
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Vedic Horoscope &amp; <span className="text-[#D4A017]">Jyotish</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-indigo-200 leading-relaxed">
            Unlock the wisdom of Vedic astrology. Discover your Nakshatra, Rashi, Lagna, and
            planetary positions based on precise birth details and ancient calculations.
          </p>

          {/* quick stat pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-sm px-4 py-1.5 text-sm text-white/90 border border-white/10">
              <Star className="h-3.5 w-3.5 text-[#D4A017]" /> 12 Rashis
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-sm px-4 py-1.5 text-sm text-white/90 border border-white/10">
              <Moon className="h-3.5 w-3.5 text-purple-300" /> 27 Nakshatras
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-sm px-4 py-1.5 text-sm text-white/90 border border-white/10">
              <Sun className="h-3.5 w-3.5 text-orange-300" /> 9 Grahas
            </span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FORM + RESULTS  (two-column layout)
      ═══════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* ── LEFT: Zodiac Grid (3 cols) ─────────────────────────── */}
          <div className="lg:col-span-3 space-y-8">
            {/* section heading */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-[#D4A017]" />
                Dwadasha Rashi <span className="text-[#8B1A1A]">- 12 Zodiac Signs</span>
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Explore the twelve Vedic zodiac signs, their ruling elements, and date ranges.
              </p>
            </div>

            {/* zodiac grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {ZODIAC_SIGNS.map((sign) => {
                const el = ELEMENT_CONFIG[sign.element] || ELEMENT_CONFIG.Fire;
                return (
                  <div
                    key={sign.name}
                    className="group relative bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg hover:border-[#D4A017]/40 transition-all duration-300 p-4 text-center cursor-default"
                  >
                    {/* element badge top-right */}
                    <span
                      className={`absolute top-2 right-2 inline-flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${el.bg} ${el.text} ${el.border}`}
                    >
                      {el.icon}
                      {sign.element}
                    </span>

                    {/* symbol */}
                    <div className="text-4xl sm:text-5xl leading-none mt-2 mb-2 group-hover:scale-110 transition-transform duration-300">
                      {sign.symbol}
                    </div>

                    {/* sanskrit name */}
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{sign.name}</p>
                    {/* english name */}
                    <p className="text-xs text-[#8B1A1A] font-medium">{sign.english}</p>
                    {/* date range */}
                    <p className="mt-1.5 text-[11px] text-gray-400 dark:text-gray-500 flex items-center justify-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {sign.dates}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── RIGHT: Form card (2 cols) ──────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">
            {/* premium form card */}
            <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-100 dark:border-gray-700 shadow-lg overflow-hidden">
              {/* card accent bar */}
              <div className="h-1.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-[#D4A017]" />

              <div className="p-6">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow">
                    <Star className="h-4.5 w-4.5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Birth Details</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Generate your Vedic birth chart</p>
                  </div>
                </div>

                <form onSubmit={handleFullProfile} className="space-y-4">
                  <Input
                    label="Full Name *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter full name"
                    required
                  />
                  <Input
                    label="Date of Birth *"
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    required
                  />
                  <Input
                    label="Time of Birth *"
                    type="time"
                    value={timeOfBirth}
                    onChange={(e) => setTimeOfBirth(e.target.value)}
                    required
                  />
                  <Input
                    label="Place of Birth *"
                    value={placeOfBirth}
                    onChange={(e) => setPlaceOfBirth(e.target.value)}
                    placeholder="City, State"
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender *</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 dark:bg-[#2a2a2a] dark:border-gray-600 dark:text-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E07B39]/20 focus:border-[#E07B39]"
                      required
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <Input
                    label="Gothram (optional)"
                    value={gothram}
                    onChange={(e) => setGothram(e.target.value)}
                    placeholder="Family gothram"
                  />

                  <div className="flex gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleQuickLookup}
                      isLoading={submitting && !result}
                      className="flex-1"
                    >
                      <Sparkles className="h-4 w-4 mr-1.5" />
                      Quick Lookup
                    </Button>
                    <Button type="submit" variant="primary" isLoading={submitting} className="flex-1">
                      Full Profile
                    </Button>
                  </div>
                </form>
              </div>
            </div>

            {/* ── Results cards ───────────────────────────────────── */}
            {/* Quick result */}
            {quickResult && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-[#D4A017]" />
                    Quick Lookup Result
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-[#E07B39]/5 rounded-xl">
                      <Moon className="h-6 w-6 text-[#E07B39] mx-auto mb-2" />
                      <p className="text-xs text-gray-500">Nakshatra</p>
                      <p className="font-semibold text-gray-900 mt-1">{quickResult.nakshatra || 'N/A'}</p>
                    </div>
                    <div className="text-center p-4 bg-[#8B1A1A]/5 rounded-xl">
                      <Sun className="h-6 w-6 text-[#8B1A1A] mx-auto mb-2" />
                      <p className="text-xs text-gray-500">Rashi</p>
                      <p className="font-semibold text-gray-900 mt-1">{quickResult.rashi || 'N/A'}</p>
                    </div>
                    <div className="text-center p-4 bg-[#D4A017]/10 rounded-xl">
                      <Star className="h-6 w-6 text-[#D4A017] mx-auto mb-2" />
                      <p className="text-xs text-gray-500">Lagna</p>
                      <p className="font-semibold text-gray-900 mt-1">{quickResult.lagna || 'N/A'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Full result */}
            {result && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-[#D4A017]" />
                    Full Horoscope Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 dark:bg-[#2a2a2a] rounded-lg p-3">
                      <p className="text-xs text-gray-500">Nakshatra</p>
                      <p className="font-medium">{result.nakshatra || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-[#2a2a2a] rounded-lg p-3">
                      <p className="text-xs text-gray-500">Rashi</p>
                      <p className="font-medium">{result.rashi || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-[#2a2a2a] rounded-lg p-3">
                      <p className="text-xs text-gray-500">Lagna</p>
                      <p className="font-medium">{result.lagna || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-[#2a2a2a] rounded-lg p-3">
                      <p className="text-xs text-gray-500">Gothram</p>
                      <p className="font-medium">{result.gothram || 'N/A'}</p>
                    </div>
                  </div>

                  {result.doshas && result.doshas.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Doshas</p>
                      <div className="flex flex-wrap gap-2">
                        {result.doshas.map((d, i) => (
                          <Badge key={i} variant="red">
                            {d}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.predictions && Object.keys(result.predictions).length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Predictions</p>
                      <div className="space-y-2">
                        {Object.entries(result.predictions).map(([key, value]) => (
                          <div key={key} className="bg-gray-50 dark:bg-[#2a2a2a] rounded-lg p-3">
                            <p className="text-xs text-gray-500 capitalize">{key}</p>
                            <p className="text-sm text-gray-700">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.planetaryPositions && Object.keys(result.planetaryPositions).length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Planetary Positions</p>
                      <div className="grid grid-cols-3 gap-2">
                        {Object.entries(result.planetaryPositions).map(([planet, position]) => (
                          <div key={planet} className="bg-[#E07B39]/5 rounded-lg p-2 text-center">
                            <p className="text-xs text-gray-500 capitalize">{planet}</p>
                            <p className="text-sm font-medium text-[#E07B39]">{position}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* empty state */}
            {!quickResult && !result && (
              <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-dashed border-gray-200 dark:border-gray-600 p-8 text-center">
                <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                  <Eye className="h-6 w-6 text-indigo-500" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Your birth chart will appear here</p>
                <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                  Fill in your birth details and click Quick Lookup or Full Profile
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          DAILY HOROSCOPE TEASERS
      ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-b from-[#FFF8F0] to-white dark:from-[#1a1a1a] dark:to-[#121212] border-t border-gray-100 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          {/* section header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-[#D4A017]/10 text-[#D4A017] text-xs font-semibold px-3 py-1 rounded-full mb-3">
              <Sun className="h-3.5 w-3.5" />
              TODAY&apos;S INSIGHTS
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Daily Horoscope <span className="text-[#8B1A1A]">Highlights</span>
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
              A glimpse into what the stars have in store. Generate your full profile for personalized Vedic predictions.
            </p>
          </div>

          {/* teaser cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {DAILY_TEASERS.map((t) => (
              <div
                key={t.sign}
                className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
              >
                {/* top accent */}
                <div className="h-1 bg-gradient-to-r from-[#D4A017] via-[#E07B39] to-[#8B1A1A]" />

                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{t.symbol}</span>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">{t.sign}</p>
                      <p className="text-xs text-[#8B1A1A]">{t.english}</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-4">{t.prediction}</p>

                  <div className="mt-4 flex items-center text-xs font-medium text-[#E07B39] cursor-pointer group">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    Today&apos;s Reading
                    <ArrowRight className="h-3.5 w-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
