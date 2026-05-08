import React from 'react';
import type { Metadata } from 'next';
import { getArticleBySlug, getArticles } from '@/lib/api/articles';
import { notFound } from 'next/navigation';
import { ArticleDetailClient } from './ArticleDetailClient';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const response = await getArticleBySlug(slug);
  if (!response.success || !response.data) {
    return { title: 'Article Not Found - Panthulu Garu' };
  }
  const article = response.data;
  return {
    title: `${article.title} | Panthulu Garu`,
    description: article.excerpt || article.title,
    openGraph: {
      title: article.title,
      description: article.excerpt || '',
      images: article.coverImage ? [{ url: article.coverImage }] : [],
    },
  };
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;
  const response = await getArticleBySlug(slug);

  if (!response.success || !response.data) {
    notFound();
  }

  // Fetch related articles
  let relatedArticles: any[] = [];
  try {
    const relatedResponse = await getArticles({
      page: 0,
      size: 3,
      category: response.data.category || undefined,
      status: 'PUBLISHED',
    });
    if (relatedResponse.success && relatedResponse.data) {
      relatedArticles = relatedResponse.data.content?.filter((a: any) => a.id !== response.data!.id).slice(0, 3) || [];
    }
  } catch {
    // silently fail
  }

  return <ArticleDetailClient article={response.data} relatedArticles={relatedArticles} />;
}
