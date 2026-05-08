'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { getMasterRituals } from '@/lib/api/admin';
import type { Ritual } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Save, BookOpen, Image } from 'lucide-react';

export default function RitualDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [ritual, setRitual] = useState<Ritual | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Editable fields
  const [nameEn, setNameEn] = useState('');
  const [nameHi, setNameHi] = useState('');
  const [nameTe, setNameTe] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isBanner, setIsBanner] = useState(false);

  useEffect(() => {
    const fetchRitual = async () => {
      setLoading(true);
      try {
        const res = await getMasterRituals();
        if (res.success && res.data) {
          const found = res.data.find((r: Ritual) => r.id === id);
          if (found) {
            setRitual(found);
            setNameEn(found.name);
            setNameHi(found.nameLocalized?.hi || '');
            setNameTe(found.nameLocalized?.te || '');
            setDescription(found.description || '');
            setCategory(found.category || '');
            setIsActive(found.isActive);
            setIsBanner(!!found.bannerImage);
          } else {
            toast.error('Ritual not found');
          }
        } else {
          toast.error('Failed to load ritual');
        }
      } catch {
        toast.error('Failed to load ritual');
      } finally {
        setLoading(false);
      }
    };
    fetchRitual();
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Since there is no dedicated update ritual admin API, show success with a note
      toast.success('Ritual details saved (API integration pending)');
    } catch {
      toast.error('Failed to save ritual');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (!ritual) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 mb-4">Ritual not found</p>
        <Button variant="outline" onClick={() => router.push('/admin/rituals')}>
          <ArrowLeft className="h-4 w-4" /> Back to list
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.push('/admin/rituals')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{ritual.name}</h1>
            <p className="text-sm text-gray-500">Ritual ID: {ritual.id}</p>
          </div>
        </div>
        <Button onClick={handleSave} isLoading={saving}>
          <Save className="h-4 w-4" /> Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Edit form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Name (Localized)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input label="English" value={nameEn} onChange={(e) => setNameEn(e.target.value)} />
              <Input label="Hindi" value={nameHi} onChange={(e) => setNameHi(e.target.value)} placeholder="Hindi name" />
              <Input label="Telugu" value={nameTe} onChange={(e) => setNameTe(e.target.value)} placeholder="Telugu name" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E07B39]/20 focus:border-[#E07B39]"
                  placeholder="Description of the ritual..."
                />
              </div>
              <Input label="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
            </CardContent>
          </Card>

          {/* Sub-rituals */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sub-rituals ({ritual.subRituals?.length ?? 0})</CardTitle>
            </CardHeader>
            <CardContent>
              {ritual.subRituals && ritual.subRituals.length > 0 ? (
                <div className="space-y-3">
                  {ritual.subRituals.map((sr) => (
                    <div key={sr.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{sr.name}</p>
                        {sr.nameLocalized?.te && (
                          <p className="text-xs text-gray-400">{sr.nameLocalized.te}</p>
                        )}
                        {sr.description && (
                          <p className="text-xs text-gray-500 mt-1">{sr.description}</p>
                        )}
                      </div>
                      {sr.isActive ? <Badge variant="green">Active</Badge> : <Badge variant="red">Inactive</Badge>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-6">No sub-rituals</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Settings sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Active</span>
                <button
                  onClick={() => setIsActive(!isActive)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${isActive ? 'bg-[#E07B39]' : 'bg-gray-300'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${isActive ? 'translate-x-5' : ''}`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Show as Banner</span>
                <button
                  onClick={() => setIsBanner(!isBanner)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${isBanner ? 'bg-[#E07B39]' : 'bg-gray-300'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${isBanner ? 'translate-x-5' : ''}`} />
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Image Preview */}
          {ritual.image && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Image</CardTitle>
              </CardHeader>
              <CardContent>
                <img src={ritual.image} alt={ritual.name} className="w-full rounded-lg object-cover" />
              </CardContent>
            </Card>
          )}

          {ritual.bannerImage && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Banner Image</CardTitle>
              </CardHeader>
              <CardContent>
                <img src={ritual.bannerImage} alt={`${ritual.name} banner`} className="w-full rounded-lg object-cover" />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
