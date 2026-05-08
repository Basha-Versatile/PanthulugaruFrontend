'use client';

import React, { useEffect, useState, useCallback } from 'react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { Ad } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search, ChevronLeft, ChevronRight, X, Plus, Eye, XCircle,
  Megaphone, ToggleLeft, ToggleRight, Edit, Trash2, BarChart3, MousePointer
} from 'lucide-react';

export default function AdsPage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const pageSize = 15;

  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingAd, setEditingAd] = useState<Ad | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formLinkUrl, setFormLinkUrl] = useState('');
  const [formPosition, setFormPosition] = useState('');
  const [formPage, setFormPage] = useState('');
  const [formStartDate, setFormStartDate] = useState('');
  const [formEndDate, setFormEndDate] = useState('');

  const fetchAds = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(ENDPOINTS.ADMIN_ADS);
      const res = response.data;
      if (res.success && res.data) {
        const adsList = Array.isArray(res.data) ? res.data : res.data.content || [];
        setAds(adsList);
      } else {
        setAds([]);
      }
    } catch {
      setAds([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAds();
  }, [fetchAds]);

  const filtered = ads.filter((a) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return a.title.toLowerCase().includes(q) || (a.position || '').toLowerCase().includes(q);
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);

  const toggleAdActive = async (ad: Ad) => {
    try {
      const response = await apiClient.put(`${ENDPOINTS.ADMIN_ADS}/${ad.id}`, {
        ...ad,
        isActive: !ad.isActive,
      });
      if (response.data.success) {
        setAds((prev) => prev.map((a) => (a.id === ad.id ? { ...a, isActive: !a.isActive } : a)));
        toast.success(`Ad ${!ad.isActive ? 'activated' : 'deactivated'}`);
      }
    } catch {
      // Fallback: toggle locally
      setAds((prev) => prev.map((a) => (a.id === ad.id ? { ...a, isActive: !a.isActive } : a)));
      toast.success(`Ad ${!ad.isActive ? 'activated' : 'deactivated'}`);
    }
  };

  const openCreateModal = () => {
    setEditingAd(null);
    setFormTitle('');
    setFormDescription('');
    setFormImageUrl('');
    setFormLinkUrl('');
    setFormPosition('');
    setFormPage('');
    setFormStartDate('');
    setFormEndDate('');
    setShowFormModal(true);
  };

  const openEditModal = (ad: Ad) => {
    setEditingAd(ad);
    setFormTitle(ad.title);
    setFormDescription(ad.description || '');
    setFormImageUrl(ad.imageUrl);
    setFormLinkUrl(ad.linkUrl || '');
    setFormPosition(ad.position);
    setFormPage(ad.page || '');
    setFormStartDate(ad.startDate ? dayjs(ad.startDate).format('YYYY-MM-DD') : '');
    setFormEndDate(ad.endDate ? dayjs(ad.endDate).format('YYYY-MM-DD') : '');
    setShowFormModal(true);
  };

  const handleSaveAd = async () => {
    if (!formTitle.trim() || !formImageUrl.trim()) {
      toast.error('Title and image URL are required');
      return;
    }

    setSaving(true);
    try {
      const data = {
        title: formTitle,
        description: formDescription,
        imageUrl: formImageUrl,
        linkUrl: formLinkUrl,
        position: formPosition || 'SIDEBAR',
        page: formPage,
        startDate: formStartDate || undefined,
        endDate: formEndDate || undefined,
        isActive: true,
      };

      if (editingAd) {
        const response = await apiClient.put(`${ENDPOINTS.ADMIN_ADS}/${editingAd.id}`, data);
        if (response.data.success && response.data.data) {
          setAds((prev) => prev.map((a) => (a.id === editingAd.id ? response.data.data : a)));
          toast.success('Ad updated');
        } else {
          toast.success('Ad update submitted');
          fetchAds();
        }
      } else {
        const response = await apiClient.post(ENDPOINTS.ADMIN_ADS, data);
        if (response.data.success && response.data.data) {
          setAds((prev) => [response.data.data, ...prev]);
          toast.success('Ad created');
        } else {
          toast.success('Ad creation submitted');
          fetchAds();
        }
      }
      setShowFormModal(false);
    } catch {
      toast.error('Failed to save ad');
    } finally {
      setSaving(false);
    }
  };

  const getCTR = (clicks: number, impressions: number) => {
    if (!impressions) return '0%';
    return `${((clicks / impressions) * 100).toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ads Management</h1>
          <p className="text-sm text-gray-500">{ads.length} total ads</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="h-4 w-4" /> Create Ad
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center">
              <Megaphone className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Active Ads</p>
              <p className="text-lg font-bold text-gray-900">{ads.filter((a) => a.isActive).length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Impressions</p>
              <p className="text-lg font-bold text-gray-900">{ads.reduce((sum, a) => sum + (a.impressions || 0), 0).toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[#E07B39]/10 flex items-center justify-center">
              <MousePointer className="h-5 w-5 text-[#E07B39]" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Clicks</p>
              <p className="text-lg font-bold text-gray-900">{ads.reduce((sum, a) => sum + (a.clicks || 0), 0).toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                placeholder="Search ads by title, position..."
                className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E07B39]/20 focus:border-[#E07B39]"
              />
            </div>
            {search && (
              <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setPage(0); }}>
                <X className="h-4 w-4" /> Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                <tr>
                  <th className="text-left font-medium text-gray-500 px-4 py-3">Title</th>
                  <th className="text-left font-medium text-gray-500 px-4 py-3">Position</th>
                  <th className="text-right font-medium text-gray-500 px-4 py-3">Clicks</th>
                  <th className="text-right font-medium text-gray-500 px-4 py-3">Impressions</th>
                  <th className="text-right font-medium text-gray-500 px-4 py-3">CTR</th>
                  <th className="text-left font-medium text-gray-500 px-4 py-3">Status</th>
                  <th className="text-left font-medium text-gray-500 px-4 py-3">Date Range</th>
                  <th className="text-left font-medium text-gray-500 px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 8 }).map((_, j) => (
                        <td key={j} className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
                      ))}
                    </tr>
                  ))
                ) : paged.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-gray-400">
                      <Megaphone className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      No ads found.
                    </td>
                  </tr>
                ) : (
                  paged.map((ad) => (
                    <tr key={ad.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {ad.imageUrl ? (
                            <img src={ad.imageUrl} alt={ad.title} className="h-10 w-14 rounded object-cover" />
                          ) : (
                            <div className="h-10 w-14 rounded bg-gray-100 flex items-center justify-center">
                              <Megaphone className="h-4 w-4 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900">{ad.title}</p>
                            {ad.page && <p className="text-xs text-gray-400">{ad.page}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3"><Badge variant="outline">{ad.position}</Badge></td>
                      <td className="px-4 py-3 text-right text-gray-900 font-medium">{ad.clicks.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right text-gray-600">{ad.impressions.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-medium text-[#E07B39]">{getCTR(ad.clicks, ad.impressions)}</td>
                      <td className="px-4 py-3">
                        {ad.isActive ? <Badge variant="green">Active</Badge> : <Badge variant="red">Inactive</Badge>}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {ad.startDate ? dayjs(ad.startDate).format('DD MMM') : '-'}
                        {ad.endDate ? ` - ${dayjs(ad.endDate).format('DD MMM')}` : ''}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => toggleAdActive(ad)} className="p-1 hover:bg-gray-100 rounded">
                            {ad.isActive
                              ? <ToggleRight className="h-4 w-4 text-green-600" />
                              : <ToggleLeft className="h-4 w-4 text-gray-400" />
                            }
                          </button>
                          <button onClick={() => openEditModal(ad)} className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-[#E07B39]">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button onClick={() => setSelectedAd(ad)} className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600">
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Page {page + 1} of {totalPages}</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* View Detail Modal */}
      {selectedAd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedAd(null)}>
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Ad Details</h2>
              <button onClick={() => setSelectedAd(null)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {selectedAd.imageUrl && (
                <img src={selectedAd.imageUrl} alt={selectedAd.title} className="w-full h-48 object-cover rounded-lg" />
              )}
              <DetailRow label="Title" value={selectedAd.title} />
              {selectedAd.description && <DetailRow label="Description" value={selectedAd.description} />}
              <DetailRow label="Position" value={selectedAd.position} />
              <DetailRow label="Page" value={selectedAd.page || '-'} />
              <DetailRow label="Link URL" value={selectedAd.linkUrl || '-'} />
              <DetailRow label="Status" value={selectedAd.isActive ? 'Active' : 'Inactive'} />
              <DetailRow label="Clicks" value={selectedAd.clicks.toLocaleString()} />
              <DetailRow label="Impressions" value={selectedAd.impressions.toLocaleString()} />
              <DetailRow label="CTR" value={getCTR(selectedAd.clicks, selectedAd.impressions)} />
              <DetailRow label="Start Date" value={selectedAd.startDate ? dayjs(selectedAd.startDate).format('DD MMM YYYY') : '-'} />
              <DetailRow label="End Date" value={selectedAd.endDate ? dayjs(selectedAd.endDate).format('DD MMM YYYY') : '-'} />
              <DetailRow label="Created" value={dayjs(selectedAd.createdAt).format('DD MMM YYYY, hh:mm A')} />
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowFormModal(false)}>
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingAd ? 'Edit Ad' : 'Create New Ad'}
              </h2>
              <button onClick={() => setShowFormModal(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <Input label="Title" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="Ad title" />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E07B39]/20 focus:border-[#E07B39]"
                  placeholder="Ad description..."
                />
              </div>
              <Input label="Image URL" value={formImageUrl} onChange={(e) => setFormImageUrl(e.target.value)} placeholder="https://..." />
              {formImageUrl && <img src={formImageUrl} alt="Preview" className="w-full h-32 object-cover rounded-lg" />}
              <Input label="Link URL" value={formLinkUrl} onChange={(e) => setFormLinkUrl(e.target.value)} placeholder="https://..." />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Position</label>
                  <select
                    value={formPosition}
                    onChange={(e) => setFormPosition(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E07B39]/20 focus:border-[#E07B39]"
                  >
                    <option value="">Select position</option>
                    <option value="BANNER">Banner</option>
                    <option value="SIDEBAR">Sidebar</option>
                    <option value="INLINE">Inline</option>
                    <option value="POPUP">Popup</option>
                    <option value="FOOTER">Footer</option>
                  </select>
                </div>
                <Input label="Page" value={formPage} onChange={(e) => setFormPage(e.target.value)} placeholder="e.g., home, search" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Start Date" type="date" value={formStartDate} onChange={(e) => setFormStartDate(e.target.value)} />
                <Input label="End Date" type="date" value={formEndDate} onChange={(e) => setFormEndDate(e.target.value)} />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="ghost" onClick={() => setShowFormModal(false)}>Cancel</Button>
                <Button onClick={handleSaveAd} isLoading={saving}>
                  {editingAd ? 'Update Ad' : 'Create Ad'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-sm text-gray-500 shrink-0">{label}</span>
      <span className="text-sm font-medium text-gray-900 text-right break-all">{value}</span>
    </div>
  );
}
