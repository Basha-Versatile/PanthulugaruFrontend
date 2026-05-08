'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Star,
  Calendar,
  Clock,
  FileText,
  ChevronRight,
  Loader2,
  IndianRupee,
  Sparkles,
} from 'lucide-react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { createMuhurthamOrder, getMyMuhurthamOrders } from '@/lib/api/muhurtham';
import type { MuhurthamOrder } from '@/types';

const EVENT_TYPES = [
  'Marriage / Vivah',
  'Griha Pravesh (Housewarming)',
  'Naming Ceremony (Namakaranam)',
  'Upanayanam (Thread Ceremony)',
  'Vehicle Purchase',
  'Business Opening',
  'Engagement',
  'Annaprasana (First Feeding)',
  'Aksharabhyasam (First Writing)',
  'Temple Consecration',
  'Other',
];

export default function MuhurthamPage() {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<MuhurthamOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [eventType, setEventType] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [preferredDateRange, setPreferredDateRange] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  const fetchOrders = useCallback(async () => {
    if (!isAuthenticated) return;
    setOrdersLoading(true);
    try {
      const response = await getMyMuhurthamOrders(1, 20);
      const data = response.data;
      if ((data?.success || data?.status) && data.data) {
        const items = Array.isArray(data.data) ? data.data : data.data.content || [];
        setOrders(items);
      }
    } catch {
      // silently fail
    } finally {
      setOrdersLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    if (user) {
      setContactName(`${user.firstName} ${user.lastName}`.trim());
      setContactPhone(user.phone || '');
      setContactEmail(user.email || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventType) {
      toast.error('Please select an event type');
      return;
    }
    if (!eventDescription.trim()) {
      toast.error('Please provide event details');
      return;
    }
    if (!contactName.trim() || !contactPhone.trim()) {
      toast.error('Please provide your contact information');
      return;
    }

    setSubmitting(true);
    try {
      const response = await createMuhurthamOrder({
        eventType,
        eventDescription,
        preferredDateRange: preferredDateRange || undefined,
        customerName: contactName,
        phone: contactPhone,
        email: contactEmail || undefined,
      });
      const data = response.data;
      if (data?.success || data?.status) {
        toast.success('Muhurtham request submitted successfully!');
        // Reset form
        setEventType('');
        setEventDescription('');
        setPreferredDateRange('');
        if (!user) {
          setContactName('');
          setContactPhone('');
          setContactEmail('');
        }
        fetchOrders();
      } else {
        toast.error(data?.message || 'Failed to submit request');
      }
    } catch {
      toast.error('Failed to submit muhurtham request');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'gold' | 'green' | 'saffron' | 'red' | 'default'; label: string }> = {
      PENDING: { variant: 'gold', label: 'Pending' },
      IN_PROGRESS: { variant: 'saffron', label: 'In Progress' },
      COMPLETED: { variant: 'green', label: 'Completed' },
      CANCELLED: { variant: 'red', label: 'Cancelled' },
    };
    const config = variants[status] || { variant: 'default' as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero section */}
      <div className="bg-gradient-to-br from-[#E07B39]/10 via-[#D4A017]/5 to-[#8B1A1A]/10 border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-[#E07B39]/10 mb-4">
              <Sparkles className="h-7 w-7 text-[#E07B39]" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Muhurtham <span className="text-[#E07B39]">Services</span>
            </h1>
            <p className="text-gray-600 mt-3 text-lg">
              Find the most auspicious date and time for your important events.
              Our experienced Panthulugaru will analyze your horoscope and suggest
              the best muhurtham.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Star className="h-4 w-4 text-[#D4A017]" />
                <span>Expert Astrologers</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4 text-[#E07B39]" />
                <span>Vedic Calculations</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4 text-[#8B1A1A]" />
                <span>Quick Response</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Order form */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#E07B39]" />
                  Request Muhurtham
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Event Type *
                    </label>
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#E07B39]/20 focus:border-[#E07B39]"
                    >
                      <option value="">Select event type</option>
                      {EVENT_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Event Description *
                    </label>
                    <textarea
                      value={eventDescription}
                      onChange={(e) => setEventDescription(e.target.value)}
                      rows={3}
                      placeholder="Describe your event, any specific requirements, rashi/nakshatra details..."
                      className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E07B39]/20 focus:border-[#E07B39]"
                    />
                  </div>

                  <div>
                    <Input
                      label="Preferred Date Range (optional)"
                      placeholder="e.g., June 2026 - August 2026"
                      value={preferredDateRange}
                      onChange={(e) => setPreferredDateRange(e.target.value)}
                    />
                  </div>

                  <div className="border-t border-gray-200 pt-5">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">
                      Contact Information
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Full Name *"
                        placeholder="Your name"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                      />
                      <Input
                        label="Phone Number *"
                        type="tel"
                        placeholder="Your phone"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                      />
                    </div>
                    <div className="mt-4">
                      <Input
                        label="Email (optional)"
                        type="email"
                        placeholder="Your email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    isLoading={submitting}
                  >
                    Submit Muhurtham Request
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Info sidebar */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="bg-gradient-to-br from-[#E07B39]/5 to-[#D4A017]/5">
              <CardContent className="p-5">
                <h3 className="font-semibold text-gray-900 mb-3">How It Works</h3>
                <div className="space-y-3">
                  {[
                    'Submit your muhurtham request with event details',
                    'Our expert Panthulugaru reviews your request',
                    'Receive the auspicious date and time',
                    'Book the Panthulugaru for your ceremony',
                  ].map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-[#E07B39] text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <p className="text-sm text-gray-600">{step}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold text-gray-900 mb-2">Pricing</h3>
                <p className="text-sm text-gray-500 mb-3">
                  Muhurtham consultation fees vary based on complexity. You will
                  receive a quote after our Panthulugaru reviews your request.
                </p>
                <div className="flex items-center gap-1 text-[#E07B39] font-semibold">
                  <IndianRupee className="h-4 w-4" />
                  <span>Starting from 501</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* My Orders section */}
        {isAuthenticated && (
          <div className="mt-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">My Muhurtham Orders</h2>
            {ordersLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <Skeleton key={i} className="h-40 rounded-xl" />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No muhurtham orders yet</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Submit a request above to get started
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {orders.map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-xs text-gray-400 font-mono">
                            #{order.orderId}
                          </p>
                          <p className="font-semibold text-gray-900 mt-0.5">
                            {order.eventType}
                          </p>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>

                      <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                        {order.eventDescription}
                      </p>

                      <div className="space-y-1.5 text-sm">
                        {order.muhurthamDate && (
                          <div className="flex items-center gap-2 text-green-600">
                            <Calendar className="h-3.5 w-3.5" />
                            <span className="font-medium">
                              Muhurtham: {dayjs(order.muhurthamDate).format('DD MMM YYYY')}
                              {order.muhurthamTime && `, ${order.muhurthamTime}`}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-gray-500">
                          <Clock className="h-3.5 w-3.5" />
                          <span>
                            Requested: {dayjs(order.createdAt).format('DD MMM YYYY')}
                          </span>
                        </div>
                        {order.amount > 0 && (
                          <div className="flex items-center gap-2 text-gray-700">
                            <IndianRupee className="h-3.5 w-3.5" />
                            <span className="font-medium">
                              {order.amount.toLocaleString('en-IN')}
                            </span>
                            <Badge
                              variant={
                                order.paymentStatus === 'COMPLETED'
                                  ? 'green'
                                  : order.paymentStatus === 'PENDING'
                                  ? 'gold'
                                  : 'default'
                              }
                              className="ml-1"
                            >
                              {order.paymentStatus}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
