'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, ChevronRight, ChevronLeft, Calendar, MapPin, Clock, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { RouteGuard } from '@/components/auth/RouteGuard';
import { getPanditById } from '@/lib/api/pandits';
import { getRitualsWithSublist } from '@/lib/api/rituals';
import { getPanthulugaruAvailability, createBookingDraft } from '@/lib/api/bookings';
import type { Panthulugaru, Ritual, TimeSlot } from '@/types';
import toast from 'react-hot-toast';

type Props = {
  params: Promise<{ panthulugaruId: string }>;
};

function BookingPageContent({ panthulugaruId }: { panthulugaruId: string }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [pandit, setPandit] = useState<Panthulugaru | null>(null);
  const [rituals, setRituals] = useState<Ritual[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [selectedRitualId, setSelectedRitualId] = useState('');
  const [selectedSubRitualId, setSelectedSubRitualId] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [notes, setNotes] = useState('');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, [panthulugaruId]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [panditRes, ritualsRes] = await Promise.all([
        getPanditById(panthulugaruId),
        getRitualsWithSublist(),
      ]);
      if (panditRes.success && panditRes.data) setPandit(panditRes.data);
      if (ritualsRes.success && ritualsRes.data) setRituals(ritualsRes.data);
    } catch {
      toast.error('Failed to load booking data');
    } finally {
      setLoading(false);
    }
  };

  const fetchTimeSlots = async (date: string) => {
    setLoadingSlots(true);
    try {
      const response = await getPanthulugaruAvailability(panthulugaruId, date);
      if (response.success && response.data) {
        setTimeSlots(response.data);
      }
    } catch {
      // silently fail
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleDateChange = (date: string) => {
    setBookingDate(date);
    setBookingTime('');
    if (date) fetchTimeSlots(date);
  };

  const selectedRitual = rituals.find((r) => r.id === selectedRitualId);
  const selectedSubRitual = selectedRitual?.subRituals?.find((s) => s.id === selectedSubRitualId);

  const validateStep = (): boolean => {
    switch (step) {
      case 1:
        if (!selectedRitualId) { toast.error('Please select a ritual'); return false; }
        return true;
      case 2:
        return true; // mode selection optional
      case 3:
        if (!bookingDate || !bookingTime) { toast.error('Please select date and time'); return false; }
        if (!address || !city) { toast.error('Please provide address and city'); return false; }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep()) setStep((s) => Math.min(4, s + 1));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const response = await createBookingDraft({
        panthulugaruId,
        ritualId: selectedRitualId,
        subRitualId: selectedSubRitualId || undefined,
        bookingDate,
        bookingTime,
        address,
        city,
        state: state || undefined,
        pincode: pincode || undefined,
        notes: notes || undefined,
      });
      if (response.success && response.data) {
        toast.success('Booking draft created!');
        router.push(`/booking/payment?bookingId=${response.data.id}`);
      } else {
        toast.error(response.message || 'Failed to create booking');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (!pandit) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <h2 className="text-xl font-semibold text-gray-900">Pandit not found</h2>
        <Link href="/pandits"><Button variant="outline" className="mt-4">Browse Pandits</Button></Link>
      </div>
    );
  }

  const STEPS = [
    { id: 1, label: 'Select Ritual' },
    { id: 2, label: 'Mode' },
    { id: 3, label: 'Date & Location' },
    { id: 4, label: 'Review' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Link href={`/pandits/${pandit.slug}`} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#FF6B00]">
            <ArrowLeft className="h-4 w-4" />
            Back to Profile
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Book {pandit.firstName} {pandit.lastName}
        </h1>

        {/* Progress steps */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.id}>
              <div className={`flex items-center gap-1.5 ${s.id <= step ? 'text-[#FF6B00]' : 'text-gray-400'}`}>
                <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-medium border-2 ${
                  s.id < step ? 'bg-[#FF6B00] border-[#FF6B00] text-white' :
                  s.id === step ? 'border-[#FF6B00] text-[#FF6B00]' : 'border-gray-300 text-gray-400'
                }`}>
                  {s.id < step ? <Check className="h-3.5 w-3.5" /> : s.id}
                </div>
                <span className="text-xs font-medium hidden sm:inline">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 ${s.id < step ? 'bg-[#FF6B00]' : 'bg-gray-200'}`} />}
            </React.Fragment>
          ))}
        </div>

        {/* Step 1: Select Ritual */}
        {step === 1 && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                <BookOpen className="h-5 w-5 inline mr-2 text-[#FF6B00]" />
                Select a Ritual
              </h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {rituals.map((ritual) => (
                  <button
                    key={ritual.id}
                    onClick={() => { setSelectedRitualId(ritual.id); setSelectedSubRitualId(''); }}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedRitualId === ritual.id ? 'border-[#FF6B00] bg-[#FF6B00]/5' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{ritual.name}</div>
                    {ritual.description && <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{ritual.description}</p>}
                  </button>
                ))}
              </div>

              {selectedRitual?.subRituals && selectedRitual.subRituals.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Select Sub-Ritual (optional)</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedRitual.subRituals.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => setSelectedSubRitualId(sub.id === selectedSubRitualId ? '' : sub.id)}
                        className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                          selectedSubRitualId === sub.id ? 'border-[#FF6B00] bg-[#FF6B00]/10 text-[#FF6B00]' : 'border-gray-200 text-gray-600'
                        }`}
                      >
                        {sub.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 2: Mode selection */}
        {step === 2 && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Mode</h2>
              <div className="grid grid-cols-2 gap-4">
                <button className="p-6 rounded-xl border-2 border-[#FF6B00] bg-[#FF6B00]/5 text-center">
                  <MapPin className="h-8 w-8 text-[#FF6B00] mx-auto mb-2" />
                  <p className="font-medium text-gray-900">In Person</p>
                  <p className="text-xs text-gray-500 mt-1">Pandit visits your location</p>
                </button>
                <button className="p-6 rounded-xl border-2 border-gray-200 text-center hover:border-gray-300 transition-colors">
                  <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="font-medium text-gray-900">Online</p>
                  <p className="text-xs text-gray-500 mt-1">Video call ceremony</p>
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Date & Location */}
        {step === 3 && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                <Calendar className="h-5 w-5 inline mr-2 text-[#FF6B00]" />
                Date, Time & Location
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Date *"
                  type="date"
                  value={bookingDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Time *</label>
                  {loadingSlots ? (
                    <Skeleton className="h-10 w-full rounded-lg" />
                  ) : timeSlots.length > 0 ? (
                    <select
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00]"
                    >
                      <option value="">Select time</option>
                      {timeSlots.filter((s) => s.isAvailable).map((slot) => (
                        <option key={slot.id || slot.startTime} value={slot.startTime}>
                          {slot.label || `${slot.startTime} - ${slot.endTime}`}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <Input
                      type="time"
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      required
                    />
                  )}
                </div>
              </div>
              <Input label="Address *" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Full address" required />
              <div className="grid grid-cols-3 gap-3">
                <Input label="City *" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" required />
                <Input label="State" value={state} onChange={(e) => setState(e.target.value)} placeholder="State" />
                <Input label="Pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="Pincode" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes (optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special requirements..."
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00]"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Review Booking</h2>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Pandit</span>
                  <span className="text-sm font-medium">{pandit.firstName} {pandit.lastName}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Ritual</span>
                  <span className="text-sm font-medium">{selectedRitual?.name || '-'}</span>
                </div>
                {selectedSubRitual && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Sub-Ritual</span>
                    <span className="text-sm font-medium">{selectedSubRitual.name}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Date & Time</span>
                  <span className="text-sm font-medium">{bookingDate} at {bookingTime}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Location</span>
                  <span className="text-sm font-medium text-right max-w-[200px]">{address}, {city}</span>
                </div>
                {notes && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Notes</span>
                    <span className="text-sm font-medium text-right max-w-[200px]">{notes}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-6">
          <Button variant="ghost" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          {step < 4 ? (
            <Button variant="primary" onClick={handleNext}>
              Continue
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button variant="primary" onClick={handleSubmit} isLoading={submitting}>
              Create Booking
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BookingPage({ params }: Props) {
  const { panthulugaruId } = use(params);
  return (
    <RouteGuard role="customer">
      <BookingPageContent panthulugaruId={panthulugaruId} />
    </RouteGuard>
  );
}
