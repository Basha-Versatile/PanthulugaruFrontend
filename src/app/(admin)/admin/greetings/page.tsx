'use client';

import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { getUpcomingFestivals } from '@/lib/api/festivals';
import type { Festival } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search, X, Plus, XCircle, Image as ImageIcon,
  MessageSquare, Calendar, ToggleLeft, ToggleRight, Edit
} from 'lucide-react';

interface GreetingCard {
  id: string;
  festivalId?: string;
  title: string;
  message: string;
  imageUrl: string;
  isActive: boolean;
  category?: string;
  scheduledDate?: string;
  createdAt: string;
}

export default function GreetingsPage() {
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [greetings, setGreetings] = useState<GreetingCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingGreeting, setEditingGreeting] = useState<GreetingCard | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formDate, setFormDate] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getUpcomingFestivals();
        if (res.success && res.data) {
          setFestivals(res.data);
          // Generate greeting cards from festivals
          const cards: GreetingCard[] = res.data.map((f: Festival) => ({
            id: f.id,
            festivalId: f.id,
            title: f.name,
            message: f.description || `Wishing you a blessed ${f.name}!`,
            imageUrl: f.image || '',
            isActive: true,
            category: f.category || 'Festival',
            scheduledDate: f.date,
            createdAt: f.createdAt || f.date,
          }));
          setGreetings(cards);
        }
      } catch {
        toast.error('Failed to load greetings');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = greetings.filter((g) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return g.title.toLowerCase().includes(q) || g.message.toLowerCase().includes(q);
  });

  const toggleActive = (id: string) => {
    setGreetings((prev) =>
      prev.map((g) => (g.id === id ? { ...g, isActive: !g.isActive } : g))
    );
    toast.success('Greeting status toggled');
  };

  const openEditModal = (greeting: GreetingCard) => {
    setEditingGreeting(greeting);
    setFormTitle(greeting.title);
    setFormMessage(greeting.message);
    setFormImage(greeting.imageUrl);
    setFormCategory(greeting.category || '');
    setFormDate(greeting.scheduledDate || '');
    setShowCreateModal(true);
  };

  const openCreateModal = () => {
    setEditingGreeting(null);
    setFormTitle('');
    setFormMessage('');
    setFormImage('');
    setFormCategory('');
    setFormDate('');
    setShowCreateModal(true);
  };

  const handleSaveGreeting = () => {
    if (!formTitle.trim()) {
      toast.error('Title is required');
      return;
    }

    if (editingGreeting) {
      setGreetings((prev) =>
        prev.map((g) =>
          g.id === editingGreeting.id
            ? { ...g, title: formTitle, message: formMessage, imageUrl: formImage, category: formCategory, scheduledDate: formDate }
            : g
        )
      );
      toast.success('Greeting updated');
    } else {
      const newGreeting: GreetingCard = {
        id: `greeting-${Date.now()}`,
        title: formTitle,
        message: formMessage,
        imageUrl: formImage,
        isActive: true,
        category: formCategory,
        scheduledDate: formDate,
        createdAt: new Date().toISOString(),
      };
      setGreetings((prev) => [newGreeting, ...prev]);
      toast.success('Greeting created');
    }
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Greetings</h1>
          <p className="text-sm text-gray-500 dark:text-[#E8DDD0]/60">{greetings.length} greeting cards</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="h-4 w-4" /> Create Greeting
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-[#E8DDD0]/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search greetings..."
                className="w-full rounded-lg border border-gray-300 dark:border-[#D4AF37]/15 bg-white dark:bg-[#241C16] pl-10 pr-4 py-2 text-sm dark:text-white dark:placeholder:text-[#E8DDD0]/30 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 dark:focus:ring-[#D4AF37]/20 focus:border-[#FF6B00] dark:focus:border-[#D4AF37]"
              />
            </div>
            {search && (
              <Button variant="ghost" size="sm" onClick={() => setSearch('')}>
                <X className="h-4 w-4" /> Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Grid of Greeting Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <Skeleton className="h-40 w-full rounded-t-xl" />
              <CardContent className="p-4">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <MessageSquare className="h-12 w-12 text-gray-300 dark:text-[#E8DDD0]/30 mx-auto mb-3" />
            <p className="text-gray-400 dark:text-[#E8DDD0]/40">No greetings found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((greeting) => (
            <Card key={greeting.id} className="overflow-hidden">
              {greeting.imageUrl ? (
                <img
                  src={greeting.imageUrl}
                  alt={greeting.title}
                  className="w-full h-40 object-cover"
                />
              ) : (
                <div className="w-full h-40 bg-gradient-to-br from-[#FF6B00]/20 to-[#D4AF37]/20 flex items-center justify-center">
                  <ImageIcon className="h-12 w-12 text-[#FF6B00]/40" />
                </div>
              )}
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{greeting.title}</h3>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => toggleActive(greeting.id)}>
                      {greeting.isActive
                        ? <ToggleRight className="h-5 w-5 text-green-600" />
                        : <ToggleLeft className="h-5 w-5 text-gray-400 dark:text-[#E8DDD0]/40" />
                      }
                    </button>
                    <button onClick={() => openEditModal(greeting)} className="text-gray-400 dark:text-[#E8DDD0]/40 hover:text-[#FF6B00]">
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-[#E8DDD0]/60 line-clamp-2 mb-3">{greeting.message}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {greeting.category && <Badge variant="saffron" className="text-xs">{greeting.category}</Badge>}
                    {greeting.isActive ? <Badge variant="green" className="text-xs">Active</Badge> : <Badge variant="red" className="text-xs">Inactive</Badge>}
                  </div>
                  {greeting.scheduledDate && (
                    <span className="text-xs text-gray-400 dark:text-[#E8DDD0]/40 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {dayjs(greeting.scheduledDate).format('DD MMM')}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowCreateModal(false)}>
          <div className="bg-white dark:bg-[#1A1210] rounded-xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-[#D4AF37]/10">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingGreeting ? 'Edit Greeting' : 'Create Greeting'}
              </h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 dark:text-[#E8DDD0]/40 hover:text-gray-600 dark:hover:text-[#E8DDD0]/70">
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <Input label="Title" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="Greeting title" />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-[#E8DDD0]/80 mb-1.5">Message</label>
                <textarea
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 dark:border-[#D4AF37]/15 bg-white dark:bg-[#241C16] px-3.5 py-2.5 text-sm dark:text-white dark:placeholder:text-[#E8DDD0]/30 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 dark:focus:ring-[#D4AF37]/20 focus:border-[#FF6B00] dark:focus:border-[#D4AF37]"
                  placeholder="Greeting message..."
                />
              </div>
              <Input label="Image URL" value={formImage} onChange={(e) => setFormImage(e.target.value)} placeholder="https://..." />
              {formImage && (
                <img src={formImage} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
              )}
              <Input label="Category" value={formCategory} onChange={(e) => setFormCategory(e.target.value)} placeholder="e.g., Festival, Birthday" />
              <Input label="Scheduled Date" type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} />
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="ghost" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                <Button onClick={handleSaveGreeting}>
                  {editingGreeting ? 'Update' : 'Create'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
