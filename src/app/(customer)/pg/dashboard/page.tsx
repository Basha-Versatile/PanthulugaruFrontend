'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BarChart3, Users, Calendar, IndianRupee, Star, Eye, TrendingUp, Bell, Settings, LogOut, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { RouteGuard } from '@/components/auth/RouteGuard';
import { PGOnboardingModal } from '@/components/pg/PGOnboardingModal';
import { usePGAuth } from '@/contexts/PGAuthContext';
import { getDashboardStats, getMyBookings } from '@/lib/api/pgDashboard';
import type { PGDashboardStats, BookingCeremony } from '@/types';

function PGDashboardContent() {
  const { user, approvalStatus, featureAccess, logout } = usePGAuth();
  const [stats, setStats] = useState<PGDashboardStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<BookingCeremony[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (featureAccess.showOnboardingModal) {
      setShowOnboarding(true);
    }
    fetchDashboardData();
  }, [featureAccess]);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, bookingsRes] = await Promise.all([
        getDashboardStats(),
        getMyBookings({ page: 0, size: 5 }),
      ]);
      if (statsRes.success && statsRes.data) setStats(statsRes.data);
      if (bookingsRes.success && bookingsRes.data) setRecentBookings(bookingsRes.data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  const fullName = user ? `${user.firstName} ${user.lastName}` : 'Panthulugaru';

  const STAT_CARDS = [
    { label: 'Total Bookings', value: stats?.totalBookings || 0, icon: Calendar, color: 'text-blue-600 bg-blue-50' },
    { label: 'Completed', value: stats?.completedBookings || 0, icon: BarChart3, color: 'text-green-600 bg-green-50' },
    { label: 'Upcoming', value: stats?.upcomingBookings || 0, icon: TrendingUp, color: 'text-amber-600 bg-amber-50' },
    { label: 'Total Earnings', value: `₹${(stats?.totalEarnings || 0).toLocaleString()}`, icon: IndianRupee, color: 'text-[#E07B39] bg-[#E07B39]/10' },
    { label: 'This Month', value: `₹${(stats?.thisMonthEarnings || 0).toLocaleString()}`, icon: IndianRupee, color: 'text-purple-600 bg-purple-50' },
    { label: 'Rating', value: stats?.rating ? stats.rating.toFixed(1) : 'N/A', icon: Star, color: 'text-[#D4A017] bg-[#D4A017]/10' },
    { label: 'Profile Views', value: stats?.profileViews || 0, icon: Eye, color: 'text-indigo-600 bg-indigo-50' },
    { label: 'Leads', value: stats?.leadsReceived || 0, icon: Users, color: 'text-pink-600 bg-pink-50' },
  ];

  const getStatusBadge = () => {
    switch (approvalStatus) {
      case 'ACTIVE':
        return <Badge variant="green">Active</Badge>;
      case 'PENDING_APPROVAL':
        return <Badge variant="gold">Pending Approval</Badge>;
      case 'REJECTED':
        return <Badge variant="red">Rejected</Badge>;
      default:
        return <Badge variant="default">Draft</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl text-[#E07B39] font-bold">Om</span>
            <span className="text-lg font-bold text-gray-900">PG Dashboard</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/pg/dashboard/profile/edit">
              <Button variant="ghost" size="sm"><Settings className="h-4 w-4 mr-1.5" />Profile</Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-1.5" />Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Profile overview */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Avatar src={user?.profileImage} alt={fullName} fallback={fullName} size="xl" />
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold text-gray-900">{fullName}</h1>
                  {getStatusBadge()}
                </div>
                <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
                <p className="text-sm text-gray-500">{user?.phone}</p>
                {user?.primaryCity && (
                  <p className="text-sm text-gray-500 mt-1">{user.primaryCity}, {user.primaryState}</p>
                )}
                <div className="flex gap-2 mt-3">
                  {user?.isVerified && <Badge variant="saffron">Verified</Badge>}
                  {user?.isAvailable && <Badge variant="green">Available</Badge>}
                  <Badge variant="outline">{user?.experience || 0} yrs exp</Badge>
                </div>
              </div>
              <Link href="/pg/dashboard/profile/edit">
                <Button variant="outline">Edit Profile</Button>
              </Link>
            </div>

            {approvalStatus === 'PENDING_APPROVAL' && (
              <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
                <strong>Profile Under Review:</strong> Your profile is pending admin approval. You will be notified once approved.
              </div>
            )}
            {approvalStatus === 'REJECTED' && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-800">
                <strong>Profile Rejected:</strong> Please update your profile and resubmit for approval.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {STAT_CARDS.map((stat) => (
              <Card key={stat.label}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{stat.label}</p>
                      <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-[#E07B39]" />
              Recent Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-lg" />)}
              </div>
            ) : recentBookings.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Calendar className="h-10 w-10 mx-auto mb-2" />
                <p>No bookings yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 text-gray-500 font-medium">Customer</th>
                      <th className="text-left py-3 px-2 text-gray-500 font-medium">Ritual</th>
                      <th className="text-left py-3 px-2 text-gray-500 font-medium">Date</th>
                      <th className="text-left py-3 px-2 text-gray-500 font-medium">Status</th>
                      <th className="text-left py-3 px-2 text-gray-500 font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((booking) => (
                      <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-2 font-medium">{booking.customerName}</td>
                        <td className="py-3 px-2">{booking.ritualName}</td>
                        <td className="py-3 px-2">{booking.bookingDate}</td>
                        <td className="py-3 px-2">
                          <Badge variant={
                            booking.status === 'COMPLETED' ? 'green' :
                            booking.status === 'CONFIRMED' ? 'saffron' :
                            booking.status === 'CANCELLED' ? 'red' : 'default'
                          }>
                            {booking.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-2 font-medium">&#8377;{booking.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Onboarding Modal */}
      <PGOnboardingModal isOpen={showOnboarding} onClose={() => setShowOnboarding(false)} />
    </div>
  );
}

export default function PGDashboardPage() {
  return (
    <RouteGuard role="pg">
      <PGDashboardContent />
    </RouteGuard>
  );
}
