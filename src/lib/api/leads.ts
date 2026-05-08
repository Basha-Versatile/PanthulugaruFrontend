import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';
import type { ApiResponse, Lead, Panthulugaru } from '@/types';

export async function createLead(data: {
  panthulugaruId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  ritualId?: string;
  city?: string;
  message?: string;
}): Promise<ApiResponse<Lead>> {
  try {
    const response = await apiClient.post(ENDPOINTS.CREATE_LEAD, data);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to create lead', data: null as unknown as Lead }) as any;
  }
}

export async function checkUnlockStatus(panthulugaruId: string): Promise<ApiResponse<{ isUnlocked: boolean }>> {
  try {
    const response = await apiClient.get(`${ENDPOINTS.CHECK_UNLOCK}/${panthulugaruId}`);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to check unlock status', data: { isUnlocked: false } }) as any;
  }
}

export async function checkUnlockByCustomer(panthulugaruId: string): Promise<ApiResponse<{ isUnlocked: boolean }>> {
  try {
    const response = await apiClient.get(`${ENDPOINTS.CHECK_UNLOCK_BY_CUSTOMER}/${panthulugaruId}`);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to check unlock status', data: { isUnlocked: false } }) as any;
  }
}

export async function getSecureUnlockStatus(panthulugaruId: string): Promise<ApiResponse<{ isUnlocked: boolean; expiresAt?: string }>> {
  try {
    const response = await apiClient.get(ENDPOINTS.GET_UNLOCK_STATUS, { params: { panthulugaruId } });
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to get unlock status', data: { isUnlocked: false } }) as any;
  }
}

export async function createSecureUnlock(panthulugaruId: string, paymentId: string): Promise<ApiResponse<{ isUnlocked: boolean }>> {
  try {
    const response = await apiClient.post(ENDPOINTS.CREATE_UNLOCK, { panthulugaruId, paymentId });
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to unlock', data: { isUnlocked: false } }) as any;
  }
}

export async function getMyPanthulugaru(): Promise<ApiResponse<Panthulugaru[]>> {
  try {
    const response = await apiClient.get(ENDPOINTS.MY_PANTHULUGARU);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to get my panthulugaru', data: [] }) as any;
  }
}

export async function getPanditContact(panthulugaruId: string): Promise<ApiResponse<{ phone: string; email: string }>> {
  try {
    const response = await apiClient.get(`${ENDPOINTS.CUSTOMER_ACCESS_CONTACT}/${panthulugaruId}`);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to get contact', data: { phone: '', email: '' } }) as any;
  }
}
