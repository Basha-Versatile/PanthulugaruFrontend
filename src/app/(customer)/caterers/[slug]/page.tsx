import React from 'react';
import type { Metadata } from 'next';
import { getCatererBySlug } from '@/lib/api/caterers';
import { notFound } from 'next/navigation';
import { CatererDetailClient } from './CatererDetailClient';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const response = await getCatererBySlug(slug);
  if (!response.success || !response.data) {
    return { title: 'Caterer Not Found - Panthulu Garu' };
  }
  const cat = response.data;
  return {
    title: `${cat.businessName} - Caterer | Panthulu Garu`,
    description: `${cat.businessName} offers ${cat.cuisineTypes?.join(', ') || 'multi-cuisine'} catering in ${cat.primaryCity || 'India'}.`,
  };
}

export default async function CatererDetailPage({ params }: Props) {
  const { slug } = await params;
  const response = await getCatererBySlug(slug);

  if (!response.success || !response.data) {
    notFound();
  }

  return <CatererDetailClient caterer={response.data} />;
}
