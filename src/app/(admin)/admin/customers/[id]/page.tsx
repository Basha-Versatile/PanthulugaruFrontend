'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { getCustomerById, updateCustomer } from '@/lib/api/admin';
import type { Customer } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import {
  ArrowLeft, Save, User, Mail, Phone, MapPin, Calendar
} from 'lucide-react';

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const fetchCustomer = async () => {
      setLoading(true);
      try {
        const res = await getCustomerById(id);
        if (res.success && res.data) {
          setCustomer(res.data);
        } else {
          toast.error(res.message || 'Customer not found');
        }
      } catch {
        toast.error('Failed to load customer');
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [id]);

  const handleSave = async () => {
    if (!customer) return;
    setSaving(true);
    try {
      const res = await updateCustomer(customer.id, { ...customer });
      if (res.success && res.data) {
        setCustomer(res.data);
        toast.success('Customer updated successfully');
      } else {
        toast.error(res.message || 'Failed to update customer');
      }
    } catch {
      toast.error('Failed to update customer');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2"><CardContent className="p-6"><div className="space-y-4">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-6 w-full" />)}</div></CardContent></Card>
          <Card><CardContent className="p-6"><div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-6 w-full" />)}</div></CardContent></Card>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 dark:text-[#E8DDD0]/60 mb-4">Customer not found</p>
        <Button variant="outline" onClick={() => router.push('/admin/customers')}>
          <ArrowLeft className="h-4 w-4" /> Back to list
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.push('/admin/customers')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Avatar src={customer.profileImage} fallback={`${customer.firstName} ${customer.lastName}`} size="lg" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{customer.firstName} {customer.lastName}</h1>
          <p className="text-sm text-gray-500 dark:text-[#E8DDD0]/60">Customer ID: {customer.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><User className="h-5 w-5" /> Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  value={customer.firstName}
                  onChange={(e) => setCustomer({ ...customer, firstName: e.target.value })}
                />
                <Input
                  label="Last Name"
                  value={customer.lastName}
                  onChange={(e) => setCustomer({ ...customer, lastName: e.target.value })}
                />
                <Input
                  label="Email"
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  type="email"
                />
                <Input
                  label="Phone"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                />
                <Input
                  label="City"
                  value={customer.city || ''}
                  onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                />
                <Input
                  label="State"
                  value={customer.state || ''}
                  onChange={(e) => setCustomer({ ...customer, state: e.target.value })}
                />
                <Input
                  label="Pincode"
                  value={customer.pincode || ''}
                  onChange={(e) => setCustomer({ ...customer, pincode: e.target.value })}
                />
              </div>
              {customer.address && (
                <div className="mt-4">
                  <Input
                    label="Address"
                    value={customer.address}
                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                  />
                </div>
              )}
              <div className="mt-6 flex justify-end">
                <Button onClick={handleSave} isLoading={saving}>
                  <Save className="h-4 w-4" /> Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Admin Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Admin Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add internal notes about this customer..."
                rows={4}
                className="w-full rounded-lg border border-gray-300 dark:border-[#D4AF37]/15 bg-white dark:bg-[#241C16] px-3.5 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#E8DDD0]/30 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00] dark:focus:ring-[#D4AF37]/20 dark:focus:border-[#D4AF37]"
              />
            </CardContent>
          </Card>

          {/* Booking History Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Booking History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400 dark:text-[#E8DDD0]/40 text-center py-8">Booking history will appear here once integrated.</p>
            </CardContent>
          </Card>

          {/* Lead History Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Lead History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400 dark:text-[#E8DDD0]/40 text-center py-8">Lead history will appear here once integrated.</p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Verification Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-[#E8DDD0]/70">Email</span>
                {customer.isEmailVerified ? <Badge variant="green">Verified</Badge> : <Badge variant="gold">Unverified</Badge>}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-[#E8DDD0]/70">Phone</span>
                {customer.isPhoneVerified ? <Badge variant="green">Verified</Badge> : <Badge variant="gold">Unverified</Badge>}
              </div>
              {customer.googleId && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-[#E8DDD0]/70">Google</span>
                  <Badge variant="green">Linked</Badge>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Timestamps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-[#E8DDD0]/60">Joined</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{dayjs(customer.createdAt).format('DD MMM YYYY')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-[#E8DDD0]/60">Updated</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{dayjs(customer.updatedAt).format('DD MMM YYYY')}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
