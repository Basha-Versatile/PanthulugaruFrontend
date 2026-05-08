import React from 'react';
import type { Metadata } from 'next';
import { getPhotographerBySlug } from '@/lib/api/photographers';
import { notFound } from 'next/navigation';
import { PhotographerDetailClient } from './PhotographerDetailClient';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const response = await getPhotographerBySlug(slug);
  if (!response.success || !response.data) {
    return { title: 'Photographer Not Found - Panthulu Garu' };
  }
  const ph = response.data;
  const fullName = `${ph.firstName} ${ph.lastName}`;
  return {
    title: `${fullName} - Photographer | Panthulu Garu`,
    description: `${fullName} is a professional photographer with ${ph.experience} years of experience based in ${ph.primaryCity || 'India'}.`,
  };
}

export default async function PhotographerDetailPage({ params }: Props) {
  const { slug } = await params;
  const response = await getPhotographerBySlug(slug);

  if (!response.success || !response.data) {
    notFound();
  }

  return <PhotographerDetailClient photographer={response.data} />;
}
