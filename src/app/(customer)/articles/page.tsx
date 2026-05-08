'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, BookOpen, ChevronLeft, ChevronRight, TrendingUp, Clock, Eye, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getArticles } from '@/lib/api/articles';
import { DUMMY_ARTICLES } from '@/lib/dummyData';
import type { Article } from '@/types';

function ArticlesPageInner() {
  const searchParams = useSearchParams();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 0);
  const [totalPages, setTotalPages] = useState(0);
  const [category, setCategory] = useState(searchParams.get('category') || '');

  useEffect(() => {
    fetchArticles();
  }, [currentPage, category]);

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const params: any = { page: currentPage, size: 9, status: 'PUBLISHED' };
      if (category) params.category = category;
      const response = await getArticles(params);
      if (response.success && response.data && response.data.content?.length > 0) {
        setArticles(response.data.content);
        setTotalPages(response.data.totalPages || 0);
      } else {
        // Fallback to dummy data for demo
        const filtered = category
          ? DUMMY_ARTICLES.filter((a) => a.category === category)
          : DUMMY_ARTICLES;
        setArticles(filtered);
        setTotalPages(1);
      }
    } catch {
      const filtered = category
        ? DUMMY_ARTICLES.filter((a) => a.category === category)
        : DUMMY_ARTICLES;
      setArticles(filtered);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  const CATEGORIES = ['Rituals', 'Festivals', 'Spirituality', 'Astrology', 'Traditions'];

  // Featured article (first one)
  const featuredArticle = articles.length > 0 ? articles[0] : null;
  const remainingArticles = articles.length > 1 ? articles.slice(1) : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#121212]">
      {/* Premium Hero */}
      <div className="bg-gradient-to-br from-[#8B1A1A] via-[#6B1414] to-[#4a0e0e] text-white relative overflow-hidden">
        <div className="absolute inset-0 pattern-bg opacity-5" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#E07B39]/10 rounded-full blur-3xl -translate-y-1/2" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-[#D4A017]" />
            </div>
            <Badge className="bg-[#D4A017] text-white border-none">Knowledge Hub</Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold">Articles & Insights</h1>
          <p className="text-white/70 mt-2 max-w-xl">
            Explore ancient wisdom, learn about Hindu traditions, rituals, astrology, and spirituality from our expert writers.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category filters - Premium styled */}
        <div className="flex gap-2 mb-8 overflow-x-auto hide-scrollbar pb-2">
          <button
            onClick={() => { setCategory(''); setCurrentPage(0); }}
            className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap border transition-all ${
              !category
                ? 'bg-gradient-to-r from-[#E07B39] to-[#D4A017] text-white border-transparent shadow-lg shadow-[#E07B39]/20'
                : 'border-gray-200 text-gray-600 bg-white hover:border-[#E07B39]/30 hover:text-[#E07B39] dark:border-gray-600 dark:text-gray-300 dark:bg-[#1e1e1e]'
            }`}
          >
            All Articles
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => { setCategory(cat); setCurrentPage(0); }}
              className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap border transition-all ${
                category === cat
                  ? 'bg-gradient-to-r from-[#E07B39] to-[#D4A017] text-white border-transparent shadow-lg shadow-[#E07B39]/20'
                  : 'border-gray-200 text-gray-600 bg-white hover:border-[#E07B39]/30 hover:text-[#E07B39] dark:border-gray-600 dark:text-gray-300 dark:bg-[#1e1e1e]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-8">
            {/* Featured skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Skeleton className="h-80 rounded-2xl" />
              <div className="space-y-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <Skeleton className="h-52 rounded-t-xl" />
                  <CardContent className="p-5">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full mt-2" />
                    <Skeleton className="h-4 w-2/3 mt-1" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : articles.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center dark:bg-[#1e1e1e] dark:border-gray-700">
            <div className="h-20 w-20 rounded-2xl bg-[#E07B39]/10 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-10 w-10 text-[#E07B39]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No articles found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Try a different category or check back later for new content</p>
            {category && (
              <Button variant="outline" onClick={() => { setCategory(''); setCurrentPage(0); }}>
                Show All Articles
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Featured Article - Hero Card */}
            {featuredArticle && currentPage === 0 && (
              <div className="mb-10">
                <Link href={`/articles/${featuredArticle.slug}`}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white rounded-2xl border border-gray-200 overflow-hidden card-premium cursor-pointer group dark:bg-[#1e1e1e] dark:border-gray-700">
                    {/* Image */}
                    <div className="h-64 lg:h-auto bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
                      {featuredArticle.coverImage ? (
                        <img
                          src={featuredArticle.coverImage}
                          alt={featuredArticle.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#E07B39]/20 to-[#8B1A1A]/20 flex items-center justify-center">
                          <BookOpen className="h-20 w-20 text-[#E07B39]/30" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-[#D4A017] text-white border-none shadow-lg">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 lg:p-10 flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-3">
                        {featuredArticle.category && (
                          <Badge variant="saffron">{featuredArticle.category}</Badge>
                        )}
                        {featuredArticle.tags?.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline">{tag}</Badge>
                        ))}
                      </div>

                      <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white group-hover:text-[#E07B39] transition-colors leading-tight">
                        {featuredArticle.title}
                      </h2>

                      {featuredArticle.excerpt && (
                        <p className="text-gray-500 dark:text-gray-400 mt-3 leading-relaxed line-clamp-3">
                          {featuredArticle.excerpt}
                        </p>
                      )}

                      <div className="flex items-center gap-4 mt-6 text-sm text-gray-400 dark:text-gray-500">
                        {featuredArticle.author && (
                          <span className="font-medium text-gray-600 dark:text-gray-400">By {featuredArticle.author}</span>
                        )}
                        {featuredArticle.publishedAt && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{new Date(featuredArticle.publishedAt).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                          </div>
                        )}
                        {featuredArticle.viewCount > 0 && (
                          <div className="flex items-center gap-1">
                            <Eye className="h-3.5 w-3.5" />
                            <span>{featuredArticle.viewCount.toLocaleString()} views</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-6">
                        <span className="inline-flex items-center gap-1.5 text-[#E07B39] font-semibold group-hover:gap-2.5 transition-all">
                          Read Full Article <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Article Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(currentPage === 0 ? remainingArticles : articles).map((article) => (
                <Link key={article.id} href={`/articles/${article.slug}`}>
                  <Card className="h-full overflow-hidden card-premium cursor-pointer group">
                    {article.coverImage ? (
                      <div className="h-52 bg-gray-100 relative overflow-hidden">
                        <img
                          src={article.coverImage}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        {article.category && (
                          <div className="absolute top-3 left-3">
                            <Badge variant="saffron" className="bg-[#E07B39] text-white border-none shadow-md">
                              {article.category}
                            </Badge>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-52 bg-gradient-to-br from-[#E07B39]/15 to-[#8B1A1A]/15 flex items-center justify-center relative">
                        <BookOpen className="h-14 w-14 text-[#E07B39]/25" />
                        {article.category && (
                          <div className="absolute top-3 left-3">
                            <Badge variant="saffron">{article.category}</Badge>
                          </div>
                        )}
                      </div>
                    )}
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        {article.tags?.slice(0, 2).map((tag) => (
                          <span key={tag} className="text-[10px] px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-[#E07B39] transition-colors">
                        {article.title}
                      </h3>
                      {article.excerpt && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2 leading-relaxed">{article.excerpt}</p>
                      )}
                      <div className="flex items-center gap-3 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-400 dark:text-gray-500">
                        {article.author && <span className="font-medium text-gray-600 dark:text-gray-400">By {article.author}</span>}
                        {article.publishedAt && (
                          <span>{new Date(article.publishedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                        )}
                        {article.viewCount > 0 && (
                          <div className="flex items-center gap-1 ml-auto">
                            <Eye className="h-3 w-3" />
                            <span>{article.viewCount.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-10">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 0}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="rounded-full"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) pageNum = i;
                  else if (currentPage < 3) pageNum = i;
                  else if (currentPage > totalPages - 4) pageNum = totalPages - 5 + i;
                  else pageNum = currentPage - 2 + i;
                  return (
                    <Button
                      key={pageNum}
                      variant={pageNum === currentPage ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className="min-w-[36px] rounded-full"
                    >
                      {pageNum + 1}
                    </Button>
                  );
                })}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= totalPages - 1}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="rounded-full"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function ArticlesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-[#121212]">
        {/* Hero skeleton */}
        <div className="bg-gradient-to-br from-[#8B1A1A] to-[#4a0e0e] h-40" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-2 mb-6">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-24 rounded-full" />)}
          </div>
          <Skeleton className="h-80 rounded-2xl mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-xl" />)}
          </div>
        </div>
      </div>
    }>
      <ArticlesPageInner />
    </Suspense>
  );
}
