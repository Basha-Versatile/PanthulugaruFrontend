'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Unlock, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { RouteGuard } from '@/components/auth/RouteGuard';
import { getMyPanthulugaru } from '@/lib/api/leads';
import type { Panthulugaru } from '@/types';

function MyPanthulugaruContent() {
  const [pandits, setPandits] = useState<Panthulugaru[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyPandits();
  }, []);

  const fetchMyPandits = async () => {
    try {
      const response = await getMyPanthulugaru();
      if (response.success && response.data) {
        setPandits(response.data);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Panthulugaru</h1>
          <p className="text-gray-500 mt-1">Pandits whose contact details you have unlocked</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-14 w-14 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-24 mt-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : pandits.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Unlock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No unlocked pandits yet</h3>
            <p className="text-gray-500 mb-4">Unlock pandit contacts to view them here</p>
            <Link href="/pandits">
              <Button variant="primary">Browse Pandits</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pandits.map((pandit) => (
              <Link key={pandit.id} href={`/pandits/${pandit.slug}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={pandit.profileImage}
                        alt={`${pandit.firstName} ${pandit.lastName}`}
                        fallback={`${pandit.firstName} ${pandit.lastName}`}
                        size="lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {pandit.firstName} {pandit.lastName}
                        </h3>
                        <p className="text-sm text-gray-500">{pandit.primaryCity || 'India'}</p>
                        <div className="flex gap-1.5 mt-1">
                          {pandit.isVerified && <Badge variant="saffron">Verified</Badge>}
                          <Badge variant="green">
                            <Unlock className="h-3 w-3 mr-1" />
                            Unlocked
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function MyPanthulugaruPage() {
  return (
    <RouteGuard role="customer">
      <MyPanthulugaruContent />
    </RouteGuard>
  );
}
