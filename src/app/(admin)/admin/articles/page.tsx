'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { getArticles, updateArticleStatus } from '@/lib/api/admin';
import type { Article, PagedResponse } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Search, ChevronLeft, ChevronRight, X, Plus, Eye, ToggleLeft, ToggleRight } from 'lucide-react';

function getArticleStatusBadge(status: string) {
  switch (status) {
    case 'PUBLISHED': return <Badge variant="green">Published</Badge>;
    case 'DRAFT': return <Badge variant="gold">Draft</Badge>;
    case 'ARCHIVED': return <Badge variant="default">Archived</Badge>;
    default: return <Badge>{status}</Badge>;
  }
}

export default function ArticlesListPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchDebounced, setSearchDebounced] = useState('');
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setSearchDebounced(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page, size: 15 };
      if (statusFilter) params.status = statusFilter;

      const res = await getArticles(params as any);
      if (res.success && res.data) {
        const data = res.data as PagedResponse<Article>;
        let filtered = data.content;
        if (searchDebounced) {
          const q = searchDebounced.toLowerCase();
          filtered = filtered.filter(
            (a) => a.title.toLowerCase().includes(q) || (a.category || '').toLowerCase().includes(q)
          );
        }
        setArticles(filtered);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      } else {
        toast.error(res.message || 'Failed to load articles');
      }
    } catch {
      toast.error('Failed to load articles');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, searchDebounced]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  useEffect(() => {
    setPage(0);
  }, [statusFilter, searchDebounced]);

  const handleToggleStatus = async (article: Article) => {
    const newStatus = article.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    setTogglingId(article.id);
    try {
      const res = await updateArticleStatus(article.id, newStatus);
      if (res.success) {
        toast.success(`Article ${newStatus === 'PUBLISHED' ? 'published' : 'set to draft'}`);
        setArticles((prev) =>
          prev.map((a) => (a.id === article.id ? { ...a, status: newStatus as Article['status'] } : a))
        );
      } else {
        toast.error(res.message || 'Failed to toggle status');
      }
    } catch {
      toast.error('Failed to toggle status');
    } finally {
      setTogglingId(null);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('');
    setPage(0);
  };

  const hasFilters = search || statusFilter;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Articles</h1>
          <p className="text-sm text-gray-500">{totalElements} articles</p>
        </div>
        <Link href="/admin/articles/new">
          <Button><Plus className="h-4 w-4" /> New Article</Button>
        </Link>
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
                placeholder="Search articles..."
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
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
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
                  <th className="text-left font-medium text-gray-500 px-4 py-3">Title</th>
                  <th className="text-left font-medium text-gray-500 px-4 py-3">Category</th>
                  <th className="text-left font-medium text-gray-500 px-4 py-3">Status</th>
                  <th className="text-left font-medium text-gray-500 px-4 py-3">Views</th>
                  <th className="text-left font-medium text-gray-500 px-4 py-3">Created</th>
                  <th className="text-left font-medium text-gray-500 px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
                      ))}
                    </tr>
                  ))
                ) : articles.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-400">No articles found.</td>
                  </tr>
                ) : (
                  articles.map((article) => (
                    <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900 max-w-[250px] truncate">{article.title}</p>
                          {article.excerpt && <p className="text-xs text-gray-400 truncate max-w-[250px]">{article.excerpt}</p>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{article.category || '-'}</td>
                      <td className="px-4 py-3">{getArticleStatusBadge(article.status)}</td>
                      <td className="px-4 py-3 text-gray-600">{article.viewCount || 0}</td>
                      <td className="px-4 py-3 text-gray-500">{dayjs(article.createdAt).format('DD MMM YYYY')}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/admin/articles/${article.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(article)}
                            disabled={togglingId === article.id}
                          >
                            {article.status === 'PUBLISHED'
                              ? <ToggleRight className="h-4 w-4 text-green-600" />
                              : <ToggleLeft className="h-4 w-4 text-gray-400" />
                            }
                          </Button>
                        </div>
                      </td>
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
          <p className="text-sm text-gray-500">Page {page + 1} of {totalPages}</p>
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
