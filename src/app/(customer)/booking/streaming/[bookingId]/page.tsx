'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Video,
  Calendar,
  MapPin,
  User,
  BookOpen,
} from 'lucide-react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { RouteGuard } from '@/components/auth/RouteGuard';
import { VideoStreamingPanel } from '@/components/features/VideoStreamingPanel';
import { getStreamingByBooking } from '@/lib/api/streaming';
import { useAuth } from '@/contexts/AuthContext';
import { usePGAuth } from '@/contexts/PGAuthContext';
import type { Streaming } from '@/types';

function StreamingPageContent() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params?.bookingId as string;
  const customerAuth = useAuth();
  const pgAuth = usePGAuth();

  const [streaming, setStreaming] = useState<Streaming | null>(null);
  const [loading, setLoading] = useState(true);

  // Determine role
  const role: 'customer' | 'pg' = pgAuth.isAuthenticated ? 'pg' : 'customer';

  const fetchStreaming = useCallback(async () => {
    if (!bookingId) return;
    try {
      const response = await getStreamingByBooking(bookingId);
      const data = response.data;
      if ((data?.success || data?.status) && data.data) {
        setStreaming(data.data);
      }
    } catch {
      // streaming may not exist yet
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    fetchStreaming();
  }, [fetchStreaming]);

  const handleEnd = () => {
    toast.success('Ceremony has ended');
    router.push('/my-bookings');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-[400px] w-full rounded-2xl mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/my-bookings"
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-2">
              <Video className="h-5 w-5 text-[#FF6B00]" />
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                Online Ceremony
              </h1>
            </div>
            <Badge variant="saffron" className="ml-auto">
              Booking: {bookingId.slice(0, 8)}...
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main video panel */}
          <div className="lg:col-span-2">
            <VideoStreamingPanel
              bookingId={bookingId}
              role={role}
              onEnd={handleEnd}
            />
          </div>

          {/* Sidebar - Booking details */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-[#FF6B00]" />
                  Ceremony Details
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Booking ID</p>
                      <p className="text-sm font-medium text-gray-700 break-all">
                        {bookingId}
                      </p>
                    </div>
                  </div>

                  {streaming && (
                    <>
                      <div className="flex items-start gap-3">
                        <Video className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500">Room</p>
                          <p className="text-sm font-medium text-gray-700">
                            {streaming.roomName}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Calendar className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500">Created</p>
                          <p className="text-sm font-medium text-gray-700">
                            {dayjs(streaming.createdAt).format('DD MMM YYYY, hh:mm A')}
                          </p>
                        </div>
                      </div>

                      {streaming.startedAt && (
                        <div className="flex items-start gap-3">
                          <Calendar className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-gray-500">Started</p>
                            <p className="text-sm font-medium text-gray-700">
                              {dayjs(streaming.startedAt).format('DD MMM YYYY, hh:mm A')}
                            </p>
                          </div>
                        </div>
                      )}

                      {streaming.endedAt && (
                        <div className="flex items-start gap-3">
                          <Calendar className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-gray-500">Ended</p>
                            <p className="text-sm font-medium text-gray-700">
                              {dayjs(streaming.endedAt).format('DD MMM YYYY, hh:mm A')}
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Participants */}
            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="h-4 w-4 text-[#FF6B00]" />
                  Participants
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-[#FF6B00]/10 flex items-center justify-center text-[#FF6B00] text-xs font-bold">
                        PG
                      </div>
                      <span className="text-sm text-gray-700">Panthulugaru</span>
                    </div>
                    <Badge variant={streaming?.isPanthulugaruJoined ? 'green' : 'default'}>
                      {streaming?.isPanthulugaruJoined ? 'Online' : 'Offline'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">
                        C
                      </div>
                      <span className="text-sm text-gray-700">Customer</span>
                    </div>
                    <Badge variant={streaming?.isCustomerJoined ? 'green' : 'default'}>
                      {streaming?.isCustomerJoined ? 'Online' : 'Offline'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Help */}
            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
                <p className="text-sm text-gray-500 mb-3">
                  Having trouble with the video stream? Make sure your camera and microphone permissions are enabled.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StreamingPage() {
  return (
    <RouteGuard role="customer">
      <StreamingPageContent />
    </RouteGuard>
  );
}
