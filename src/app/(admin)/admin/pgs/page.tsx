'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { getAllPGs, getMasterRituals, getMasterLocations } from '@/lib/api/admin';
import type { Panthulugaru, Ritual, ServiceAreaEntry, PagedResponse } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ChevronLeft, ChevronRight, Download, X, Filter } from 'lucide-react';

function getStatusBadge(status: string) {
  switch (status) {
    case 'ACTIVE': return <Badge variant="green">Active</Badge>;
    case 'PENDING': case 'PENDING_APPROVAL': return <Badge variant="gold">Pending</Badge>;
    case 'DRAFT': return <Badge variant="default">Draft</Badge>;
    case 'REJECTED': return <Badge variant="red">Rejected</Badge>;
    default: return <Badge>{status}</Badge>;
  }
}

export default function PGListPage() {
  const router = useRouter();
  const [pgs, setPgs] = useState<Panthulugaru[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchDebounced, setSearchDebounced] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setSearchDebounced(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchPGs = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page, size: 15 };
      if (statusFilter) params.status = statusFilter;
      if (searchDebounced) params.search = searchDebounced;

      const res = await getAllPGs(params as any);
      if (res.success && res.data) {
        const data = res.data as PagedResponse<Panthulugaru>;
        setPgs(data.content);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      } else {
        toast.error(res.message || 'Failed to load PGs');
      }
    } catch {
      toast.error('Failed to load PGs');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, searchDebounced]);

  useEffect(() => {
    fetchPGs();
  }, [fetchPGs]);

  // Reset page on filter change
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Panthulugaru</h1>
          <p className="text-sm text-gray-500">{totalElements} total registered PGs</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => toast('Export feature coming soon')}>
          <Download className="h-4 w-4" /> Export
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, phone, city..."
                className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E07B39]/20 focus:border-[#E07B39]"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E07B39]/20 focus:border-[#E07B39]"
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
              <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                <tr>
                  <th className="text-left font-medium text-gray-500 px-4 py-3">Name</th>
                  <th className="text-left font-medium text-gray-500 px-4 py-3">Phone</th>
                  <th className="text-left font-medium text-gray-500 px-4 py-3">City</th>
                  <th className="text-left font-medium text-gray-500 px-4 py-3">Status</th>
                  <th className="text-left font-medium text-gray-500 px-4 py-3">Rituals</th>
                  <th className="text-left font-medium text-gray-500 px-4 py-3">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-4 py-3"><Skeleton className="h-4 w-32" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-5 w-16" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-4 w-8" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
                    </tr>
                  ))
                ) : pgs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-400">
                      No PGs found. {hasFilters && 'Try adjusting your filters.'}
                    </td>
                  </tr>
                ) : (
                  pgs.map((pg) => (
                    <tr
                      key={pg.id}
                      onClick={() => router.push(`/admin/pgs/${pg.id}`)}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900">{pg.firstName} {pg.lastName}</p>
                          <p className="text-xs text-gray-400">{pg.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{pg.phone}</td>
                      <td className="px-4 py-3 text-gray-600">{pg.primaryCity || '-'}</td>
                      <td className="px-4 py-3">{getStatusBadge(pg.status)}</td>
                      <td className="px-4 py-3 text-gray-600">{pg.rituals?.length ?? 0}</td>
                      <td className="px-4 py-3 text-gray-500">{dayjs(pg.createdAt).format('DD MMM YYYY')}</td>
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
          <p className="text-sm text-gray-500">
            Page {page + 1} of {totalPages} ({totalElements} total)
          </p>
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
