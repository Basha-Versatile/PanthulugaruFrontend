'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Eye, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { Article } from '@/types';

type Props = {
  article: Article;
  relatedArticles: Article[];
};

export function ArticleDetailClient({ article, relatedArticles }: Props) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Link href="/articles" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#E07B39] transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Articles
          </Link>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cover image */}
        {article.coverImage && (
          <div className="rounded-2xl overflow-hidden mb-8 aspect-video bg-gray-100">
            <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Meta */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          {article.category && <Badge variant="saffron">{article.category}</Badge>}
          {article.tags?.map((tag) => (
            <Badge key={tag} variant="outline">{tag}</Badge>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">{article.title}</h1>

        {/* Author & date */}
        <div className="flex items-center gap-4 mt-4 text-sm text-gray-500 flex-wrap">
          {article.author && (
            <div className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              <span>{article.author}</span>
            </div>
          )}
          {article.publishedAt && (
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>{new Date(article.publishedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Eye className="h-4 w-4" />
            <span>{article.viewCount} views</span>
          </div>
        </div>

        {/* Content */}
        <div
          className="mt-8 prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-[#E07B39] prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Related articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-16 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedArticles.map((ra) => (
                <Link key={ra.id} href={`/articles/${ra.slug}`}>
                  <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
                    {ra.coverImage && (
                      <div className="h-32 bg-gray-100">
                        <img src={ra.coverImage} alt={ra.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <CardContent className="p-3">
                      <h3 className="font-medium text-gray-900 text-sm line-clamp-2">{ra.title}</h3>
                      <p className="text-xs text-gray-400 mt-1">
                        {ra.publishedAt && new Date(ra.publishedAt).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
