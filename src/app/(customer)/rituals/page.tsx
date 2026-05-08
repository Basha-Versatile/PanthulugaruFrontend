'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Search, X, ChevronRight, Sparkles, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getRitualsWithSublist } from '@/lib/api/rituals';
import { DUMMY_RITUALS } from '@/lib/dummyData';
import type { Ritual, SubRitual } from '@/types';

// Color constants
const COLORS = {
  gold: '#D4AF37',
  saffron: '#FF6B00',
  maroon: '#361E1E',
  cream: '#FDF8F0',
};

// Gradient accent colors per category for visual variety on cards
const CATEGORY_GRADIENTS: Record<string, string> = {
  'Home Ceremonies': 'from-[#361E1E] via-[#4A2828] to-[#D4AF37]',
  'Regular Pujas': 'from-[#D4AF37] via-[#FF6B00] to-[#E0983B]',
  'Life Events': 'from-[#FF6B00] via-[#D4AF37] to-[#361E1E]',
  'Remedial Pujas': 'from-[#1F0F0F] via-[#361E1E] to-[#4A2828]',
  'Homams': 'from-[#D4AF37] via-[#B8860B] to-[#8B6914]',
};

function getCategoryGradient(category?: string): string {
  if (!category) return 'from-[#361E1E] via-[#4A2828] to-[#D4AF37]';
  return CATEGORY_GRADIENTS[category] || 'from-[#361E1E] via-[#4A2828] to-[#D4AF37]';
}

export default function RitualsPage() {
  const [rituals, setRituals] = useState<Ritual[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedRitual, setSelectedRitual] = useState<Ritual | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchRituals();
  }, []);

  const fetchRituals = async () => {
    try {
      const response = await getRitualsWithSublist();
      if (response.success && response.data && response.data.length > 0) {
        setRituals(response.data);
      } else {
        // Fallback to dummy data when API returns empty
        setRituals(DUMMY_RITUALS);
      }
    } catch {
      // Fallback to dummy data on error
      setRituals(DUMMY_RITUALS);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [...new Set(rituals.map((r) => r.category).filter(Boolean))] as string[];

  const filteredRituals = rituals.filter((ritual) => {
    const matchesCategory = !selectedCategory || ritual.category === selectedCategory;
    const matchesSearch = !searchQuery ||
      ritual.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ritual.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FDF8F0] dark:bg-[#0D0907]">
      {/* ─── Premium Hero Banner ─────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Maroon gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#361E1E] via-[#1F0F0F] to-[#1F0F0F]" />

        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#FF6B00]/10 rounded-full translate-y-1/2 -translate-x-1/4" />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-[#D4AF37]/5 rounded-full -translate-x-1/2 -translate-y-1/2" />

        {/* Decorative mandala-style corner elements */}
        <div className="absolute top-4 left-4 w-24 h-24 border border-[#D4AF37]/20 rounded-full" />
        <div className="absolute top-4 left-4 w-16 h-16 border border-[#D4AF37]/15 rounded-full translate-x-1 translate-y-1" />
        <div className="absolute bottom-4 right-4 w-32 h-32 border border-[#D4AF37]/20 rounded-full" />
        <div className="absolute bottom-4 right-4 w-20 h-20 border border-[#D4AF37]/15 rounded-full translate-x-1.5 translate-y-1.5" />

        {/* Horizontal decorative line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="max-w-3xl">
            {/* Ornamental top accent */}
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-[#D4AF37] to-transparent" />
              <Sparkles className="h-4 w-4 text-[#D4AF37]" />
              <span className="text-[#D4AF37] text-sm font-medium tracking-widest uppercase">
                Sacred Traditions
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Hindu Rituals &{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#E8B84B] to-[#D4AF37]">
                Ceremonies
              </span>
            </h1>
            <p className="text-[#FDF8F0]/70 mt-4 text-base sm:text-lg max-w-xl leading-relaxed">
              Explore our comprehensive collection of sacred Hindu rituals, pujas, and ceremonies.
              Each tradition carries centuries of spiritual wisdom and divine blessings.
            </p>

            {/* Stats row */}
            <div className="flex items-center gap-6 mt-8">
              <div className="text-center">
                <p className="text-2xl font-bold text-[#D4AF37]">{rituals.length || '--'}</p>
                <p className="text-xs text-white/50 mt-0.5">Rituals</p>
              </div>
              <div className="w-px h-10 bg-white/15" />
              <div className="text-center">
                <p className="text-2xl font-bold text-[#D4AF37]">{categories.length || '--'}</p>
                <p className="text-xs text-white/50 mt-0.5">Categories</p>
              </div>
              <div className="w-px h-10 bg-white/15" />
              <div className="text-center">
                <p className="text-2xl font-bold text-[#D4AF37]">
                  {rituals.reduce((acc, r) => acc + (r.subRituals?.length || 0), 0) || '--'}
                </p>
                <p className="text-xs text-white/50 mt-0.5">Sub-Rituals</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Search Bar ──────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg border border-[#D4AF37]/10 p-2 dark:bg-[#1A1210] dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#361E1E]/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search rituals by name, description, or keyword..."
              className="w-full pl-12 pr-4 py-3.5 bg-[#FDF8F0]/50 border border-[#D4AF37]/10 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37]/40 transition-all dark:bg-[#241C16] dark:border-gray-600 dark:text-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─── Main Content ────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* ─── Categories Sidebar (Desktop) ─────────────────────────── */}
          <aside className="hidden md:block w-60 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-[#D4AF37]/10 shadow-sm p-5 sticky top-24 dark:bg-[#1A1210] dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="h-4 w-4 text-[#361E1E]" />
                <h3 className="font-semibold text-[#361E1E]">Categories</h3>
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                    !selectedCategory
                      ? 'bg-gradient-to-r from-[#361E1E] to-[#4A2828] text-white font-medium shadow-sm'
                      : 'text-gray-600 hover:bg-[#FDF8F0] hover:text-[#361E1E] dark:text-gray-400 dark:hover:bg-[#241C16]'
                  }`}
                >
                  All Rituals
                  <span className={`ml-2 text-xs ${!selectedCategory ? 'text-white/70' : 'text-gray-400'}`}>
                    ({rituals.length})
                  </span>
                </button>
                {categories.map((cat) => {
                  const count = rituals.filter((r) => r.category === cat).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                        selectedCategory === cat
                          ? 'bg-gradient-to-r from-[#361E1E] to-[#4A2828] text-white font-medium shadow-sm'
                          : 'text-gray-600 hover:bg-[#FDF8F0] hover:text-[#361E1E] dark:text-gray-400 dark:hover:bg-[#241C16]'
                      }`}
                    >
                      {cat}
                      <span className={`ml-2 text-xs ${selectedCategory === cat ? 'text-white/70' : 'text-gray-400'}`}>
                        ({count})
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Decorative divider */}
              <div className="mt-5 pt-4 border-t border-[#D4AF37]/10">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>Browse all traditions</span>
                </div>
              </div>
            </div>
          </aside>

          {/* ─── Rituals Grid ─────────────────────────────────────────── */}
          <div className="flex-1">
            {/* ── Category Filter Pills (Mobile) ───────────────────────── */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 md:hidden scrollbar-hide">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  !selectedCategory
                    ? 'bg-gradient-to-r from-[#361E1E] to-[#4A2828] text-white shadow-md shadow-[#361E1E]/20'
                    : 'bg-white border border-[#D4AF37]/20 text-gray-600 hover:border-[#D4AF37]/40 hover:text-[#361E1E] dark:bg-[#1A1210] dark:border-gray-600 dark:text-gray-400'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-[#361E1E] to-[#4A2828] text-white shadow-md shadow-[#361E1E]/20'
                      : 'bg-white border border-[#D4AF37]/20 text-gray-600 hover:border-[#D4AF37]/40 hover:text-[#361E1E] dark:bg-[#1A1210] dark:border-gray-600 dark:text-gray-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* ── Results Header ──────────────────────────────────────── */}
            {!isLoading && (
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Showing{' '}
                  <span className="font-semibold text-[#361E1E]">{filteredRituals.length}</span>{' '}
                  {filteredRituals.length === 1 ? 'ritual' : 'rituals'}
                  {selectedCategory && (
                    <span>
                      {' '}in{' '}
                      <span className="font-medium text-[#361E1E]">{selectedCategory}</span>
                    </span>
                  )}
                  {searchQuery && (
                    <span>
                      {' '}matching &ldquo;
                      <span className="font-medium text-[#361E1E]">{searchQuery}</span>
                      &rdquo;
                    </span>
                  )}
                </p>
              </div>
            )}

            {/* ── Loading Skeletons ──────────────────────────────────── */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden border-[#D4AF37]/10">
                    <div className="h-1.5 bg-gray-200" />
                    <CardContent className="p-5">
                      <Skeleton className="h-6 w-3/4 mb-3" />
                      <Skeleton className="h-4 w-1/3 mb-4" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-5/6 mb-4" />
                      <div className="flex gap-2">
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-6 w-16 rounded-full" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredRituals.length === 0 ? (
              /* ── Premium Empty State ─────────────────────────────────── */
              <div className="bg-white rounded-2xl border border-[#D4AF37]/15 p-12 sm:p-16 text-center shadow-sm dark:bg-[#1A1210] dark:border-gray-700">
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FDF8F0] to-[#F5E6D0] flex items-center justify-center">
                    <BookOpen className="h-9 w-9 text-[#361E1E]/60" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
                    <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-[#361E1E] mb-2">No rituals found</h3>
                <p className="text-gray-500 max-w-md mx-auto text-sm leading-relaxed dark:text-gray-400">
                  {searchQuery
                    ? `We couldn't find any rituals matching "${searchQuery}". Try adjusting your search terms or clearing the filter.`
                    : selectedCategory
                    ? `No rituals available in the "${selectedCategory}" category. Try selecting a different category.`
                    : 'No rituals are currently available. Please check back soon for our growing collection of sacred ceremonies.'}
                </p>
                {(searchQuery || selectedCategory) && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory(null);
                    }}
                    className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#361E1E] to-[#4A2828] text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-[#361E1E]/20 transition-all duration-200"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              /* ── Ritual Cards Grid ───────────────────────────────────── */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredRituals.map((ritual) => (
                  <Card
                    key={ritual.id}
                    className="group cursor-pointer overflow-hidden border-[#D4AF37]/10 bg-white hover:shadow-xl hover:shadow-[#361E1E]/8 hover:border-[#D4AF37]/25 transition-all duration-300 hover:-translate-y-0.5 dark:bg-[#1A1210] dark:border-gray-700"
                    onClick={() => setSelectedRitual(ritual)}
                  >
                    {/* Gradient accent bar at top */}
                    <div className={`h-1.5 bg-gradient-to-r ${getCategoryGradient(ritual.category)}`} />

                    {/* Image (if available) */}
                    {ritual.image && (
                      <div className="h-36 bg-[#FDF8F0] overflow-hidden dark:bg-[#241C16]">
                        <img
                          src={ritual.image}
                          alt={ritual.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}

                    <CardContent className="p-5">
                      {/* Title row */}
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-[#361E1E] group-hover:text-[#1F0F0F] transition-colors leading-snug">
                          {ritual.name}
                        </h3>
                        <ChevronRight className="h-4 w-4 text-[#D4AF37]/50 flex-shrink-0 mt-0.5 group-hover:text-[#D4AF37] group-hover:translate-x-0.5 transition-all" />
                      </div>

                      {/* Category badge */}
                      {ritual.category && (
                        <Badge variant="gold" className="mt-2.5 text-xs">
                          {ritual.category}
                        </Badge>
                      )}

                      {/* Description */}
                      {ritual.description && (
                        <p className="text-sm text-gray-500 mt-3 line-clamp-2 leading-relaxed dark:text-gray-400">
                          {ritual.description}
                        </p>
                      )}

                      {/* Sub-ritual badges */}
                      {ritual.subRituals && ritual.subRituals.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-[#D4AF37]/10 dark:border-gray-700">
                          <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wider">
                            Sub-Rituals
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {ritual.subRituals.slice(0, 3).map((sub) => (
                              <span
                                key={sub.id}
                                className="inline-flex items-center px-2.5 py-1 bg-[#FDF8F0] text-[#361E1E]/70 text-xs rounded-full border border-[#D4AF37]/15 font-medium dark:bg-[#241C16] dark:text-gray-300 dark:border-gray-600"
                              >
                                {sub.name}
                              </span>
                            ))}
                            {ritual.subRituals.length > 3 && (
                              <span className="inline-flex items-center px-2.5 py-1 bg-[#361E1E]/5 text-[#361E1E]/60 text-xs rounded-full font-medium">
                                +{ritual.subRituals.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Detail Modal ────────────────────────────────────────────── */}
      {selectedRitual && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedRitual(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[80vh] overflow-y-auto dark:bg-[#1A1210]">
            <button onClick={() => setSelectedRitual(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
              <X className="h-5 w-5" />
            </button>

            {/* Modal gradient accent bar */}
            <div className={`h-2 rounded-t-2xl bg-gradient-to-r ${getCategoryGradient(selectedRitual.category)}`} />

            {selectedRitual.bannerImage || selectedRitual.image ? (
              <div className="h-48 bg-[#FDF8F0] overflow-hidden">
                <img src={selectedRitual.bannerImage || selectedRitual.image} alt={selectedRitual.name} className="w-full h-full object-cover" />
              </div>
            ) : null}

            <div className="p-6">
              <h2 className="text-xl font-bold text-[#361E1E]">{selectedRitual.name}</h2>
              {selectedRitual.category && <Badge variant="gold" className="mt-2">{selectedRitual.category}</Badge>}
              {selectedRitual.description && (
                <p className="text-gray-600 mt-3 leading-relaxed dark:text-gray-400">{selectedRitual.description}</p>
              )}

              {selectedRitual.subRituals && selectedRitual.subRituals.length > 0 && (
                <div className="mt-5">
                  <h3 className="font-semibold text-[#361E1E] mb-3 flex items-center gap-2">
                    <div className="w-1 h-4 bg-gradient-to-b from-[#D4AF37] to-[#FF6B00] rounded-full" />
                    Sub-Rituals
                  </h3>
                  <div className="space-y-2">
                    {selectedRitual.subRituals.map((sub) => (
                      <div key={sub.id} className="bg-[#FDF8F0] rounded-xl p-3.5 border border-[#D4AF37]/10 hover:border-[#D4AF37]/25 transition-colors dark:bg-[#241C16]">
                        <p className="font-medium text-[#361E1E] text-sm">{sub.name}</p>
                        {sub.description && <p className="text-xs text-gray-500 mt-1 leading-relaxed dark:text-gray-400">{sub.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
