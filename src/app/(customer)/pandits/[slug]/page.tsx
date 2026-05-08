import React from 'react';
import type { Metadata } from 'next';
import { getPanditBySlug } from '@/lib/api/pandits';
import { ProfilePageClient } from '@/components/pandits/ProfilePageClient';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const response = await getPanditBySlug(slug);
  if (!response.success || !response.data) {
    return { title: 'Pandit Not Found - Panthulu Garu' };
  }
  const pandit = response.data;
  const fullName = `${pandit.firstName} ${pandit.lastName}`;
  return {
    title: `${fullName} - Pandit Profile | Panthulu Garu`,
    description: `${fullName} is a verified pandit with ${pandit.experience} years of experience in ${pandit.primaryCity || 'India'}. Book for Hindu ceremonies and rituals.`,
    openGraph: {
      title: `${fullName} - Pandit Profile`,
      description: pandit.aboutMe || `Experienced pandit available for ceremonies`,
      images: pandit.profileImage ? [{ url: pandit.profileImage }] : [],
    },
  };
}

export default async function PanditDetailPage({ params }: Props) {
  const { slug } = await params;
  const response = await getPanditBySlug(slug);

  if (!response.success || !response.data) {
    notFound();
  }

  return <ProfilePageClient pandit={response.data} />;
}
