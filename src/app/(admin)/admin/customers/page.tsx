'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { getCustomers } from '@/lib/api/admin';
import type { Customer, PagedResponse } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Search, ChevronLeft, ChevronRight, X, Users } from 'lucide-react';

export default function CustomerListPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchDebounced, setSearchDebounced] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setSearchDebounced(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page, size: 15 };
      if (searchDebounced) params.search = searchDebounced;

      const res = await getCustomers(params as any);
      if (res.success && res.data) {
        const data = res.data as PagedResponse<Customer>;
        setCustomers(data.content);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      } else {
        toast.error(res.message || 'Failed to load customers');
      }
    } catch {
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  }, [page, searchDebounced]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  useEffect(() => {
    setPage(0);
  }, [searchDebounced]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customers</h1>
          <p className="text-sm text-gray-500 dark:text-[#E8DDD0]/60">{totalElements} registered customers</p>
        </div>
      </div>

      {/* Search Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-[#E8DDD0]/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, phone..."
                className="w-full rounded-lg border border-gray-300 dark:border-[#D4AF37]/15 bg-white dark:bg-[#241C16] pl-10 pr-4 py-2 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00] dark:focus:ring-[#D4AF37]/20 dark:focus:border-[#D4AF37] dark:placeholder:text-[#E8DDD0]/30"
              />
            </div>
            {search && (
              <Button variant="ghost" size="sm" onClick={() => setSearch('')}>
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
                  <th className="text-left font-medium text-gray-500 dark:text-[#E8DDD0]/60 px-4 py-3">Customer</th>
                  <th className="text-left font-medium text-gray-500 dark:text-[#E8DDD0]/60 px-4 py-3">Email</th>
                  <th className="text-left font-medium text-gray-500 dark:text-[#E8DDD0]/60 px-4 py-3">Phone</th>
                  <th className="text-left font-medium text-gray-500 dark:text-[#E8DDD0]/60 px-4 py-3">City</th>
                  <th className="text-left font-medium text-gray-500 dark:text-[#E8DDD0]/60 px-4 py-3">Verified</th>
                  <th className="text-left font-medium text-gray-500 dark:text-[#E8DDD0]/60 px-4 py-3">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#D4AF37]/5">
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-4 py-3"><Skeleton className="h-4 w-32" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-4 w-40" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-5 w-16" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>
                    </tr>
                  ))
                ) : customers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-400 dark:text-[#E8DDD0]/40">
                      No customers found.
                    </td>
                  </tr>
                ) : (
                  customers.map((customer) => (
                    <tr
                      key={customer.id}
                      onClick={() => router.push(`/admin/customers/${customer.id}`)}
                      className="hover:bg-gray-50 dark:hover:bg-[#241C16] cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={customer.profileImage}
                            fallback={`${customer.firstName} ${customer.lastName}`}
                            size="sm"
                          />
                          <span className="font-medium text-gray-900 dark:text-white">{customer.firstName} {customer.lastName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-[#E8DDD0]/70">{customer.email}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-[#E8DDD0]/70">{customer.phone}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-[#E8DDD0]/70">{customer.city || '-'}</td>
                      <td className="px-4 py-3">
                        {customer.isEmailVerified ? (
                          <Badge variant="green">Verified</Badge>
                        ) : (
                          <Badge variant="gold">Unverified</Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-[#E8DDD0]/60">{dayjs(customer.createdAt).format('DD MMM YYYY')}</td>
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
