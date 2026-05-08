'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Star, BadgeCheck, Clock, Globe, BookOpen, Phone, Languages, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { LeadCapturePopup } from './LeadCapturePopup';
import { PaymentGatePopup } from './PaymentGatePopup';
import { ContactRevealPopup } from './ContactRevealPopup';
import { getSecureUnlockStatus, getPanditContact } from '@/lib/api/leads';
import { useAuth } from '@/contexts/AuthContext';
import type { Panthulugaru } from '@/types';

type ProfilePageClientProps = {
  pandit: Panthulugaru;
};

export function ProfilePageClient({ pandit }: ProfilePageClientProps) {
  const { isAuthenticated, openLoginModal } = useAuth();
  const [showLeadPopup, setShowLeadPopup] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [contactInfo, setContactInfo] = useState<{ phone: string; email: string } | null>(null);
  const [checkingUnlock, setCheckingUnlock] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      checkUnlockStatus();
    }
  }, [isAuthenticated]);

  const checkUnlockStatus = async () => {
    setCheckingUnlock(true);
    try {
      const response = await getSecureUnlockStatus(pandit.id);
      if (response.success && response.data?.isUnlocked) {
        setIsUnlocked(true);
        // Fetch contact info
        const contactResponse = await getPanditContact(pandit.id);
        if (contactResponse.success && contactResponse.data) {
          setContactInfo(contactResponse.data);
        }
      }
    } catch {
      // not unlocked
    } finally {
      setCheckingUnlock(false);
    }
  };

  const handleUnlockClick = () => {
    if (!isAuthenticated) {
      openLoginModal(`/pandits/${pandit.slug}`);
      return;
    }
    if (isUnlocked && contactInfo) {
      setShowContactPopup(true);
    } else {
      setShowLeadPopup(true);
    }
  };

  const handleLeadSuccess = () => {
    setShowLeadPopup(false);
    setShowPaymentPopup(true);
  };

  const handlePaymentSuccess = async () => {
    setIsUnlocked(true);
    // Fetch contact info after payment
    try {
      const contactResponse = await getPanditContact(pandit.id);
      if (contactResponse.success && contactResponse.data) {
        setContactInfo(contactResponse.data);
        setShowContactPopup(true);
      }
    } catch {
      // silently fail
    }
  };

  const fullName = `${pandit.firstName} ${pandit.lastName}`;
  const location = [pandit.primaryCity, pandit.primaryState].filter(Boolean).join(', ') || 'India';

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <Link href="/pandits" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#E07B39] transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Pandits
            </Link>
          </div>
        </div>

        {/* Banner */}
        {pandit.bannerImage && (
          <div className="w-full h-48 sm:h-64 bg-gradient-to-r from-[#E07B39]/20 to-[#8B1A1A]/20 relative">
            <img src={pandit.bannerImage} alt="" className="w-full h-full object-cover" />
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile header */}
          <div className={`bg-white rounded-xl border border-gray-200 p-6 shadow-sm ${pandit.bannerImage ? '-mt-16 relative z-10' : 'mt-6'}`}>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Avatar
                src={pandit.profileImage}
                alt={fullName}
                fallback={fullName}
                size="xl"
                className="border-4 border-white shadow-md"
              />

              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-bold text-gray-900">{fullName}</h1>
                  {pandit.isVerified && (
                    <BadgeCheck className="h-6 w-6 text-[#E07B39]" />
                  )}
                </div>

                <div className="flex items-center gap-4 mt-2 flex-wrap text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{location}</span>
                  </div>
                  {pandit.experience > 0 && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>{pandit.experience} years experience</span>
                    </div>
                  )}
                  {pandit.rating > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-[#D4A017] fill-[#D4A017]" />
                      <span className="font-medium">{pandit.rating.toFixed(1)}</span>
                      <span className="text-gray-400">({pandit.reviewCount} reviews)</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-3 flex-wrap">
                  {pandit.isAvailable && <Badge variant="green">Available</Badge>}
                  {pandit.isVerified && <Badge variant="saffron">Verified</Badge>}
                  {pandit.languages?.length > 0 && (
                    <Badge variant="default">
                      <Languages className="h-3 w-3 mr-1" />
                      {pandit.languages.join(', ')}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleUnlockClick}
                  isLoading={checkingUnlock}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  {isUnlocked ? 'View Contact' : 'Unlock Contact'}
                </Button>
                <Link href={`/book/${pandit.id}`}>
                  <Button variant="outline" size="lg" className="w-full">
                    Book Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 pb-12">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* About */}
              {pandit.aboutMe && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">About</h2>
                    <p className="text-gray-600 leading-relaxed">{pandit.aboutMe}</p>
                  </CardContent>
                </Card>
              )}

              {/* Rituals */}
              {pandit.rituals?.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">
                      <BookOpen className="h-5 w-5 inline mr-2 text-[#E07B39]" />
                      Rituals & Services
                    </h2>
                    <div className="space-y-3">
                      {pandit.rituals.map((ritual) => (
                        <div key={ritual.ritualId} className="bg-gray-50 rounded-lg p-3">
                          <h3 className="font-medium text-gray-900">{ritual.ritualName}</h3>
                          {ritual.subRituals?.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {ritual.subRituals.map((sub) => (
                                <Badge key={sub.subRitualId} variant="outline">
                                  {sub.subRitualName}
                                  {sub.price > 0 && ` - ₹${sub.price}`}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Gallery */}
              {pandit.gallery && pandit.gallery.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Gallery</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {pandit.gallery.map((img, index) => (
                        <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                          <img src={img} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Service Areas */}
              {pandit.serviceAreas?.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">
                      <Globe className="h-5 w-5 inline mr-2 text-[#E07B39]" />
                      Service Areas
                    </h2>
                    <div className="space-y-2">
                      {pandit.serviceAreas.map((area, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                          <span>{area.city}, {area.district}, {area.state}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Specializations */}
              {pandit.specializations?.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Specializations</h2>
                    <div className="flex flex-wrap gap-2">
                      {pandit.specializations.map((spec, index) => (
                        <Badge key={index} variant="saffron">{spec}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick stats */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Quick Info</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Experience</span>
                      <span className="font-medium text-gray-900">{pandit.experience} years</span>
                    </div>
                    {pandit.qualification && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Qualification</span>
                        <span className="font-medium text-gray-900">{pandit.qualification}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Total Bookings</span>
                      <span className="font-medium text-gray-900">{pandit.totalBookings}</span>
                    </div>
                    {pandit.minimumPricing && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Starting from</span>
                        <span className="font-medium text-[#E07B39]">&#8377;{pandit.minimumPricing}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Popups */}
      <LeadCapturePopup
        isOpen={showLeadPopup}
        onClose={() => setShowLeadPopup(false)}
        panthulugaruId={pandit.id}
        panthulugaruName={fullName}
        onSuccess={handleLeadSuccess}
      />
      <PaymentGatePopup
        isOpen={showPaymentPopup}
        onClose={() => setShowPaymentPopup(false)}
        panthulugaruId={pandit.id}
        panthulugaruName={fullName}
        onPaymentSuccess={handlePaymentSuccess}
      />
      {contactInfo && (
        <ContactRevealPopup
          isOpen={showContactPopup}
          onClose={() => setShowContactPopup(false)}
          panthulugaruId={pandit.id}
          panthulugaruName={fullName}
          phone={contactInfo.phone}
          email={contactInfo.email}
        />
      )}
    </>
  );
}
