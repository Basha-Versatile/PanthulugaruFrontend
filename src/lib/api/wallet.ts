import api from './client';

export const getWalletBalance = () =>
  api.get('/wallet');

export const getTransactions = (page = 1, limit = 10) =>
  api.get(`/wallet/transactions?page=${page}&limit=${limit}`);

export const requestWithdrawal = (amount: number, bankDetailsId: string) =>
  api.post('/withdrawals', { amount, bankDetailsId });

export const getMyWithdrawals = (page = 1, limit = 10) =>
  api.get(`/withdrawals/my?page=${page}&limit=${limit}`);
