'use client';

import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { DeathAnniversary } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Search, X, Heart, ChevronLeft, ChevronRight, Calendar, Bell } from 'lucide-react';

export default function DeathAnniversariesPage() {
  const [records, setRecords] = useState<DeathAnniversary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const pageSize = 15;

  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      try {
        // Use admin endpoint or public endpoint to fetch all records
        const response = await apiClient.get(ENDPOINTS.DEATH_ANNIVERSARY + '/all');
        const res = response.data;
        if (res.success && res.data) {
          setRecords(Array.isArray(res.data) ? res.data : res.data.content || []);
        } else {
          // Fallback: Try without /all suffix
          const fallbackRes = await apiClient.get(ENDPOINTS.DEATH_ANNIVERSARY);
          if (fallbackRes.data.success && fallbackRes.data.data) {
            setRecords(Array.isArray(fallbackRes.data.data) ? fallbackRes.data.data : []);
          }
        }
      } catch {
        // Silently handle - page still renders with empty state
        setRecords([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  const filtered = records.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      r.deceasedName.toLowerCase().includes(q) ||
      r.relationship.toLowerCase().includes(q) ||
      (r.gothram || '').toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Death Anniversaries</h1>
        <p className="text-sm text-gray-500 dark:text-[#E8DDD0]/60">{records.length} records</p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-[#E8DDD0]/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                placeholder="Search by name, relationship, gothram..."
                className="w-full rounded-lg border border-gray-300 dark:border-[#D4AF37]/15 bg-white dark:bg-[#241C16] pl-10 pr-4 py-2 text-sm dark:text-white dark:placeholder:text-[#E8DDD0]/30 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 dark:focus:ring-[#D4AF37]/20 focus:border-[#FF6B00] dark:focus:border-[#D4AF37]"
              />
            </div>
            {search && (
              <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setPage(0); }}>
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
                  <th className="text-left font-medium text-gray-500 dark:text-[#E8DDD0]/60 px-4 py-3">Deceased Name</th>
                  <th className="text-left font-medium text-gray-500 dark:text-[#E8DDD0]/60 px-4 py-3">Relationship</th>
                  <th className="text-left font-medium text-gray-500 dark:text-[#E8DDD0]/60 px-4 py-3">Death Date</th>
                  <th className="text-left font-medium text-gray-500 dark:text-[#E8DDD0]/60 px-4 py-3">Tithi</th>
                  <th className="text-left font-medium text-gray-500 dark:text-[#E8DDD0]/60 px-4 py-3">Gothram</th>
                  <th className="text-left font-medium text-gray-500 dark:text-[#E8DDD0]/60 px-4 py-3">Upcoming Date</th>
                  <th className="text-left font-medium text-gray-500 dark:text-[#E8DDD0]/60 px-4 py-3">Reminder</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#D4AF37]/5">
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 7 }).map((_, j) => (
                        <td key={j} className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
                      ))}
                    </tr>
                  ))
                ) : paged.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-400 dark:text-[#E8DDD0]/40">
                      <Heart className="h-8 w-8 mx-auto mb-2 text-gray-300 dark:text-[#E8DDD0]/30" />
                      No death anniversary records found.
                    </td>
                  </tr>
                ) : (
                  paged.map((record) => {
                    const nextAnniversary = record.upcomingAnniversaries?.[0];
                    return (
                      <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-[#241C16] transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900 dark:text-white">{record.deceasedName}</p>
                          <p className="text-xs text-gray-400 dark:text-[#E8DDD0]/40">ID: {record.customerId.slice(0, 8)}...</p>
                        </td>
                        <td className="px-4 py-3 text-gray-600 dark:text-[#E8DDD0]/70">{record.relationship}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-[#E8DDD0]/70">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-gray-400 dark:text-[#E8DDD0]/40" />
                            {dayjs(record.deathDate).format('DD MMM YYYY')}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {record.deathTithi ? (
                            <div>
                              <p className="text-xs text-gray-600 dark:text-[#E8DDD0]/70">{record.deathTithi.tithiName}</p>
                              <p className="text-xs text-gray-400 dark:text-[#E8DDD0]/40">{record.deathTithi.paksham}, {record.deathTithi.lunarMonth}</p>
                            </div>
                          ) : (
                            <span className="text-gray-400 dark:text-[#E8DDD0]/40">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-600 dark:text-[#E8DDD0]/70">{record.gothram || '-'}</td>
                        <td className="px-4 py-3">
                          {nextAnniversary ? (
                            <div>
                              <p className="text-sm text-gray-900 dark:text-white">{dayjs(nextAnniversary.gregorianDate).format('DD MMM YYYY')}</p>
                              <p className="text-xs text-gray-400 dark:text-[#E8DDD0]/40">{nextAnniversary.dayOfWeek}</p>
                            </div>
                          ) : (
                            <span className="text-gray-400 dark:text-[#E8DDD0]/40">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {record.reminderEnabled ? (
                            <Badge variant="green"><Bell className="h-3 w-3" /> {record.reminderDaysBefore}d before</Badge>
                          ) : (
                            <Badge variant="default">Off</Badge>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-[#E8DDD0]/60">Page {page + 1} of {totalPages} ({filtered.length} total)</p>
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
