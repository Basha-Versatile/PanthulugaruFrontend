'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { getDashboardStats } from '@/lib/api/admin';
import type { DashboardStats, Lead, BookingCeremony } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  Users, TrendingUp, CreditCard, Megaphone,
  ArrowRight, RefreshCw, Plus, FileText, BookOpen
} from 'lucide-react';

function getLeadStatusBadge(status: string) {
  switch (status) {
    case 'NEW': return <Badge variant="saffron">New</Badge>;
    case 'CONTACTED': return <Badge variant="gold">Contacted</Badge>;
    case 'CONVERTED': return <Badge variant="green">Converted</Badge>;
    case 'CLOSED': return <Badge variant="default">Closed</Badge>;
    case 'SPAM': return <Badge variant="red">Spam</Badge>;
    default: return <Badge>{status}</Badge>;
  }
}

function getPaymentStatusBadge(status: string) {
  switch (status) {
    case 'SUCCESS': case 'COMPLETED': return <Badge variant="green">Success</Badge>;
    case 'PENDING': case 'CREATED': return <Badge variant="gold">Pending</Badge>;
    case 'FAILED': return <Badge variant="red">Failed</Badge>;
    case 'REFUNDED': return <Badge variant="saffron">Refunded</Badge>;
    default: return <Badge>{status}</Badge>;
  }
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await getDashboardStats();
      if (res.success && res.data) {
        setStats(res.data);
      } else {
        toast.error(res.message || 'Failed to load dashboard stats');
      }
    } catch {
      toast.error('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total PGs', value: stats?.totalPGs ?? 0, icon: Users, color: 'text-[#E07B39]', bg: 'bg-[#E07B39]/10' },
    { label: 'Total Leads', value: stats?.totalLeads ?? 0, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Revenue', value: `₹${(stats?.totalRevenue ?? 0).toLocaleString('en-IN')}`, icon: CreditCard, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Active Ads', value: stats?.activePGs ?? 0, icon: Megaphone, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">Welcome back! Here is an overview of the platform.</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchStats} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-24 mb-3" />
                  <Skeleton className="h-8 w-32" />
                </CardContent>
              </Card>
            ))
          : statCards.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.label}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-medium text-gray-500">{item.label}</p>
                      <div className={`h-10 w-10 rounded-lg ${item.bg} flex items-center justify-center`}>
                        <Icon className={`h-5 w-5 ${item.color}`} />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                  </CardContent>
                </Card>
              );
            })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/pgs">
              <Button variant="outline" size="sm"><Users className="h-4 w-4" /> Manage PGs</Button>
            </Link>
            <Link href="/admin/articles/new">
              <Button variant="outline" size="sm"><Plus className="h-4 w-4" /> New Article</Button>
            </Link>
            <Link href="/admin/leads">
              <Button variant="outline" size="sm"><TrendingUp className="h-4 w-4" /> View Leads</Button>
            </Link>
            <Link href="/admin/payments">
              <Button variant="outline" size="sm"><CreditCard className="h-4 w-4" /> Payments</Button>
            </Link>
            <Link href="/admin/rituals">
              <Button variant="outline" size="sm"><BookOpen className="h-4 w-4" /> Rituals</Button>
            </Link>
            <Link href="/admin/ads">
              <Button variant="outline" size="sm"><Megaphone className="h-4 w-4" /> Ads</Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Two-column: Recent Leads + Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Leads</CardTitle>
            <Link href="/admin/leads" className="text-sm text-[#E07B39] hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : stats?.recentLeads && stats.recentLeads.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left font-medium text-gray-500 pb-2">Customer</th>
                      <th className="text-left font-medium text-gray-500 pb-2">PG</th>
                      <th className="text-left font-medium text-gray-500 pb-2">Status</th>
                      <th className="text-left font-medium text-gray-500 pb-2">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {stats.recentLeads.slice(0, 5).map((lead: Lead) => (
                      <tr key={lead.id} className="hover:bg-gray-50">
                        <td className="py-2.5 text-gray-900">{lead.customerName}</td>
                        <td className="py-2.5 text-gray-600 truncate max-w-[120px]">{lead.panthulugaruName}</td>
                        <td className="py-2.5">{getLeadStatusBadge(lead.status)}</td>
                        <td className="py-2.5 text-gray-500">{dayjs(lead.createdAt).format('DD MMM')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-8">No recent leads</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Bookings / Payments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Bookings</CardTitle>
            <Link href="/admin/payments" className="text-sm text-[#E07B39] hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : stats?.recentBookings && stats.recentBookings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left font-medium text-gray-500 pb-2">Customer</th>
                      <th className="text-left font-medium text-gray-500 pb-2">Ritual</th>
                      <th className="text-right font-medium text-gray-500 pb-2">Amount</th>
                      <th className="text-left font-medium text-gray-500 pb-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {stats.recentBookings.slice(0, 5).map((booking: BookingCeremony) => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="py-2.5 text-gray-900">{booking.customerName}</td>
                        <td className="py-2.5 text-gray-600 truncate max-w-[120px]">{booking.ritualName}</td>
                        <td className="py-2.5 text-right text-gray-900 font-medium">₹{booking.amount?.toLocaleString('en-IN')}</td>
                        <td className="py-2.5">{getPaymentStatusBadge(booking.paymentStatus)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-8">No recent bookings</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Summary Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Platform Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: 'Active PGs', value: stats?.activePGs ?? 0 },
              { label: 'Pending PGs', value: stats?.pendingPGs ?? 0 },
              { label: 'Customers', value: stats?.totalCustomers ?? 0 },
              { label: 'Total Bookings', value: stats?.totalBookings ?? 0 },
              { label: 'Completed', value: stats?.completedBookings ?? 0 },
              { label: 'Cancelled', value: stats?.cancelledBookings ?? 0 },
            ].map((item) => (
              <div key={item.label} className="text-center p-3 rounded-lg bg-gray-50">
                <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                <p className="text-xs text-gray-500 mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
