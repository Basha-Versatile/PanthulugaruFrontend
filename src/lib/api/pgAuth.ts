import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';
import type { ApiResponse, Panthulugaru, Ritual, ServiceAreaEntry } from '@/types';

export async function pgEmailSignup(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}): Promise<ApiResponse<{ token: string; user: Panthulugaru }>> {
  try {
    const response = await apiClient.post(ENDPOINTS.PG_EMAIL_SIGNUP, data);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Signup failed', data: null as unknown as { token: string; user: Panthulugaru } }) as any;
  }
}

export async function pgEmailLogin(data: {
  email: string;
  password: string;
}): Promise<ApiResponse<{ token: string; user: Panthulugaru }>> {
  try {
    const response = await apiClient.post(ENDPOINTS.PG_EMAIL_LOGIN, data);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Login failed', data: null as unknown as { token: string; user: Panthulugaru } }) as any;
  }
}

export async function sendPGOtp(phone: string): Promise<ApiResponse<{ otpSent: boolean }>> {
  try {
    const response = await apiClient.post(ENDPOINTS.PG_SEND_OTP, { phone });
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to send OTP', data: { otpSent: false } }) as any;
  }
}

export async function verifyPGOtp(data: {
  phone: string;
  otp: string;
}): Promise<ApiResponse<{ token: string; user: Panthulugaru }>> {
  try {
    const response = await apiClient.post(ENDPOINTS.PG_VERIFY_OTP, data);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'OTP verification failed', data: null as unknown as { token: string; user: Panthulugaru } }) as any;
  }
}

export async function completePGProfile(data: Partial<Panthulugaru>): Promise<ApiResponse<Panthulugaru>> {
  try {
    const response = await apiClient.post(ENDPOINTS.PG_COMPLETE_PROFILE, data);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to complete profile', data: null as unknown as Panthulugaru }) as any;
  }
}

export async function getAvailableRituals(): Promise<ApiResponse<Ritual[]>> {
  try {
    const response = await apiClient.get(ENDPOINTS.PG_RITUALS);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to get rituals', data: [] }) as any;
  }
}

export async function getAvailableLocations(): Promise<ApiResponse<ServiceAreaEntry[]>> {
  try {
    const response = await apiClient.get(ENDPOINTS.PG_LOCATIONS);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to get locations', data: [] }) as any;
  }
}

export async function getPGMe(): Promise<ApiResponse<Panthulugaru>> {
  try {
    const response = await apiClient.get(ENDPOINTS.PG_PROFILE);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ApiResponse<null> } };
    return (err.response?.data || { success: false, message: 'Failed to get profile', data: null as unknown as Panthulugaru }) as any;
  }
}
