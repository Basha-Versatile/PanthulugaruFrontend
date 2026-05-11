'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { getPGById, updatePG, updatePGStatus } from '@/lib/api/admin';
import type { Panthulugaru } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ArrowLeft, Save, User, Phone, Mail, MapPin,
  Star, Calendar, BookOpen, Building, Shield
} from 'lucide-react';

function getStatusBadge(status: string) {
  switch (status) {
    case 'ACTIVE': return <Badge variant="green">Active</Badge>;
    case 'PENDING': case 'PENDING_APPROVAL': return <Badge variant="gold">Pending</Badge>;
    case 'DRAFT': return <Badge variant="default">Draft</Badge>;
    case 'REJECTED': return <Badge variant="red">Rejected</Badge>;
    default: return <Badge>{status}</Badge>;
  }
}

const STATUS_OPTIONS = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'PENDING_APPROVAL', label: 'Pending Approval' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'REJECTED', label: 'Rejected' },
];

export default function PGDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [pg, setPg] = useState<Panthulugaru | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusValue, setStatusValue] = useState('');
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    const fetchPG = async () => {
      setLoading(true);
      try {
        const res = await getPGById(id);
        if (res.success && res.data) {
          setPg(res.data);
          setStatusValue(res.data.status);
        } else {
          toast.error(res.message || 'PG not found');
        }
      } catch {
        toast.error('Failed to load PG details');
      } finally {
        setLoading(false);
      }
    };
    fetchPG();
  }, [id]);

  const handleStatusChange = async () => {
    if (!pg) return;
    setSaving(true);
    try {
      const res = await updatePGStatus(pg.id, statusValue, statusValue === 'REJECTED' ? rejectReason : undefined);
      if (res.success && res.data) {
        setPg(res.data);
        toast.success('Status updated successfully');
        setRejectReason('');
      } else {
        toast.error(res.message || 'Failed to update status');
      }
    } catch {
      toast.error('Failed to update status');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card><CardContent className="p-6"><div className="space-y-4">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-6 w-full" />)}</div></CardContent></Card>
          <Card><CardContent className="p-6"><div className="space-y-4">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-6 w-full" />)}</div></CardContent></Card>
        </div>
      </div>
    );
  }

  if (!pg) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 dark:text-[#E8DDD0]/60 mb-4">PG not found</p>
        <Button variant="outline" onClick={() => router.push('/admin/pgs')}>
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
          <Button variant="ghost" size="sm" onClick={() => router.push('/admin/pgs')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{pg.firstName} {pg.lastName}</h1>
            <p className="text-sm text-gray-500 dark:text-[#E8DDD0]/60">PG ID: {pg.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(pg.status)}
          {pg.isVerified && <Badge variant="green">Verified</Badge>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><User className="h-5 w-5" /> Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoRow label="First Name" value={pg.firstName} />
                <InfoRow label="Last Name" value={pg.lastName} />
                <InfoRow label="Gender" value={pg.gender || '-'} />
                <InfoRow label="Date of Birth" value={pg.dateOfBirth ? dayjs(pg.dateOfBirth).format('DD MMM YYYY') : '-'} />
                <InfoRow label="Experience" value={`${pg.experience} years`} />
                <InfoRow label="Qualification" value={pg.qualification || '-'} />
                <InfoRow label="Languages" value={pg.languages?.join(', ') || '-'} />
                <InfoRow label="Specializations" value={pg.specializations?.join(', ') || '-'} />
              </div>
              {pg.aboutMe && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-[#D4AF37]/5">
                  <p className="text-sm font-medium text-gray-500 dark:text-[#E8DDD0]/60 mb-1">About</p>
                  <p className="text-sm text-gray-700 dark:text-[#E8DDD0]/80">{pg.aboutMe}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><Phone className="h-5 w-5" /> Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoRow label="Email" value={pg.email} icon={<Mail className="h-4 w-4 text-gray-400 dark:text-[#E8DDD0]/40" />} />
                <InfoRow label="Phone" value={pg.phone} icon={<Phone className="h-4 w-4 text-gray-400 dark:text-[#E8DDD0]/40" />} />
              </div>
            </CardContent>
          </Card>

          {/* Rituals */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><BookOpen className="h-5 w-5" /> Rituals ({pg.rituals?.length ?? 0})</CardTitle>
            </CardHeader>
            <CardContent>
              {pg.rituals && pg.rituals.length > 0 ? (
                <div className="space-y-3">
                  {pg.rituals.map((r, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 dark:bg-[#241C16] rounded-lg">
                      <p className="font-medium text-gray-900 dark:text-white text-sm">{r.ritualName}</p>
                      {r.subRituals && r.subRituals.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {r.subRituals.map((sr, si) => (
                            <div key={si} className="flex items-center justify-between text-xs text-gray-600 dark:text-[#E8DDD0]/70 pl-3">
                              <span>{sr.subRitualName}</span>
                              <span className="font-medium">₹{sr.price?.toLocaleString('en-IN')}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 dark:text-[#E8DDD0]/40">No rituals added</p>
              )}
            </CardContent>
          </Card>

          {/* Service Areas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><MapPin className="h-5 w-5" /> Service Areas</CardTitle>
            </CardHeader>
            <CardContent>
              {pg.serviceAreas && pg.serviceAreas.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {pg.serviceAreas.map((area, idx) => (
                    <Badge key={idx} variant="outline">
                      {area.city}, {area.district}, {area.state}
                      {area.isPrimary && <span className="ml-1 text-[#FF6B00]">(Primary)</span>}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 dark:text-[#E8DDD0]/40">No service areas added</p>
              )}
            </CardContent>
          </Card>

          {/* Bank Details */}
          {pg.bankDetails && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2"><Building className="h-5 w-5" /> Bank Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoRow label="Account Holder" value={pg.bankDetails.accountHolderName} />
                  <InfoRow label="Account Number" value={pg.bankDetails.accountNumber} />
                  <InfoRow label="IFSC Code" value={pg.bankDetails.ifscCode} />
                  <InfoRow label="Bank Name" value={pg.bankDetails.bankName} />
                  <InfoRow label="Branch" value={pg.bankDetails.branchName || '-'} />
                  <InfoRow label="UPI ID" value={pg.bankDetails.upiId || '-'} />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Status & Stats */}
        <div className="space-y-6">
          {/* Status Management */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><Shield className="h-5 w-5" /> Status Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-[#E8DDD0]/80 mb-1.5">Current Status</label>
                <select
                  value={statusValue}
                  onChange={(e) => setStatusValue(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-[#D4AF37]/15 bg-white dark:bg-[#241C16] px-3 py-2.5 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00] dark:focus:ring-[#D4AF37]/20 dark:focus:border-[#D4AF37]"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {statusValue === 'REJECTED' && (
                <div>
                  <Input
                    label="Rejection Reason"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Enter reason for rejection"
                  />
                </div>
              )}

              <Button
                onClick={handleStatusChange}
                isLoading={saving}
                disabled={statusValue === pg.status}
                className="w-full"
              >
                <Save className="h-4 w-4" /> Update Status
              </Button>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><Star className="h-5 w-5" /> Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <StatRow label="Rating" value={`${pg.rating?.toFixed(1) ?? '0.0'} / 5`} />
                <StatRow label="Reviews" value={pg.reviewCount?.toString() ?? '0'} />
                <StatRow label="Total Bookings" value={pg.totalBookings?.toString() ?? '0'} />
                <StatRow label="Onboarding Step" value={`${pg.onboardingStep}`} />
                <StatRow label="Available" value={pg.isAvailable ? 'Yes' : 'No'} />
                <StatRow label="Created" value={dayjs(pg.createdAt).format('DD MMM YYYY')} />
                <StatRow label="Updated" value={dayjs(pg.updatedAt).format('DD MMM YYYY')} />
              </div>
            </CardContent>
          </Card>

          {/* Gallery */}
          {pg.gallery && pg.gallery.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Gallery ({pg.gallery.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {pg.gallery.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Gallery ${idx + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500 dark:text-[#E8DDD0]/60 mb-0.5">{label}</p>
      <div className="flex items-center gap-1.5">
        {icon}
        <p className="text-sm text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-gray-50 dark:border-[#D4AF37]/5 last:border-0">
      <span className="text-sm text-gray-500 dark:text-[#E8DDD0]/60">{label}</span>
      <span className="text-sm font-medium text-gray-900 dark:text-white">{value}</span>
    </div>
  );
}
