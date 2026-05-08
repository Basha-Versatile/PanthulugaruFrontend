'use client';

import React, { useEffect, useState, useCallback } from 'react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { getPayments } from '@/lib/api/admin';
import type { Payment, PagedResponse } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Search, ChevronLeft, ChevronRight, X, Eye, XCircle, CreditCard, IndianRupee } from 'lucide-react';

const PAYMENT_STATUSES = ['CREATED', 'SUCCESS', 'FAILED', 'REFUNDED', 'PENDING'];
const PAYMENT_TYPES = ['BOOKING', 'UNLOCK', 'SUBSCRIPTION', 'LEAD'];

function getPaymentStatusBadge(status: string) {
  switch (status) {
    case 'SUCCESS': return <Badge variant="green">Success</Badge>;
    case 'PENDING': case 'CREATED': return <Badge variant="gold">Pending</Badge>;
    case 'FAILED': return <Badge variant="red">Failed</Badge>;
    case 'REFUNDED': return <Badge variant="saffron">Refunded</Badge>;
    default: return <Badge>{status}</Badge>;
  }
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [searchDebounced, setSearchDebounced] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setSearchDebounced(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page, size: 15 };
      if (statusFilter) params.status = statusFilter;
      if (typeFilter) params.paymentType = typeFilter;

      const res = await getPayments(params as any);
      if (res.success && res.data) {
        const data = res.data as PagedResponse<Payment>;
        let filtered = data.content;
        if (searchDebounced) {
          const q = searchDebounced.toLowerCase();
          filtered = filtered.filter(
            (p) =>
              p.id.toLowerCase().includes(q) ||
              p.orderId.toLowerCase().includes(q) ||
              (p.customerName || '').toLowerCase().includes(q)
          );
        }
        setPayments(filtered);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
        setTotalAmount(filtered.reduce((sum, p) => sum + (p.amount || 0), 0));
      } else {
        toast.error(res.message || 'Failed to load payments');
      }
    } catch {
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, typeFilter, searchDebounced]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  useEffect(() => {
    setPage(0);
  }, [statusFilter, typeFilter, searchDebounced]);

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('');
    setTypeFilter('');
    setPage(0);
  };

  const hasFilters = search || statusFilter || typeFilter;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
        <p className="text-sm text-gray-500">{totalElements} total payments</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center">
              <IndianRupee className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Amount (page)</p>
              <p className="text-lg font-bold text-gray-900">₹{totalAmount.toLocaleString('en-IN')}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[#E07B39]/10 flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-[#E07B39]" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Transactions</p>
              <p className="text-lg font-bold text-gray-900">{totalElements}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Showing</p>
              <p className="text-lg font-bold text-gray-900">{payments.length} records</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by ID, order, customer..."
                className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E07B39]/20 focus:border-[#E07B39]"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E07B39]/20 focus:border-[#E07B39]"
            >
              <option value="">All Status</option>
              {PAYMENT_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E07B39]/20 focus:border-[#E07B39]"
            >
              <option value="">All Types</option>
              {PAYMENT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
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
              <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                <tr>
                  <th className="text-left font-medium text-gray-500 px-4 py-3">Payment ID</th>
                  <th className="text-left font-medium text-gray-500 px-4 py-3">Customer</th>
                  <th className="text-right font-medium text-gray-500 px-4 py-3">Amount</th>
                  <th className="text-left font-medium text-gray-500 px-4 py-3">Type</th>
                  <th className="text-left font-medium text-gray-500 px-4 py-3">Provider</th>
                  <th className="text-left font-medium text-gray-500 px-4 py-3">Status</th>
                  <th className="text-left font-medium text-gray-500 px-4 py-3">Date</th>
                  <th className="text-left font-medium text-gray-500 px-4 py-3">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 8 }).map((_, j) => (
                        <td key={j} className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
                      ))}
                    </tr>
                  ))
                ) : payments.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-gray-400">No payments found.</td>
                  </tr>
                ) : (
                  payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-600 font-mono text-xs">{payment.id.slice(0, 12)}...</td>
                      <td className="px-4 py-3 text-gray-900">{payment.customerName || '-'}</td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900">₹{payment.amount?.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3"><Badge variant="outline">{payment.paymentType}</Badge></td>
                      <td className="px-4 py-3 text-gray-600">{payment.provider}</td>
                      <td className="px-4 py-3">{getPaymentStatusBadge(payment.status)}</td>
                      <td className="px-4 py-3 text-gray-500">{dayjs(payment.createdAt).format('DD MMM YYYY')}</td>
                      <td className="px-4 py-3">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedPayment(payment)}>
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

      {/* Detail Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedPayment(null)}>
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Payment Details</h2>
              <button onClick={() => setSelectedPayment(null)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <DetailRow label="Payment ID" value={selectedPayment.id} />
              <DetailRow label="Order ID" value={selectedPayment.orderId} />
              <DetailRow label="Amount" value={`₹${selectedPayment.amount?.toLocaleString('en-IN')} ${selectedPayment.currency}`} />
              <DetailRow label="Type" value={selectedPayment.paymentType} />
              <DetailRow label="Status" value={selectedPayment.status} />
              <DetailRow label="Provider" value={selectedPayment.provider} />
              <DetailRow label="Provider Payment ID" value={selectedPayment.providerPaymentId || '-'} />
              <DetailRow label="Customer" value={selectedPayment.customerName || '-'} />
              <DetailRow label="Customer ID" value={selectedPayment.customerId || '-'} />
              <DetailRow label="PG ID" value={selectedPayment.panthulugaruId || '-'} />
              <DetailRow label="Booking ID" value={selectedPayment.bookingId || '-'} />
              <DetailRow label="Created" value={dayjs(selectedPayment.createdAt).format('DD MMM YYYY, hh:mm A')} />
              <DetailRow label="Updated" value={dayjs(selectedPayment.updatedAt).format('DD MMM YYYY, hh:mm A')} />
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
