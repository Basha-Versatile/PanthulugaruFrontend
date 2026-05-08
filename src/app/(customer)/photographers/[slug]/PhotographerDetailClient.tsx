'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, Star, Clock, BadgeCheck, Camera, Video, Plane, Phone, Mail, Languages, X } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Photographer } from '@/types';

type Props = {
  photographer: Photographer;
};

export function PhotographerDetailClient({ photographer: ph }: Props) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const fullName = `${ph.firstName} ${ph.lastName}`;
  const location = [ph.primaryCity, ph.primaryState].filter(Boolean).join(', ') || 'India';

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <Link href="/photographers" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#E07B39] transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Photographers
            </Link>
          </div>
        </div>

        {ph.bannerImage && (
          <div className="w-full h-48 sm:h-64 bg-gradient-to-r from-blue-100 to-purple-100">
            <img src={ph.bannerImage} alt="" className="w-full h-full object-cover" />
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Header */}
          <div className={`bg-white rounded-xl border border-gray-200 p-6 shadow-sm ${ph.bannerImage ? '-mt-16 relative z-10' : 'mt-6'}`}>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Avatar src={ph.profileImage} alt={fullName} fallback={fullName} size="xl" className="border-4 border-white shadow-md" />
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-bold text-gray-900">{fullName}</h1>
                  {ph.isVerified && <BadgeCheck className="h-6 w-6 text-[#E07B39]" />}
                </div>
                <div className="flex items-center gap-4 mt-2 flex-wrap text-sm text-gray-600">
                  <div className="flex items-center gap-1"><MapPin className="h-4 w-4 text-gray-400" /><span>{location}</span></div>
                  <div className="flex items-center gap-1"><Clock className="h-4 w-4 text-gray-400" /><span>{ph.experience} years exp</span></div>
                  {ph.rating > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-[#D4A017] fill-[#D4A017]" />
                      <span className="font-medium">{ph.rating.toFixed(1)}</span>
                      <span className="text-gray-400">({ph.reviewCount})</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 mt-3 flex-wrap">
                  {ph.isAvailable && <Badge variant="green">Available</Badge>}
                  {ph.isVerified && <Badge variant="saffron">Verified</Badge>}
                  {ph.videography && <Badge variant="default"><Video className="h-3 w-3 mr-1" />Videography</Badge>}
                  {ph.dronePhotography && <Badge variant="default"><Plane className="h-3 w-3 mr-1" />Drone</Badge>}
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full sm:w-auto">
                {ph.phone && (
                  <a href={`tel:${ph.phone}`}>
                    <Button variant="primary" size="lg" className="w-full"><Phone className="h-4 w-4 mr-2" />Call Now</Button>
                  </a>
                )}
                {ph.email && (
                  <a href={`mailto:${ph.email}`}>
                    <Button variant="outline" size="lg" className="w-full"><Mail className="h-4 w-4 mr-2" />Email</Button>
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 pb-12">
            <div className="lg:col-span-2 space-y-6">
              {ph.aboutMe && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">About</h2>
                    <p className="text-gray-600 leading-relaxed">{ph.aboutMe}</p>
                  </CardContent>
                </Card>
              )}

              {/* Portfolio Gallery */}
              {ph.portfolio?.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">
                      <Camera className="h-5 w-5 inline mr-2 text-[#E07B39]" />
                      Portfolio
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {ph.portfolio.map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(img)}
                          className="aspect-square rounded-lg overflow-hidden bg-gray-100 hover:opacity-90 transition-opacity"
                        >
                          <img src={img} alt={`Portfolio ${index + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              {ph.specializations?.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Specializations</h2>
                    <div className="flex flex-wrap gap-2">
                      {ph.specializations.map((s, i) => <Badge key={i} variant="saffron">{s}</Badge>)}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Pricing</h2>
                  <div className="space-y-3">
                    {ph.pricePerDay && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Per Day</span>
                        <span className="font-medium text-[#E07B39]">&#8377;{ph.pricePerDay.toLocaleString()}</span>
                      </div>
                    )}
                    {ph.pricePerEvent && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Per Event</span>
                        <span className="font-medium text-[#E07B39]">&#8377;{ph.pricePerEvent.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {ph.serviceAreas?.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Service Areas</h2>
                    <div className="space-y-2">
                      {ph.serviceAreas.map((area, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-3.5 w-3.5 text-gray-400" />
                          <span>{area.city}, {area.district}, {area.state}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {(ph.equipment?.length ?? 0) > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Equipment</h2>
                    <div className="flex flex-wrap gap-2">
                      {ph.equipment!.map((eq, i) => <Badge key={i} variant="outline">{eq}</Badge>)}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={() => setSelectedImage(null)}>
          <button className="absolute top-4 right-4 text-white" onClick={() => setSelectedImage(null)}>
            <X className="h-8 w-8" />
          </button>
          <img src={selectedImage} alt="Portfolio" className="max-w-full max-h-[90vh] object-contain" />
        </div>
      )}
    </>
  );
}
