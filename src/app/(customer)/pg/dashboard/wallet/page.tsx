'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Wallet as WalletIcon,
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  Clock,
  Banknote,
  ChevronLeft,
  ChevronRight,
  X,
  IndianRupee,
} from 'lucide-react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { RouteGuard } from '@/components/auth/RouteGuard';
import { getWalletBalance, getTransactions, requestWithdrawal, getMyWithdrawals } from '@/lib/api/wallet';
import type { Wallet, TransactionHistory, Withdraw } from '@/types';

function WalletPageContent() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<TransactionHistory[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdraw[]>([]);
  const [walletLoading, setWalletLoading] = useState(true);
  const [txLoading, setTxLoading] = useState(true);
  const [wdLoading, setWdLoading] = useState(true);
  const [txPage, setTxPage] = useState(1);
  const [txTotalPages, setTxTotalPages] = useState(1);
  const [wdPage, setWdPage] = useState(1);
  const [wdTotalPages, setWdTotalPages] = useState(1);

  // Withdrawal modal
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [bankDetailsId, setBankDetailsId] = useState('default');
  const [submitting, setSubmitting] = useState(false);

  const fetchWallet = useCallback(async () => {
    setWalletLoading(true);
    try {
      const response = await getWalletBalance();
      const data = response.data;
      if ((data?.success || data?.status) && data.data) {
        setWallet(data.data);
      }
    } catch {
      toast.error('Failed to load wallet');
    } finally {
      setWalletLoading(false);
    }
  }, []);

  const fetchTransactions = useCallback(async () => {
    setTxLoading(true);
    try {
      const response = await getTransactions(txPage, 10);
      const data = response.data;
      if ((data?.success || data?.status) && data.data) {
        const items = Array.isArray(data.data) ? data.data : data.data.content || [];
        setTransactions(items);
        if (data.data.totalPages) {
          setTxTotalPages(data.data.totalPages);
        }
      }
    } catch {
      toast.error('Failed to load transactions');
    } finally {
      setTxLoading(false);
    }
  }, [txPage]);

  const fetchWithdrawals = useCallback(async () => {
    setWdLoading(true);
    try {
      const response = await getMyWithdrawals(wdPage, 10);
      const data = response.data;
      if ((data?.success || data?.status) && data.data) {
        const items = Array.isArray(data.data) ? data.data : data.data.content || [];
        setWithdrawals(items);
        if (data.data.totalPages) {
          setWdTotalPages(data.data.totalPages);
        }
      }
    } catch {
      toast.error('Failed to load withdrawals');
    } finally {
      setWdLoading(false);
    }
  }, [wdPage]);

  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    fetchWithdrawals();
  }, [fetchWithdrawals]);

  const handleWithdrawalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (wallet && amount > wallet.amount) {
      toast.error('Insufficient balance');
      return;
    }
    setSubmitting(true);
    try {
      const response = await requestWithdrawal(amount, bankDetailsId);
      const data = response.data;
      if (data?.success || data?.status) {
        toast.success('Withdrawal request submitted!');
        setShowWithdrawModal(false);
        setWithdrawAmount('');
        fetchWallet();
        fetchWithdrawals();
      } else {
        toast.error(data?.message || 'Failed to submit withdrawal');
      }
    } catch {
      toast.error('Failed to submit withdrawal request');
    } finally {
      setSubmitting(false);
    }
  };

  const getWithdrawalStatusBadge = (status: Withdraw['status']) => {
    const variants: Record<string, { variant: 'gold' | 'green' | 'red' | 'default'; label: string }> = {
      PENDING: { variant: 'gold', label: 'Pending' },
      APPROVED: { variant: 'green', label: 'Approved' },
      REJECTED: { variant: 'red', label: 'Rejected' },
      PROCESSED: { variant: 'green', label: 'Processed' },
    };
    const config = variants[status] || { variant: 'default' as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#FF6B00]/10 flex items-center justify-center">
              <WalletIcon className="h-5 w-5 text-[#FF6B00]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">My Wallet</h1>
              <p className="text-sm text-gray-500">Manage your earnings and withdrawals</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Balance cards */}
        {walletLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        ) : wallet ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Card className="border-l-4 border-l-[#FF6B00]">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Current Balance</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1 flex items-center">
                      <IndianRupee className="h-5 w-5" />
                      {wallet.amount.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-[#FF6B00]/10 flex items-center justify-center">
                    <WalletIcon className="h-6 w-6 text-[#FF6B00]" />
                  </div>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  className="mt-4 w-full"
                  onClick={() => setShowWithdrawModal(true)}
                >
                  <Banknote className="h-4 w-4 mr-1.5" />
                  Request Withdrawal
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Previous Amount</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1 flex items-center">
                      <IndianRupee className="h-5 w-5" />
                      {wallet.previousAmount.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-gray-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Upcoming Amount</p>
                    <p className="text-2xl font-bold text-green-600 mt-1 flex items-center">
                      <IndianRupee className="h-5 w-5" />
                      {wallet.upcomingAmount.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-12 mb-8">
            <WalletIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No wallet data available</p>
          </div>
        )}

        {/* Transaction History */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            {txLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : transactions.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No transactions yet</p>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 text-left">
                        <th className="pb-3 font-medium text-gray-500">Date</th>
                        <th className="pb-3 font-medium text-gray-500">Type</th>
                        <th className="pb-3 font-medium text-gray-500">Amount</th>
                        <th className="pb-3 font-medium text-gray-500 hidden sm:table-cell">Mode</th>
                        <th className="pb-3 font-medium text-gray-500 hidden md:table-cell">Description</th>
                        <th className="pb-3 font-medium text-gray-500 text-right">Balance After</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {transactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-gray-50">
                          <td className="py-3 text-gray-700">
                            {dayjs(tx.createdAt).format('DD MMM YYYY')}
                          </td>
                          <td className="py-3">
                            <span
                              className={`inline-flex items-center gap-1 font-medium ${
                                tx.transactionType === 'credit'
                                  ? 'text-green-600'
                                  : 'text-red-600'
                              }`}
                            >
                              {tx.transactionType === 'credit' ? (
                                <ArrowDownLeft className="h-3.5 w-3.5" />
                              ) : (
                                <ArrowUpRight className="h-3.5 w-3.5" />
                              )}
                              {tx.transactionType === 'credit' ? 'Credit' : 'Debit'}
                            </span>
                          </td>
                          <td className="py-3">
                            <span
                              className={`font-semibold ${
                                tx.transactionType === 'credit'
                                  ? 'text-green-600'
                                  : 'text-red-600'
                              }`}
                            >
                              {tx.transactionType === 'credit' ? '+' : '-'}
                              {tx.transactionAmount.toLocaleString('en-IN')}
                            </span>
                          </td>
                          <td className="py-3 text-gray-500 hidden sm:table-cell">
                            {tx.transactionMode}
                          </td>
                          <td className="py-3 text-gray-500 hidden md:table-cell max-w-[200px] truncate">
                            {tx.description}
                          </td>
                          <td className="py-3 text-gray-700 font-medium text-right">
                            {tx.balanceAfter.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {txTotalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setTxPage((p) => Math.max(1, p - 1))}
                      disabled={txPage <= 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-gray-600">
                      {txPage} / {txTotalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setTxPage((p) => Math.min(txTotalPages, p + 1))}
                      disabled={txPage >= txTotalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* My Withdrawals */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">My Withdrawals</CardTitle>
          </CardHeader>
          <CardContent>
            {wdLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : withdrawals.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No withdrawal requests yet</p>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 text-left">
                        <th className="pb-3 font-medium text-gray-500">Date</th>
                        <th className="pb-3 font-medium text-gray-500">Amount</th>
                        <th className="pb-3 font-medium text-gray-500">Status</th>
                        <th className="pb-3 font-medium text-gray-500 hidden sm:table-cell">Transaction Ref</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {withdrawals.map((wd) => (
                        <tr key={wd.id} className="hover:bg-gray-50">
                          <td className="py-3 text-gray-700">
                            {dayjs(wd.createdAt).format('DD MMM YYYY')}
                          </td>
                          <td className="py-3 font-semibold text-gray-900">
                            {wd.amount.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3">{getWithdrawalStatusBadge(wd.status)}</td>
                          <td className="py-3 text-gray-500 hidden sm:table-cell">
                            {wd.transactionRef || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {wdTotalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setWdPage((p) => Math.max(1, p - 1))}
                      disabled={wdPage <= 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-gray-600">
                      {wdPage} / {wdTotalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setWdPage((p) => Math.min(wdTotalPages, p + 1))}
                      disabled={wdPage >= wdTotalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Request Withdrawal</h2>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleWithdrawalSubmit} className="p-5 space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-3">
                  Available balance:{' '}
                  <span className="font-semibold text-gray-900">
                    {wallet?.amount.toLocaleString('en-IN') || '0'}
                  </span>
                </p>
                <Input
                  label="Withdrawal Amount"
                  type="number"
                  placeholder="Enter amount"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  min="1"
                  max={wallet?.amount}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Bank Account
                </label>
                <select
                  value={bankDetailsId}
                  onChange={(e) => setBankDetailsId(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 focus:border-[#FF6B00]"
                >
                  <option value="default">Primary Bank Account</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowWithdrawModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  isLoading={submitting}
                >
                  Submit Request
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function WalletPage() {
  return (
    <RouteGuard role="pg">
      <WalletPageContent />
    </RouteGuard>
  );
}
