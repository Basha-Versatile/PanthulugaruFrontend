'use client';

import React, { useEffect, useState, useCallback } from 'react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { getLeads, updateLeadStatus } from '@/lib/api/admin';
import type { Lead, PagedResponse } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Search, ChevronLeft, ChevronRight, X, Eye, XCircle } from 'lucide-react';

const LEAD_STATUSES = ['NEW', 'CONTACTED', 'CONVERTED', 'CLOSED', 'SPAM'];
const LEAD_SOURCES = ['INQUIRY', 'UNLOCK', 'ASSISTANCE'];

function getLeadStatusBadge(status: string) {
  switch (status) {
    case 'NEW': return <Badge variant="saffron">New</Badge>;
    case 'CONTACTED': return <Badge variant="gold">Contacted</Badge>;
    case 'CONVERTED': return <Badge variant="green">Converted</Badge>;
    case 'CLOSED': return <Badge variant="default">Closed</Badge>;
    case 'SPAM': return <Badge variant="red">Spam</Badge>;
    default: return <Badge>{status}</Badge>;
  }
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchDebounced, setSearchDebounced] = useState('');

  // Detail modal
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setSearchDebounced(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page, size: 15 };
      if (statusFilter) params.status = statusFilter;

      const res = await getLeads(params as any);
      if (res.success && res.data) {
        const data = res.data as PagedResponse<Lead>;
        let filtered = data.content;
        if (searchDebounced) {
          const q = searchDebounced.toLowerCase();
          filtered = filtered.filter(
            (l) =>
              l.customerName.toLowerCase().includes(q) ||
              l.customerPhone.includes(q) ||
              l.panthulugaruName.toLowerCase().includes(q)
          );
        }
        setLeads(filtered);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      } else {
        toast.error(res.message || 'Failed to load leads');
      }
    } catch {
      toast.error('Failed to load leads');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, searchDebounced]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    setPage(0);
  }, [statusFilter, searchDebounced]);

  const handleStatusUpdate = async (leadId: string, newStatus: string) => {
    setUpdatingStatus(leadId);
    try {
      const res = await updateLeadStatus(leadId, newStatus);
      if (res.success) {
        toast.success('Lead status updated');
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, status: newStatus as Lead['status'] } : l))
        );
        if (selectedLead?.id === leadId) {
          setSelectedLead((prev) => prev ? { ...prev, status: newStatus as Lead['status'] } : null);
        }
      } else {
        toast.error(res.message || 'Failed to update status');
      }
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('');
    setPage(0);
  };

  const hasFilters = search || statusFilter;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leads Management</h1>
        <p className="text-sm text-gray-500 dark:text-[#E8DDD0]/60">{totalElements} total leads</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-[#E8DDD0]/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by customer, phone, PG..."
                className="w-full rounded-lg border border-gray-300 dark:border-[#D4AF37]/15 bg-white dark:bg-[#241C16] dark:text-white dark:placeholder:text-[#E8DDD0]/30 pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00] dark:focus:ring-[#D4AF37]/20 dark:focus:border-[#D4AF37]"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-300 dark:border-[#D4AF37]/15 bg-white dark:bg-[#241C16] dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00] dark:focus:ring-[#D4AF37]/20 dark:focus:border-[#D4AF37]"
            >
              <option value="">All Status</option>
              {LEAD_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
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
              <thead className="bg-gray-50 dark:bg-[#241C16] border-b border-gray-200 dark:border-[#D4AF37]/10 sticky top-0">
                <tr>
                  <th className="text-left font-medium text-gray-500 dark:text-[#E8DDD0]/60 px-4 py-3">Customer</th>
                  <th className="text-left font-medium text-gray-500 dark:text-[#E8DDD0]/60 px-4 py-3">Phone</th>
                  <th className="text-left font-medium text-gray-500 dark:text-[#E8DDD0]/60 px-4 py-3">PG Name</th>
                  <th className="text-left font-medium text-gray-500 dark:text-[#E8DDD0]/60 px-4 py-3">Source</th>
                  <th className="text-left font-medium text-gray-500 dark:text-[#E8DDD0]/60 px-4 py-3">Status</th>
                  <th className="text-left font-medium text-gray-500 dark:text-[#E8DDD0]/60 px-4 py-3">Created</th>
                  <th className="text-left font-medium text-gray-500 dark:text-[#E8DDD0]/60 px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#D4AF37]/5">
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 7 }).map((_, j) => (
                        <td key={j} className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
                      ))}
                    </tr>
                  ))
                ) : leads.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-400 dark:text-[#E8DDD0]/40">
                      No leads found.
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50 dark:hover:bg-[#241C16] transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{lead.customerName}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-[#E8DDD0]/70">{lead.customerPhone}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-[#E8DDD0]/70 max-w-[150px] truncate">{lead.panthulugaruName}</td>
                      <td className="px-4 py-3">
                        <Badge variant={lead.source === 'UNLOCK' ? 'saffron' : lead.source === 'INQUIRY' ? 'default' : 'gold'}>
                          {lead.source || 'N/A'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusUpdate(lead.id, e.target.value)}
                          disabled={updatingStatus === lead.id}
                          className="rounded border border-gray-200 dark:border-[#D4AF37]/10 bg-white dark:bg-[#241C16] dark:text-white px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#FF6B00] dark:focus:ring-[#D4AF37]/20 dark:focus:border-[#D4AF37]"
                        >
                          {LEAD_STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-[#E8DDD0]/60">{dayjs(lead.createdAt).format('DD MMM YYYY')}</td>
                      <td className="px-4 py-3">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedLead(lead)}>
                          <Eye className="h-4 w-4" />
                        </Button>
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
          <p className="text-sm text-gray-500 dark:text-[#E8DDD0]/60">Page {page + 1} of {totalPages}</p>
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

      {/* Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedLead(null)}>
          <div className="bg-white dark:bg-[#1A1210] rounded-xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-[#D4AF37]/10">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Lead Details</h2>
              <button onClick={() => setSelectedLead(null)} className="text-gray-400 dark:text-[#E8DDD0]/40 hover:text-gray-600 dark:hover:text-[#E8DDD0]/70">
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <DetailRow label="Customer" value={selectedLead.customerName} />
              <DetailRow label="Phone" value={selectedLead.customerPhone} />
              <DetailRow label="Email" value={selectedLead.customerEmail || '-'} />
              <DetailRow label="PG" value={selectedLead.panthulugaruName} />
              <DetailRow label="Ritual" value={selectedLead.ritualName || '-'} />
              <DetailRow label="City" value={selectedLead.city || '-'} />
              <DetailRow label="Source" value={selectedLead.source || '-'} />
              <DetailRow label="Status" value={selectedLead.status} />
              <DetailRow label="Unlocked" value={selectedLead.isUnlocked ? 'Yes' : 'No'} />
              {selectedLead.message && <DetailRow label="Message" value={selectedLead.message} />}
              <DetailRow label="Created" value={dayjs(selectedLead.createdAt).format('DD MMM YYYY, hh:mm A')} />
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
      <span className="text-sm text-gray-500 dark:text-[#E8DDD0]/60 shrink-0">{label}</span>
      <span className="text-sm font-medium text-gray-900 dark:text-white text-right">{value}</span>
    </div>
  );
}
