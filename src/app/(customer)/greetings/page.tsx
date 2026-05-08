'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  PartyPopper,
  Bell,
  BellOff,
  Calendar,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  X,
  Send,
  Users,
} from 'lucide-react';
import dayjs from 'dayjs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { getUpcomingFestivals } from '@/lib/api/festivals';
import {
  createGreetingsSubscription,
  getMySubscriptions,
  updateSubscription,
  deleteSubscription,
} from '@/lib/api/greetingsSubscription';
import { useAuth } from '@/contexts/AuthContext';
import type { Festival, GreetingsSubscription } from '@/types';
import toast from 'react-hot-toast';

const STATIC_GREETINGS = [
  { id: '1', title: 'Diwali Greetings', image: '/greetings/diwali.jpg', festival: 'Diwali', color: 'bg-amber-50 border-amber-200' },
  { id: '2', title: 'Ugadi Greetings', image: '/greetings/ugadi.jpg', festival: 'Ugadi', color: 'bg-green-50 border-green-200' },
  { id: '3', title: 'Sankranti Greetings', image: '/greetings/sankranti.jpg', festival: 'Sankranti', color: 'bg-orange-50 border-orange-200' },
  { id: '4', title: 'Ganesh Chaturthi', image: '/greetings/ganesh.jpg', festival: 'Ganesh Chaturthi', color: 'bg-red-50 border-red-200' },
  { id: '5', title: 'Dasara Greetings', image: '/greetings/dasara.jpg', festival: 'Dasara', color: 'bg-purple-50 border-purple-200' },
  { id: '6', title: 'Holi Greetings', image: '/greetings/holi.jpg', festival: 'Holi', color: 'bg-pink-50 border-pink-200' },
];

const GREETING_TYPES = [
  'Birthday',
  'Anniversary',
  'Festival - Diwali',
  'Festival - Ugadi',
  'Festival - Sankranti',
  'Festival - Holi',
  'Festival - Dasara',
  'Festival - Ganesh Chaturthi',
  'Wedding',
  'Housewarming',
  'Custom',
];

export default function GreetingsPage() {
  const { isAuthenticated } = useAuth();
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(false);

  // Subscriptions state
  const [subscriptions, setSubscriptions] = useState<GreetingsSubscription[]>([]);
  const [subsLoading, setSubsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // New subscription form
  const [formContactName, setFormContactName] = useState('');
  const [formContactPhone, setFormContactPhone] = useState('');
  const [formContactEmail, setFormContactEmail] = useState('');
  const [formGreetingType, setFormGreetingType] = useState('');
  const [formGreetingDate, setFormGreetingDate] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formIsRecurring, setFormIsRecurring] = useState(true);

  useEffect(() => {
    fetchFestivals();
  }, []);

  const fetchFestivals = async () => {
    try {
      const response = await getUpcomingFestivals();
      if (response.success && response.data) {
        setFestivals(response.data);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscriptions = useCallback(async () => {
    if (!isAuthenticated) return;
    setSubsLoading(true);
    try {
      const response = await getMySubscriptions();
      const data = response.data;
      if ((data?.success || data?.status) && data.data) {
        const items = Array.isArray(data.data) ? data.data : data.data.content || [];
        setSubscriptions(items);
      }
    } catch {
      // silently fail
    } finally {
      setSubsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const handleSubscribe = () => {
    setSubscribed(!subscribed);
    toast.success(subscribed ? 'Unsubscribed from notifications' : 'Subscribed to festival notifications!');
  };

  const resetForm = () => {
    setFormContactName('');
    setFormContactPhone('');
    setFormContactEmail('');
    setFormGreetingType('');
    setFormGreetingDate('');
    setFormMessage('');
    setFormIsRecurring(true);
  };

  const handleAddSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formContactName.trim() || !formContactPhone.trim()) {
      toast.error('Please provide contact name and phone');
      return;
    }
    if (!formGreetingType) {
      toast.error('Please select a greeting type');
      return;
    }
    if (!formGreetingDate) {
      toast.error('Please select the greeting date');
      return;
    }
    if (!formMessage.trim()) {
      toast.error('Please provide a greeting message');
      return;
    }

    setSubmitting(true);
    try {
      const response = await createGreetingsSubscription({
        contactName: formContactName,
        contactPhone: formContactPhone,
        contactEmail: formContactEmail || undefined,
        greetingType: formGreetingType,
        greetingDate: formGreetingDate,
        message: formMessage,
        isRecurring: formIsRecurring,
      });
      const data = response.data;
      if (data?.success || data?.status) {
        toast.success('Greeting subscription added!');
        resetForm();
        setShowAddForm(false);
        fetchSubscriptions();
      } else {
        toast.error(data?.message || 'Failed to add subscription');
      }
    } catch {
      toast.error('Failed to add greeting subscription');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (sub: GreetingsSubscription) => {
    try {
      const response = await updateSubscription(sub.id, { isActive: !sub.isActive });
      const data = response.data;
      if (data?.success || data?.status) {
        setSubscriptions((prev) =>
          prev.map((s) => (s.id === sub.id ? { ...s, isActive: !s.isActive } : s))
        );
        toast.success(sub.isActive ? 'Subscription paused' : 'Subscription activated');
      } else {
        toast.error('Failed to update subscription');
      }
    } catch {
      toast.error('Failed to update subscription');
    }
  };

  const handleDeleteSubscription = async (id: string) => {
    if (!confirm('Are you sure you want to delete this greeting subscription?')) return;
    try {
      await deleteSubscription(id);
      setSubscriptions((prev) => prev.filter((s) => s.id !== id));
      toast.success('Subscription deleted');
    } catch {
      toast.error('Failed to delete subscription');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#121212]">
      <div className="bg-gradient-to-r from-[#E07B39]/10 to-[#D4A017]/10 dark:from-[#E07B39]/5 dark:to-[#D4A017]/5 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <PartyPopper className="h-8 w-8 text-[#D4A017]" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Festival Greetings</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Share beautiful greetings for Hindu festivals</p>
              </div>
            </div>
            <Button variant={subscribed ? 'outline' : 'primary'} onClick={handleSubscribe}>
              {subscribed ? <BellOff className="h-4 w-4 mr-1.5" /> : <Bell className="h-4 w-4 mr-1.5" />}
              {subscribed ? 'Unsubscribe' : 'Subscribe'}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upcoming festivals */}
        {festivals.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Festivals</h2>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {festivals.map((festival) => (
                <div key={festival.id} className="flex-shrink-0 bg-white dark:bg-[#1e1e1e] rounded-xl border border-gray-200 dark:border-gray-700 p-4 min-w-[200px]">
                  {festival.image && <img src={festival.image} alt={festival.name} className="h-24 w-full object-cover rounded-lg mb-3" />}
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{festival.name}</h3>
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(festival.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Greeting cards */}
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Greeting Cards</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {STATIC_GREETINGS.map((greeting) => (
            <Card key={greeting.id} className={`overflow-hidden ${greeting.color}`}>
              <div className="h-48 bg-gradient-to-br from-[#E07B39]/20 to-[#D4A017]/20 flex items-center justify-center">
                <div className="text-center">
                  <PartyPopper className="h-12 w-12 text-[#E07B39] mx-auto mb-2" />
                  <p className="text-lg font-bold text-[#E07B39]">{greeting.festival}</p>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">{greeting.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Share this greeting with friends and family</p>
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm" className="flex-1">
                    Share
                  </Button>
                  <Button variant="primary" size="sm" className="flex-1">
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* My Subscriptions section - only for logged-in users */}
        {isAuthenticated && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#D4A017]/10 flex items-center justify-center">
                  <Send className="h-5 w-5 text-[#D4A017]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Greeting Subscriptions</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Schedule automatic greetings for your loved ones
                  </p>
                </div>
              </div>
              <Button
                variant={showAddForm ? 'outline' : 'primary'}
                size="sm"
                onClick={() => {
                  setShowAddForm(!showAddForm);
                  if (showAddForm) resetForm();
                }}
              >
                {showAddForm ? (
                  <>
                    <X className="h-4 w-4 mr-1.5" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-1.5" />
                    Add Subscription
                  </>
                )}
              </Button>
            </div>

            {/* Add subscription form */}
            {showAddForm && (
              <Card className="mb-6 border-[#E07B39]/20">
                <CardContent className="p-5">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">New Greeting Subscription</h3>
                  <form onSubmit={handleAddSubscription} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Contact Name *"
                        placeholder="Recipient's name"
                        value={formContactName}
                        onChange={(e) => setFormContactName(e.target.value)}
                      />
                      <Input
                        label="Phone Number *"
                        type="tel"
                        placeholder="Recipient's phone"
                        value={formContactPhone}
                        onChange={(e) => setFormContactPhone(e.target.value)}
                      />
                    </div>

                    <Input
                      label="Email (optional)"
                      type="email"
                      placeholder="Recipient's email"
                      value={formContactEmail}
                      onChange={(e) => setFormContactEmail(e.target.value)}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          Greeting Type *
                        </label>
                        <select
                          value={formGreetingType}
                          onChange={(e) => setFormGreetingType(e.target.value)}
                          className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#E07B39]/20 focus:border-[#E07B39] dark:bg-[#2a2a2a] dark:border-gray-600 dark:text-white"
                        >
                          <option value="">Select type</option>
                          {GREETING_TYPES.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>

                      <Input
                        label="Greeting Date *"
                        type="date"
                        value={formGreetingDate}
                        onChange={(e) => setFormGreetingDate(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Message *
                      </label>
                      <textarea
                        value={formMessage}
                        onChange={(e) => setFormMessage(e.target.value)}
                        rows={3}
                        placeholder="Your greeting message..."
                        className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E07B39]/20 focus:border-[#E07B39] dark:bg-[#2a2a2a] dark:border-gray-600 dark:text-white"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setFormIsRecurring(!formIsRecurring)}
                        className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                      >
                        {formIsRecurring ? (
                          <ToggleRight className="h-6 w-6 text-[#E07B39]" />
                        ) : (
                          <ToggleLeft className="h-6 w-6 text-gray-400" />
                        )}
                        Repeat every year
                      </button>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowAddForm(false);
                          resetForm();
                        }}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" variant="primary" isLoading={submitting}>
                        <Plus className="h-4 w-4 mr-1.5" />
                        Add Subscription
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Subscription list */}
            {subsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-44 rounded-xl" />
                ))}
              </div>
            ) : subscriptions.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Users className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 dark:text-gray-400">No greeting subscriptions yet</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                    Add a subscription to automatically send greetings
                  </p>
                  {!showAddForm && (
                    <Button
                      variant="primary"
                      size="sm"
                      className="mt-3"
                      onClick={() => setShowAddForm(true)}
                    >
                      <Plus className="h-4 w-4 mr-1.5" />
                      Add Your First Subscription
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {subscriptions.map((sub) => (
                  <Card
                    key={sub.id}
                    className={`transition-opacity ${!sub.isActive ? 'opacity-60' : ''}`}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{sub.contactName}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{sub.contactPhone}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Badge variant={sub.isActive ? 'green' : 'default'}>
                            {sub.isActive ? 'Active' : 'Paused'}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-sm mb-3">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <PartyPopper className="h-3.5 w-3.5 flex-shrink-0" />
                          <span>{sub.greetingType}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                          <span>{dayjs(sub.greetingDate).format('DD MMM YYYY')}</span>
                          {sub.isRecurring && (
                            <Badge variant="saffron" className="text-[10px] px-1.5 py-0">
                              Yearly
                            </Badge>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                        {sub.message}
                      </p>

                      {sub.lastSentDate && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
                          Last sent: {dayjs(sub.lastSentDate).format('DD MMM YYYY')}
                        </p>
                      )}

                      <div className="flex items-center gap-2 border-t border-gray-100 dark:border-gray-700 pt-3">
                        <button
                          onClick={() => handleToggleActive(sub)}
                          className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors ${
                            sub.isActive
                              ? 'text-yellow-700 bg-yellow-50 hover:bg-yellow-100'
                              : 'text-green-700 bg-green-50 hover:bg-green-100'
                          }`}
                        >
                          {sub.isActive ? (
                            <>
                              <ToggleRight className="h-3.5 w-3.5" />
                              Pause
                            </>
                          ) : (
                            <>
                              <ToggleLeft className="h-3.5 w-3.5" />
                              Activate
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteSubscription(sub.id)}
                          className="flex items-center gap-1.5 text-xs font-medium text-red-600 px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
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
