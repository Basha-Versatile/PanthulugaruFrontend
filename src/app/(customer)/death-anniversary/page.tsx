'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Bell, BellOff, Trash2, Calculator, Moon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { RouteGuard } from '@/components/auth/RouteGuard';
import { createDeathAnniversary, getByCustomer, calculateTithi } from '@/lib/api/deathAnniversary';
import type { DeathAnniversary } from '@/types';
import toast from 'react-hot-toast';

function DeathAnniversaryContent() {
  const [anniversaries, setAnniversaries] = useState<DeathAnniversary[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [calculating, setCalculating] = useState(false);

  // Form fields
  const [deceasedName, setDeceasedName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [deathDate, setDeathDate] = useState('');
  const [gothram, setGothram] = useState('');
  const [nakshatra, setNakshatra] = useState('');
  const [notes, setNotes] = useState('');
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderDaysBefore, setReminderDaysBefore] = useState('3');

  // Tithi calculation result
  const [tithiResult, setTithiResult] = useState<any>(null);

  useEffect(() => {
    fetchAnniversaries();
  }, []);

  const fetchAnniversaries = async () => {
    try {
      const response = await getByCustomer();
      if (response.success && response.data) {
        setAnniversaries(response.data);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  const handleCalculateTithi = async () => {
    if (!deathDate) {
      toast.error('Please enter the death date first');
      return;
    }
    setCalculating(true);
    try {
      const response = await calculateTithi({ deathDate, yearsAhead: 10 });
      if (response.success && response.data) {
        setTithiResult(response.data);
        toast.success('Tithi calculated successfully');
      } else {
        toast.error(response.message || 'Failed to calculate tithi');
      }
    } catch {
      toast.error('Failed to calculate tithi');
    } finally {
      setCalculating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deceasedName || !relationship || !deathDate) {
      toast.error('Please fill required fields');
      return;
    }
    setSubmitting(true);
    try {
      const response = await createDeathAnniversary({
        deceasedName,
        relationship,
        deathDate,
        gothram: gothram || undefined,
        nakshatra: nakshatra || undefined,
        notes: notes || undefined,
        reminderEnabled,
        reminderDaysBefore: parseInt(reminderDaysBefore) || 3,
      });
      if (response.success) {
        toast.success('Death anniversary saved');
        setShowForm(false);
        resetForm();
        fetchAnniversaries();
      } else {
        toast.error(response.message || 'Failed to save');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setDeceasedName('');
    setRelationship('');
    setDeathDate('');
    setGothram('');
    setNakshatra('');
    setNotes('');
    setReminderEnabled(true);
    setReminderDaysBefore('3');
    setTithiResult(null);
  };

  const RELATIONSHIPS = ['Father', 'Mother', 'Grandfather', 'Grandmother', 'Spouse', 'Sibling', 'Child', 'Uncle', 'Aunt', 'Other'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#121212]">
      <div className="bg-white border-b border-gray-200 dark:bg-[#1e1e1e] dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Death Anniversary Calculator</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Calculate tithi dates and set reminders for death anniversaries</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-end mb-6">
          <Button variant="primary" onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-1.5" />
            Add Death Anniversary
          </Button>
        </div>

        {/* Add form */}
        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add Death Anniversary</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Name of Deceased *" value={deceasedName} onChange={(e) => setDeceasedName(e.target.value)} placeholder="Full name" required />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Relationship *</label>
                    <select value={relationship} onChange={(e) => setRelationship(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E07B39]/20 focus:border-[#E07B39] dark:bg-[#2a2a2a] dark:border-gray-600 dark:text-white" required>
                      <option value="">Select relationship</option>
                      {RELATIONSHIPS.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Input label="Death Date *" type="date" value={deathDate} onChange={(e) => setDeathDate(e.target.value)} required />
                  </div>
                  <div className="flex items-end">
                    <Button type="button" variant="outline" onClick={handleCalculateTithi} isLoading={calculating} className="w-full">
                      <Calculator className="h-4 w-4 mr-1.5" />
                      Calculate Tithi
                    </Button>
                  </div>
                </div>

                {tithiResult && (
                  <div className="bg-[#E07B39]/5 border border-[#E07B39]/20 rounded-lg p-4 dark:bg-[#E07B39]/10 dark:border-[#E07B39]/30">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Tithi Information</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                      {tithiResult.tithiName && (
                        <div><span className="text-gray-500 dark:text-gray-400">Tithi</span><p className="font-medium">{tithiResult.tithiName}</p></div>
                      )}
                      {tithiResult.paksham && (
                        <div><span className="text-gray-500 dark:text-gray-400">Paksham</span><p className="font-medium">{tithiResult.paksham}</p></div>
                      )}
                      {tithiResult.lunarMonth && (
                        <div><span className="text-gray-500 dark:text-gray-400">Lunar Month</span><p className="font-medium">{tithiResult.lunarMonth}</p></div>
                      )}
                      {tithiResult.nakshatra && (
                        <div><span className="text-gray-500 dark:text-gray-400">Nakshatra</span><p className="font-medium">{tithiResult.nakshatra}</p></div>
                      )}
                    </div>
                    {tithiResult.upcomingDates?.length > 0 && (
                      <div className="mt-3">
                        <h5 className="text-sm font-medium text-gray-700 mb-1.5">Upcoming 10 Anniversary Dates</h5>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                          {tithiResult.upcomingDates.slice(0, 10).map((d: any, i: number) => (
                            <div key={i} className="bg-white rounded-md p-2 text-center border border-gray-100 dark:bg-[#2a2a2a] dark:border-gray-700">
                              <p className="text-xs text-gray-400 dark:text-gray-500">{d.year}</p>
                              <p className="text-sm font-medium">{d.gregorianDate}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{d.dayOfWeek}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Gothram" value={gothram} onChange={(e) => setGothram(e.target.value)} placeholder="Family gothram" />
                  <Input label="Nakshatra" value={nakshatra} onChange={(e) => setNakshatra(e.target.value)} placeholder="Star name" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Notes</label>
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Additional notes..." rows={2} className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E07B39]/20 focus:border-[#E07B39] dark:bg-[#2a2a2a] dark:border-gray-600 dark:text-white" />
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={reminderEnabled} onChange={(e) => setReminderEnabled(e.target.checked)} className="w-4 h-4 text-[#E07B39] border-gray-300 rounded focus:ring-[#E07B39]" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Enable reminders</span>
                  </label>
                  {reminderEnabled && (
                    <Input type="number" value={reminderDaysBefore} onChange={(e) => setReminderDaysBefore(e.target.value)} min="1" max="30" className="w-20" />
                  )}
                  {reminderEnabled && <span className="text-sm text-gray-500">days before</span>}
                </div>

                <div className="flex gap-3">
                  <Button type="submit" variant="primary" isLoading={submitting}>Save</Button>
                  <Button type="button" variant="ghost" onClick={() => { setShowForm(false); resetForm(); }}>Cancel</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Existing anniversaries */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
          </div>
        ) : anniversaries.length === 0 && !showForm ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center dark:bg-[#1e1e1e] dark:border-gray-700">
            <Moon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No death anniversaries saved</h3>
            <p className="text-gray-500 dark:text-gray-400">Add a death anniversary to calculate tithi dates and set reminders</p>
          </div>
        ) : (
          <div className="space-y-4">
            {anniversaries.map((ann) => (
              <Card key={ann.id}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{ann.deceasedName}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{ann.relationship} - Passed on {new Date(ann.deathDate).toLocaleDateString()}</p>
                      <div className="flex gap-2 mt-2">
                        {ann.deathTithi?.tithiName && <Badge variant="saffron">{ann.deathTithi.tithiName}</Badge>}
                        {ann.deathTithi?.paksham && <Badge variant="outline">{ann.deathTithi.paksham}</Badge>}
                        {ann.reminderEnabled ? (
                          <Badge variant="green"><Bell className="h-3 w-3 mr-1" />Reminder ON</Badge>
                        ) : (
                          <Badge variant="default"><BellOff className="h-3 w-3 mr-1" />Reminder OFF</Badge>
                        )}
                      </div>
                      {ann.gothram && <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Gothram: {ann.gothram}</p>}
                    </div>
                  </div>

                  {ann.upcomingAnniversaries && ann.upcomingAnniversaries.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Upcoming Dates</p>
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {ann.upcomingAnniversaries.slice(0, 5).map((ua, i) => (
                          <div key={i} className="flex-shrink-0 bg-gray-50 rounded-lg px-3 py-2 text-center min-w-[80px] dark:bg-[#2a2a2a]">
                            <p className="text-xs text-gray-400 dark:text-gray-500">{ua.year}</p>
                            <p className="text-sm font-medium">{new Date(ua.gregorianDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{ua.dayOfWeek}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function DeathAnniversaryPage() {
  return (
    <RouteGuard role="customer">
      <DeathAnniversaryContent />
    </RouteGuard>
  );
}
