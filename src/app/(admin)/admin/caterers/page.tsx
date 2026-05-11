'use client';

import React, { useEffect, useState, useCallback } from 'react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { getAllCaterers } from '@/lib/api/caterers';
import type { Caterer, PagedResponse } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Search, ChevronLeft, ChevronRight, X, UtensilsCrossed } from 'lucide-react';

function getStatusBadge(status: string) {
  switch (status) {
    case 'ACTIVE': return <Badge variant="green">Active</Badge>;
    case 'PENDING': case 'PENDING_APPROVAL': return <Badge variant="gold">Pending</Badge>;
    case 'DRAFT': return <Badge variant="default">Draft</Badge>;
    case 'REJECTED': return <Badge variant="red">Rejected</Badge>;
    default: return <Badge>{status}</Badge>;
  }
}

export default function CaterersPage() {
  const [caterers, setCaterers] = useState<Caterer[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchDebounced, setSearchDebounced] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setSearchDebounced(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchCaterers = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page, size: 15 };
      if (searchDebounced) params.search = searchDebounced;

      const res = await getAllCaterers(params as any);
      if (res.success && res.data) {
        const data = res.data as PagedResponse<Caterer>;
        let filtered = data.content;
        if (statusFilter) {
          filtered = filtered.filter((c) => c.status === statusFilter);
        }
        setCaterers(filtered);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      } else {
        toast.error(res.message || 'Failed to load caterers');
      }
    } catch {
      toast.error('Failed to load caterers');
    } finally {
      setLoading(false);
    }
  }, [page, searchDebounced, statusFilter]);

  useEffect(() => {
    fetchCaterers();
  }, [fetchCaterers]);

  useEffect(() => {
    setPage(0);
  }, [statusFilter, searchDebounced]);

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('');
    setPage(0);
  };

  const hasFilters = search || statusFilter;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Caterers</h1>
        <p className="text-sm text-gray-500 dark:text-[#E8DDD0]/60">{totalElements} registered caterers</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-[#E8DDD0]/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by business name, phone, city..."
                className="w-full rounded-lg border border-gray-300 dark:border-[#D4AF37]/15 bg-white dark:bg-[#241C16] pl-10 pr-4 py-2 text-sm dark:text-white dark:placeholder:text-[#E8DDD0]/30 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 dark:focus:ring-[#D4AF37]/20 focus:border-[#FF6B00] dark:focus:border-[#D4AF37]"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-300 dark:border-[#D4AF37]/15 bg-white dark:bg-[#241C16] px-3 py-2 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 dark:focus:ring-[#D4AF37]/20 focus:border-[#FF6B00] dark:focus:border-[#D4AF37]"
            >
              <option value="">All Status</option>
              <option value="DRAFT">Draft</option>
              <option value="PENDING_APPROVAL">Pending</option>
              <option value="ACTIVE">Active</option>
              <option value="REJECTED">Rejected</option>
            </select>
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4" /> Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-[#241C16] border-b border-gray-200 dark:border-[#D4AF37]/10 sticky top-0">
                <tr>
                  <th className="text-left font-medium text-gray-500 dark:text-[#E8DDD0]/60 px-4 py-3">Business Name</th>
                  <th className="text-left font-medium text-gray-500 dark:text-[#E8DDD0]/60 px-4 py-3">Phone</th>
                  <th className="text-left font-medium text-gray-500 dark:text-[#E8DDD0]/60 px-4 py-3">City</th>
                  <th className="text-left font-medium text-gray-500 dark:text-[#E8DDD0]/60 px-4 py-3">Cuisine Types</th>
                  <th className="text-left font-medium text-gray-500 dark:text-[#E8DDD0]/60 px-4 py-3">Plate Range</th>
                  <th className="text-left font-medium text-gray-500 dark:text-[#E8DDD0]/60 px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#D4AF37]/5">
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
                      ))}
                    </tr>
                  ))
                ) : caterers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-400 dark:text-[#E8DDD0]/40">
                      <UtensilsCrossed className="h-8 w-8 mx-auto mb-2 text-gray-300 dark:text-[#E8DDD0]/30" />
                      No caterers found.
                    </td>
                  </tr>
                ) : (
                  caterers.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-[#241C16] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar src={c.profileImage} fallback={c.businessName} size="sm" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{c.businessName}</p>
                            <p className="text-xs text-gray-400 dark:text-[#E8DDD0]/40">{c.ownerName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-[#E8DDD0]/70">{c.phone}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-[#E8DDD0]/70">{c.primaryCity || '-'}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {c.cuisineTypes?.slice(0, 3).map((ct, i) => (
                            <Badge key={i} variant="outline" className="text-xs">{ct}</Badge>
                          ))}
                          {(c.cuisineTypes?.length ?? 0) > 3 && (
                            <Badge variant="default" className="text-xs">+{c.cuisineTypes.length - 3}</Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-[#E8DDD0]/70">
                        {c.minPlateCount && c.maxPlateCount
                          ? `${c.minPlateCount} - ${c.maxPlateCount}`
                          : '-'}
                        {c.pricePerPlate && (
                          <span className="block text-xs text-gray-400 dark:text-[#E8DDD0]/40">&#8377;{c.pricePerPlate}/plate</span>
                        )}
                      </td>
                      <td className="px-4 py-3">{getStatusBadge(c.status)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-[#E8DDD0]/60">Page {page + 1} of {totalPages}</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
