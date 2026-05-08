'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight, ArrowUpDown, Sparkles, MapPin, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ServiceProviderCard, ServiceProviderCardSkeleton } from '@/components/cards/ServiceProviderCard';
import type { Panthulugaru, Photographer, Caterer } from '@/types';
import { DUMMY_PANDITS, DUMMY_PHOTOGRAPHERS, DUMMY_CATERERS } from '@/lib/dummyData';

const DUMMY_DATA_MAP: Record<string, (Panthulugaru | Photographer | Caterer)[]> = {
  pandit: DUMMY_PANDITS,
  photographer: DUMMY_PHOTOGRAPHERS,
  caterer: DUMMY_CATERERS,
};

export type FilterConfig = {
  key: string;
  label: string;
  type: 'text' | 'select' | 'toggle';
  options?: { label: string; value: string }[];
};

type ServiceListingPageProps = {
  type: 'pandit' | 'photographer' | 'caterer';
  title: string;
  fetchFn: (params: any) => Promise<any>;
  filters?: FilterConfig[];
};

const heroConfig = {
  pandit: {
    gradient: 'from-[#E07B39] to-[#c96a2e]',
    description: 'Find experienced and trusted pandits for your sacred ceremonies, pujas, and religious events.',
    icon: Sparkles,
  },
  photographer: {
    gradient: 'from-blue-600 to-blue-800',
    description: 'Discover talented photographers to capture your most precious moments beautifully.',
    icon: MapPin,
  },
  caterer: {
    gradient: 'from-green-600 to-green-800',
    description: 'Browse top-rated caterers offering delicious menus for weddings, events, and celebrations.',
    icon: Users,
  },
};

const sortOptions = [
  { label: 'Relevance', value: '' },
  { label: 'Rating: High to Low', value: 'rating_desc' },
  { label: 'Rating: Low to High', value: 'rating_asc' },
  { label: 'Experience: High to Low', value: 'experience_desc' },
  { label: 'Experience: Low to High', value: 'experience_asc' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
];

function ServiceListingPageInner({ type, title, fetchFn, filters = [] }: ServiceListingPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [items, setItems] = useState<(Panthulugaru | Photographer | Caterer)[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 0);
  const [sortBy, setSortBy] = useState('');

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [filterValues, setFilterValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    filters.forEach((f) => {
      const val = searchParams.get(f.key);
      if (val) initial[f.key] = val;
    });
    return initial;
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const fetchData = useCallback(async (page: number) => {
    setIsLoading(true);
    try {
      const params: Record<string, any> = { page, size: 12 };
      if (searchQuery.trim()) params.search = searchQuery.trim();
      Object.entries(filterValues).forEach(([key, value]) => {
        if (value) params[key] = value;
      });
      if (sortBy) params.sort = sortBy;

      const response = await fetchFn(params);
      if (response.success && response.data && response.data.content?.length > 0) {
        setItems(response.data.content);
        setTotalPages(response.data.totalPages || 0);
        setTotalElements(response.data.totalElements || 0);
      } else {
        // Fallback to dummy data for demo
        const dummyItems = DUMMY_DATA_MAP[type] || [];
        setItems(dummyItems);
        setTotalPages(1);
        setTotalElements(dummyItems.length);
      }
    } catch {
      // Fallback to dummy data for demo
      const dummyItems = DUMMY_DATA_MAP[type] || [];
      setItems(dummyItems);
      setTotalPages(1);
      setTotalElements(dummyItems.length);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn, searchQuery, filterValues, sortBy]);

  useEffect(() => {
    fetchData(currentPage);
  }, [fetchData, currentPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchData(0);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(0);
  };

  const clearFilters = () => {
    setFilterValues({});
    setSearchQuery('');
    setCurrentPage(0);
  };

  const hasActiveFilters = searchQuery || Object.values(filterValues).some(Boolean);

  const getSlugLink = (item: any) => {
    const slug = item.slug || item.id;
    if (type === 'pandit') return `/pandits/${slug}`;
    if (type === 'photographer') return `/photographers/${slug}`;
    return `/caterers/${slug}`;
  };

  const hero = heroConfig[type];
  const HeroIcon = hero.icon;

  return (
    <div className="min-h-screen bg-cream dark:bg-[#121212]">
      {/* Premium Hero Banner */}
      <div className={`relative bg-linear-to-r ${hero.gradient} overflow-hidden`}>
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/4" />
          <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="flex items-start gap-4">
            <div className="hidden sm:flex items-center justify-center w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl shrink-0">
              <HeroIcon className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                {title}
              </h1>
              <p className="text-white/80 mt-2 max-w-2xl text-sm sm:text-base leading-relaxed">
                {hero.description}
              </p>
              <div className="mt-4 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm text-white font-medium">
                <Users className="h-4 w-4" />
                {isLoading ? (
                  <span className="inline-block w-16 h-4 bg-white/30 rounded animate-pulse" />
                ) : (
                  <span>{totalElements} {type}{totalElements !== 1 ? 's' : ''} available</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search bar and controls */}
        <div className="flex flex-col gap-4 mb-6 -mt-6 relative z-10">
          {/* Search bar card */}
          <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-lg shadow-black/5 dark:shadow-black/20 border border-gray-100 dark:border-gray-700 p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-saffron" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search ${type}s by name, location...`}
                    className="w-full pl-12 pr-4 py-3 bg-cream border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-saffron/30 focus:border-saffron transition-all placeholder:text-gray-400 dark:bg-[#2a2a2a] dark:border-gray-600 dark:text-white dark:placeholder:text-gray-500"
                  />
                </div>
                <Button type="submit" variant="primary" size="md" className="rounded-xl px-6 bg-saffron hover:bg-[#c96a2e] shadow-md shadow-saffron/20">
                  Search
                </Button>
              </form>

              {filters.length > 0 && (
                <Button
                  variant="outline"
                  size="md"
                  className="md:hidden rounded-xl border-gray-200"
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                >
                  <SlidersHorizontal className="h-4 w-4 mr-1.5" />
                  Filters
                </Button>
              )}
            </div>
          </div>

          {/* Sort and result info bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isLoading ? (
                <span className="inline-block w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              ) : (
                <>
                  Showing <span className="font-semibold text-gray-800 dark:text-gray-200">{items.length}</span> of{' '}
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{totalElements}</span> results
                  {currentPage > 0 && (
                    <span className="text-gray-400 dark:text-gray-500"> &middot; Page {currentPage + 1} of {totalPages}</span>
                  )}
                </>
              )}
            </p>

            <div className="relative flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(0);
                }}
                className="appearance-none bg-transparent text-sm text-gray-600 dark:text-gray-300 font-medium pr-6 py-1 cursor-pointer focus:outline-none hover:text-saffron transition-colors"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.value ? `Sort by: ${opt.label}` : 'Sort by: Relevance'}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Desktop filters sidebar */}
          {filters.length > 0 && (
            <aside className="hidden md:block w-64 shrink-0">
              <div className="bg-white dark:bg-[#1e1e1e] rounded-xl border border-gray-200 dark:border-gray-700 p-4 sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Filters</h3>
                  {hasActiveFilters && (
                    <button onClick={clearFilters} className="text-xs text-saffron hover:underline">
                      Clear all
                    </button>
                  )}
                </div>
                <div className="space-y-4">
                  {filters.map((filter) => (
                    <div key={filter.key}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        {filter.label}
                      </label>
                      {filter.type === 'select' && filter.options ? (
                        <select
                          value={filterValues[filter.key] || ''}
                          onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/20 focus:border-saffron dark:bg-[#2a2a2a] dark:border-gray-600 dark:text-white"
                        >
                          <option value="">All</option>
                          {filter.options.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      ) : filter.type === 'toggle' ? (
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filterValues[filter.key] === 'true'}
                            onChange={(e) => handleFilterChange(filter.key, e.target.checked ? 'true' : '')}
                            className="w-4 h-4 text-saffron border-gray-300 rounded focus:ring-saffron"
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-400">Show only {filter.label.toLowerCase()}</span>
                        </label>
                      ) : (
                        <Input
                          value={filterValues[filter.key] || ''}
                          onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                          placeholder={`Filter by ${filter.label.toLowerCase()}`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          )}

          {/* Mobile filters dropdown */}
          {showMobileFilters && filters.length > 0 && (
            <div className="fixed inset-0 z-50 md:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
              <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-[#1e1e1e] rounded-t-2xl p-6 max-h-[70vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Filters</h3>
                  <button onClick={() => setShowMobileFilters(false)}>
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
                <div className="space-y-4">
                  {filters.map((filter) => (
                    <div key={filter.key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        {filter.label}
                      </label>
                      {filter.type === 'select' && filter.options ? (
                        <select
                          value={filterValues[filter.key] || ''}
                          onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/20 focus:border-saffron"
                        >
                          <option value="">All</option>
                          {filter.options.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      ) : filter.type === 'toggle' ? (
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filterValues[filter.key] === 'true'}
                            onChange={(e) => handleFilterChange(filter.key, e.target.checked ? 'true' : '')}
                            className="w-4 h-4 text-saffron border-gray-300 rounded focus:ring-saffron"
                          />
                          <span className="text-sm text-gray-600">{filter.label}</span>
                        </label>
                      ) : (
                        <Input
                          value={filterValues[filter.key] || ''}
                          onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                          placeholder={filter.label}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-6">
                  <Button variant="outline" className="flex-1" onClick={clearFilters}>
                    Clear
                  </Button>
                  <Button variant="primary" className="flex-1" onClick={() => setShowMobileFilters(false)}>
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Results grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ServiceProviderCardSkeleton key={i} />
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-8 sm:p-16 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-cream rounded-full mb-5">
                  <Search className="h-9 w-9 text-saffron" />
                </div>
                <h3 className="text-xl font-bold text-maroon mb-2">No {type}s found</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  We couldn&apos;t find any {type}s matching your criteria. Try broadening your search or adjusting the filters.
                </p>
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="rounded-xl border-saffron text-saffron hover:bg-saffron/5"
                  >
                    <X className="h-4 w-4 mr-1.5" />
                    Clear All Filters
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {items.map((item) => (
                    <ServiceProviderCard
                      key={item.id}
                      type={type}
                      data={item}
                      onView={() => router.push(getSlugLink(item))}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center mt-10 mb-4">
                    <div className="inline-flex items-center gap-1.5 bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 px-2 py-2">
                      <button
                        disabled={currentPage === 0}
                        onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                        className="flex items-center justify-center w-10 h-10 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-cream hover:text-saffron disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-500 transition-colors"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>

                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum: number;
                        if (totalPages <= 5) {
                          pageNum = i;
                        } else if (currentPage < 3) {
                          pageNum = i;
                        } else if (currentPage > totalPages - 4) {
                          pageNum = totalPages - 5 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`flex items-center justify-center min-w-10 h-10 rounded-xl text-sm font-semibold transition-all ${
                              pageNum === currentPage
                                ? 'bg-saffron text-white shadow-md shadow-saffron/25'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-cream hover:text-saffron dark:hover:text-[#D4A017]'
                            }`}
                          >
                            {pageNum + 1}
                          </button>
                        );
                      })}

                      <button
                        disabled={currentPage >= totalPages - 1}
                        onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                        className="flex items-center justify-center w-10 h-10 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-cream hover:text-saffron disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-500 transition-colors"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ServiceListingPage(props: ServiceListingPageProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cream dark:bg-[#121212]">
        <div className={`relative bg-linear-to-r ${heroConfig[props.type].gradient} overflow-hidden`}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/4" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            <div className="flex items-start gap-4">
              <div className="hidden sm:flex items-center justify-center w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl shrink-0">
                <div className="w-7 h-7 bg-white/40 rounded animate-pulse" />
              </div>
              <div>
                <div className="h-9 bg-white/30 rounded-lg animate-pulse w-56" />
                <div className="h-4 bg-white/20 rounded animate-pulse w-80 mt-3" />
                <div className="mt-4 h-8 bg-white/20 rounded-full animate-pulse w-40" />
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-lg shadow-black/5 border border-gray-100 dark:border-gray-700 p-4 -mt-6 relative z-10 mb-6">
            <div className="h-12 bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <ServiceProviderCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    }>
      <ServiceListingPageInner {...props} />
    </Suspense>
  );
}
