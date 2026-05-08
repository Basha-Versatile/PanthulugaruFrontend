'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, Star, Clock, BadgeCheck, UtensilsCrossed, Users, Phone, Mail, Leaf, X } from 'lucide-react';
import { useState } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Caterer } from '@/types';

type Props = {
  caterer: Caterer;
};

export function CatererDetailClient({ caterer: cat }: Props) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const location = [cat.primaryCity, cat.primaryState].filter(Boolean).join(', ') || 'India';

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <Link href="/caterers" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#FF6B00] transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Caterers
            </Link>
          </div>
        </div>

        {cat.bannerImage && (
          <div className="w-full h-48 sm:h-64 bg-gradient-to-r from-green-100 to-amber-100">
            <img src={cat.bannerImage} alt="" className="w-full h-full object-cover" />
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`bg-white rounded-xl border border-gray-200 p-6 shadow-sm ${cat.bannerImage ? '-mt-16 relative z-10' : 'mt-6'}`}>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Avatar src={cat.profileImage} alt={cat.businessName} fallback={cat.businessName} size="xl" className="border-4 border-white shadow-md" />
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-bold text-gray-900">{cat.businessName}</h1>
                  {cat.isVerified && <BadgeCheck className="h-6 w-6 text-[#FF6B00]" />}
                </div>
                <p className="text-sm text-gray-500 mt-0.5">by {cat.ownerName}</p>
                <div className="flex items-center gap-4 mt-2 flex-wrap text-sm text-gray-600">
                  <div className="flex items-center gap-1"><MapPin className="h-4 w-4 text-gray-400" /><span>{location}</span></div>
                  <div className="flex items-center gap-1"><Clock className="h-4 w-4 text-gray-400" /><span>{cat.experience} years exp</span></div>
                  {cat.rating > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-[#D4AF37] fill-[#D4AF37]" />
                      <span className="font-medium">{cat.rating.toFixed(1)}</span>
                      <span className="text-gray-400">({cat.reviewCount})</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 mt-3 flex-wrap">
                  {cat.isAvailable && <Badge variant="green">Available</Badge>}
                  {cat.isVerified && <Badge variant="saffron">Verified</Badge>}
                  {cat.vegetarianOnly && <Badge variant="green"><Leaf className="h-3 w-3 mr-1" />Pure Veg</Badge>}
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full sm:w-auto">
                {cat.phone && (
                  <a href={`tel:${cat.phone}`}>
                    <Button variant="primary" size="lg" className="w-full"><Phone className="h-4 w-4 mr-2" />Call Now</Button>
                  </a>
                )}
                {cat.email && (
                  <a href={`mailto:${cat.email}`}>
                    <Button variant="outline" size="lg" className="w-full"><Mail className="h-4 w-4 mr-2" />Email</Button>
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 pb-12">
            <div className="lg:col-span-2 space-y-6">
              {cat.aboutUs && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">About</h2>
                    <p className="text-gray-600 leading-relaxed">{cat.aboutUs}</p>
                  </CardContent>
                </Card>
              )}

              {cat.gallery?.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">
                      <UtensilsCrossed className="h-5 w-5 inline mr-2 text-[#FF6B00]" />
                      Gallery
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {cat.gallery.map((img, index) => (
                        <button key={index} onClick={() => setSelectedImage(img)} className="aspect-square rounded-lg overflow-hidden bg-gray-100 hover:opacity-90 transition-opacity">
                          <img src={img} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              {cat.cuisineTypes?.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Cuisine Types</h2>
                    <div className="flex flex-wrap gap-2">
                      {cat.cuisineTypes.map((c, i) => <Badge key={i} variant="saffron">{c}</Badge>)}
                    </div>
                  </CardContent>
                </Card>
              )}

              {cat.menuTypes?.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Menu Types</h2>
                    <div className="flex flex-wrap gap-2">
                      {cat.menuTypes.map((m, i) => <Badge key={i} variant="outline">{m}</Badge>)}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Pricing & Capacity</h2>
                  <div className="space-y-3">
                    {cat.pricePerPlate && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Price per plate</span>
                        <span className="font-medium text-[#FF6B00]">&#8377;{cat.pricePerPlate}</span>
                      </div>
                    )}
                    {cat.minPlateCount && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Minimum plates</span>
                        <span className="font-medium">{cat.minPlateCount}</span>
                      </div>
                    )}
                    {cat.maxPlateCount && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Maximum plates</span>
                        <span className="font-medium">{cat.maxPlateCount}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {cat.serviceAreas?.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Service Areas</h2>
                    <div className="space-y-2">
                      {cat.serviceAreas.map((area, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-3.5 w-3.5 text-gray-400" />
                          <span>{area.city}, {area.district}, {area.state}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={() => setSelectedImage(null)}>
          <button className="absolute top-4 right-4 text-white" onClick={() => setSelectedImage(null)}>
            <X className="h-8 w-8" />
          </button>
          <img src={selectedImage} alt="Gallery" className="max-w-full max-h-[90vh] object-contain" />
        </div>
      )}
    </>
  );
}
