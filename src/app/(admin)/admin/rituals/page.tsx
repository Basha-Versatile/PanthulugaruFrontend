'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { getMasterRituals } from '@/lib/api/admin';
import type { Ritual } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Search, X, BookOpen, Image, ChevronRight } from 'lucide-react';

export default function RitualsListPage() {
  const router = useRouter();
  const [rituals, setRituals] = useState<Ritual[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchRituals = async () => {
      setLoading(true);
      try {
        const res = await getMasterRituals();
        if (res.success && res.data) {
          setRituals(res.data);
        } else {
          toast.error(res.message || 'Failed to load rituals');
        }
      } catch {
        toast.error('Failed to load rituals');
      } finally {
        setLoading(false);
      }
    };
    fetchRituals();
  }, []);

  const filteredRituals = rituals.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      (r.category || '').toLowerCase().includes(q) ||
      (r.nameLocalized?.te || '').toLowerCase().includes(q) ||
      (r.nameLocalized?.hi || '').toLowerCase().includes(q)
    );
  });

  // Group by category
  const grouped = filteredRituals.reduce<Record<string, Ritual[]>>((acc, r) => {
    const cat = r.category || 'Uncategorized';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(r);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Rituals</h1>
        <p className="text-sm text-gray-500">{rituals.length} master rituals</p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search rituals..."
                className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E07B39]/20 focus:border-[#E07B39]"
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

      {/* Rituals grouped by category */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <Skeleton key={j} className="h-16 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400">No rituals found</p>
          </CardContent>
        </Card>
      ) : (
        Object.entries(grouped).map(([category, items]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[#E07B39]" />
                {category}
                <Badge variant="saffron" className="ml-2">{items.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left font-medium text-gray-500 pb-2">Name</th>
                      <th className="text-left font-medium text-gray-500 pb-2">Sub-rituals</th>
                      <th className="text-left font-medium text-gray-500 pb-2">Active</th>
                      <th className="text-left font-medium text-gray-500 pb-2">Banner</th>
                      <th className="text-left font-medium text-gray-500 pb-2"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {items.map((ritual) => (
                      <tr
                        key={ritual.id}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => router.push(`/admin/rituals/${ritual.id}`)}
                      >
                        <td className="py-3">
                          <div className="flex items-center gap-3">
                            {ritual.image ? (
                              <img src={ritual.image} alt={ritual.name} className="h-10 w-10 rounded-lg object-cover" />
                            ) : (
                              <div className="h-10 w-10 rounded-lg bg-[#E07B39]/10 flex items-center justify-center">
                                <BookOpen className="h-5 w-5 text-[#E07B39]" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-gray-900">{ritual.name}</p>
                              {ritual.nameLocalized?.te && (
                                <p className="text-xs text-gray-400">{ritual.nameLocalized.te}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 text-gray-600">{ritual.subRituals?.length ?? 0}</td>
                        <td className="py-3">
                          {ritual.isActive ? <Badge variant="green">Active</Badge> : <Badge variant="red">Inactive</Badge>}
                        </td>
                        <td className="py-3">
                          {ritual.bannerImage ? (
                            <Badge variant="saffron"><Image className="h-3 w-3" /> Yes</Badge>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-3">
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
