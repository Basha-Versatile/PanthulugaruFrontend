'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CreditCard, Smartphone, Building2, Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { RouteGuard } from '@/components/auth/RouteGuard';
import { getBookingDraft, initiateBookingPayment, confirmBookingPayment } from '@/lib/api/bookings';
import type { BookingCeremony } from '@/types';
import toast from 'react-hot-toast';

function PaymentPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId') || '';

  const [booking, setBooking] = useState<BookingCeremony | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');

  useEffect(() => {
    if (bookingId) fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const response = await getBookingDraft(bookingId);
      if (response.success && response.data) {
        setBooking(response.data);
      } else {
        toast.error('Booking not found');
      }
    } catch {
      toast.error('Failed to load booking');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!booking) return;
    setProcessing(true);
    try {
      const paymentRes = await initiateBookingPayment(booking.id);
      if (!paymentRes.success || !paymentRes.data) {
        toast.error(paymentRes.message || 'Failed to initiate payment');
        setProcessing(false);
        return;
      }

      // Demo mode: simulate payment
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const confirmRes = await confirmBookingPayment(booking.id, {
        razorpay_order_id: paymentRes.data.orderId,
        razorpay_payment_id: `demo_pay_${Date.now()}`,
        razorpay_signature: `demo_sig_${Date.now()}`,
      });

      if (confirmRes.success) {
        toast.success('Payment successful!');
        router.push('/booking/success?bookingId=' + booking.id);
      } else {
        toast.error(confirmRes.message || 'Payment confirmation failed');
      }
    } catch {
      toast.error('Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center">
        <h2 className="text-xl font-semibold text-gray-900">Booking not found</h2>
        <Link href="/"><Button variant="outline" className="mt-4">Go Home</Button></Link>
      </div>
    );
  }

  const METHODS = [
    { id: 'upi' as const, label: 'UPI', icon: Smartphone, desc: 'Google Pay, PhonePe, Paytm' },
    { id: 'card' as const, label: 'Card', icon: CreditCard, desc: 'Credit or Debit Card' },
    { id: 'netbanking' as const, label: 'Net Banking', icon: Building2, desc: 'All major banks' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <button onClick={() => router.back()} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#E07B39]">
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Complete Payment</h1>

        {/* Booking summary */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <h3 className="font-medium text-gray-900 mb-3">Booking Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Pandit</span><span>{booking.panthulugaruName}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Ritual</span><span>{booking.ritualName}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Date</span><span>{booking.bookingDate}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Time</span><span>{booking.bookingTime}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Location</span><span>{booking.city}</span></div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-[#E07B39]">&#8377;{booking.totalAmount || booking.amount || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment methods */}
        <div className="space-y-2 mb-6">
          <p className="text-sm font-medium text-gray-700 mb-2">Payment Method</p>
          {METHODS.map((m) => (
            <button
              key={m.id}
              onClick={() => setPaymentMethod(m.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                paymentMethod === m.id ? 'border-[#E07B39] bg-[#E07B39]/5' : 'border-gray-200'
              }`}
            >
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                paymentMethod === m.id ? 'bg-[#E07B39]/10' : 'bg-gray-100'
              }`}>
                <m.icon className={`h-5 w-5 ${paymentMethod === m.id ? 'text-[#E07B39]' : 'text-gray-500'}`} />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">{m.label}</p>
                <p className="text-xs text-gray-500">{m.desc}</p>
              </div>
            </button>
          ))}
        </div>

        <Button variant="primary" className="w-full" size="lg" onClick={handlePayment} isLoading={processing}>
          {processing ? 'Processing...' : `Pay ₹${booking.totalAmount || booking.amount || 0}`}
        </Button>

        <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-gray-400">
          <Shield className="h-3.5 w-3.5" />
          <span>Secure payment - Demo mode</span>
        </div>
      </div>
    </div>
  );
}

export default function BookingPaymentPage() {
  return (
    <RouteGuard role="customer">
      <Suspense fallback={
        <div className="max-w-lg mx-auto px-4 py-12">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-96 rounded-xl" />
        </div>
      }>
        <PaymentPageInner />
      </Suspense>
    </RouteGuard>
  );
}
