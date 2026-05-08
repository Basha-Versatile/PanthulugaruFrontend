import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';
import type { ApiResponse, Payment } from '@/types';

export async function createPayment(data: {
  paymentType: string;
  amount: number;
  currency?: string;
  customerId?: string;
  panthulugaruId?: string;
  bookingId?: string;
  metadata?: Record<string, string>;
}): Promise<ApiResponse<{ orderId: string; amount: number; currency: string; key: string }>> {
  try {
    const response = await apiClient.post(ENDPOINTS.CREATE_PAYMENT, data);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to create payment', data: null as unknown as { orderId: string; amount: number; currency: string; key: string } }) as any;
  }
}

export async function createUnlockPayment(panthulugaruId: string): Promise<ApiResponse<{ orderId: string; amount: number; currency: string; key: string }>> {
  try {
    const response = await apiClient.post(ENDPOINTS.CREATE_PAYMENT, {
      paymentType: 'UNLOCK',
      panthulugaruId,
    });
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to create unlock payment', data: null as unknown as { orderId: string; amount: number; currency: string; key: string } }) as any;
  }
}

export async function getPaymentStatus(paymentId: string): Promise<ApiResponse<Payment>> {
  try {
    const response = await apiClient.get(`${ENDPOINTS.GET_PAYMENTS}/${paymentId}`);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to get payment status', data: null as unknown as Payment }) as any;
  }
}
