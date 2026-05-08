'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Calendar, MapPin, User, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getBookingDraft } from '@/lib/api/bookings';
import type { BookingCeremony } from '@/types';

function BookingSuccessInner() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId') || '';
  const [booking, setBooking] = useState<BookingCeremony | null>(null);

  useEffect(() => {
    if (bookingId) {
      getBookingDraft(bookingId).then((res) => {
        if (res.success && res.data) setBooking(res.data);
      });
    }
  }, [bookingId]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 py-12 text-center">
        {/* Animated checkmark */}
        <div className="mb-6">
          <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center mx-auto animate-bounce">
            <CheckCircle className="h-14 w-14 text-green-500" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
        <p className="text-gray-500 mb-8">
          Your ceremony has been booked successfully. You will receive a confirmation shortly.
        </p>

        {booking && (
          <Card className="mb-8 text-left">
            <CardContent className="p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Booking Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-gray-500">Pandit</p>
                    <p className="font-medium">{booking.panthulugaruName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-gray-500">Ceremony</p>
                    <p className="font-medium">{booking.ritualName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-gray-500">Date & Time</p>
                    <p className="font-medium">{booking.bookingDate} at {booking.bookingTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-gray-500">Location</p>
                    <p className="font-medium">{booking.address}, {booking.city}</p>
                  </div>
                </div>
              </div>
              {booking.totalAmount && (
                <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between">
                  <span className="font-medium text-gray-700">Amount Paid</span>
                  <span className="font-bold text-[#E07B39]">&#8377;{booking.totalAmount}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col gap-3">
          <Link href="/">
            <Button variant="primary" className="w-full">Back to Home</Button>
          </Link>
          <Link href="/my-panthulugaru">
            <Button variant="outline" className="w-full">View My Bookings</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Skeleton className="h-24 w-24 rounded-full mx-auto mb-4" />
          <Skeleton className="h-8 w-48 mx-auto mb-2" />
          <Skeleton className="h-4 w-64 mx-auto" />
        </div>
      </div>
    }>
      <BookingSuccessInner />
    </Suspense>
  );
}
