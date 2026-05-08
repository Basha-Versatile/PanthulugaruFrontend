'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Star, BadgeCheck, Clock, Camera, UtensilsCrossed, ArrowRight, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { Panthulugaru, Photographer, Caterer } from '@/types';

type ServiceProviderCardProps = {
  type: 'pandit' | 'photographer' | 'caterer';
  data: Panthulugaru | Photographer | Caterer;
  onView?: () => void;
};

function getName(type: string, data: any): string {
  if (type === 'caterer') return (data as Caterer).businessName || (data as Caterer).ownerName;
  return `${data.firstName} ${data.lastName}`;
}

function getSlug(data: any): string {
  return data.slug || data.id;
}

function getLocation(data: any): string {
  return [data.primaryCity, data.primaryState].filter(Boolean).join(', ') || 'India';
}

function getSpecialties(type: string, data: any): string[] {
  if (type === 'pandit') return (data as Panthulugaru).specializations?.slice(0, 3) || [];
  if (type === 'photographer') return (data as Photographer).specializations?.slice(0, 3) || [];
  return (data as Caterer).cuisineTypes?.slice(0, 3) || [];
}

function getProfileLink(type: string, slug: string): string {
  if (type === 'pandit') return `/pandits/${slug}`;
  if (type === 'photographer') return `/photographers/${slug}`;
  return `/caterers/${slug}`;
}

function getPrice(type: string, data: any): string | null {
  if (type === 'pandit') {
    const p = data as Panthulugaru;
    return p.minimumPricing ? `From ₹${p.minimumPricing.toLocaleString()}` : null;
  }
  if (type === 'photographer') {
    const p = data as Photographer;
    return p.pricePerEvent ? `₹${p.pricePerEvent.toLocaleString()}/event` : null;
  }
  const c = data as Caterer;
  return c.pricePerPlate ? `₹${c.pricePerPlate}/plate` : null;
}

const TYPE_COLORS: Record<string, string> = {
  pandit: 'from-[#E07B39] via-[#D4A017] to-[#8B1A1A]',
  photographer: 'from-blue-500 via-blue-600 to-indigo-700',
  caterer: 'from-green-500 via-emerald-600 to-teal-700',
};

function getTypeIcon(type: string) {
  if (type === 'photographer') return <Camera className="h-3.5 w-3.5" />;
  if (type === 'caterer') return <UtensilsCrossed className="h-3.5 w-3.5" />;
  return null;
}

export function ServiceProviderCard({ type, data, onView }: ServiceProviderCardProps) {
  const name = getName(type, data);
  const slug = getSlug(data);
  const location = getLocation(data);
  const specialties = getSpecialties(type, data);
  const profileLink = getProfileLink(type, slug);
  const profileImage = data.profileImage;
  const isVerified = data.isVerified;
  const isAvailable = data.isAvailable;
  const rating = data.rating;
  const experience = data.experience;
  const price = getPrice(type, data);

  const cardContent = (
    <Card className="overflow-hidden group card-premium cursor-pointer h-full">
      {/* Top accent gradient bar */}
      <div className={`h-1.5 bg-gradient-to-r ${TYPE_COLORS[type] || TYPE_COLORS.pandit}`} />
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="relative">
            <Avatar src={profileImage} alt={name} fallback={name} size="lg" />
            {isVerified && (
              <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-[#E07B39] rounded-full flex items-center justify-center ring-2 ring-white">
                <CheckCircle className="h-3 w-3 text-white" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-gray-900 dark:text-white truncate group-hover:text-[#E07B39] transition-colors">
              {name}
            </h3>
            <div className="flex items-center gap-1.5 mt-1 text-sm text-gray-500 dark:text-gray-400">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
              <span className="truncate">{location}</span>
            </div>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              {rating > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 text-[#D4A017] fill-[#D4A017]" />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{rating.toFixed(1)}</span>
                  {data.reviewCount > 0 && <span className="text-xs text-gray-400">({data.reviewCount})</span>}
                </div>
              )}
              {experience > 0 && (
                <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{experience} yrs</span>
                </div>
              )}
              {getTypeIcon(type) && (
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  {getTypeIcon(type)}
                  <span className="capitalize">{type}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Specializations / Tags */}
        {specialties.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {specialties.map((spec) => (
              <span key={spec} className="px-2 py-0.5 text-[10px] font-medium bg-[#E07B39]/5 text-[#E07B39] rounded-full">
                {spec}
              </span>
            ))}
          </div>
        )}

        {/* Bottom row */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            {isAvailable && <Badge variant="green" className="text-[10px]">Available</Badge>}
            {price && <span className="text-sm font-semibold text-[#E07B39]">{price}</span>}
          </div>
          <span className="text-xs text-[#E07B39] font-medium group-hover:underline flex items-center gap-1">
            View Profile <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </CardContent>
    </Card>
  );

  if (onView) {
    return <div onClick={onView}>{cardContent}</div>;
  }

  return <Link href={profileLink}>{cardContent}</Link>;
}

export function ServiceProviderCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="h-1.5 bg-gray-100 dark:bg-gray-700" />
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
          </div>
        </div>
        <div className="flex gap-1.5 mt-3">
          <div className="h-5 bg-gray-100 rounded-full animate-pulse w-16" />
          <div className="h-5 bg-gray-100 rounded-full animate-pulse w-20" />
        </div>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse w-20" />
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24" />
        </div>
      </CardContent>
    </Card>
  );
}
